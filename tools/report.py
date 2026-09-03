"""Generate an update report: what changed in the network since the last run.

  python tools/report.py

Compares the current state (data/*.csv + news_data.js) against the snapshot in
reports/state.json, appends a timestamped section to reports/YYYY-MM-DD.md
covering: nodes added/removed (with their roles), new roles on existing people,
new ownership edges, news signals this period, and pending suggested edges.
Then refreshes the snapshot. Run by the GitHub Actions workflow after each
news refresh; safe to run manually any time.
"""
import csv
import json
import re
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
D = ROOT / "data"
RDIR = ROOT / "reports"
STATE = RDIR / "state.json"
STR = r'"((?:[^"\\]|\\.)*)"'

def read(fname):
    p = D / fname
    if not p.exists():
        return []
    with open(p, encoding="utf-8-sig", newline="") as f:
        return [r for r in csv.DictReader(f) if any((v or "").strip() for v in r.values())]

def news_items():
    p = ROOT / "news_data.js"
    if not p.exists():
        return []
    txt = p.read_text(encoding="utf-8")
    out = []
    for m in re.finditer(r'\{id:' + STR + r', date:' + STR + r', title:' + STR +
                         r', source:' + STR + r', url:' + STR + r', ids:\[([^\]]*)\]\}', txt):
        out.append({"key": m.group(1), "date": m.group(2), "title": m.group(3).replace('\\"', '"'),
                    "ids": re.findall(STR, m.group(6))})
    return out

def snapshot():
    people = read("people.csv")
    insts = read("institutions.csv")
    return {
        "people": {r["id"]: r["name"] for r in people},
        "institutions": {r["id"]: r["name"] for r in insts},
        "roles": sorted(f'{r["person_id"]}|{r["institution_id"]}|{r["title"]}' for r in read("roles.csv")),
        "ownership": sorted(f'{r["child_id"]}|{r["parent_id"]}' for r in read("ownership.csv")),
        "news": sorted(i["key"] for i in news_items()),
        "suggested": sorted(f'{r["entity_a"]}|{r["entity_b"]}' for r in read("suggested_edges.csv")),
    }

def source_health(now):
    """Flag scrapers with no success >48h (or 2x their cadence) and stale
    listings registries (>30 days). Only emits lines when something is wrong."""
    lines = []
    hp = ROOT / "scraped_news" / "health.json"
    if hp.exists():
        try:
            health = json.loads(hp.read_text(encoding="utf-8"))
        except Exception:
            health = {}
        stale = []
        for key, h in sorted(health.items()):
            freq = h.get("freq_h", 6)
            limit_h = max(48, 2 * freq)
            ok = h.get("last_success")
            if ok:
                try:
                    age_h = (now - datetime.datetime.strptime(ok, "%Y-%m-%dT%H:%M:%SZ")).total_seconds() / 3600
                except ValueError:
                    continue
                if age_h > limit_h:
                    stale.append(f"- `{key}` — last success {age_h/24:.1f} days ago (cadence {freq}h, {h.get('fails', 0)} consecutive fails)")
            elif h.get("fails", 0) >= 3:
                stale.append(f"- `{key}` — never succeeded, {h['fails']} fails (cadence {freq}h)")
        if stale:
            lines.append(f"### Source health — {len(stale)} scraper(s) need attention")
            lines.extend(stale)
            lines.append("")
    old_lists = []
    for f in sorted((D / "listings").glob("*.csv")) if (D / "listings").exists() else []:
        age_d = (now - datetime.datetime.utcfromtimestamp(f.stat().st_mtime)).days
        if age_d > 30:
            old_lists.append(f"- `data/listings/{f.name}` — {age_d} days since refresh")
    if old_lists:
        lines.append("### Listings registries older than 30 days (re-run tools/import_listings.py)")
        lines.extend(old_lists)
        lines.append("")
    return lines

