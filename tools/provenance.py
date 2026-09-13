"""Provenance log: where every person/institution in the network came from.

data/provenance.csv — one row per added entity (append-only, never rewritten):
  date,region,entity_id,entity_type,action,source_kind,source,url

  entity_type  person | institution
  action       added    (normal growth, logged by the merge tools)
               baseline (one-time backfill of records that predate this log)
  source_kind  official (company/government page) | report (annual/governance
               report, PDF) | news (media outlet) | registry (exchange listing)
               | legacy (pre-provenance backfill) | unspecified (no url given)
  source       short human label — the domain, outlet or registry name
  url          the exact page used, when known

Writers: merge_people.py, merge_institutions.py, import_listings.py.
Reader: growth_report.py (per-person source in the drill-downs + the Sources
section). The kind is classified from the url; media domains come from
data/sources.csv so the news bucket follows the managed source registry.
"""
import csv
import datetime
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
LOG = ROOT / "data" / "provenance.csv"
SOURCES_CSV = ROOT / "data" / "sources.csv"
HEADER = ["date", "region", "entity_id", "entity_type", "action",
          "source_kind", "source", "url"]

# fallback media domains for classify() when sources.csv is absent
_STATIC_MEDIA = {
    "agbi.com", "arabianbusiness.com", "zawya.com", "ft.com", "meed.com",
    "thenationalnews.com", "gulfnews.com", "khaleejtimes.com", "arabnews.com",
    "argaam.com", "aleqt.com", "gulf-times.com", "thepeninsulaqatar.com",
    "qna.org.qa", "kuwaittimes.com", "kuna.net.kw", "alraimedia.com",
    "gdnonline.com", "tradearabia.com", "bna.bh", "omanobserver.om",
    "timesofoman.com", "muscatdaily.com", "omannews.gov.om", "reuters.com",
    "bloomberg.com", "asharqbusiness.com", "forbesmiddleeast.com",
    "gulfbusiness.com", "news.google.com",
}

_media_cache = None


def _domain(url):
    try:
        d = urlparse(url if "//" in url else "//" + url).netloc.lower()
    except ValueError:
        return ""
    return d[4:] if d.startswith("www.") else d


def media_domains():
    """Domains of managed news sources (data/sources.csv) + static fallbacks."""
    global _media_cache
    if _media_cache is not None:
        return _media_cache
    doms = set(_STATIC_MEDIA)
    if SOURCES_CSV.exists():
        with open(SOURCES_CSV, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                if (r.get("type") or "").strip() != "media":
                    continue
                for u in ((r.get("page_url") or "") + "|" + (r.get("rss_url") or "")).split("|"):
                    d = _domain(u.strip())
                    if d:
                        doms.add(d)
    _media_cache = doms
    return doms


def classify(url):
    """official | report | news | unspecified — from the source url alone."""
    u = (url or "").strip()
    if not u:
        return "unspecified"
    low = u.lower()
    if low.endswith(".pdf") or "annual" in low or "governance-report" in low \
       or "integrated-report" in low or "/reports/" in low:
        return "report"
    dom = _domain(low)
    if any(dom == m or dom.endswith("." + m) for m in media_domains()):
        return "news"
    return "official"


def log(rows):
    """Append provenance rows. Each row: (region, entity_id, entity_type, url)
    or (region, entity_id, entity_type, url, action, kind, source) to override.
    Missing kind/source are derived from the url."""
    if not rows:
        return
    today = datetime.date.today().isoformat()
    new = not LOG.exists()
    with open(LOG, "a", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        if new:
            w.writerow(HEADER)
        for r in rows:
            region, eid, etype, url = r[0], r[1], r[2], (r[3] or "").strip()
            action = r[4] if len(r) > 4 and r[4] else "added"
            kind = r[5] if len(r) > 5 and r[5] else classify(url)
            source = r[6] if len(r) > 6 and r[6] else (_domain(url) or "")
            w.writerow([today, region, eid, etype, action, kind, source, url])


def read():
    """All provenance rows as dicts (empty list when the log doesn't exist)."""
    if not LOG.exists():
        return []
    with open(LOG, encoding="utf-8-sig", newline="") as f:
        return [r for r in csv.DictReader(f) if (r.get("entity_id") or "").strip()]
