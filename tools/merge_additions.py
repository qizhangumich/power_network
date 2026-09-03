"""Merge staged people/role additions into the Abu Dhabi CSV database.

  python tools/merge_additions.py

Consumes data/additions_*_people.csv and data/additions_*_roles.csv (written by
research agents), dedupes against the live tables (by id and by normalized
name), validates sectors/tiers/role types/institution refs, appends the clean
rows to data/people.csv and data/roles.csv, then deletes the staging files.
Run tools/update.py afterwards to regenerate and ship.
"""
import csv
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
D = ROOT / "data"
SECTORS = {"energy","materials","industry","consumer_disc","consumer_stap","health",
           "finance","tech","comm","utilities","realestate","gov","sovereign",
           "education","conglomerate"}
ROLE_TYPES = {"political","government","board","executive","ownership"}

def read(p):
    with open(p, encoding="utf-8-sig", newline="") as f:
        return [r for r in csv.DictReader(f) if any((v or "").strip() for v in r.values())]

def norm(s):
    return re.sub(r"[^a-z0-9]", "", (s or "").lower())

def main():
    people = read(D / "people.csv")
    roles = read(D / "roles.csv")
    insts = {r["id"].strip(): r["name"] for r in read(D / "institutions.csv")}
    pids = {r["id"].strip() for r in people}
    pnames = {norm(r["name"]) for r in people}
    role_keys = {(r["person_id"].strip(), r["institution_id"].strip(), norm(r["title"])) for r in roles}

    new_people, new_roles, problems = [], [], []
    stage_p = sorted(D.glob("additions_*_people.csv"))
    stage_r = sorted(D.glob("additions_*_roles.csv"))
    if not stage_p and not stage_r:
        print("no staging files found")
        return

    id_remap = {}
    for sp in stage_p:
        for r in read(sp):
            pid, name = r["id"].strip(), r["name"].strip()
            if not pid or not name:
                continue
            if norm(name) in pnames:
                # person already exists under another id — remap this staged id
                existing = next((p["id"] for p in people if norm(p["name"]) == norm(name)), None)
                if existing:
                    id_remap[pid] = existing
                continue
            if pid in pids:
                pid2 = pid + "_2"
                id_remap[pid] = pid2
                pid = pid2
            if r["sector"].strip() not in SECTORS:
                problems.append(f"{sp.name}: bad sector '{r['sector']}' for {pid}"); continue
            if not r["tier"].strip().isdigit() or not r["power"].strip().isdigit():
                problems.append(f"{sp.name}: bad tier/power for {pid}"); continue
            pids.add(pid); pnames.add(norm(name))
            new_people.append([pid, name, int(r["tier"]), int(r["power"]), r["sector"].strip(),
                               (r.get("note") or "").strip()])

    for sr in stage_r:
        for r in read(sr):
            pid = id_remap.get(r["person_id"].strip(), r["person_id"].strip())
            iid = r["institution_id"].strip()
            if pid not in pids:
                problems.append(f"{sr.name}: role for unknown person {pid}"); continue
            if iid not in insts:
                problems.append(f"{sr.name}: unknown institution {iid} ({pid})"); continue
            if r["role_type"].strip() not in ROLE_TYPES:
                problems.append(f"{sr.name}: bad role_type for {pid}"); continue
            v = r["verification"].strip()
            if v not in ("v", "ns"):
                v = "ns"
            key = (pid, iid, norm(r["title"]))
            if key in role_keys:
                continue
            role_keys.add(key)
            pname = r.get("person_name", "").strip()
            new_roles.append([pid, pname, iid, insts[iid], r["title"].strip(), r["role_type"].strip(), v])

    if problems:
        print("PROBLEM ROWS (skipped):")
        for p in problems:
            print("  -", p)

    with open(D / "people.csv", "a", newline="", encoding="utf-8-sig") as f:
        csv.writer(f).writerows(new_people)
    with open(D / "roles.csv", "a", newline="", encoding="utf-8-sig") as f:
        csv.writer(f).writerows(new_roles)
    for p in stage_p + stage_r:
        p.unlink()
    print(f"merged: +{len(new_people)} people, +{len(new_roles)} roles "
          f"({len(problems)} rows skipped). Staging files removed.")
    print("Now run: python tools/update.py \"...\"")

if __name__ == "__main__":
    main()
