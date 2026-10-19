"""Attach education ties (alumni links) to people already in the region maps.

  python tools/merge_alumni.py             # merge all data/alumni_additions_*.csv
  python tools/merge_alumni.py --dry-run   # report only, change nothing

Staging header:
  region,person_name,person_id,institution_id,title,verification,source_url
  region          abudhabi/dubai/northern/saudi/qatar/bahrain/oman/kuwait
  person_id       optional exact id in that region (wins over name matching)
  institution_id  the school's node id in that region (must exist — add it first
                  with merge_institutions.py)
  title           what the source states, e.g. "MBA (2008)" or
                  "Executive Master in Finance — INSEAD Abu Dhabi campus"
  verification    v only when an official bio / school page states the degree
  source_url      the exact page; logged to data/provenance.csv

A degree is an "alumni" role (role_type alumni): the maps draw it as a faint
weak tie and never use it as reach or as an introduction path. People are
matched by id, else by name with honorifics ignored; an unmatched or ambiguous
name is reported and NOT added — someone enters the network for a GCC role,
never for a degree alone (stage their role through merge_people.py first).
Staging files are deleted after a successful (non-dry) merge.
"""
import csv
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import ROOT
import provenance

REGION_DIR = {"abudhabi": "", "dubai": "dubai", "northern": "northern", "saudi": "saudi",
              "qatar": "qatar", "bahrain": "bahrain", "oman": "oman", "kuwait": "kuwait"}
DATA = ROOT / "data"
HON = {"he", "h", "e", "hh", "dr", "eng", "mr", "mrs", "ms", "prof", "capt", "captain",
       "lt", "gen", "brig", "phd", "mba"}
PERSON_RE = re.compile(r'\{id:"([^"]+)",\s*n:"([^"]*)",[^\n]*?roles:\[')
INST_RE = re.compile(r'\{id:"([^"]+)",\s*n:"([^"]*)",\s*s:"\w+",\s*t:')


def ntoks(s):
    return frozenset(t for t in re.sub(r"[^a-z0-9 ]", " ", (s or "").lower()).split() if t not in HON)


def esc_js(s):
    return str(s).replace("\\", "\\\\").replace('"', '\\"')


def load_region(reg):
    """-> (people {id: name}, institutions {id: name}, existing alumni pairs {(pid, iid)})"""
    if reg == "abudhabi":
        with open(DATA / "people.csv", encoding="utf-8-sig", newline="") as f:
            people = {r["id"]: r["name"] for r in csv.DictReader(f)}
        with open(DATA / "institutions.csv", encoding="utf-8-sig", newline="") as f:
            insts = {r["id"]: r["name"] for r in csv.DictReader(f)}
        with open(DATA / "roles.csv", encoding="utf-8-sig", newline="") as f:
            pairs = {(r["person_id"], r["institution_id"]) for r in csv.DictReader(f)
                     if r.get("role_type") == "alumni"}
        return people, insts, pairs
    text = (ROOT / REGION_DIR[reg] / "network_data.js").read_text(encoding="utf-8")
    people = {m.group(1): m.group(2) for m in PERSON_RE.finditer(text)}
    insts = {m.group(1): m.group(2) for m in INST_RE.finditer(text)}
    pairs = set()
    for m in re.finditer(r'\{id:"([^"]+)",[^\n]*?roles:\[(.*?)\]\}', text, re.S):
        for iid in re.findall(r'\["([^"]+)","[^"]*","alumni"', m.group(2)):
            pairs.add((m.group(1), iid))
    return people, insts, pairs


def main(dry=False):
    staged = sorted(DATA.glob("alumni_additions_*.csv"))
    if not staged:
        print("no data/alumni_additions_*.csv staging files found")
        return
    by_reg = {}
    for f in staged:
        with open(f, encoding="utf-8-sig", newline="") as fh:
            for r in csv.DictReader(fh):
                r = {k: (v or "").strip() for k, v in r.items() if k}
                if r.get("region") in REGION_DIR and (r.get("person_name") or r.get("person_id")):
                    by_reg.setdefault(r["region"], []).append(r)

    total = 0
    for reg, rows in by_reg.items():
        people, insts, pairs = load_region(reg)
        index = {}
        for pid, nm in people.items():
            index.setdefault(ntoks(nm), []).append(pid)
        adds, unmatched, skipped = [], [], 0
        for r in rows:
            iid = r.get("institution_id", "")
            if iid not in insts:
                unmatched.append(f"{r.get('person_name')}: unknown institution_id '{iid}'")
                continue
            pid = r.get("person_id") if r.get("person_id") in people else None
            if not pid:
                hits = index.get(ntoks(r.get("person_name")), [])
                if len(hits) == 1:
                    pid = hits[0]
                else:
                    unmatched.append(f"{r.get('person_name')}: " + ("ambiguous " + str(hits) if hits else "not in this map"))
                    continue
            if (pid, iid) in pairs:
                skipped += 1
                continue
            pairs.add((pid, iid))
            ver = r.get("verification") if r.get("verification") in ("v", "ns") else "ns"
            adds.append((pid, people[pid], iid, insts[iid], r.get("title") or "Alumnus", ver, r.get("source_url", "")))

        print(f"  [{reg}] +{len(adds)} alumni links ({skipped} already linked, {len(unmatched)} not matched)")
        for a in adds:
            print(f"     + {a[1]} ({a[0]}) — {a[4]} @ {a[3]} [{a[5]}]")
        for u in unmatched:
            print(f"     ? {u}")
        if dry or not adds:
            total += len(adds)
            continue

        if reg == "abudhabi":
            with open(DATA / "roles.csv", "a", newline="", encoding="utf-8-sig") as f:
                w = csv.writer(f)
                for pid, pname, iid, iname, title, ver, src in adds:
                    w.writerow([pid, pname, iid, iname, title, "alumni", ver, ""])
        else:
            js = ROOT / REGION_DIR[reg] / "network_data.js"
            text = js.read_text(encoding="utf-8")
            for pid, pname, iid, iname, title, ver, src in adds:
                m = re.search(r'\{id:"' + re.escape(pid) + r'",[^\n]*?roles:\[', text)
                if not m:
                    print("     !! could not locate", pid)
                    continue
                text = text[:m.end()] + f'\n    ["{iid}","{esc_js(title)}","alumni","{ver}"],' + text[m.end():]
            js.write_text(text, encoding="utf-8")
        provenance.log([(reg, pid, "person", src, "role_added") for pid, _, _, _, _, _, src in adds])
        total += len(adds)

    if dry:
        print(f"dry run: would add {total} alumni links")
        return
    for f in staged:
        f.unlink()
    print(f"merged: +{total} alumni links. Staging files removed. Run tools/update.py to ship.")


if __name__ == "__main__":
    main("--dry-run" in sys.argv)
