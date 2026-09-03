"""Import listed companies from the exchange registries into the region maps.

  python tools/import_listings.py

Reads data/listings/<exchange>.csv (columns: symbol,name,sector[,market]) and
adds every company not already present in that exchange's region map as a
background node (t:2, p:50) with a dashed "listed on <exchange>" edge to the
exchange node — so listings form a constellation around their bourse until the
daily agent promotes them (leadership, real ownership, power).

Abu Dhabi rows go through the CSV database (data/institutions.csv +
ownership.csv); other regions are appended to <region>/network_data.js.
Idempotent: name-matching (suffix-stripped, alias-aware) skips existing
companies and previous imports.
"""
import csv
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import ROOT, load_nodes

LISTINGS = ROOT / "data" / "listings"
VALID_SECTORS = {"energy","materials","industry","consumer_disc","consumer_stap","health",
                 "finance","tech","comm","utilities","realestate","gov","sovereign",
                 "education","conglomerate"}
EXCHANGES = {
    "adx":     {"region": "",        "node": "adx",     "label": "listed on ADX"},
    "dfm":     {"region": "dubai",   "node": "dfm",     "label": "listed on DFM"},
    "tadawul": {"region": "saudi",   "node": "tadawul", "label": "listed on Tadawul"},
    "qse":     {"region": "qatar",   "node": "qse",     "label": "listed on QSE"},
    "bhb":     {"region": "bahrain", "node": "bhb",     "label": "listed on Bahrain Bourse"},
    "msx":     {"region": "oman",    "node": "msx",     "label": "listed on MSX"},
    "bk":      {"region": "kuwait",  "node": "boursa",  "label": "listed on Boursa Kuwait"},
}
SUFFIXES = re.compile(
    r"\b(pjsc|psc|p\.j\.s\.c|bsc|b\.s\.c|saog|s\.a\.o\.g|ksc|kscp|k\.s\.c|qpsc|q\.p\.s\.c|sjsc|"
    r"co|company|corp|corporation|group|holding|holdings|plc|llc|ltd|limited|the)\b\.?", re.I)

def norm(s):
    s = re.sub(r"[^\w& ]+", " ", (s or "").lower())
    s = SUFFIXES.sub(" ", s)
    return re.sub(r"\s+", " ", s).strip()

def sym_id(symbol, name):
    base = re.sub(r"[^a-z0-9]+", "", (symbol or "").lower()) or re.sub(r"[^a-z0-9]+", "_", norm(name))[:18]
    return "lst_" + base

def main():
    total_added = 0
    for ex, cfg in EXCHANGES.items():
        src = LISTINGS / f"{ex}.csv"
        if not src.exists():
            print(f"  {ex}: no registry (data/listings/{ex}.csv missing) — skipped")
            continue
        with open(src, encoding="utf-8-sig", newline="") as f:
            rows = [r for r in csv.DictReader(f) if (r.get("name") or "").strip()]

        region = cfg["region"]
        data_js = (ROOT / region / "network_data.js") if region else (ROOT / "network_data.js")
        nodes = load_nodes(data_js)
        existing = set()
        for n in nodes:
            for a in n["aliases"]:
                na = norm(a)
                if len(na) >= 4:
                    existing.add(na)
        exch_node = cfg["node"]
        have_exch = any(n["id"] == exch_node for n in nodes)
        if not have_exch:
            print(f"  {ex}: exchange node '{exch_node}' missing in map — skipped")
            continue

        adds, skipped = [], 0
        seen_ids = {n["id"] for n in nodes}
        for r in rows:
            name = r["name"].strip()
            sector = (r.get("sector") or "").strip()
            if sector not in VALID_SECTORS:
                sector = "finance" if "bank" in name.lower() else "industry"
            nn = norm(name)
            if not nn or any(nn == e or (len(nn) >= 6 and (nn in e or e in nn)) for e in existing):
                skipped += 1
                continue
            nid = sym_id(r.get("symbol"), name)
            if nid in seen_ids:
                skipped += 1
                continue
            seen_ids.add(nid)
            existing.add(nn)
            short = name if len(name) <= 20 else (r.get("symbol") or name[:18]).upper()
            adds.append((nid, name, sector, short))

        if not adds:
            print(f"  {ex}: nothing new ({skipped} already present) of {len(rows)}")
            continue

        if region == "":
            with open(ROOT/"data"/"institutions.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for nid, name, sector, short in adds:
                    w.writerow([nid, name, short, sector, 2, 50])
            with open(ROOT/"data"/"ownership.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for nid, name, sector, short in adds:
                    w.writerow([nid, name, exch_node, "ADX", cfg["label"], "ns"])
        else:
            text = data_js.read_text(encoding="utf-8")
            inst_lines = "".join(
                f'  {{id:"{nid}", n:"{name}", s:"{sector}", t:2, p:50, short:"{short}"}},\n'
                for nid, name, sector, short in adds)
            own_lines = "".join(
                f'  ["{nid}","{exch_node}","{cfg["label"]}","ns"],\n'
                for nid, name, sector, short in adds)
            # insert institutions before INSTITUTIONS closing bracket
            text = re.sub(r"\];\s*\n\s*const PEOPLE", inst_lines + "];\n\nconst PEOPLE", text, count=1)
            # insert ownership rows before OWNERSHIP closing bracket
            m = re.search(r"const OWNERSHIP = \[(.*?)(\n\];)", text, re.S)
            if m:
                text = text[:m.end(1)] + "\n" + own_lines.rstrip("\n") + text[m.end(1):]
            data_js.write_text(text, encoding="utf-8")

        total_added += len(adds)
        print(f"  {ex}: +{len(adds)} listed companies added ({skipped} already present) of {len(rows)}")

    print(f"total: {total_added} companies imported")
    if total_added and not (LISTINGS / ".note").exists():
        print("Run tools/import_csv.py (Abu Dhabi) / tools/update.py to regenerate and ship.")

if __name__ == "__main__":
    main()
