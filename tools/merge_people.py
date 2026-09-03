"""Bulk-merge board/management rows into the region maps.

  python tools/merge_people.py

Consumes data/board_additions_*.csv with header:
  region,institution_id,person_name,title,role_type,verification
(region: abudhabi/dubai/northern/saudi/qatar/bahrain/oman/kuwait;
 role_type: board|executive; verification: v|ns)

Per region it dedupes by normalized person name (skips people already in that
map; merges multiple rows for the same new person into one entry with several
roles), generates ids, calibrates power (chair 62 / executive 58 / board 52),
assigns the institution's sector, then appends: Abu Dhabi -> data/people.csv +
data/roles.csv; other regions -> that region's network_data.js PEOPLE block.
Staging files are deleted after a successful merge. Run tools/update.py after.
"""
import csv
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import ROOT, load_nodes

REGION_DIR = {"abudhabi": "", "dubai": "dubai", "northern": "northern", "saudi": "saudi",
              "qatar": "qatar", "bahrain": "bahrain", "oman": "oman", "kuwait": "kuwait"}

def norm(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())

def slug(name):
    s = re.sub(r"[^a-z0-9]+", "_", name.lower()).strip("_")
    parts = s.split("_")
    return "_".join(parts[:3])[:28] or "person"

def power_for(rows):
    p = 52
    for r in rows:
        t = r["title"].lower()
        if r["role_type"] == "executive": p = max(p, 58)
        if "chair" in t: p = max(p, 62)
        if "ceo" in t or "managing director" in t: p = max(p, 60)
    return p

def main():
    staged = sorted((ROOT / "data").glob("board_additions_*.csv"))
    if not staged:
        print("no board_additions_*.csv staging files found")
        return
    rows_by_region = {}
    for f in staged:
        with open(f, encoding="utf-8-sig", newline="") as fh:
            for r in csv.DictReader(fh):
                reg = (r.get("region") or "").strip().lower()
                if reg not in REGION_DIR or not (r.get("person_name") or "").strip():
                    continue
                r = {k: (v or "").strip() for k, v in r.items()}
                if r["role_type"] not in ("board", "executive"): r["role_type"] = "board"
                if r["verification"] not in ("v", "ns"): r["verification"] = "ns"
                rows_by_region.setdefault(reg, []).append(r)

    total_p = total_r = 0
    for reg, rows in rows_by_region.items():
        rd = REGION_DIR[reg]
        data_js = (ROOT / rd / "network_data.js") if rd else (ROOT / "network_data.js")
        nodes = load_nodes(data_js)
        inst_sector = {}
        text = data_js.read_text(encoding="utf-8")
        for m in re.finditer(r'\{id:"([^"]+)",\s*n:"[^"]*",\s*s:"(\w+)"', text):
            inst_sector[m.group(1)] = m.group(2)
        existing_names = {norm(n["name"]) for n in nodes}
        existing_ids = {n["id"] for n in nodes}

        # group by person
        people = {}
        for r in rows:
            if r["institution_id"] not in inst_sector:
                print(f"  [{reg}] unknown institution {r['institution_id']} — row skipped ({r['person_name']})")
                continue
            k = norm(r["person_name"])
            if k in existing_names:
                continue      # person already curated in this map — leave to daily agent
            people.setdefault(k, {"name": r["person_name"], "rows": []})["rows"].append(r)

        adds = []
        for k, p in people.items():
            pid = slug(p["name"])
            while pid in existing_ids: pid += "_b"
            existing_ids.add(pid)
            sector = inst_sector.get(p["rows"][0]["institution_id"], "finance")
            adds.append((pid, p["name"], power_for(p["rows"]), sector, p["rows"]))

        if not adds:
            print(f"  [{reg}] nothing new")
            continue

        if rd == "":
            with open(ROOT/"data"/"people.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for pid, name, pw, sector, rws in adds:
                    w.writerow([pid, name, 2, pw, sector, ""])
            with open(ROOT/"data"/"roles.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for pid, name, pw, sector, rws in adds:
                    for r in rws:
                        w.writerow([pid, name, r["institution_id"], "", r["title"], r["role_type"], r["verification"]])
                        total_r += 1
        else:
            lines = []
            for pid, name, pw, sector, rws in adds:
                role_lines = ",\n".join(
                    f'    ["{r["institution_id"]}","{r["title"]}","{r["role_type"]}","{r["verification"]}"]'
                    for r in rws)
                lines.append(f'  {{id:"{pid}", n:"{name}", t:2, p:{pw}, s:"{sector}", roles:[\n{role_lines}]}},\n')
                total_r += len(rws)
            m = re.search(r"(const PEOPLE = \[)(.*?)(\n\];)", text, re.S)
            text = text[:m.end(2)] + "\n" + "".join(lines).rstrip("\n") + text[m.end(2):]
            data_js.write_text(text, encoding="utf-8")
        total_p += len(adds)
        print(f"  [{reg}] +{len(adds)} people")

    for f in staged:
        f.unlink()
    print(f"merged: +{total_p} people, +{total_r} roles. Staging files removed. Run tools/update.py to ship.")

if __name__ == "__main__":
    main()
