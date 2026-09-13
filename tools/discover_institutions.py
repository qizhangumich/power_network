"""Institution discovery queue — organisations the news keeps naming that no map has yet.

  python tools/discover_institutions.py [--days 21] [--min 2]

Scans headlines (+ first body line) in news_inbox/ and scraped_news/**, extracts
organisation-like names (a run of capitalised words ending in an org keyword —
Bank, Holding, Authority, Ministry, Fund, Airways, Properties … — or "Ministry of X"
style phrases), drops anything already present in ANY region map (name, short or
AKA, legal suffixes stripped), guesses the region, and writes
data/institution_candidates.csv ranked by distinct-article mentions.

The daily agent researches the top pending rows, stages the real ones in
data/institution_additions_*.csv (tools/merge_institutions.py) and sets
status to added / rejected — reviewer decisions survive regeneration.
"""
import csv
import re
import sys
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import ROOT, load_nodes
from import_listings import norm

OUT = ROOT / "data" / "institution_candidates.csv"
REGION_DIRS = ["", "dubai", "northern", "saudi", "qatar", "bahrain", "oman", "kuwait"]

ORG_KW = {"bank", "holding", "holdings", "group", "authority", "company", "corporation", "capital",
          "investments", "investment", "properties", "development", "developments", "fund", "insurance",
          "takaful", "airways", "airlines", "airline", "energy", "petroleum", "petrochemicals", "ports",
          "exchange", "university", "council", "ministry", "department", "partners", "ventures",
          "hospital", "healthcare", "telecom", "telecommunications", "logistics", "industries", "cement",
          "steel", "chemicals", "finance", "financial", "media", "municipality", "commission", "agency",
          "centre", "center", "zone", "foundation", "estate", "realty", "utilities", "power", "motors",
          "aluminium", "mining", "shipping", "marine", "hotels", "resorts", "retail", "pharma",
          "pharmaceuticals", "technologies", "technology", "solutions", "systems", "enterprises",
          "trading", "contracting", "construction", "developers", "dmcc", "pjsc", "psc", "saog", "qpsc", "kscp",
          "city", "park", "airport", "airports", "railways", "refinery", "fertilisers", "fertilizers", "foods"}
PREFIX_KW = {"ministry", "bank", "department", "authority", "university", "council", "chamber", "port", "emirate"}
STOP = set("""a an the and or but to of in on at by for with from into over as vs via after before amid
about against says say said signs sign signed launches launch launched unveils unveil announces announce
announced opens open opened wins win won secures secure secured posts post reports report record new
deal deals agreement agreements mou partnership partners with plans plan eyes eye sees see set sets
rise rises rising fall falls up down profit profits revenue net quarter q1 q2 q3 q4 h1 h2 fy first second
third billion million bln mln bn dh aed sar qr usd per cent percent year years week month today how why what
who when where will may could should its it is are was were be been has have had this that these those more
most top best largest biggest major news update exclusive breaking watch live video photos
chief ceo chairman minister head appoints appointed names named meets meeting visit visits hosts host
receives received awarded award talks talk invest invests investing expands expand expansion acquire
acquires acquisition stake stakes buy buys sell sells sale ipo listing shares share stock stocks market
markets price prices status schedule routes flights flight weekend delays cancellations""".split())
# words that cannot on their own make a phrase an institution name ("Real Estate", "Central Bank")
GENERIC = set("""real central public education infrastructure space future tourism national general digital
sovereign global world international regional local private islamic secretary business water gulf middle
east arab investment financial services smart green clean renewable innovation data health medical sports
club league cup open championship school new first united state federal royal economic trade culture
security emerging markets index asset management wealth family credit rating""".split())
CONNECT = {"al", "el", "&", "and", "of", "for"}
MEDIA = {"yahoo finance", "west bank", "security council", "un security council", "google finance", "zawya projects"}
REGION_HINTS = [
    ("saudi", r"\b(saudi|riyadh|jeddah|dammam|neom|ksa|tadawul)\b"),
    ("qatar", r"\b(qatar|qatari|doha|lusail)\b"),
    ("kuwait", r"\b(kuwait|kuwaiti)\b"),
    ("bahrain", r"\b(bahrain|bahraini|manama)\b"),
    ("oman", r"\b(oman|omani|muscat|duqm|sohar|salalah)\b"),
    ("northern", r"\b(sharjah|ras al khaimah|rak|fujairah|ajman|umm al quwain)\b"),
    ("dubai", r"\b(dubai|dfm|difc|jebel ali)\b"),
    ("abudhabi", r"\b(abu dhabi|adx|adgm|al ain)\b"),
]
GROUP_REGION = {"saudi": "saudi", "qatar": "qatar", "kuwait": "kuwait", "bahrain": "bahrain", "oman": "oman"}
WORD = re.compile(r"[A-Z][A-Za-z0-9&\-]*|[a-z]+|&")
# segment boundaries: punctuation, spaced dashes, possessives ("L'IMAD's AD Ports")
SEG = re.compile(r"[.,:;|!?()\[\]\"“”]+(?:\s|$)|\s[-–—]\s|['’]s\b|\s['‘’]|['‘’]\s")

def existing_index():
    idx = set()
    for d in REGION_DIRS:
        js = (ROOT / d / "network_data.js") if d else ROOT / "network_data.js"
        if not js.exists(): continue
        for n in load_nodes(js):
            for a in n["aliases"]:
                if len(norm(a)) >= 3: idx.add(norm(a))
    return idx

