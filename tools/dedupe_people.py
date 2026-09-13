"""Fuzzy pre-pass for researched people rows, run BEFORE tools/merge_people.py.

  python tools/dedupe_people.py <research_dir> [file-or-glob ...]            # report only
  python tools/dedupe_people.py <research_dir> [file-or-glob ...] --apply    # write

Inputs: CSVs in <research_dir> with header
  region,institution_id,person_name,title,role_type,verification[,source_url]
(default glob: *.csv). Optional <research_dir>/dedupe_cfg.py may define
  REMAP = {("dubai", "lst_airarabia"): ("northern", "airarabia")}   # lst_* shadows -> curated ids
  SKIP_MATCH = {("qatar", "Sheikh Fahad bin Jassim Al Thani")}      # eyeballed: a DIFFERENT person

Why: merge_people.py dedupes on the exact normalised name and silently drops rows for
people already in a map (their new roles are lost) while missing variants such as
"H.E. Kamal Ishaq Almaazmi" vs "Kamal Ishaq Almaazmi" or "Mohammed" vs "Mohamed".

--apply: rows for NEW people -> data/board_additions_daily.csv (then run merge_people.py);
role-adds for EXISTING people are appended directly (AD -> data/roles.csv, regions ->
the person's roles:[ array). Eyeball every [fuzzy] match in the report first — same-name
different people exist, and token-subset matching on Al Thani names gives false hits.
Former (ended) roles are ignored when checking "already holds this role", so apply
demotions-to-former AFTER merging, never before.
"""
import csv
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REG = {"abudhabi": "", "dubai": "dubai", "northern": "northern", "saudi": "saudi", "qatar": "qatar",
       "bahrain": "bahrain", "oman": "oman", "kuwait": "kuwait"}

HON = re.compile(r"^(h\.?\s?h\.?|h\.?\s?e\.?|hrh|his highness|his excellency|her excellency|sheikh|sheikha|shaikh|shaikha|"
                 r"dr\.?|eng\.?|engr\.?|mr\.?|mrs\.?|ms\.?|prof\.?|capt\.?|captain|arch\.?|prince|princess|sayyid|sayyida|"
                 r"lt\.?\s?gen\.?|brig\.?\s?gen\.?|general|major general|lieutenant general|chancellor|advisor|engineer)\s+", re.I)
SYN = {"mohammed": "mohamed", "muhammad": "mohamed", "mohammad": "mohamed", "mohamad": "mohamed", "muhammed": "mohamed",
       "abdullah": "abdulla", "abdallah": "abdulla", "khalid": "khaled", "yousef": "yousif", "yusuf": "yousif"}
ROYAL = re.compile(r"(?i)^(sheikh|sheikha|prince|princess|sayyid)\b")

def ntoks(name):
    s = html.unescape(name).strip()
    prev = None
    while prev != s:
        prev = s
        s = HON.sub("", s).strip()
    s = s.lower().replace("-", " ").replace("’", "'")
    s = re.sub(r"\b(oam|obe|cbe|mbe|phd|cfa|cpa)\b", " ", s)
    s = re.sub(r"[^a-z\s]", "", s)
    t = [SYN.get(x, x) for x in s.split() if len(x) > 1]
    out, i = [], 0
    while i < len(t):
        if t[i] in ("al", "el") and i + 1 < len(t):
            out.append("al" + t[i + 1]); i += 2
        else:
            out.append(t[i]); i += 1
    return out

