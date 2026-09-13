"""Daily growth report: how much the network grew, per region, per day.

  python tools/growth_report.py

Counts people/institutions/roles per region, stores one snapshot per day in
reports/growth_state.json, and renders reports/growth.html — a standalone
bilingual page with today's delta, per-region breakdown, and the last 45 days
of growth. Linked from the landing page footer. Run by tools/update.py and the
GitHub Actions workflow, so the report refreshes with every data change; the
last run of a day defines that day's closing numbers.

The "+N" badges are not just numbers: every added person is recorded by name,
role, institution and verification state in reports/growth_people.json, so the
page can show *who* arrived on any given day. reports/growth_roster.json holds
the id roster of the previous run — the diff against it is what "added" means.
On a first run (no roster yet) the roster is seeded from the last commit made
before today, so today's names are still attributable rather than lost.
"""
import datetime
import json
import re
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import ROOT, load_nodes
import provenance

STATE = ROOT / "reports" / "growth_state.json"
ROSTER = ROOT / "reports" / "growth_roster.json"
PEOPLE_LOG = ROOT / "reports" / "growth_people.json"
OUT = ROOT / "reports" / "growth.html"
KEEP_DAYS = 400
DETAIL_DAYS = 30            # days of named detail embedded in the page
DETAIL_CAP = 1200           # max named entries embedded per day+region

REGIONS = [("abudhabi", "", "Abu Dhabi", "阿布扎比"),
           ("dubai", "dubai", "Dubai", "迪拜"),
           ("northern", "northern", "Northern Emirates", "北部酋长国"),
           ("saudi", "saudi", "Saudi Arabia", "沙特阿拉伯"),
           ("qatar", "qatar", "Qatar", "卡塔尔"),
           ("bahrain", "bahrain", "Bahrain", "巴林"),
           ("oman", "oman", "Oman", "阿曼"),
           ("kuwait", "kuwait", "Kuwait", "科威特")]

ROLE_RE = re.compile(r',"(?:board|executive|political|government|ownership)","(?:v|ns)"')
PERSON_RE = re.compile(r'\{id:"([^"]+)",\s*n:"([^"]*)"[^{}]*?roles:\[(.*?)\]\}', re.S)
ROLE_ITEM = re.compile(r'\["([^"]*)","([^"]*)","(\w+)","(\w+)"')
INST_RE = re.compile(r'\{id:"([^"]+)",\s*n:"([^"]*)",\s*s:"\w+",\s*t:')

REL = {key: (d + "/network_data.js" if d else "network_data.js") for key, d, _, _ in REGIONS}


def region_text(key):
    return (ROOT / REL[key]).read_text(encoding="utf-8")


def parse_people(text):
    """id -> {n: name, r: [[institution name, title, role type, verification], ...]}."""
    insts = {m.group(1): m.group(2) for m in INST_RE.finditer(text)}
    out = {}
    for pid, name, rolesblob in PERSON_RE.findall(text):
        roles = [[insts.get(i, i), t, rt, v] for i, t, rt, v in ROLE_ITEM.findall(rolesblob)]
        out[pid] = {"n": name, "r": roles}
    return out


def counts():
    out = {}
    for key, d, _, _ in REGIONS:
        f = ROOT / REL[key]
        nodes = load_nodes(f)
        text = f.read_text(encoding="utf-8")
        out[key] = [sum(1 for n in nodes if n["kind"] == "person"),
                    sum(1 for n in nodes if n["kind"] == "inst"),
                    len(ROLE_RE.findall(text))]
    out["total"] = [sum(v[i] for k, v in out.items()) for i in range(3)]
    return out


def current_roster():
    # parse_people (not load_nodes) so that both sides of the diff below are
    # produced by the same parser — otherwise the mismatch reads as "added"
    return {key: sorted(parse_people(region_text(key)).keys())
            for key, _, _, _ in REGIONS}


def seed_roster_from_git(today):
    """Roster as of the last commit before today, so a first run can still name
    today's arrivals. Returns None when git can't answer."""
    try:
        rev = subprocess.run(["git", "rev-list", "-1", f"--before={today}T00:00:00", "HEAD"],
                             cwd=ROOT, capture_output=True, text=True,
                             encoding="utf-8", errors="replace", timeout=30)
        sha = rev.stdout.strip()
        if not sha:
            return None
        seeded = {}
        for key, _, _, _ in REGIONS:
            blob = subprocess.run(["git", "show", f"{sha}:{REL[key]}"],
                                  cwd=ROOT, capture_output=True, text=True,
                                  encoding="utf-8", errors="replace", timeout=30)
            if blob.returncode != 0:
                return None
            seeded[key] = sorted(parse_people(blob.stdout).keys())
        return seeded
    except Exception:
        return None


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


