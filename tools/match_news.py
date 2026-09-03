"""News → network matcher, for all GCC region maps.

  python tools/match_news.py

For each region it scans the applicable inboxes — the Google News inbox
(news_inbox/, Abu Dhabi only) plus the tier-1 scraper output
(scraped_news/<group>/, see tools/scrape_news.py) — matches every item
against that region's node names + aliases, and writes <region>/news_data.js
(root news_data.js for Abu Dhabi). Matched nodes get signal badges and a
"Recent signals" panel section on the map.

Abu Dhabi additionally gets co-mention candidate relationships
(data/suggested_edges.csv + window.SUGGESTED_EDGES).

Item file format (news_inbox/ and scraped_news/*): first line = title
(leading '# ' stripped), optional 'source:' / 'url:' lines, rest = summary.
"""
import csv
import re
import datetime
from itertools import combinations
from pathlib import Path
from netdata import ROOT, load_nodes, js_string

SUGGEST = ROOT / "data" / "suggested_edges.csv"
MIN_COMENTIONS = 2   # articles two entities must share before an edge is suggested

# region dir ("" = root/Abu Dhabi) -> inbox dirs scanned for it
REGION_INBOXES = {
    "":         ["news_inbox", "scraped_news/regional", "scraped_news/uae"],
    "dubai":    ["scraped_news/regional", "scraped_news/uae"],
    "northern": ["scraped_news/regional", "scraped_news/uae"],
    "saudi":    ["scraped_news/regional", "scraped_news/saudi"],
    "qatar":    ["scraped_news/regional", "scraped_news/qatar"],
    "bahrain":  ["scraped_news/regional", "scraped_news/bahrain"],
    "oman":     ["scraped_news/regional", "scraped_news/oman"],
    "kuwait":   ["scraped_news/regional", "scraped_news/kuwait"],
}

# aliases that are too generic to match on their own
STOP_ALIASES = {"bp", "eni", "ey", "shell", "e&", "doe", "dof", "doh", "dmt", "dge", "dcd",
                "mof", "mofa", "moi", "mod", "moci", "moph", "edb", "gea", "com", "kpc"}
# all-caps abbreviations whose Title-case form is an ordinary English word
TITLECASE_UNSAFE = {"ADDED", "EDGE", "MARJAN", "ARADA"}

def norm_title(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())[:60]

def alias_patterns(nodes):
    pats = []
    for n in nodes:
        for a in n["aliases"]:
            if len(a) < 3 and a.lower() not in {"bp", "ey", "e&", "iq", "oq"}:
                continue
            # allow line breaks / multiple spaces inside multi-word names
            body = r"\s+".join(re.escape(w) for w in a.split())
            if a.isupper() or a.lower() in STOP_ALIASES:
                # abbreviations: exact-case; distinctive 4+ letter ones also
                # match their Title-case form ("Adnoc", "Adia", "Taqa")
                variants = [body]
                if a.isupper() and len(a) >= 4 and " " not in a and a not in TITLECASE_UNSAFE:
                    variants.append(re.escape(a.capitalize()))
                pat = re.compile(r"\b(?:" + "|".join(variants) + r")\b")
            else:
                pat = re.compile(r"\b" + body + r"\b", re.I)
            pats.append((pat, n["id"], a))
    return pats

def parse_item(path: Path):
    text = path.read_text(encoding="utf-8", errors="replace")
    lines = [l.rstrip() for l in text.splitlines()]
    title, source, url = None, "", ""
    for l in lines[:10]:
        low = l.lower()
        if low.startswith("source:"):
            source = l.split(":", 1)[1].strip()
        elif low.startswith("url:"):
            url = l.split(":", 1)[1].strip()
        elif title is None and l.strip():
            title = l.strip().lstrip("# ").strip()
    m = re.match(r"(\d{4}-\d{2}-\d{2})", path.stem)
    date = m.group(1) if m else datetime.date.fromtimestamp(path.stat().st_mtime).isoformat()
    return {"id": path.stem, "date": date, "title": title or path.stem,
            "source": source, "url": url, "text": text}

def collect_items(inboxes):
    items, seen_titles, dups = [], set(), 0
    for ib in inboxes:
        d = ROOT / ib
        if not d.exists():
            continue
        for f in sorted(d.iterdir()):
            if f.suffix.lower() not in (".txt", ".md"):
                continue
            it = parse_item(f)
            tkey = norm_title(it["title"])
            if tkey and tkey in seen_titles:
                dups += 1
                continue
            seen_titles.add(tkey)
            items.append(it)
    return items, dups

