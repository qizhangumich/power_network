"""Bulk-add institutions (companies, government bodies, portfolio companies) to the region maps.

  python tools/merge_institutions.py             # merge all data/institution_additions_*.csv
  python tools/merge_institutions.py --dry-run   # report only, change nothing

Staging header:
  region,name,short,sector,tier,power,parent_id,relation,verification,source_url,aliases,force
  region        abudhabi/dubai/northern/saudi/qatar/bahrain/oman/kuwait
  name          full official name (news-matchable)
  short         map label, <= 20 chars (defaults to name)
  sector        energy … conglomerate (same keys as every map)
  tier          0-3 (default 2)
  power         number; blank -> default_power(sector, tier)
  parent_id     optional existing id in that region -> ownership/control edge
  relation      edge label ("wholly owned", "portfolio company", "reports to" …)
  verification  v|ns for the edge (v only with an official source_url)
  aliases       optional "|"-separated AKA forms (acronyms, former names)
  force         1 = add even though a similar (substring) name exists

Dedupe: an institution already in the region (name, short or AKA alias with legal
suffixes stripped) is not re-added; if its row carries a parent edge that the map
lacks, the edge is added to the existing node instead. Near-matches (one name
contained in the other) are skipped and listed for review unless force=1.
Staging files are deleted after a successful merge. Run tools/update.py after.
"""
import csv
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import ROOT, load_nodes, js_string
from import_listings import norm, VALID_SECTORS

REGION_DIR = {"abudhabi": "", "dubai": "dubai", "northern": "northern", "saudi": "saudi",
              "qatar": "qatar", "bahrain": "bahrain", "oman": "oman", "kuwait": "kuwait"}
DATA = ROOT / "data"

def default_power(sector, tier):
    if tier == 0: return 90
    if tier == 1: return 74
    base = {"gov": 62, "sovereign": 64}.get(sector, 56)
    return base if tier == 2 else base - 4

def make_id(short, name, taken):
    src = short if short and len(short) <= 20 else name
    s = re.sub(r"[^a-z0-9]+", "_", norm(src)).strip("_")
    s = "_".join(s.split("_")[:3])[:24] or "inst"
    if s[0].isdigit(): s = "i_" + s
    nid, n = s, 2
    while nid in taken:
        nid, n = f"{s}_{n}", n + 1
    taken.add(nid)
    return nid

def read_csv(path):
    with open(path, encoding="utf-8-sig", newline="") as f:
        return list(csv.DictReader(f))

def load_region(reg):
    """-> (alias index {norm: id}, inst names {id: name}, all ids, edges {(child,parent)})"""
    idx, names, ids, edges = {}, {}, set(), set()
    if reg == "abudhabi":
        for r in read_csv(DATA / "institutions.csv"):
            names[r["id"]] = r["name"]
            for a in (r["name"], r["short"]):
                if len(norm(a)) >= 3: idx.setdefault(norm(a), r["id"])
        ids |= set(names) | {r["id"] for r in read_csv(DATA / "people.csv")}
        for r in read_csv(DATA / "aka.csv"):
            if r["id"] in names:
                for a in r["aliases"].split("|"):
                    if len(norm(a)) >= 3: idx.setdefault(norm(a), r["id"])
        edges = {(r["child_id"], r["parent_id"]) for r in read_csv(DATA / "ownership.csv")}
    else:
        js = ROOT / REGION_DIR[reg] / "network_data.js"
        for n in load_nodes(js):
            ids.add(n["id"])
            if n["kind"] != "inst": continue
            names[n["id"]] = n["name"]
            for a in n["aliases"]:
                if len(norm(a)) >= 3: idx.setdefault(norm(a), n["id"])
        m = re.search(r"const OWNERSHIP = \[(.*?)\n\];", js.read_text(encoding="utf-8"), re.S)
        if m:
            edges = set(re.findall(r'\["([^"]+)","([^"]+)"', m.group(1)))
    return idx, names, ids, edges

