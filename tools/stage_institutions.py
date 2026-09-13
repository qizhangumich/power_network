"""Turn institution research CSVs into merge_institutions.py staging rows.

  python tools/stage_institutions.py <research_dir> file.csv [file.csv ...]

Research CSV header (what research agents write):
  region,name,short,sector,tier,power,parent_name,relation,verification,source_url,aliases
Resolves parent_name -> an existing parent_id in that region's map and writes
data/institution_additions_stage.csv. Rows whose parent is ANOTHER row of the same batch
(e.g. "Gulf Air" under "Gulf Air Group") go to <research_dir>/pending_pass2.csv — after
`python tools/merge_institutions.py`, run this script again on pending_pass2.csv (copy it
to a new name first) and merge again. Unresolvable parents are staged without an edge.

Optional <research_dir>/stage_cfg.py may define (all reviewed by eye, see docs/ENRICH_AGENT.md):
  PARENT_HINT = {"oq": "oq"}                        # extra parent-name -> id mappings (lowercase keys)
  FORCE = {"Saudi Industrial Development Fund"}      # near-match reviewed as a different entity
  DROP = {("oman", "OQ SAOC")}                       # duplicate of an existing node under another spelling
  REGION_FIX = {"AbuIssa Holding": "qatar"}          # research mislabelled the HQ region
"""
import csv
import html
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from merge_institutions import load_region, REGION_DIR, key

PARENT_HINT = {"government of dubai": "dxbgov", "abu dhabi government": "adgov", "government of abu dhabi": "adgov",
               "ihc": "ihc", "icd": "icd", "adq": "adq", "mubadala": "mubadala", "pif": "pif", "qia": "qia",
               "oia": "oia", "kia": "kia", "mumtalakat": "mumtalakat", "bapco energies": "bapco",
               "kuwait petroleum corporation": "kpc", "kpc": "kpc", "qatarenergy": "qatarenergy",
               "dubai holding": "dubaiholding", "oq": "oq", "ndf": "ndf", "qatar airways": "qatarairways",
               "emirates nbd": "enbd", "difc": "difc"}
FIELDS = ["region", "name", "short", "sector", "tier", "power", "parent_id", "relation", "verification",
          "source_url", "aliases", "force"]

def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    rdir = Path(sys.argv[1])
    cfg = {"PARENT_HINT": {}, "FORCE": set(), "DROP": set(), "REGION_FIX": {}}
    if (rdir / "stage_cfg.py").exists():
        exec((rdir / "stage_cfg.py").read_text(encoding="utf-8"), cfg)
    hints = {**PARENT_HINT, **cfg["PARENT_HINT"]}

    rows = []
    for fn in sys.argv[2:]:
        with open(rdir / fn, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                r = {k: html.unescape((v or "").strip()) for k, v in r.items() if k}
                if r.get("name") in cfg["REGION_FIX"]:
                    r["region"], r["parent_name"] = cfg["REGION_FIX"][r["name"]], ""
                if r.get("region") in REGION_DIR and r.get("name") and (r["region"], r["name"]) not in cfg["DROP"]:
                    rows.append(r)

    batch = set()
    for r in rows:
        for f in [re.sub(r"\(.*?\)", "", r["name"]), r["name"], r.get("short", "")] + r.get("aliases", "").split("|"):
            if f and len(key(f, r["region"])) >= 2:
                batch.add((r["region"], key(f, r["region"])))

    cache, stage, pass2, unresolved = {}, [], [], []
    for r in rows:
        reg = r["region"]
        if reg not in cache:
            cache[reg] = load_region(reg)
        idx, names, _ids, _edges = cache[reg]
        pn, pid = r.get("parent_name", ""), ""
        if pn:
            k = key(re.sub(r"\(.*?\)", "", pn), reg)
            hint = hints.get(pn.lower().strip())
            pid = (hint if hint in names else None) or idx.get(k) or idx.get(key(pn, reg)) or ""
            if not pid:
                if (reg, k) in batch or (reg, key(pn, reg)) in batch:
                    pass2.append(r)
                    continue
                unresolved.append(f"{reg}: {r['name']} <- '{pn}'")
        out = {f: r.get(f, "") for f in FIELDS}
        out["parent_id"] = pid
        if not pid:
            out["relation"] = ""
        if r["name"] in cfg["FORCE"]:
            out["force"] = "1"
        stage.append(out)

    with open(ROOT / "data" / "institution_additions_stage.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS, extrasaction="ignore")
        w.writeheader(); w.writerows(stage)
    if pass2:
        with open(rdir / "pending_pass2.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=["region", "name", "short", "sector", "tier", "power", "parent_name",
                                              "relation", "verification", "source_url", "aliases"], extrasaction="ignore")
            w.writeheader(); w.writerows(pass2)
    print(f"staged {len(stage)} rows, {len(pass2)} deferred to pass 2 (parent in batch), {len(unresolved)} parents unresolved")
    for u in unresolved:
        print("  unresolved parent:", u)

if __name__ == "__main__":
    main()
