"""Tier-1 GCC media scraper — title + key summary (v1).

  python tools/scrape_news.py

For every source in SOURCES it tries the RSS candidates first (title + the
feed's own summary/description), then falls back to extracting headlines from
the page HTML (anchor-text heuristics; title-only until per-article fetching
is added). Each new item becomes a file in
scraped_news/<group>/YYYY-MM-DD_<slug>_<hash>.md (title, source, url, summary).
Dedupe via .seen.json per group; items older than KEEP_DAYS pruned. Failures
are logged, never fatal — run it and read the per-source report.

Each source has its own refresh cadence (FREQ_HOURS, default 6h): a source is
skipped while not yet due, so the 6-hourly scheduler naturally gives 6h/12h/24h
tiers. Attempts/successes are tracked in scraped_news/health.json (surfaced by
tools/report.py). Use  --force  to scrape everything regardless of cadence.

Groups map to regions in tools/match_news.py:
  regional -> all maps · uae -> Abu Dhabi/Dubai/Northern · saudi/qatar/
  kuwait/bahrain/oman -> their own map.
"""
import hashlib
import html as htmllib
import json
import re
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin

ROOT = Path(__file__).resolve().parent.parent
OUTDIR = ROOT / "scraped_news"
HEALTH = OUTDIR / "health.json"
KEEP_DAYS = 45
PER_SOURCE = 12
TIMEOUT = 25

# Per-source refresh cadence in hours (default 6 = every scheduled run).
# Slower cadences for weeklies, paywalled/bot-walled sites (pointless to hammer)
# and state wire agencies that publish in daytime batches.
DEFAULT_FREQ_H = 6
FREQ_HOURS = {
    "MEED": 24,             # weekly magazine; daily briefing at most
    "Bloomberg ME": 24,     # bot-walled; syndication covers it
    "Reuters ME": 24,       # bot-walled
    "FT Middle East": 12,
    "Arab News": 24,        # bot-walled
    "Al Eqtisadiah": 24,
    "Asharq Business": 24,
    "QNA": 12, "KUNA": 12, "BNA": 12, "ONA": 12,   # state agencies, batch publishers
    "TradeArabia": 12,
    "Muscat Daily": 12,
}

# {group: [(source_name, [rss candidates], fallback_page_url)]}
SOURCES = {
  "regional": [
    ("AGBI",             ["https://www.agbi.com/feed/"],                          "https://www.agbi.com/"),
    ("Arabian Business", ["https://www.arabianbusiness.com/feed"],                "https://www.arabianbusiness.com/"),
    ("Zawya",            ["https://www.zawya.com/en/rss"],                        "https://www.zawya.com/en/business"),
    ("Reuters ME",       ["https://www.reuters.com/arc/outboundfeeds/rss/category/middle-east/?outputType=xml"],
                                                                                  "https://www.reuters.com/world/middle-east/"),
    ("FT Middle East",   ["https://www.ft.com/middle-east?format=rss"],           "https://www.ft.com/middle-east"),
    ("MEED",             ["https://www.meed.com/feed"],                           "https://www.meed.com/"),
    ("Bloomberg ME",     [],                                                      "https://www.bloomberg.com/middleeast"),
  ],
  "uae": [
    ("The National",     ["https://www.thenationalnews.com/arc/outboundfeeds/rss/?outputType=xml"],
                                                                                  "https://www.thenationalnews.com/business/"),
    ("Gulf News",        ["https://gulfnews.com/rss"],                            "https://gulfnews.com/business"),
    ("Khaleej Times",    ["https://www.khaleejtimes.com/rss"],                    "https://www.khaleejtimes.com/business"),
  ],
  "saudi": [
    ("Arab News",        ["https://www.arabnews.com/rss.xml"],                    "https://www.arabnews.com/economy"),
    ("Argaam",           ["https://www.argaam.com/en/rss"],                       "https://www.argaam.com/en"),
    ("Al Eqtisadiah",    [],                                                      "https://www.aleqt.com/"),
    ("Asharq Business",  [],                                                      "https://www.asharqbusiness.com/"),
  ],
  "qatar": [
    ("Gulf Times",       ["https://www.gulf-times.com/rss"],                      "https://www.gulf-times.com/business"),
    ("The Peninsula",    ["https://thepeninsulaqatar.com/rss"],                   "https://thepeninsulaqatar.com/category/business"),
    ("QNA",              [],                                                      "https://www.qna.org.qa/en/news/economics"),
  ],
  "kuwait": [
    ("Kuwait Times",     [],                                                      "https://kuwaittimes.com/"),
    ("KUNA",             [],                                                      "https://www.kuna.net.kw/Default.aspx?language=en"),
    ("Al Qabas",         [],                                                      "https://www.alqabas.com/"),
    ("Al Rai",           [],                                                      "https://www.alraimedia.com/"),
  ],
  "bahrain": [
    ("GDN",              ["https://www.gdnonline.com/rss"],                       "https://www.gdnonline.com/"),
    ("TradeArabia",      ["http://www.tradearabia.com/rss/index.xml"],            "http://www.tradearabia.com/"),
    ("BNA",              [],                                                      "https://www.bna.bh/en/"),
  ],
  "oman": [
    ("Oman Observer",    [],                                                      "https://www.omanobserver.om/"),
    ("Times of Oman",    ["https://timesofoman.com/feed"],                        "https://timesofoman.com/"),
    ("Muscat Daily",     [],                                                      "https://www.muscatdaily.com/"),
    ("ONA",              [],                                                      "https://omannews.gov.om/"),
  ],
}

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36"}

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.read()

