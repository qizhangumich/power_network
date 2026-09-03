"""Auto-fetch news into news_inbox/ via Google News RSS (stdlib only).

  python tools/fetch_news.py

For each query in QUERIES it pulls the Google News RSS feed, writes new items
as news_inbox/YYYY-MM-DD_<slug>.md (title / source / url / snippet), and skips
anything already fetched (news_inbox/.seen.json tracks URLs). Items older than
KEEP_DAYS are pruned so the inbox stays small.

Run tools/match_news.py afterwards to tag items to network nodes — the GitHub
Actions workflow (.github/workflows/update.yml) does both on a schedule.
NOTE: Google News is unreachable from mainland-China servers; run this locally
or in CI, never on the Aliyun box.
"""
import hashlib
import html
import json
import re
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / "news_inbox"
SEEN = INBOX / ".seen.json"

# Entities worth a dedicated query — edit freely.
QUERIES = [
    'ADNOC', 'Mubadala', '"ADQ" Abu Dhabi', 'Abu Dhabi Investment Authority',
    '"G42" Abu Dhabi', 'International Holding Company IHC', 'MGX Abu Dhabi',
    '"Sheikh Tahnoon" OR "Sheikh Tahnoun"', '"Sultan Al Jaber"', '"Khaldoon Al Mubarak"',
    '"Sheikh Khaled bin Mohamed"', 'EDGE Group Abu Dhabi', 'Masdar', 'TAQA Abu Dhabi',
    'Aldar Properties', 'Etihad Airways', '"AD Ports"', '"PureHealth" Abu Dhabi', 'Space42',
    'Abu Dhabi sovereign wealth',
]
PER_QUERY = 6          # max new items kept per query per run
KEEP_DAYS = 45         # prune fetched items older than this
TIMEOUT = 20

def slugify(s, n=40):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:n] or "item"

def strip_tags(s):
    return html.unescape(re.sub(r"<[^>]+>", " ", s or "")).strip()

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (power-network-bot)"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.read()

def main():
    INBOX.mkdir(exist_ok=True)
    seen = json.loads(SEEN.read_text(encoding="utf-8")) if SEEN.exists() else {}
    added = 0
    for q in QUERIES:
        url = ("https://news.google.com/rss/search?q=" + urllib.parse.quote(q)
               + "&hl=en-US&gl=US&ceid=US:en")
        try:
            root = ET.fromstring(fetch(url))
        except Exception as e:
            print(f"  [skip] {q}: {type(e).__name__}: {e}")
            continue
        kept = 0
        for item in root.iter("item"):
            if kept >= PER_QUERY:
                break
            title = strip_tags(item.findtext("title") or "")
            link = (item.findtext("link") or "").strip()
            desc = strip_tags(item.findtext("description") or "")
            pub = item.findtext("pubDate") or ""
            src = item.findtext("source") or ""
            if not title or not link:
                continue
            key = hashlib.sha1(link.encode()).hexdigest()[:16]
            if key in seen:
                continue
            try:
                dt = datetime.strptime(pub[:25].strip(), "%a, %d %b %Y %H:%M:%S")
            except ValueError:
                dt = datetime.now(timezone.utc).replace(tzinfo=None)
            if dt < datetime.utcnow() - timedelta(days=KEEP_DAYS):
                continue
            date = dt.strftime("%Y-%m-%d")
            # Google News titles are usually "Headline - Outlet"
            outlet = src or (title.rsplit(" - ", 1)[1] if " - " in title else "")
            headline = title.rsplit(" - ", 1)[0] if " - " in title else title
            fname = f"{date}_{slugify(headline)}_{key[:6]}.md"
            (INBOX / fname).write_text(
                f"# {headline}\nsource: {outlet}\nurl: {link}\n\n{desc}\n",
                encoding="utf-8")
            seen[key] = date
            kept += 1
            added += 1
        print(f"  {q}: +{kept}")
        time.sleep(1)

    # prune old items (never touches hand-written files without a date prefix)
    cutoff = (datetime.utcnow() - timedelta(days=KEEP_DAYS)).strftime("%Y-%m-%d")
    pruned = 0
    for f in INBOX.glob("*.md"):
        m = re.match(r"(\d{4}-\d{2}-\d{2})_", f.name)
        if m and m.group(1) < cutoff:
            f.unlink()
            pruned += 1
    SEEN.write_text(json.dumps(seen, indent=0), encoding="utf-8")
    print(f"{added} new items, {pruned} pruned -> news_inbox/")

if __name__ == "__main__":
    main()