def main():
    RDIR.mkdir(exist_ok=True)
    cur = snapshot()
    old = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else None
    now = datetime.datetime.utcnow()
    stamp = now.strftime("%Y-%m-%d %H:%M UTC")

    if old is None:
        STATE.write_text(json.dumps(cur, ensure_ascii=False), encoding="utf-8")
        (RDIR / f"{now:%Y-%m-%d}.md").write_text(
            f"# Network update report — {now:%Y-%m-%d}\n\n## {stamp} — baseline\n"
            f"Tracking starts here: {len(cur['people'])} people, {len(cur['institutions'])} institutions, "
            f"{len(cur['roles'])} roles, {len(cur['ownership'])} ownership edges, "
            f"{len(cur['news'])} news items on file.\n", encoding="utf-8")
        print("baseline snapshot written")
        return

    roles_all = read("roles.csv")
    names = {**cur["people"], **cur["institutions"]}
    items = news_items()
    lines = []

    def diff(kind):
        added = sorted(set(cur[kind]) - set(old.get(kind, [])))
        removed = sorted(set(old.get(kind, [])) - set(cur[kind]))
        return added, removed

    # nodes
    for kind, label in [("people", "People"), ("institutions", "Institutions")]:
        added = sorted(set(cur[kind]) - set(old.get(kind, {})))
        removed = sorted(set(old.get(kind, {})) - set(cur[kind]))
        if added:
            lines.append(f"### {label} added ({len(added)})")
            for nid in added:
                lines.append(f"- **{cur[kind][nid]}** (`{nid}`)")
                for r in roles_all:
                    if r["person_id"] == nid:
                        lines.append(f"  - {r['title']}, {r['institution_name']} [{r['verification']}]")
            lines.append("")
        if removed:
            lines.append(f"### {label} removed ({len(removed)}): " +
                         ", ".join(old[kind][x] for x in removed) + "\n")

    ra, rr = diff("roles")
    if ra:
        lines.append(f"### New roles ({len(ra)})")
        for r in ra:
            pid, iid, title = r.split("|", 2)
            lines.append(f"- {names.get(pid, pid)} — {title}, {names.get(iid, iid)}")
        lines.append("")
    if rr:
        lines.append(f"### Roles removed ({len(rr)})")
        for r in rr:
            pid, iid, title = r.split("|", 2)
            lines.append(f"- {names.get(pid, pid)} — {title}, {names.get(iid, iid)}")
        lines.append("")

    oa, orm = diff("ownership")
    if oa:
        lines.append(f"### New ownership/control edges ({len(oa)})")
        for e in oa:
            a, b = e.split("|", 1)
            lines.append(f"- {names.get(a, a)} → {names.get(b, b)}")
        lines.append("")

    na, _ = diff("news")
    if na:
        new_items = [i for i in items if i["key"] in set(na)]
        matched = [i for i in new_items if i["ids"]]
        lines.append(f"### News this period: {len(new_items)} new items, {len(matched)} matched")
        from collections import Counter
        cnt = Counter(nid for i in new_items for nid in i["ids"])
        if cnt:
            lines.append("Most active: " + ", ".join(
                f"{names.get(n, n)} ({c})" for n, c in cnt.most_common(8)))
        for i in sorted(matched, key=lambda x: x["date"], reverse=True)[:10]:
            lines.append(f"- {i['date']} — {i['title'][:90]}  →  "
                         + ", ".join(names.get(x, x) for x in i["ids"]))
        lines.append("")

    sa, _ = diff("suggested")
    if sa:
        lines.append(f"### New candidate relationships to review ({len(sa)})")
        for e in sa:
            a, b = e.split("|", 1)
            lines.append(f"- {names.get(a, a)} ↔ {names.get(b, b)}  (see data/suggested_edges.csv)")
        lines.append("")

    lines.extend(source_health(now))

    if not lines:
        print("no changes since last report")
        return

    header = (f"## {stamp}\nTotals: {len(cur['people'])} people · {len(cur['institutions'])} institutions · "
              f"{len(cur['roles'])} roles · {len(cur['ownership'])} ownership edges · "
              f"{len(cur['news'])} news items\n\n")
    fpath = RDIR / f"{now:%Y-%m-%d}.md"
    existing = fpath.read_text(encoding="utf-8") if fpath.exists() else f"# Network update report — {now:%Y-%m-%d}\n\n"
    fpath.write_text(existing + header + "\n".join(lines) + "\n", encoding="utf-8")
    STATE.write_text(json.dumps(cur, ensure_ascii=False), encoding="utf-8")
    print(f"report updated: reports/{now:%Y-%m-%d}.md ({len(lines)} lines added)")

if __name__ == "__main__":
    main()
