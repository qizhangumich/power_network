"""Daily growth report: how much the network grew, per region, per day.

  python tools/growth_report.py

Counts people/institutions/roles per region, stores one snapshot per day in
reports/growth_state.json, and renders reports/growth.html — a standalone
bilingual page with today's delta, per-region breakdown, and the last 45 days
of growth. Linked from the landing page footer. Run by tools/update.py and the
GitHub Actions workflow, so the report refreshes with every data change; the
last run of a day defines that day's closing numbers.
"""
import datetime
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from netdata import ROOT, load_nodes

STATE = ROOT / "reports" / "growth_state.json"
OUT = ROOT / "reports" / "growth.html"
KEEP_DAYS = 400

REGIONS = [("abudhabi", "", "Abu Dhabi", "阿布扎比"),
           ("dubai", "dubai", "Dubai", "迪拜"),
           ("northern", "northern", "Northern Emirates", "北部酋长国"),
           ("saudi", "saudi", "Saudi Arabia", "沙特阿拉伯"),
           ("qatar", "qatar", "Qatar", "卡塔尔"),
           ("bahrain", "bahrain", "Bahrain", "巴林"),
           ("oman", "oman", "Oman", "阿曼"),
           ("kuwait", "kuwait", "Kuwait", "科威特")]

ROLE_RE = re.compile(r',"(?:board|executive|political|government|ownership)","(?:v|ns)"')

def counts():
    out = {}
    for key, d, _, _ in REGIONS:
        f = ROOT / (d + "/network_data.js" if d else "network_data.js")
        nodes = load_nodes(f)
        text = f.read_text(encoding="utf-8")
        out[key] = [sum(1 for n in nodes if n["kind"] == "person"),
                    sum(1 for n in nodes if n["kind"] == "inst"),
                    len(ROLE_RE.findall(text))]
    out["total"] = [sum(v[i] for k, v in out.items()) for i in range(3)]
    return out

def main():
    STATE.parent.mkdir(exist_ok=True)
    state = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
    today = datetime.date.today().isoformat()
    cur = counts()
    state[today] = cur                      # last run of the day wins
    cutoff = (datetime.date.today() - datetime.timedelta(days=KEEP_DAYS)).isoformat()
    state = {k: v for k, v in state.items() if k >= cutoff}
    STATE.write_text(json.dumps(state, separators=(",", ":")), encoding="utf-8")

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
    for key, _, en, zh in REGIONS:
        p, i, r = state[today][key]
        if prev_day and key in state[prev_day]:
            pp, pi, pr = state[prev_day][key]
            dp, di = p - pp, i - pi
        else:
            dp = di = 0
        badge = (f'<span class="up">+{dp}</span>' if dp > 0 else "") + \
                (f' <span class="up">+{di} <span class="t" data-en="inst" data-zh="机构">inst</span></span>' if di > 0 else "")
        region_rows.append(
            f'<tr><td><span class="t" data-en="{en}" data-zh="{zh}">{en}</span></td>'
            f'<td>{p} {badge if dp or di else ""}</td><td>{i}</td><td>{r}</td></tr>')

    hist_rows = []
    for day in reversed(days[-45:]):
        dd = delta(day)
        t = state[day]["total"]
        cells = "—" if dd is None else " · ".join(
            (f"+{x}" if x > 0 else str(x)) for x in dd[:2])
        hist_rows.append(f"<tr><td>{day}</td><td>{cells}</td><td>{t[0]}</td><td>{t[1]}</td><td>{t[2]}</td></tr>")

    stamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    html = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>GCC Power Networks — Growth</title>
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
h2{{font-size:15px;margin:24px 0 4px}}
#b-lang{{float:right;border:1px solid var(--line);background:var(--card);border-radius:999px;padding:4px 12px;font-size:12px;color:var(--soft);cursor:pointer}}
</style></head><body><div class="wrap">
<button id="b-lang">中文</button>
<a href="../" class="t" data-en="&larr; GCC Power Networks" data-zh="&larr; 海湾权力网络">&larr; GCC Power Networks</a>
<h1 class="t" data-en="Network growth" data-zh="网络增长">Network growth</h1>
<div class="sub"><span class="t" data-en="Updated" data-zh="更新于">Updated</span> {stamp} · <span class="t" data-en="auto-generated on every data refresh" data-zh="每次数据刷新时自动生成">auto-generated on every data refresh</span></div>
<div class="cards">
<div class="c"><b>{cur["total"][0]}</b><span class="t" data-en="people" data-zh="人物">people</span> <span class="up">{"+" + str(d_today[0]) if d_today[0] > 0 else ""}</span></div>
<div class="c"><b>{cur["total"][1]}</b><span class="t" data-en="institutions" data-zh="机构">institutions</span> <span class="up">{"+" + str(d_today[1]) if d_today[1] > 0 else ""}</span></div>
<div class="c"><b>{cur["total"][2]}</b><span class="t" data-en="roles" data-zh="职位">roles</span> <span class="up">{"+" + str(d_today[2]) if d_today[2] > 0 else ""}</span></div>
</div>
<h2 class="t" data-en="By region" data-zh="按地区">By region</h2>
<table><tr><th class="t" data-en="Region" data-zh="地区">Region</th><th class="t" data-en="People" data-zh="人物">People</th><th class="t" data-en="Institutions" data-zh="机构">Institutions</th><th class="t" data-en="Roles" data-zh="职位">Roles</th></tr>
{"".join(region_rows)}</table>
<h2 class="t" data-en="Daily history (people · institutions added)" data-zh="每日历史（新增人物 · 机构）">Daily history (people · institutions added)</h2>
<table><tr><th class="t" data-en="Date" data-zh="日期">Date</th><th class="t" data-en="Added" data-zh="新增">Added</th><th class="t" data-en="People" data-zh="人物">People</th><th class="t" data-en="Institutions" data-zh="机构">Institutions</th><th class="t" data-en="Roles" data-zh="职位">Roles</th></tr>
{"".join(hist_rows)}</table>
</div>
<script>
var lang="en"; try{{lang=localStorage.getItem("pm_lang")==="zh"?"zh":"en";}}catch(e){{}}
function ap(){{document.querySelectorAll(".t").forEach(function(el){{el.innerHTML=el.getAttribute(lang==="zh"?"data-zh":"data-en");}});
document.getElementById("b-lang").textContent=lang==="zh"?"EN":"中文";}}
document.getElementById("b-lang").addEventListener("click",function(){{lang=lang==="zh"?"en":"zh";try{{localStorage.setItem("pm_lang",lang);}}catch(e){{}}ap();}});
ap();
</script></body></html>"""
    OUT.write_text(html, encoding="utf-8")
    print(f"growth report: {cur['total'][0]} people ({'+' + str(d_today[0]) if d_today[0] else '±0'} today), "
          f"{cur['total'][1]} institutions ({'+' + str(d_today[1]) if d_today[1] else '±0'}) -> reports/growth.html")

if __name__ == "__main__":
    main()