def main(dry=False):
    staged = sorted(DATA.glob("institution_additions_*.csv"))
    if not staged:
        print("no data/institution_additions_*.csv staging files found")
        return
    by_reg = {}
    for f in staged:
        for r in read_csv(f):
            r = {k: (v or "").strip() for k, v in r.items() if k}
            if r.get("region") in REGION_DIR and r.get("name"):
                by_reg.setdefault(r["region"], []).append(r)

    tot_i = tot_e = 0
    for reg, rows in by_reg.items():
        idx, names, ids, edges = load_region(reg)
        adds, edge_adds, near, bad = [], [], [], []
        batch = {}
        for r in rows:
            nn = norm(re.sub(r"\(.*?\)", "", r["name"])) or norm(r["name"])
            sector = r.get("sector", "")
            if sector not in VALID_SECTORS:
                bad.append(f"{r['name']}: sector '{sector}'"); continue
            tier = int(r["tier"]) if r.get("tier", "").isdigit() and int(r["tier"]) <= 3 else 2
            try: power = int(float(r["power"]))
            except (KeyError, ValueError): power = default_power(sector, tier)
            parent = r.get("parent_id", "")
            if parent and parent not in names:
                bad.append(f"{r['name']}: unknown parent_id '{parent}' (edge dropped)"); parent = ""
            aliases = [a.strip() for a in r.get("aliases", "").split("|") if a.strip()]
            hit = idx.get(nn) or idx.get(norm(r["name"])) or next((idx[norm(a)] for a in aliases if norm(a) in idx), None) \
                or (idx.get(norm(r.get("short", ""))) if len(norm(r.get("short", ""))) >= 5 else None)
            if hit:
                if parent and parent != hit and (hit, parent) not in edges:
                    edges.add((hit, parent))
                    edge_adds.append((hit, names[hit], parent, r.get("relation", ""), r.get("verification") or "ns"))
                continue
            if nn in batch:
                continue
            if r.get("force") != "1" and len(nn) >= 8:
                sim = next((i for a, i in idx.items() if len(a) >= 8 and (a in nn or nn in a)), None)
                if sim:
                    near.append(f"{r['name']}  ~  {names[sim]} ({sim})"); continue
            short = r.get("short") or r["name"]
            if len(short) > 22: short = short[:20].rstrip() + "…"
            nid = make_id(r.get("short", ""), r["name"], ids)
            batch[nn] = nid
            idx[nn] = nid
            names[nid] = r["name"]
            adds.append(dict(id=nid, name=r["name"], short=short, sector=sector, tier=tier, power=power,
                             parent=parent, relation=r.get("relation", ""),
                             ver=r.get("verification") if r.get("verification") in ("v", "ns") else "ns",
                             aliases=[a for a in aliases if a not in (r["name"], short)]))

        print(f"  [{reg}] +{len(adds)} institutions, +{len(edge_adds)} edges on existing nodes"
              f" ({len(rows) - len(adds)} rows already present/near/invalid)")
        for b in bad: print(f"     invalid: {b}")
        for n in near: print(f"     near-match skipped (set force=1 to add): {n}")
        if dry or not (adds or edge_adds):
            tot_i += len(adds); tot_e += len(edge_adds)
            continue

        new_edges = [(a["id"], a["name"], a["parent"], a["relation"], a["ver"]) for a in adds if a["parent"]] + edge_adds
        if reg == "abudhabi":
            with open(DATA / "institutions.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for a in adds: w.writerow([a["id"], a["name"], a["short"], a["sector"], a["tier"], a["power"]])
            with open(DATA / "ownership.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for c, cn, p, lab, v in new_edges: w.writerow([c, cn, p, names.get(p, ""), lab, v])
            with open(DATA / "aka.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for a in adds:
                    if a["aliases"]: w.writerow([a["id"], "|".join(a["aliases"])])
        else:
            js = ROOT / REGION_DIR[reg] / "network_data.js"
            text = js.read_text(encoding="utf-8")
            inst_lines = "".join(
                f'  {{id:"{a["id"]}", n:{js_string(a["name"])}, s:"{a["sector"]}", t:{a["tier"]}, p:{a["power"]}, short:{js_string(a["short"])}}},\n'
                for a in adds)
            text, k = re.subn(r"\];\s*\n\s*const PEOPLE", lambda m: inst_lines + "];\n\nconst PEOPLE", text, count=1)
            assert k == 1, f"{reg}: INSTITUTIONS block not found"
            if new_edges:
                own = "\n".join(f'  ["{c}","{p}",{js_string(lab)},"{v}"],' for c, cn, p, lab, v in new_edges)
                m = re.search(r"const OWNERSHIP = \[(.*?)(\n\];)", text, re.S)
                assert m, f"{reg}: OWNERSHIP block not found"
                text = text[:m.end(1)] + "\n" + own + text[m.end(1):]
            aka = "\n".join(f'  {a["id"]}:[{",".join(js_string(x) for x in a["aliases"])}],' for a in adds if a["aliases"])
            if aka:
                m = re.search(r"const AKA\s*=\s*\{(.*?)(\n\};)", text, re.S)
                if m: text = text[:m.end(1)] + "\n" + aka + text[m.end(1):]
            js.write_text(text, encoding="utf-8")
        tot_i += len(adds); tot_e += len(edge_adds)

    if dry:
        print(f"dry run: would add +{tot_i} institutions, +{tot_e} edges on existing nodes")
        return
    for f in staged: f.unlink()
    print(f"merged: +{tot_i} institutions, +{tot_e} edges on existing nodes. Staging files removed. Run tools/update.py to ship.")

if __name__ == "__main__":
    main("--dry-run" in sys.argv)
