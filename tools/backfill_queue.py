"""Leadership backfill queue — the engine of rolling growth.

  python tools/backfill_queue.py

Scans every region's network and lists institutions with little or no
leadership attached (no chairman/CEO person-roles), priority-ordered by power.
Writes data/backfill_queue.csv, PRESERVING the status column of rows that
already exist (pending -> done/skip is set by the enrichment agent as it works
through the queue researching each institution's chairman, CEO and board).
Re-run any time; new institutions join as pending automatically.
"""
import csv
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "backfill_queue.csv"
REGIONS = ["", "dubai", "northern", "saudi", "qatar", "bahrain", "oman", "kuwait"]
STR = r'"((?:[^"\\]|\\.)*)"'

def scan(region):
    p = (ROOT / region / "network_data.js") if region else (ROOT / "network_data.js")
    text = p.read_text(encoding="utf-8")
    insts = {}
    for m in re.finditer(r'\{id:' + STR + r',\s*n:' + STR + r',\s*s:' + STR + r',\s*t:(\d+),\s*p:(\d+)', text):
        insts[m.group(1)] = {"name": m.group(2), "sector": m.group(3),
                             "tier": int(m.group(4)), "power": int(m.group(5)), "links": 0}
    for m in re.finditer(r'\[' + STR + r',' + STR + r',' + STR + r'(?:,' + STR + r')?\]', text):
        a = m.group(1)
        if a in insts and m.group(3) in ("political", "government", "board", "executive", "ownership"):
            insts[a]["links"] += 1
    return insts

def main():
    old_status = {}
    if OUT.exists():
        with open(OUT, encoding="utf-8-sig", newline="") as f:
            for r in csv.DictReader(f):
                old_status[(r["region"], r["institution_id"])] = r["status"]
    rows = []
    for region in REGIONS:
        for iid, info in scan(region).items():
            if info["links"] >= 2:      # already has meaningful leadership coverage
                continue
            rows.append({
                "region": region or "abudhabi",
                "institution_id": iid,
                "name": info["name"],
                "sector": info["sector"],
                "power": info["power"],
                "people_linked": info["links"],
                "status": old_status.get((region or "abudhabi", iid), "pending"),
            })
    rows.sort(key=lambda r: (-int(r["power"]), r["region"]))
    OUT.parent.mkdir(exist_ok=True)
    with open(OUT, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["region","institution_id","name","sector","power","people_linked","status"])
        w.writeheader()
        w.writerows(rows)
    pending = sum(1 for r in rows if r["status"] == "pending")
    print(f"backfill queue: {len(rows)} institutions thin on leadership, {pending} pending -> data/backfill_queue.csv")

if __name__ == "__main__":
    main()