def distinctive(c):
    return any(w.lower() not in STOP and w.lower() not in ORG_KW and w.lower() not in GENERIC
               and w.lower() not in CONNECT for w in c.split())

def candidates(text):
    out = set()
    for seg in SEG.split(text):
        toks = WORD.findall(seg or "")
        for i, t in enumerate(toks):
            low = t.lower()
            if low in ORG_KW and t[0].isupper():
                j = i
                while j > 0 and i - j < 5:
                    p, pl = toks[j - 1], toks[j - 1].lower()
                    if p[0].isupper() and pl not in STOP:
                        j -= 1
                    elif pl in CONNECT and j >= 2 and toks[j - 2][0].isupper() and toks[j - 2].lower() not in STOP:
                        j -= 1
                    else:
                        break
                while j < i and toks[j].lower() in ("&", "and", "of", "for"): j += 1
                if j < i:
                    out.add(" ".join(toks[j:i + 1]))
            if low in PREFIX_KW and t[0].isupper() and i + 2 < len(toks) and toks[i + 1] == "of":
                k = i + 2
                while k < len(toks) and k - i < 7 and (toks[k][0].isupper() or toks[k].lower() in CONNECT):
                    k += 1
                while k > i + 2 and toks[k - 1].lower() in CONNECT: k -= 1
                if k > i + 2:
                    out.add(" ".join(toks[i:k]))
    return {c for c in out if len(c.split()) >= 2 and len(c) <= 70 and distinctive(c) and c.lower() not in MEDIA}

def known(k, have):
    """exact, or any contiguous >=2-word sub-phrase is an existing name ("Business Etihad Airways")"""
    if k in have: return True
    ws = k.split()
    return any(" ".join(ws[a:b]) in have for a in range(len(ws)) for b in range(a + 2, len(ws) + 1))

def article_date(p):
    m = re.match(r"(\d{4}-\d{2}-\d{2})", p.name)
    return m.group(1) if m else date.fromtimestamp(p.stat().st_mtime).isoformat()

def main():
    days = int(sys.argv[sys.argv.index("--days") + 1]) if "--days" in sys.argv else 21
    min_m = int(sys.argv[sys.argv.index("--min") + 1]) if "--min" in sys.argv else 2
    cutoff = (date.today() - timedelta(days=days)).isoformat()
    have = existing_index()
    files = [(p, "abudhabi") for p in (ROOT / "news_inbox").glob("*.md")]
    for p in (ROOT / "scraped_news").rglob("*.md"):
        files.append((p, GROUP_REGION.get(p.parent.name, "")))
    stats = defaultdict(lambda: {"name": None, "arts": set(), "regions": defaultdict(int), "sample": "", "first": "9999", "last": ""})
    for p, reg0 in files:
        d = article_date(p)
        if d < cutoff: continue
        try:
            lines = p.read_text(encoding="utf-8", errors="ignore").splitlines()
        except OSError:
            continue
        title = next((l[2:].strip() for l in lines if l.startswith("# ")), "")
        body = next((l.strip() for l in lines[1:] if l.strip() and not re.match(r"^(source|url|date|published):", l, re.I) and not l.startswith("#")), "")
        text = f"{title}. {body}"
        low = text.lower()
        reg = next((r for r, pat in REGION_HINTS if re.search(pat, low)), reg0)
        for c in candidates(text):
            k = norm(c)
            if len(k) < 5 or known(k, have):
                continue
            s = stats[k]
            if s["name"] is None or len(c) > len(s["name"]): s["name"] = c
            s["arts"].add(p.name)
            if reg: s["regions"][reg] += 1
            if not s["sample"]: s["sample"] = title[:140]
            s["first"], s["last"] = min(s["first"], d), max(s["last"], d)

    # collapse truncated forms: "Qatar Development" when "Qatar Development Bank" covers the same articles
    keys = sorted(stats, key=len)
    for a in keys:
        for b in keys:
            if len(b) > len(a) and (b.startswith(a + " ") or b.endswith(" " + a)) and stats[a]["arts"] <= stats[b]["arts"]:
                stats[a]["arts"] = set()
                break

    prev = {}
    if OUT.exists():
        with open(OUT, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                prev[norm(r["name"])] = r
    rows = []
    for k, s in stats.items():
        if len(s["arts"]) < min_m and k not in prev: continue
        reg = max(s["regions"], key=s["regions"].get) if s["regions"] else ""
        status = prev.get(k, {}).get("status") or "pending"
        rows.append([s["name"], len(s["arts"]), reg, status, s["first"], s["last"], s["sample"]])
    # keep decided rows that aged out of the window
    live = {norm(r[0]) for r in rows}
    for k, r in prev.items():
        if k not in live and r.get("status") in ("added", "rejected"):
            rows.append([r["name"], r["mentions"], r["region_guess"], r["status"], r["first_seen"], r["last_seen"], r["sample_headline"]])
    rows.sort(key=lambda r: (r[3] != "pending", -int(r[1])))
    with open(OUT, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["name", "mentions", "region_guess", "status", "first_seen", "last_seen", "sample_headline"])
        w.writerows(rows)
    pend = sum(1 for r in rows if r[3] == "pending")
    print(f"institution candidates: {pend} pending (>= {min_m} articles in {days}d) -> {OUT.relative_to(ROOT)}")

if __name__ == "__main__":
    main()