def slugify(s, n=40):
    s = re.sub(r"[^a-z0-9؀-ۿ]+", "-", s.lower()).strip("-")
    return s[:n] or "item"

def norm_title(s):
    return re.sub(r"[^a-z0-9؀-ۿ]", "", (s or "").lower())[:60]

def strip_tags(s):
    return htmllib.unescape(re.sub(r"<[^>]+>", " ", s or "")).strip()

def from_rss(data, base):
    items = []
    root = ET.fromstring(data)
    for it in root.iter():
        if it.tag.endswith("item") or it.tag.endswith("entry"):
            title = link = summary = ""
            for ch in it:
                tag = ch.tag.rsplit("}", 1)[-1]
                if tag == "title": title = strip_tags(ch.text or "")
                elif tag == "link": link = (ch.text or ch.get("href") or "").strip()
                elif tag in ("description", "summary") and not summary:
                    summary = strip_tags(ch.text or "")
            if summary:                      # key summary, kept tight
                summary = re.sub(r"\s+", " ", summary)[:420]
                if norm_title(summary).startswith(norm_title(title)[:40]):
                    summary = ""             # some feeds just repeat the title
            if title:
                items.append((title, urljoin(base, link), summary))
    return items

class HeadlineParser(HTMLParser):
    """Anchor-text heuristic: headline-length link text on news pages."""
    def __init__(self, base):
        super().__init__()
        self.base = base; self.href = None; self.buf = []; self.items = []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.href = dict(attrs).get("href"); self.buf = []
    def handle_data(self, data):
        if self.href is not None: self.buf.append(data)
    def handle_endtag(self, tag):
        if tag == "a" and self.href is not None:
            text = re.sub(r"\s+", " ", "".join(self.buf)).strip()
            wc = len(text.split())
            if 35 <= len(text) <= 170 and wc >= 5 and not text.isupper():
                self.items.append((text, urljoin(self.base, self.href), ""))
            self.href = None

def from_html(data, base):
    p = HeadlineParser(base)
    p.feed(data.decode("utf-8", errors="replace"))
    return p.items

def main(force=False):
    today = datetime.utcnow().strftime("%Y-%m-%d")
    now = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    now_ts = datetime.utcnow()
    cutoff = (datetime.utcnow() - timedelta(days=KEEP_DAYS)).strftime("%Y-%m-%d")
    health = json.loads(HEALTH.read_text(encoding="utf-8")) if HEALTH.exists() else {}
    total = skipped = 0
    for group, sources in SOURCES.items():
        gdir = OUTDIR / group
        gdir.mkdir(parents=True, exist_ok=True)
        seenf = gdir / ".seen.json"
        seen = json.loads(seenf.read_text(encoding="utf-8")) if seenf.exists() else {}
        for name, rss_urls, page in sources:
            key = f"{group}/{name}"
            freq = FREQ_HOURS.get(name, DEFAULT_FREQ_H)
            h = health.setdefault(key, {})
            h["freq_h"] = freq
            last = h.get("last_attempt")
            if last and not force:
                try:
                    age_h = (now_ts - datetime.strptime(last, "%Y-%m-%dT%H:%M:%SZ")).total_seconds() / 3600
                    if age_h < freq - 0.5:      # half-hour slack for cron jitter
                        skipped += 1
                        print(f"  [{group}] {name}: skipped (every {freq}h, next in {freq-age_h:.1f}h)")
                        continue
                except ValueError:
                    pass
            h["last_attempt"] = now
            items, how = [], "-"
            for ru in rss_urls:
                try:
                    items = from_rss(fetch(ru), ru); how = "rss"
                    if items: break
                except Exception:
                    items = []
            if not items and page:
                try:
                    items = from_html(fetch(page), page); how = "html"
                except Exception as e:
                    h["fails"] = h.get("fails", 0) + 1
                    print(f"  [{group}] {name}: FAILED ({type(e).__name__})")
                    continue
            if items:
                h["last_success"] = now
                h["fails"] = 0
            else:
                h["fails"] = h.get("fails", 0) + 1
            kept = 0
            for title, link, summary in items:
                if kept >= PER_SOURCE: break
                tkey = "t:" + hashlib.sha1(norm_title(title).encode()).hexdigest()[:16]
                if tkey in seen or not title: continue
                hh = hashlib.sha1((link or title).encode()).hexdigest()[:6]
                (gdir / f"{today}_{slugify(title)}_{hh}.md").write_text(
                    f"# {title}\nsource: {name}\nurl: {link}\n\n{summary}\n", encoding="utf-8")
                seen[tkey] = today
                kept += 1; total += 1
            if kept:
                h["last_new"] = now
            print(f"  [{group}] {name}: +{kept} ({how})")
            time.sleep(0.6)
        for f in gdir.glob("*.md"):
            m = re.match(r"(\d{4}-\d{2}-\d{2})_", f.name)
            if m and m.group(1) < cutoff: f.unlink()
        seenf.write_text(json.dumps(seen, indent=0), encoding="utf-8")
    HEALTH.write_text(json.dumps(health, indent=1, sort_keys=True), encoding="utf-8")
    print(f"{total} new headlines -> scraped_news/  ({skipped} sources not yet due)")

if __name__ == "__main__":
    import sys
    main(force="--force" in sys.argv)