def match_region(region):
    data_js = (ROOT / region / "network_data.js") if region else (ROOT / "network_data.js")
    out = (ROOT / region / "news_data.js") if region else (ROOT / "news_data.js")
    nodes = load_nodes(data_js)
    pats = alias_patterns(nodes)
    items, dups = collect_items(REGION_INBOXES[region])
    for it in items:
        hits = {}
        for pat, nid, alias in pats:
            if nid in hits:
                continue
            if pat.search(it["text"]):
                hits[nid] = alias
        # drop a match whose alias is just a fragment of another matched alias
        drop = set()
        for nid, alias in hits.items():
            for nid2, alias2 in hits.items():
                if nid != nid2 and alias.lower() != alias2.lower() and alias.lower() in alias2.lower():
                    drop.add(nid)
        for nid in drop:
            del hits[nid]
        it["ids"] = sorted(hits)

    matched = [i for i in items if i["ids"]]
    kept = sorted(matched if region else items, key=lambda x: x["date"], reverse=True)
    # non-AD maps carry only matched items (regional feeds are mostly out-of-region)
    rows = []
    for it in kept:
        rows.append("  {id:%s, date:%s, title:%s, source:%s, url:%s, ids:[%s]}," % (
            js_string(it["id"]), js_string(it["date"]), js_string(it["title"]),
            js_string(it["source"]), js_string(it["url"]),
            ",".join(js_string(i) for i in it["ids"])))
    out.write_text(
        "/* AUTO-GENERATED by tools/match_news.py — do not edit by hand. */\n"
        "window.NEWS_ITEMS = [\n" + "\n".join(rows) + "\n];\n",
        encoding="utf-8")
    label = region or "abudhabi"
    print(f"  {label}: {len(items)} items scanned, {len(matched)} matched, "
          f"{dups} duplicates collapsed -> {out.relative_to(ROOT)}")
    return nodes, kept

def existing_pairs():
    """Every connected pair in the Abu Dhabi map, from the canonical CSVs."""
    pairs = set()
    d = ROOT / "data"
    def add(a, b): pairs.add(frozenset((a.strip(), b.strip())))
    for fname, ca, cb in [("roles.csv", "person_id", "institution_id"),
                          ("ownership.csv", "child_id", "parent_id"),
                          ("family.csv", "person_a_id", "person_b_id")]:
        p = d / fname
        if not p.exists():
            continue
        with open(p, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                if row.get(ca) and row.get(cb):
                    add(row[ca], row[cb])
    return pairs

def suggest_edges(nodes, items, out):
    """Abu Dhabi co-mention detection -> suggested_edges.csv + map overlay."""
    known = existing_pairs()
    name = {n["id"]: n["short"] for n in nodes}
    counts, samples = {}, {}
    for it in items:
        for a, b in combinations(sorted(it["ids"]), 2):
            k = frozenset((a, b))
            if k in known:
                continue
            counts[k] = counts.get(k, 0) + 1
            samples.setdefault(k, []).append(it["title"][:80])
    rows = sorted(((c, k) for k, c in counts.items() if c >= MIN_COMENTIONS), reverse=True)
    SUGGEST.parent.mkdir(exist_ok=True)
    with open(SUGGEST, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(["entity_a", "entity_a_name", "entity_b", "entity_b_name",
                    "co_mentions", "sample_headlines"])
        for c, k in rows:
            a, b = sorted(k)
            w.writerow([a, name.get(a, a), b, name.get(b, b), c,
                        " | ".join(samples[k][:3])])
    js_rows = ",".join('{a:%s,b:%s,n:%d}' % (js_string(sorted(k)[0]), js_string(sorted(k)[1]), c)
                       for c, k in rows)
    with open(out, "a", encoding="utf-8") as f:
        f.write("window.SUGGESTED_EDGES = [" + js_rows + "];\n")
    print(f"  abudhabi: {len(rows)} candidate relationships -> data/suggested_edges.csv")

def main():
    for region in REGION_INBOXES:
        nodes, items = match_region(region)
        out = (ROOT / region / "news_data.js") if region else (ROOT / "news_data.js")
        if region == "":
            suggest_edges(nodes, items, out)
        else:
            with open(out, "a", encoding="utf-8") as f:
                f.write("window.SUGGESTED_EDGES = [];\n")

if __name__ == "__main__":
    main()