def main():
    STATE.parent.mkdir(exist_ok=True)
    state = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
    today = datetime.date.today().isoformat()
    cur = counts()
    state[today] = cur                      # last run of the day wins
    cutoff = (datetime.date.today() - datetime.timedelta(days=KEEP_DAYS)).isoformat()
    state = {k: v for k, v in state.items() if k >= cutoff}
    STATE.write_text(json.dumps(state, separators=(",", ":")), encoding="utf-8")

    # ---- who was added: diff this run's roster against the previous one ----
    roster_now = current_roster()
    prev_roster = json.loads(ROSTER.read_text(encoding="utf-8")) if ROSTER.exists() else None
    if prev_roster is None:
        prev_roster = seed_roster_from_git(today) or roster_now
    plog = json.loads(PEOPLE_LOG.read_text(encoding="utf-8")) if PEOPLE_LOG.exists() else {}
    prov_rows = provenance.read()
    prov_people = {(r["region"], r["entity_id"]): (r["source"], r["url"])
                   for r in prov_rows if r["entity_type"] == "person" and r["action"] == "added"}
    day_entry = plog.setdefault(today, {})
    for key, _, _, _ in REGIONS:
        new_ids = [i for i in roster_now[key] if i not in set(prev_roster.get(key, []))]
        if not new_ids:
            continue
        detail = parse_people(region_text(key))
        known = {e[0] for e in day_entry.get(key, [])}
        rows = day_entry.setdefault(key, [])
        for pid in new_ids:
            if pid in known:
                continue
            d = detail.get(pid, {"n": pid, "r": []})
            first = d["r"][0] if d["r"] else ["", "", "", "ns"]
            src, surl = prov_people.get((key, pid), ("", ""))
            rows.append([pid, d["n"], first[1], first[0], first[3], len(d["r"]), src, surl])
    plog = {k: v for k, v in plog.items() if k >= cutoff}
    PEOPLE_LOG.write_text(json.dumps(plog, separators=(",", ":"), ensure_ascii=False),
                          encoding="utf-8")
    ROSTER.write_text(json.dumps(roster_now, separators=(",", ":")), encoding="utf-8")

    days = sorted(state)                    # oldest -> newest

    def delta(day):
        i = days.index(day)
        if i == 0:
            return None
        prev = state[days[i - 1]]["total"]
        curr = state[day]["total"]
        return [curr[j] - prev[j] for j in range(3)]

    d_today = delta(today) or [0, 0, 0]
    prev_day = days[-2] if len(days) > 1 else None

    # per-region delta vs previous snapshot
    region_rows = []
    for key, dirname, en, zh in REGIONS:
        p, i, r = state[today][key]
        if prev_day and key in state[prev_day]:
            pp, pi, pr = state[prev_day][key]
            dp, di = p - pp, i - pi
        else:
            dp = di = 0
        named = len(plog.get(today, {}).get(key, []))
        chip = (f'<span class="up chip" data-day="{today}" data-reg="{key}" tabindex="0">+{dp}</span>'
                if dp > 0 and named else (f'<span class="up">+{dp}</span>' if dp > 0 else ""))
        badge = chip + (f' <span class="up">+{di} <span class="t" data-en="inst" data-zh="机构">inst</span></span>'
                        if di > 0 else "")
        region_rows.append(
            f'<tr><td><a href="../{dirname + "/" if dirname else "abudhabi/"}">'
            f'<span class="t" data-en="{en}" data-zh="{zh}">{en}</span></a></td>'
            f'<td>{p} {badge if dp or di else ""}</td><td>{i}</td><td>{r}</td></tr>')

    hist_rows = []
    for day in reversed(days[-45:]):
        dd = delta(day)
        t = state[day]["total"]
        n_named = sum(len(v) for v in plog.get(day, {}).values())
        cells = "—" if dd is None else " · ".join(
            (f"+{x}" if x > 0 else str(x)) for x in dd[:2])
        datecell = (f'<span class="chip datechip" data-day="{day}" tabindex="0">{day}</span>'
                    if n_named else day)
        hist_rows.append(f"<tr><td>{datecell}</td><td>{cells}</td><td>{t[0]}</td>"
                         f"<td>{t[1]}</td><td>{t[2]}</td></tr>")

    # embed named detail for recent days only, capped, to keep the page light
    recent = sorted(plog)[-DETAIL_DAYS:]
    embed = {}
    for day in recent:
        embed[day] = {}
        for key, rows in plog[day].items():
            embed[day][key] = {"n": len(rows),
                               "rows": [row[1:] for row in rows[:DETAIL_CAP]]}
    region_names = {key: en for key, _, en, _ in REGIONS}
    region_names_zh = {key: zh for key, _, _, zh in REGIONS}

    # ---- Sources section: where records come from (data/provenance.csv) ----
    from collections import Counter
    KIND_L = {"official":  ("Official page", "官方页面"),
              "report":    ("Annual / governance report", "年报及治理报告"),
              "news":      ("News media", "新闻媒体"),
              "registry":  ("Exchange registry", "交易所名录"),
              "legacy":    ("Curated, pre-provenance", "早期人工核录"),
              "unspecified": ("Source not recorded", "来源未记录")}
    cut30 = (datetime.date.today() - datetime.timedelta(days=30)).isoformat()
    added30 = [r for r in prov_rows if r["action"] == "added" and r["date"] >= cut30]
    kind30, kind_all = Counter(r["source_kind"] for r in added30), \
                       Counter(r["source_kind"] for r in prov_rows)
    ts = {}
    for r in added30:
        if r["source_kind"] == "legacy":
            continue
        d = ts.setdefault((r["source"] or "—", r["source_kind"]), [0, 0])
        d[0 if r["entity_type"] == "person" else 1] += 1
    topsrc = sorted(ts.items(), key=lambda kv: -(kv[1][0] + kv[1][1]))[:12]
    kind_rows = "".join(
        f'<tr><td><span class="t" data-en="{en}" data-zh="{zh}">{en}</span></td>'
        f'<td>{kind30.get(k, 0)}</td><td>{kind_all.get(k, 0)}</td></tr>'
        for k, (en, zh) in KIND_L.items() if kind30.get(k) or kind_all.get(k))
    src_rows = "".join(
        f'<tr><td>{esc(s)}</td>'
        f'<td><span class="t" data-en="{KIND_L.get(k, (k, k))[0]}" data-zh="{KIND_L.get(k, (k, k))[1]}">'
        f'{KIND_L.get(k, (k, k))[0]}</span></td><td>{pc}</td><td>{ic}</td></tr>'
        for (s, k), (pc, ic) in topsrc)
    ing = Counter()
    all_sources = []
    sc = ROOT / "data" / "sources.csv"
    if sc.exists():
        import csv as _csv
        with open(sc, encoding="utf-8-sig", newline="") as f:
            all_sources = list(_csv.DictReader(f))
        for r in all_sources:
            if (r.get("status") or "").strip() == "active":
                ing[(r.get("type") or "").strip()] += 1

    # ---- today's contributions by source (fallback: latest day with adds) ----
    inst_names = {key: {m.group(1): m.group(2) for m in INST_RE.finditer(region_text(key))}
                  for key, _, _, _ in REGIONS}
    ppl_names = {key: {pid: d["n"] for pid, d in parse_people(region_text(key)).items()}
                 for key, _, _, _ in REGIONS}
    added_days = sorted({r["date"] for r in prov_rows if r["action"] == "added"})
    day_pick = today if today in added_days else (added_days[-1] if added_days else None)
    bysrc = {}
    for r in prov_rows:
        if r["date"] != day_pick or r["action"] != "added":
            continue
        label = r["source"] or KIND_L.get(r["source_kind"], (r["source_kind"] or "?",))[0]
        b = bysrc.setdefault(label, {"url": r["url"], "p": [], "i": []})
        nm = (ppl_names if r["entity_type"] == "person" else inst_names) \
            .get(r["region"], {}).get(r["entity_id"], r["entity_id"])
        b["p" if r["entity_type"] == "person" else "i"].append(
            f"{nm} · {region_names.get(r['region'], r['region'])}")
    srcday_blocks = []
    for label, b in sorted(bysrc.items(), key=lambda kv: -(len(kv[1]["p"]) + len(kv[1]["i"]))):
        inner = ""
        SD_CAP = 400
        for kk, lbl_en, lbl_zh in (("p", "People", "人物"), ("i", "Institutions", "机构")):
            if not b[kk]:
                continue
            inner += (f'<div class="dhead"><span class="t" data-en="{lbl_en}" data-zh="{lbl_zh}">{lbl_en}</span></div>'
                      '<div class="sdl">' + "".join(f'<span class="sdn">{esc(x)}</span>' for x in b[kk][:SD_CAP]) + "</div>")
            if len(b[kk]) > SD_CAP:
                inner += f'<div class="more">+{len(b[kk]) - SD_CAP} <span class="t" data-en="more not listed here" data-zh="更多未在此列出">more not listed here</span></div>'
        srcday_blocks.append(
            f'<details class="sd"><summary><b>{esc(label)}</b> · {len(b["p"])} '
            f'<span class="t" data-en="people" data-zh="人物">people</span> · {len(b["i"])} '
            f'<span class="t" data-en="institutions" data-zh="机构">institutions</span></summary>'
            f'<div class="sdw">{inner}</div></details>')
    if srcday_blocks:
        daylbl = ('<span class="t" data-en="Today" data-zh="今日">Today</span>' if day_pick == today else
                  f'{day_pick} (<span class="t" data-en="latest day with additions" data-zh="最近有新增的一天">latest day with additions</span>)')
        srcday_body = ('<div class="sub" style="margin-bottom:6px"><span class="t" '
                       'data-en="Click a source to see exactly which people and institutions it contributed." '
                       'data-zh="点击来源可展开查看其贡献的具体人物与机构。">'
                       'Click a source to see exactly which people and institutions it contributed.</span></div>'
                       f'<div class="sdbox">{"".join(srcday_blocks)}</div>')
    else:
        daylbl = '<span class="t" data-en="Today" data-zh="今日">Today</span>'
        srcday_body = ('<div class="sdbox" style="padding:14px"><span class="t" style="font-size:12.5px;color:var(--soft)" '
                       'data-en="No source-tracked additions yet — provenance logging began on 2026-09-13, and this section fills automatically from the next enrichment run (daily, 05:00 &amp; 11:05 UTC). Each source will appear with its people / institution counts; click to expand the exact names. Meanwhile every existing record already shows its origin on its map dossier (the “Record source” line)." '
                       'data-zh="暂无带来源记录的新增——来源日志自 2026-09-13 启用，本栏目将在下一次每日扩充运行（05:00 与 11:05 UTC）后自动填充：每个来源显示其贡献的人物/机构数量，点击可展开具体名单。现有记录的出处已显示在各图谱档案的“记录来源”一栏。">'
                       'No source-tracked additions yet — this section fills automatically from the next enrichment run.</span></div>')
    srcday_html = (f'<h2><span class="t" data-en="Contributions by source" data-zh="按来源统计新增">Contributions by source</span> — {daylbl}</h2>'
                   + srcday_body)

    # ---- full source registry (all rows, with media health) ----
    health = {}
    hp = ROOT / "scraped_news" / "health.json"
    if hp.exists():
        try:
            health = json.loads(hp.read_text(encoding="utf-8-sig"))
        except Exception:
            health = {}

    def last_ok(group, name):
        h = health.get(f"{group}/{name}")
        if not h or not h.get("last_success"):
            return "—"
        try:
            dt = datetime.datetime.strptime(h["last_success"], "%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            return "—"
        hrs = (datetime.datetime.utcnow() - dt).total_seconds() / 3600
        return f"{hrs:.0f}h" if hrs < 48 else f"{hrs/24:.0f}d"

    TYPE_L = {"media": ("News outlet", "新闻媒体"), "query": ("News query", "新闻查询"),
              "registry": ("Exchange registry", "交易所名录")}
    # what each outlet actually contributes to the maps: matched news signals,
    # split by whether the matched entity is a person or an institution
    people_by_src, inst_by_src = Counter(), Counter()
    for key, d, _, _ in REGIONS:
        nf = ROOT / REL[key].replace("network_data", "news_data")
        if not nf.exists():
            continue
        id_kind = {n["id"]: n["kind"] for n in load_nodes(ROOT / REL[key])}
        for m in re.finditer(r'\{id:"[^"]+",.*?source:"([^"]*)".*?ids:\[([^\]]*)\]\}', nf.read_text(encoding="utf-8")):
            src = m.group(1)
            if not src:
                continue
            kinds = {id_kind.get(i) for i in re.findall(r'"([^"]+)"', m.group(2))}
            if "person" in kinds:
                people_by_src[src] += 1
            if "inst" in kinds:
                inst_by_src[src] += 1
    reg_src_rows = []
    for r in sorted(all_sources, key=lambda x: (x.get("type", ""), x.get("group", ""), x.get("name", ""))):
        typ, grp, name = (r.get("type") or "").strip(), (r.get("group") or "").strip(), (r.get("name") or "").strip()
        ten, tzh = TYPE_L.get(typ, (typ, typ))
        status = (r.get("status") or "").strip()
        st_html = ('<span class="vf v">active</span>' if status == "active"
                   else f'<span class="vf ns">{esc(status)}</span>')
        freq = (r.get("freq_hours") or "").strip()
        cadence = (freq + "h" if freq else "6h") if typ == "media" else "—"
        ok = last_ok(grp, name) if typ == "media" else "—"
        people_n = str(people_by_src.get(name, 0)) if typ == "media" else "—"
        inst_n = str(inst_by_src.get(name, 0)) if typ == "media" else "—"
        reg_src_rows.append(f'<tr><td>{esc(name)}</td>'
                            f'<td><span class="t" data-en="{ten}" data-zh="{tzh}">{ten}</span></td>'
                            f'<td>{esc(grp)}</td><td>{cadence}</td><td>{ok}</td><td>{people_n}</td><td>{inst_n}</td><td>{st_html}</td></tr>')
    registry_html = ""
    if reg_src_rows:
        registry_html = (
            f'<details class="allsrc"><summary><b><span class="t" data-en="All ingestion sources" data-zh="全部信息来源">All ingestion sources</span></b>'
            f' ({len(all_sources)}) · <span class="t" data-en="managed in data/sources.csv — add a row to add a source, set status paused to retire one" '
            f'data-zh="管理于 data/sources.csv——新增来源即添加一行，停用则将 status 设为 paused">managed in data/sources.csv</span></summary>'
            '<table style="margin-top:8px"><tr>'
            '<th class="t" data-en="Source" data-zh="来源">Source</th>'
            '<th class="t" data-en="Type" data-zh="类型">Type</th>'
            '<th class="t" data-en="Group" data-zh="分组">Group</th>'
            '<th class="t" data-en="Cadence" data-zh="频率">Cadence</th>'
            '<th class="t" data-en="Last fetch OK" data-zh="上次成功抓取">Last fetch OK</th>'
            '<th class="t" data-en="People in news" data-zh="图上人物">People in news</th>'
            '<th class="t" data-en="Institutions in news" data-zh="图上机构">Institutions in news</th>'
            '<th class="t" data-en="Status" data-zh="状态">Status</th></tr>'
            + "".join(reg_src_rows) + "</table></details>")
    sources_html = f"""
<h2 class="t" data-en="Where records come from" data-zh="数据来源">Where records come from</h2>
<div class="sub" style="margin-bottom:6px"><span class="t"
 data-en="Every person and institution added since provenance logging began carries the exact page it was taken from (data/provenance.csv). Ingestion runs on {ing.get('media', 0)} media outlets, {ing.get('query', 0)} news queries and {ing.get('registry', 0)} exchange registries — managed as data in data/sources.csv."
 data-zh="自来源记录启用起，每位新增人物与机构均记录其确切出处（data/provenance.csv）。信息采集来自 {ing.get('media', 0)} 家媒体、{ing.get('query', 0)} 条新闻查询与 {ing.get('registry', 0)} 个交易所名录——均作为数据管理于 data/sources.csv。">
Every person and institution added since provenance logging began carries the exact page it was taken from.</span></div>
<table><tr><th class="t" data-en="Source type" data-zh="来源类型">Source type</th>
<th class="t" data-en="Added, last 30 days" data-zh="近30天新增">Added, last 30 days</th>
<th class="t" data-en="All records" data-zh="全部记录">All records</th></tr>
{kind_rows}</table>
""" + (f"""<h2 class="t" data-en="Top sources (last 30 days)" data-zh="主要来源（近30天）">Top sources (last 30 days)</h2>
<table><tr><th class="t" data-en="Source" data-zh="来源">Source</th>
<th class="t" data-en="Type" data-zh="类型">Type</th>
<th class="t" data-en="People" data-zh="人物">People</th>
<th class="t" data-en="Institutions" data-zh="机构">Institutions</th></tr>
{src_rows}</table>
""" if src_rows else "")
    sources_html = sources_html + srcday_html + registry_html

    stamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>NavGCC — Growth</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
<style>
:root{{--bg:#F6F6F4;--card:#FFF;--ink:#17181C;--soft:#5B5D66;--faint:#9A9CA6;--line:#E4E4E0;--accent:#4C57C5}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{background:var(--bg);color:var(--ink);font:15px/1.5 -apple-system,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",sans-serif;padding:28px 20px 60px}}
.wrap{{max-width:820px;margin:0 auto}}
a{{color:var(--soft)}} h1{{font-size:24px;margin:14px 0 2px}} .sub{{color:var(--faint);font-size:12.5px}}
.cards{{display:flex;gap:12px;margin:20px 0}}
.c{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 18px;flex:1}}
.c b{{font-size:24px;display:block}} .c span{{color:var(--soft);font-size:12px}}
.up{{color:#2F9E63;font-weight:600;font-size:12px}}
table{{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin:10px 0 26px;font-size:13.5px}}
th{{text-align:left;color:var(--faint);font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:9px 14px;border-bottom:1px solid var(--line)}}
td{{padding:8px 14px;border-bottom:1px solid var(--line)}} tr:last-child td{{border-bottom:0}}
tbody tr:hover td, table tr:hover td{{background:rgba(76,87,197,.06)}}
h2{{font-size:15px;margin:24px 0 4px}}
#b-lang{{float:right;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:4px 12px;font-size:12px;color:var(--soft);cursor:pointer}}
.chip{{cursor:pointer;border-bottom:1px dashed rgba(47,158,99,.55);outline:none}}
.chip:hover,.chip:focus{{border-bottom-style:solid}}
.datechip{{color:var(--accent);font-weight:500;border-bottom-color:rgba(76,87,197,.4)}}
tr.drill td{{background:#FBFBFA;padding:0}}
tr.drill.hide{{display:none}}
.dwrap{{padding:10px 14px 14px}}
.dhead{{font-size:11.5px;color:var(--faint);text-transform:uppercase;letter-spacing:.07em;margin-bottom:7px}}
.plist{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:5px 16px;max-height:340px;overflow-y:auto}}
.p{{font-size:12.5px;line-height:1.45;padding:3px 0;border-bottom:1px solid #EFEFEC}}
.p b{{font-weight:600}}
.p i{{font-style:normal;color:var(--soft)}}
.p .inst{{color:var(--faint)}}
.vf{{display:inline-block;font-size:9.5px;padding:0 5px;border-radius:999px;vertical-align:1px;margin-left:4px}}
.vf.v{{background:rgba(47,158,99,.13);color:#2F9E63}}
.vf.ns{{background:rgba(154,156,166,.18);color:var(--faint)}}
.more{{font-size:11.5px;color:var(--faint);margin-top:8px}}
.src{{font-size:10.5px;color:var(--faint)}} .src a{{color:var(--faint)}}
.sdbox{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:4px 14px;margin:10px 0 26px}}
details.sd{{border-bottom:1px solid var(--line);padding:8px 0}} details.sd:last-child{{border-bottom:0}}
details.sd summary,details.allsrc summary{{cursor:pointer;font-size:13.5px;list-style:none}}
details.sd summary::before,details.allsrc summary::before{{content:"▸ ";color:var(--faint);font-size:11px}}
details[open].sd summary::before,details[open].allsrc summary::before{{content:"▾ "}}
.sdw{{padding:8px 2px 4px 14px}}
.sdl{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:3px 14px;margin-bottom:6px}}
.sdn{{font-size:12.5px;padding:2px 0;border-bottom:1px solid #EFEFEC}}
details.allsrc{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin:10px 0 26px}}
details.allsrc table{{border:0;margin:0}}
.prov{{font-size:11.5px;color:var(--soft);margin-top:10px;padding-top:9px;border-top:1px solid var(--line);line-height:1.6}}
#tip{{position:fixed;z-index:50;max-width:330px;background:#17181C;color:#fff;border-radius:9px;
     padding:9px 11px;font-size:12px;line-height:1.5;display:none;pointer-events:none;box-shadow:0 6px 22px rgba(0,0,0,.22)}}
#tip .h{{color:#B9BCC6;font-size:10.5px;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}}
</style></head><body><div class="wrap">
<button id="b-lang">中文</button>
<a href="../" class="t" data-en="&larr; NavGCC" data-zh="&larr; NavGCC">&larr; NavGCC</a>
<h1 class="t" data-en="Network growth" data-zh="网络增长">Network growth</h1>
<div class="sub"><span class="t" data-en="Updated" data-zh="更新于">Updated</span> {stamp} · <span class="t" data-en="auto-generated on every data refresh" data-zh="每次数据刷新时自动生成">auto-generated on every data refresh</span></div>
<div class="cards">
<div class="c"><b>{cur["total"][0]}</b><span class="t" data-en="people" data-zh="人物">people</span> <span class="up">{"+" + str(d_today[0]) if d_today[0] > 0 else ""}</span></div>
<div class="c"><b>{cur["total"][1]}</b><span class="t" data-en="institutions" data-zh="机构">institutions</span> <span class="up">{"+" + str(d_today[1]) if d_today[1] > 0 else ""}</span></div>
<div class="c"><b>{cur["total"][2]}</b><span class="t" data-en="roles" data-zh="职位">roles</span> <span class="up">{"+" + str(d_today[2]) if d_today[2] > 0 else ""}</span></div>
</div>
<h2 class="t" data-en="By region" data-zh="按地区">By region</h2>
<div class="sub" style="margin-bottom:6px"><span class="t" data-en="Hover a green +N to preview who was added; click it for the full list." data-zh="将鼠标悬停在绿色 +N 上可预览新增人物，点击查看完整名单。">Hover a green +N to preview who was added; click it for the full list.</span></div>
<table id="regtab"><tr><th class="t" data-en="Region" data-zh="地区">Region</th><th class="t" data-en="People" data-zh="人物">People</th><th class="t" data-en="Institutions" data-zh="机构">Institutions</th><th class="t" data-en="Roles" data-zh="职位">Roles</th></tr>
{"".join(region_rows)}</table>
<h2 class="t" data-en="Daily history (people · institutions added)" data-zh="每日历史（新增人物 · 机构）">Daily history (people · institutions added)</h2>
<table id="histtab"><tr><th class="t" data-en="Date" data-zh="日期">Date</th><th class="t" data-en="Added" data-zh="新增">Added</th><th class="t" data-en="People" data-zh="人物">People</th><th class="t" data-en="Institutions" data-zh="机构">Institutions</th><th class="t" data-en="Roles" data-zh="职位">Roles</th></tr>
{"".join(hist_rows)}</table>
{sources_html}
</div>
<div id="tip"></div>
<script>
var ADDED = {json.dumps(embed, ensure_ascii=False, separators=(",", ":"))};
var RNAME = {json.dumps(region_names, ensure_ascii=False, separators=(",", ":"))};
var RNAME_ZH = {json.dumps(region_names_zh, ensure_ascii=False, separators=(",", ":"))};
var lang="en"; try{{lang=localStorage.getItem("pm_lang")==="zh"?"zh":"en";}}catch(e){{}}
function ap(){{document.querySelectorAll(".t").forEach(function(el){{el.innerHTML=el.getAttribute(lang==="zh"?"data-zh":"data-en");}});
document.getElementById("b-lang").textContent=lang==="zh"?"EN":"中文";}}
document.getElementById("b-lang").addEventListener("click",function(){{lang=lang==="zh"?"en":"zh";try{{localStorage.setItem("pm_lang",lang);}}catch(e){{}}ap();closeAll();}});

function esc(s){{return String(s==null?"":s).replace(/[&<>"]/g,function(c){{
  return {{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}}[c];}});}}
function regName(k){{return (lang==="zh"?RNAME_ZH:RNAME)[k]||k;}}
function bucket(day,reg){{var d=ADDED[day]; if(!d) return null;
  if(reg) return d[reg]?[[reg,d[reg]]]:null;
  var out=[]; for(var k in d) out.push([k,d[k]]); return out.length?out:null;}}

/* ---- hover preview ---- */
var tip=document.getElementById("tip");
function showTip(ev,day,reg){{
  var b=bucket(day,reg); if(!b) return;
  var total=0; b.forEach(function(x){{total+=x[1].n;}});
  var names=[],capped=false;
  for(var i=0;i<b.length&&names.length<7;i++){{
    var rows=b[i][1].rows;
    for(var j=0;j<rows.length&&names.length<7;j++) names.push(rows[j]);
  }}
  if(total>names.length) capped=true;
  var head=lang==="zh"?(day+" 新增 "+total+" 人"):(total+" added "+day);
  var html='<div class="h">'+esc(head)+'</div>';
  names.forEach(function(r){{
    html+='<div>'+esc(r[0])+(r[1]?' &middot; <span style="color:#B9BCC6">'+esc(r[1])+'</span>':'')+'</div>';
  }});
  if(capped) html+='<div style="color:#B9BCC6;margin-top:4px">'+
     esc(lang==="zh"?("… 点击查看全部 "+total+" 人"):("… click for all "+total))+'</div>';
  tip.innerHTML=html; tip.style.display="block";
  var r=tip.getBoundingClientRect();
  var x=Math.min(ev.clientX+14, window.innerWidth-r.width-10);
  var y=Math.min(ev.clientY+16, window.innerHeight-r.height-10);
  tip.style.left=Math.max(8,x)+"px"; tip.style.top=Math.max(8,y)+"px";
}}
function hideTip(){{tip.style.display="none";}}

/* ---- click to expand ---- */
function closeAll(){{document.querySelectorAll("tr.drill").forEach(function(t){{t.remove();}});}}
function rowHtml(r){{
  var v=r[3]==="v";
  var vlabel=v?(lang==="zh"?"已核实":"verified"):(lang==="zh"?"待核实":"unverified");
  var extra=r[4]>1?(lang==="zh"?(" · 共"+r[4]+"个职位"):(" · "+r[4]+" roles")):"";
  var src=r.length>5&&r[5]?('<br><span class="src">'+
    (r[6]?'<a href="'+esc(r[6])+'" target="_blank" rel="noopener">':'')+
    esc(lang==="zh"?"来源: ":"source: ")+esc(r[5])+(r[6]?' ↗</a>':'')+'</span>'):'';
  return '<div class="p"><b>'+esc(r[0])+'</b><span class="vf '+(v?"v":"ns")+'">'+esc(vlabel)+'</span>'+
   (r[1]?'<br><i>'+esc(r[1])+'</i>':'')+
   (r[2]?' <span class="inst">— '+esc(r[2])+esc(extra)+'</span>':'')+src+'</div>';
}}
function openDrill(tr,day,reg,span){{
  var b=bucket(day,reg); if(!b) return;
  var cols=tr.children.length;
  var html='';
  b.forEach(function(pair){{
    var k=pair[0],d=pair[1];
    html+='<div class="dhead">'+esc(regName(k))+' &middot; '+d.n+' '+
          esc(lang==="zh"?"位新增人物":"people added")+' &middot; '+esc(day)+'</div><div class="plist">';
    d.rows.forEach(function(r){{html+=rowHtml(r);}});
    html+='</div>';
    if(d.n>d.rows.length) html+='<div class="more">'+
      esc(lang==="zh"?("另有 "+(d.n-d.rows.length)+" 人未在此列出"):("+"+(d.n-d.rows.length)+" more not listed here"))+'</div>';
  }});
  html+='<div class="prov">'+esc(lang==="zh"
    ?"来源：每位人物均来自公司/交易所官方披露、年报或官方新闻稿。“已核实”表示该职位已对照官方来源核对；“待核实”表示已记录但尚未核对。点击左侧地区名可在图谱中查看。"
    :"Provenance: every person is entered from an official company or exchange disclosure, annual report, or official press release. \\u201cverified\\u201d means the role was checked against that source; \\u201cunverified\\u201d means it is recorded but not yet confirmed. Open the region map (region name, left) to see them in the graph.")+'</div>';
  var nr=document.createElement("tr");
  nr.className="drill";
  nr.innerHTML='<td colspan="'+cols+'"><div class="dwrap">'+html+'</div></td>';
  tr.parentNode.insertBefore(nr,tr.nextSibling);
}}
document.addEventListener("click",function(ev){{
  var s=ev.target.closest?ev.target.closest(".chip"):null;
  if(!s){{return;}}
  var tr=s.closest("tr"), nx=tr.nextSibling;
  var open=nx&&nx.className==="drill";
  closeAll(); hideTip();
  if(!open) openDrill(tr,s.getAttribute("data-day"),s.getAttribute("data-reg"),s);
}});
document.addEventListener("mouseover",function(ev){{
  var s=ev.target.closest?ev.target.closest(".chip"):null;
  if(s) showTip(ev,s.getAttribute("data-day"),s.getAttribute("data-reg"));
}});
document.addEventListener("mousemove",function(ev){{
  if(tip.style.display==="block"){{
    var s=ev.target.closest?ev.target.closest(".chip"):null;
    if(!s) hideTip();
  }}
}});
document.addEventListener("keydown",function(ev){{
  if(ev.key==="Escape"){{closeAll();hideTip();}}
  if((ev.key==="Enter"||ev.key===" ")&&document.activeElement&&
     document.activeElement.classList.contains("chip")){{
    ev.preventDefault(); document.activeElement.click();}}
}});
ap();
</script></body></html>"""
    OUT.write_text(html, encoding="utf-8")
    named_today = sum(len(v) for v in plog.get(today, {}).values())
    print(f"growth report: {cur['total'][0]} people ({'+' + str(d_today[0]) if d_today[0] else '±0'} today), "
          f"{cur['total'][1]} institutions ({'+' + str(d_today[1]) if d_today[1] else '±0'}), "
          f"{named_today} named today -> reports/growth.html")


if __name__ == "__main__":
    main()