def load_people(reg):
    """-> [{id, name, roles:set(current institution ids)}]"""
    if reg == "abudhabi":
        ppl = {}
        with open(ROOT / "data/people.csv", encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                ppl[r["id"]] = {"id": r["id"], "name": r["name"], "roles": set()}
        with open(ROOT / "data/roles.csv", encoding="utf-8-sig") as f:
            for r in csv.DictReader(f):
                if r["person_id"] in ppl and not (r.get("status") or "").startswith("former"):
                    ppl[r["person_id"]]["roles"].add(r["institution_id"])
        return list(ppl.values())
    text = (ROOT / REG[reg] / "network_data.js").read_text(encoding="utf-8")
    m = re.search(r"const PEOPLE = \[(.*?)\n\];", text, re.S)
    out = []
    # split on entry boundaries — a single lazy regex attaches one person's roles to another
    for blk in m.group(1).split('{id:"')[1:]:
        pid = blk.split('"', 1)[0]
        nm = re.search(r'n:"([^"]+)"', blk)
        roles = {rm.group(1) for rm in re.finditer(r'\["([A-Za-z0-9_]+)","[^"]*","\w+","\w+"(,"former[^"]*")?\]', blk)
                 if not rm.group(2)}
        out.append({"id": pid, "name": nm.group(1) if nm else pid, "roles": roles})
    return out

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    apply = "--apply" in sys.argv
    if not args:
        sys.exit(__doc__)
    rdir = Path(args[0])
    pats = args[1:] or ["*.csv"]
    cfg = {"REMAP": {}, "SKIP_MATCH": set()}
    if (rdir / "dedupe_cfg.py").exists():
        exec((rdir / "dedupe_cfg.py").read_text(encoding="utf-8"), cfg)
    REMAP, SKIP_MATCH = cfg["REMAP"], cfg["SKIP_MATCH"]

    rows = []
    for f in sorted({f for p in pats for f in rdir.glob(p)}):
        with open(f, encoding="utf-8-sig", newline="") as fh:
            rd = csv.DictReader(fh)
            if not rd.fieldnames or "person_name" not in rd.fieldnames:
                print("skip (no header):", f.name); continue
            for r in rd:
                r = {k: (v or "").strip() for k, v in r.items() if k}
                if not r.get("person_name") or r.get("region") not in REG:
                    continue
                if (r["region"], r["institution_id"]) in REMAP:
                    r["region"], r["institution_id"] = REMAP[(r["region"], r["institution_id"])]
                name = html.unescape(r["person_name"])
                if not ROYAL.match(name):
                    name = HON.sub("", name)
                r["person_name"] = re.sub(r"\s+", " ", name).strip()
                r["title"] = html.unescape(r["title"]).replace('"', "'")
                if r.get("role_type") not in ("board", "executive"):
                    r["role_type"] = "executive" if re.search(r"(?i)chief|officer|ceo|president|head|manager", r["title"]) else "board"
                if r.get("verification") not in ("v", "ns"):
                    r["verification"] = "ns"
                rows.append(r)

    inst_ok = {}
    for reg, d in REG.items():
        js = (ROOT / d / "network_data.js") if d else ROOT / "network_data.js"
        inst_ok[reg] = set(re.findall(r'\{id:"([^"]+)",\s*n:"[^"]*",\s*s:"\w+"', js.read_text(encoding="utf-8")))

    new_rows, role_adds, skipped, seen, cache = [], [], 0, set(), {}
    for r in rows:
        reg = r["region"]
        if r["institution_id"] not in inst_ok[reg]:
            print(f"  UNKNOWN INST {reg}/{r['institution_id']} ({r['person_name']}) — merge the institution first")
            continue
        tk = ntoks(r["person_name"])
        if not tk:
            continue
        sk = (reg, r["institution_id"], " ".join(tk), r["title"].lower())
        if sk in seen:
            skipped += 1; continue
        seen.add(sk)
        if reg not in cache:
            cache[reg] = [(p, ntoks(p["name"])) for p in load_people(reg)]
        hit, kind = None, None
        for p, pt in cache[reg]:
            if pt == tk:
                hit, kind = p, "exact"; break
        if not hit:
            for p, pt in cache[reg]:
                if len(pt) >= 2 and len(tk) >= 2 and pt[0] == tk[0] and pt[-1] == tk[-1] and (set(pt) <= set(tk) or set(tk) <= set(pt)):
                    hit, kind = p, "fuzzy"; break
        if hit and (reg, r["person_name"]) in SKIP_MATCH:
            hit = None
        if hit:
            if r["institution_id"] in hit["roles"]:
                skipped += 1; continue
            role_adds.append((r, hit, kind))
        else:
            new_rows.append(r)

    print(f"rows {len(rows)} | new-person rows {len(new_rows)} | role-adds {len(role_adds)} | already held/duplicate {skipped}")
    for r, p, kind in role_adds:
        print(f"  ROLE-ADD [{kind}] {r['region']}: '{r['person_name']}' -> {p['id']} '{p['name']}' + {r['institution_id']} '{r['title']}'")
    if not apply:
        return

    canon = {}
    for r in new_rows:                       # unify in-batch spelling variants for merge_people's exact dedupe
        k = (r["region"], " ".join(ntoks(r["person_name"])))
        r["person_name"] = canon.setdefault(k, r["person_name"])
    out = ROOT / "data/board_additions_daily.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["region", "institution_id", "person_name", "title", "role_type", "verification", "source_url"])
        for r in new_rows:
            w.writerow([r["region"], r["institution_id"], r["person_name"], r["title"], r["role_type"],
                        r["verification"], r.get("source_url", "")])

    by_reg = {}
    for r, p, kind in role_adds:
        by_reg.setdefault(r["region"], []).append((r, p))
    for reg, items in by_reg.items():
        if reg == "abudhabi":
            with open(ROOT / "data/institutions.csv", encoding="utf-8-sig") as f:
                inames = {x["id"]: x["name"] for x in csv.DictReader(f)}
            with open(ROOT / "data/roles.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for r, p in items:
                    w.writerow([p["id"], p["name"], r["institution_id"], inames.get(r["institution_id"], ""),
                                r["title"], r["role_type"], r["verification"], ""])
        else:
            js = ROOT / REG[reg] / "network_data.js"
            text = js.read_text(encoding="utf-8")
            for r, p in items:
                m = re.search(r'\{id:"' + re.escape(p["id"]) + r'",[^\n]*?roles:\[', text)
                if not m:
                    print("  !! could not locate", p["id"]); continue
                text = text[:m.end()] + f'\n    ["{r["institution_id"]}","{r["title"]}","{r["role_type"]}","{r["verification"]}"],' + text[m.end():]
            js.write_text(text, encoding="utf-8")
    try:
        import provenance
        provenance.log([(r["region"], p["id"], "person", r.get("source_url", ""), "role_added")
                        for r, p, kind in role_adds])
    except Exception as e:
        print("  provenance log skipped:", e)
    print(f"wrote {len(new_rows)} rows -> data/board_additions_daily.csv; applied {len(role_adds)} role-adds. Now run tools/merge_people.py")

if __name__ == "__main__":
    main()
