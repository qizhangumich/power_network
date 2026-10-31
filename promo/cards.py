"""Four 1270x760 product images in the navgcc.com style, built from real data and real map captures.
  node promo/stats.js && python promo/cards.py   → promo/out/cards/card_1..4.png"""
import base64, csv, datetime, json, os, re, collections
from playwright.sync_api import sync_playwright
import render as R

HERE = R.HERE
OUT = os.path.join(R.OUT, "cards")
W, H = 1270, 760
S = json.load(open(os.path.join(R.BUILD, "stats.json")))

def fmt(n): return f"{n:,}"

# ------------------------------------------------------------- real data for card 2
def headlines(k=4):
    items = []
    for reg, d in R_REG.items():
        f = os.path.join(R.ROOT, d, "news_data.js")
        if not os.path.exists(f): continue
        for m in re.finditer(r'date:"([\d-]+)", title:"((?:[^"\\]|\\.)*)", source:"((?:[^"\\]|\\.)*)"', open(f, encoding="utf-8").read()):
            items.append((m.group(1), m.group(2).replace('\\"', '"'), m.group(3), reg))
    off = re.compile(r"football|premier league|man city|manchester|sport|match|fifa|cricket|celebrity|horoscope|fine[sd]?|leak|lawsuit|arrest|probe|fraud|scandal", re.I)
    items = [(d, re.sub(r"^\s*\d+\.\s*", "", t), src, r) for d, t, src, r in items]
    seen, regs, out = set(), set(), []
    for it in sorted(items, key=lambda x: x[0], reverse=True):      # latest business headline from four different markets
        key = it[1][:40]
        if key in seen or it[3] in regs or len(it[1]) > 88 or off.search(it[1] + " " + it[2]): continue
        seen.add(key); regs.add(it[3]); out.append(it)
        if len(out) == k: break
    return out
R_REG = {"abudhabi": "", "dubai": "dubai", "saudi": "saudi", "qatar": "qatar", "bahrain": "bahrain", "oman": "oman", "kuwait": "kuwait", "northern": "northern"}
NAMES = {"abudhabi": "Abu Dhabi", "dubai": "Dubai", "northern": "Northern Emirates", "saudi": "Saudi Arabia", "qatar": "Qatar",
         "bahrain": "Bahrain", "oman": "Oman", "kuwait": "Kuwait"}

def daily(days=14):
    rows = list(csv.DictReader(open(os.path.join(R.ROOT, "data", "provenance.csv"), encoding="utf-8-sig")))
    end = datetime.date(2026, 10, 31)
    c = collections.Counter(r["date"] for r in rows)
    return [(str(end - datetime.timedelta(days=i)), c.get(str(end - datetime.timedelta(days=i)), 0)) for i in range(days - 1, -1, -1)]

# ------------------------------------------------------------- map captures
def capture_maps(ctx):
    shots = {}
    page = ctx.new_page()
    page.goto(f"http://127.0.0.1:{R.PORT}/abudhabi/")
    page.wait_for_function("window.__map && window.__map.nodes.length > 100")
    page.evaluate("document.fonts.ready"); page.evaluate(R.HELPERS)
    step = lambda n: page.evaluate(f"for (let i = 0; i < {n}; i++) __step(1000/60); __blurDom();")
    step(30); page.wait_for_timeout(400)
    # industries: the whole system, laid out by industry districts
    page.evaluate("__map.setView('sector');"); step(260)
    page.evaluate("__map.fitView(0);"); step(90)
    shots["sector"] = page.screenshot(type="png")
    # a route: sample contacts (labelled as such on the card), target name blurred
    page.evaluate("__map.setView('network');"); step(200)
    page.evaluate("""(() => { const m = __map; ['hasan_nowais','deepak_khullar','alwan','ali_tadweer','samia'].forEach(id => m.Personal.addKnown(id));
                     m.rebuildPersonal(false); m.showRoutes(m.byId['peng_xiao']); })()""")
    step(40); page.evaluate("__h.fitR(__map.S.path.nodes, 0, 1.25, 0.15);"); step(120)
    step(2); page.evaluate("__h.tidy(); __blurDom();")           # blur last, right before the shot
    shots["path"] = page.screenshot(type="png")
    page.close()
    return {k: "data:image/png;base64," + base64.b64encode(v).decode() for k, v in shots.items()}

# ------------------------------------------------------------- the cards
def svg_map():
    idx = open(os.path.join(R.ROOT, "index.html"), encoding="utf-8").read()
    return re.search(r'<div class="mapcard">\s*(<svg viewBox="0 0 720 452".*?</svg>)', idx, re.S).group(1)

CSS = """
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap");
:root{--bg:#0A1120;--raise:#0E1627;--card:#121B2E;--card2:#18243A;--line:rgba(148,163,184,.14);--line2:rgba(148,163,184,.26);
      --ink:#EEF2F8;--soft:#B1BCCD;--faint:#8190A7;--accent:#7C8CFF;--hi:#A3AEFF;--asoft:rgba(124,140,255,.15);--abr:rgba(124,140,255,.55);
      --land:#152137;--landhl:#24316A;--sea:#0C1424;--ok:#3DD68C;--warn:#F2B544}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#05080f;font-family:Inter,system-ui,sans-serif;color:var(--ink);-webkit-font-smoothing:antialiased}
.c{width:1270px;height:760px;position:relative;overflow:hidden;
   background:radial-gradient(900px 460px at 82% -12%,rgba(124,140,255,.16),transparent 62%),var(--bg)}
.brand{position:absolute;left:44px;top:34px;display:flex;align-items:center;gap:10px;font:600 19px Sora}
.brand img{width:32px;height:32px;border-radius:9px}
.pill{display:inline-flex;align-items:center;gap:8px;font:600 13px Inter;letter-spacing:.14em;text-transform:uppercase;color:var(--hi);
      border:1px solid var(--abr);background:var(--asoft);border-radius:999px;padding:6px 14px}
.pill i{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(124,140,255,.2)}
h1{font:700 52px/1.04 Sora;letter-spacing:-.02em}
h1 em{font-style:normal;color:var(--hi)}
.sub{font:500 19px/1.45 Inter;color:var(--soft)}
.stats{position:absolute;left:0;right:0;bottom:0;height:108px;display:grid;border-top:1px solid var(--line);background:rgba(14,22,39,.72)}
.stats div{display:flex;flex-direction:column;justify-content:center;align-items:center;border-right:1px solid var(--line)}
.stats div:last-child{border-right:0}
.stats b{font:700 36px Sora;letter-spacing:-.01em}
.stats span{font:600 12.5px Inter;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin-top:2px}
.shot{position:absolute;border-radius:16px;overflow:hidden;border:1px solid var(--line2);box-shadow:0 26px 60px rgba(2,6,16,.6)}
.shot img{display:block;width:100%;height:100%;object-fit:cover}
.tag{display:inline-flex;align-items:center;gap:6px;font:600 13px Inter;color:#F8D58C;background:rgba(242,181,68,.12);
     border:1.5px dashed rgba(242,181,68,.6);border-radius:999px;padding:4px 12px}
.note{font:500 13.5px Inter;color:var(--faint)}
/* card 1 */
#c1 .head{position:absolute;left:44px;top:92px;width:470px}
#c1 .head h1{margin-top:18px}
#c1 .head .sub{margin-top:16px}
#c1 .map{position:absolute;right:28px;top:30px;width:700px}
#c1 .map svg{width:100%;height:auto;display:block;border-radius:18px;border:1px solid var(--line)}
#c1 .sea{fill:var(--sea)} #c1 .land{fill:var(--land);stroke:rgba(148,163,184,.35);stroke-width:1}
#c1 .lbl,#c1 .leader,#c1 .seatxt,#c1 .pulse,#c1 .pulse-ring{display:none}
#c1 .mk{position:absolute;transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center}
#c1 .mk .bx{background:rgba(18,27,46,.94);border:1px solid var(--line2);border-radius:12px;padding:7px 12px 8px;text-align:left;
            box-shadow:0 10px 26px rgba(2,6,16,.55);white-space:nowrap}
#c1 .mk .bx b{display:block;font:700 22px Sora;color:var(--ink)} #c1 .mk .bx b small{font:600 12px Inter;color:var(--faint);margin-left:6px}
#c1 .mk .bx span{display:block;font:600 11.5px Inter;letter-spacing:.1em;text-transform:uppercase;color:var(--hi)}
#c1 .mk .bx em{display:block;font:500 12px Inter;color:var(--soft);font-style:normal;margin-top:2px}
#c1 .mk .stem{width:1px;height:16px;background:var(--abr)}
#c1 .mk .dot{width:11px;height:11px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 5px rgba(124,140,255,.22),0 0 18px rgba(124,140,255,.8)}
#c1 .cl{position:absolute}
#c1 .cl i{position:absolute;border-radius:50%}
#c1 .ex{position:absolute;left:44px;bottom:132px;width:500px;display:flex;flex-direction:column;gap:10px}
#c1 .ex div{display:flex;gap:12px;align-items:flex-start;font:500 16px/1.4 Inter;color:var(--soft)}
#c1 .ex b{color:var(--ink)}
#c1 .ex svg{width:20px;height:20px;flex:none;stroke:var(--accent);fill:none;stroke-width:2.2;margin-top:1px}
/* card 2 */
#c2 .head{position:absolute;left:44px;top:92px;width:560px}
#c2 .head h1{margin-top:18px}
#c2 .head .sub{margin-top:14px}
#c2 .big{position:absolute;left:44px;top:352px;display:grid;grid-template-columns:1fr 1fr;gap:14px;width:560px}
#c2 .big div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px 18px}
#c2 .big b{display:block;font:700 34px Sora;letter-spacing:-.01em}
#c2 .big b.up{color:var(--ok)}
#c2 .big span{font:500 14px/1.35 Inter;color:var(--soft)}
#c2 .feed{position:absolute;right:40px;top:60px;width:580px;background:var(--card);border:1px solid var(--line2);border-radius:20px;
          box-shadow:0 26px 60px rgba(2,6,16,.6);padding:20px 22px}
#c2 .fh{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
#c2 .fh b{font:600 13px Inter;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
#c2 .live{display:inline-flex;align-items:center;gap:7px;font:600 13px Inter;color:var(--ok)}
#c2 .live i{width:8px;height:8px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 4px rgba(61,214,140,.2)}
#c2 .it{padding:12px 0;border-top:1px solid var(--line)}
#c2 .it .t{font:600 15.5px/1.35 Inter}
#c2 .it .m{font:500 12.5px Inter;color:var(--faint);margin-top:4px;display:flex;gap:8px;align-items:center}
#c2 .it .m em{font-style:normal;color:var(--hi);background:var(--asoft);border-radius:999px;padding:1px 8px}
#c2 .bars{margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}
#c2 .bars .lab{display:flex;justify-content:space-between;font:600 12px Inter;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
#c2 .bars .row{display:flex;align-items:flex-end;gap:6px;height:84px;margin-top:10px}
#c2 .bars .row i{flex:1;border-radius:5px 5px 2px 2px;background:linear-gradient(180deg,var(--hi),#4C57C5)}
#c2 .src{position:absolute;left:44px;bottom:36px;display:flex;gap:10px;align-items:center;font:500 14px Inter;color:var(--faint)}
#c2 .src svg{width:18px;height:18px;stroke:var(--hi);fill:none;stroke-width:2}
/* card 3 & 4 */
.side{position:absolute;left:44px;top:92px;width:400px}
.side h1{margin-top:18px;font-size:46px}
.side .sub{margin-top:14px;font-size:17.5px}
.legend{margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:8px 14px}
.legend div{display:flex;align-items:center;gap:9px;font:500 14px Inter;color:var(--soft)}
.legend i{width:12px;height:12px;border-radius:50%;flex:none}
.layers{margin-top:20px;display:flex;flex-direction:column;gap:6px}
.layers div{font:500 13.5px Inter;color:var(--faint)} .layers b{color:var(--ink);font-weight:600;margin-right:6px}
.chain{margin-top:22px;display:flex;flex-direction:column;gap:0}
.chain .s{display:flex;align-items:center;gap:12px;font:600 16px Inter}
.chain .s i{width:26px;height:26px;border-radius:50%;flex:none;display:grid;place-items:center;font:700 12px Sora;color:#0A1120;background:var(--accent)}
.chain .s small{display:block;font:500 13px Inter;color:var(--faint)}
.chain .v{margin-left:12px;border-left:2px dashed var(--abr);padding:7px 0 7px 22px;font:500 13px Inter;color:var(--soft)}
.chain .v em{font-style:normal;font-weight:600;color:var(--warn)}
.blur{filter:blur(5px)}
.feat{margin-top:20px;display:flex;flex-wrap:wrap;gap:8px}
.feat span{font:600 13px Inter;color:var(--hi);background:var(--asoft);border:1px solid var(--abr);border-radius:999px;padding:5px 12px}
"""

TICK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7"/></svg>'

def card1():
    reg = S["regions"]
    # marker positions in map units (viewBox 720x452), from the landing map's label anchors
    pos = {"kuwait": (352, 80), "saudi": (230, 225), "bahrain": (423, 168), "qatar": (446, 182), "abudhabi": (505, 230),
           "dubai": (555, 205), "northern": (574, 186), "oman": (612, 300)}
    boxes = {"kuwait": (250, 70), "saudi": (170, 300), "bahrain": (300, 165), "qatar": (430, 105), "abudhabi": (470, 300),
             "dubai": (585, 105), "northern": (640, 262), "oman": (630, 392)}
    sc = 700 / 720
    mk = ""
    for r, (x, y) in pos.items():
        v = reg[r]; bx, by = boxes[r]
        mk += (f'<svg class="cl" style="left:0;top:0;width:700px;height:455px;overflow:visible;pointer-events:none">'
               f'<line x1="{x*sc}" y1="{y*sc}" x2="{bx*sc}" y2="{by*sc}" stroke="rgba(124,140,255,.55)" stroke-width="1"/>'
               f'<circle cx="{x*sc}" cy="{y*sc}" r="{4 + min(9, v["people"] / 230):.1f}" fill="rgba(124,140,255,.28)" stroke="#7C8CFF"/>'
               f'<circle cx="{x*sc}" cy="{y*sc}" r="2.6" fill="#A3AEFF"/></svg>'
               f'<div class="mk" style="left:{bx*sc}px;top:{by*sc}px"><div class="bx"><span>{NAMES[r]}</span>'
               f'<b>{fmt(v["people"])}<small>people</small></b><em>{fmt(v["orgs"])} organizations</em></div></div>')
    return f"""<div class="c" id="c1"><div class="brand"><img src="/favicon.svg"><span>NavGCC</span></div>
      <div class="head"><span class="pill"><i></i>GCC market map</span>
        <h1>{fmt(S["people"])} decision-makers across <em>the Gulf</em></h1>
        <p class="sub">Who sits where, who sits with whom — mapped across 8 markets, with the source behind every record.</p></div>
      <div class="ex">
        <div>{TICK}<span><b>Boards, executives and owners</b> of {fmt(S["orgs"])} organizations</span></div>
        <div>{TICK}<span><b>Every link explained</b> — role, board seat, family or ownership</span></div>
        <div>{TICK}<span><b>Traceable</b> — each person links to the record it came from</span></div></div>
      <div class="map" style="position:absolute;right:28px;top:52px;width:700px;height:455px">{svg_map()}{mk}</div>
      <div class="stats" style="grid-template-columns:repeat(4,1fr)">
        <div><b>{fmt(S["people"])}</b><span>People</span></div><div><b>{fmt(S["orgs"])}</b><span>Organizations</span></div>
        <div><b>{fmt(S["links"])}</b><span>Mapped relationships</span></div><div><b>8</b><span>Markets · 6 countries</span></div></div></div>"""

def card2():
    hl = headlines(4); d = daily(14); mx = max(v for _, v in d) or 1
    items = "".join(f'<div class="it"><div class="t">{t}</div><div class="m"><span>{date} · {src}</span><em>{NAMES[r]}</em></div></div>'
                    for date, t, src, r in hl)
    bars = "".join(f'<i style="height:{max(6, v / mx * 84):.0f}px" title="{dd}: {v}"></i>' for dd, v in d)
    return f"""<div class="c" id="c2"><div class="brand"><img src="/favicon.svg"><span>NavGCC</span></div>
      <div class="head"><span class="pill"><i></i>Always current</span>
        <h1>A map that <em>updates itself</em>, every day</h1>
        <p class="sub">New appointments, boards and deals are picked up from public sources and news, matched to the right people — no manual upkeep.</p></div>
      <div class="big">
        <div><b class="up">+{fmt(S["added7"])}</b><span>people and organizations added in the last 7 days</span></div>
        <div><b>{fmt(S["news"])}</b><span>news signals linked to the people they mention</span></div>
        <div><b>{S["sources"]}</b><span>media, registries and searches monitored</span></div>
        <div><b>Daily</b><span>refresh — automatically, across all 8 markets</span></div></div>
      <div class="feed"><div class="fh"><b>Latest signals</b><span class="live"><i></i>Live</span></div>{items}
        <div class="bars"><div class="lab"><span>Records added per day</span><span>last 14 days</span></div><div class="row">{bars}</div></div></div>
      <div class="src"><svg viewBox="0 0 24 24"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
        Every record keeps a link to its source — official site, filing or article.</div></div>"""

IND = [("#3987e5", "Financials"), ("#d95926", "Energy & Utilities"), ("#199e70", "Health & Education"), ("#c98500", "Sovereign Capital"),
       ("#d55181", "Consumer"), ("#008300", "Real Estate"), ("#9085e9", "Technology & Telecom"), ("#e66767", "Industrials & Materials"),
       ("#9DA9BB", "Government & Political"), ("#B8A487", "Family Conglomerates")]

def card3(img):
    leg = "".join(f'<div><i style="background:{c}"></i>{n}</div>' for c, n in IND)
    return f"""<div class="c" id="c3"><div class="brand"><img src="/favicon.svg"><span>NavGCC</span></div>
      <div class="side"><span class="pill"><i></i>The whole system</span>
        <h1>See the market <em style="font-style:normal;color:var(--hi)">as a system</em></h1>
        <p class="sub">Every person and organization in its industry district — sized by influence, linked by real roles, boards, family and ownership.</p>
        <div class="legend">{leg}</div>
        <div class="layers"><div><b>L0</b>Ruling core</div><div><b>L1</b>Sovereign capital &amp; state</div>
          <div><b>L2</b>Operators &amp; sector leaders</div><div><b>L3</b>Private &amp; international partners</div></div></div>
      <div class="shot" style="left:480px;top:30px;width:760px;height:700px"><img src="{img}" style="object-position:50% 50%"></div></div>"""

def card4(img):
    return f"""<div class="c" id="c4"><div class="brand"><img src="/favicon.svg"><span>NavGCC</span></div>
      <div class="side"><span class="pill"><i></i>Navigate</span>
        <h1>Find your <em style="font-style:normal;color:var(--hi)">route in</em></h1>
        <p class="sub">Pick who you want to reach. NavGCC traces routes through people you already know — and shows the evidence for every step.</p>
        <div class="chain">
          <div class="s"><i>1</i><div>You</div></div>
          <div class="v">You know them — <em>confirmed</em></div>
          <div class="s"><i>2</i><div>Your contact<small>Managing Director, M42</small></div></div>
          <div class="v">Both on the board of Mubadala Health — <em>check first</em></div>
          <div class="s"><i>3</i><div><span class="blur">Peng Xiao</span><small>Group CEO, <span class="blur">G42</span></small></div></div></div>
        <div class="feat"><span>Up to 3 routes</span><span>Evidence per link</span><span>Draft intro message</span></div>
        <p class="note" style="margin-top:18px">Potential paths. Introductions are not guaranteed.</p></div>
      <div class="shot" style="left:480px;top:30px;width:760px;height:700px"><img src="{img}" style="object-position:62% 50%"></div>
      <div style="position:absolute;left:504px;top:690px"><span class="tag">Sample data · illustrative contacts</span></div></div>"""

def main():
    os.makedirs(OUT, exist_ok=True)
    promo = {"blurNames": ["Peng Xiao", "PX", "G42"],
             "hideCss": "#nudge,#hint,#toast,#stats,#mapctl,#demobar,#tip,#legend,#chipstrip{display:none!important}"}
    overlay = open(os.path.join(HERE, "overlay.js"), encoding="utf-8").read()
    srv = R.serve()
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        ctx = br.new_context(viewport={"width": 1520, "height": 1400}, device_scale_factor=1, color_scheme="dark")
        ctx.add_init_script("window.__PROMO = " + json.dumps(promo) + ";")
        ctx.add_init_script(overlay)
        ctx.add_init_script("try{localStorage.clear();localStorage.setItem('nv_tour_v1','done');localStorage.setItem('nv_lg','c');"
                            "localStorage.setItem('nv_hint','1');localStorage.setItem('pm_lang','en');}catch(e){}")
        ctx.add_init_script("window.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent=window.__PROMO.hideCss;document.head.appendChild(s);});")
        shots = capture_maps(ctx)
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>" + \
               "".join([card1(), card2(), card3(shots["sector"]), card4(shots["path"])]) + "</body></html>"
        os.makedirs(R.BUILD, exist_ok=True)
        open(os.path.join(R.BUILD, "cards.html"), "w", encoding="utf-8").write(html)
        p = br.new_page(viewport={"width": W, "height": H}, device_scale_factor=2)
        p.goto(f"http://127.0.0.1:{R.PORT}/promo/build/cards.html"); p.evaluate("document.fonts.ready"); p.wait_for_timeout(800)
        for i in range(1, 5):
            raw = os.path.join(R.BUILD, f"card_{i}@2x.png")
            p.locator(f"#c{i}").screenshot(path=raw)
            # downscale 2x → exact 1270x760 with a high-quality filter
            from PIL import Image
            Image.open(raw).resize((W, H), Image.LANCZOS).save(os.path.join(OUT, f"card_{i}.png"), optimize=True)
        br.close()
    srv.shutdown()
    print("cards:", OUT)

if __name__ == "__main__":
    main()
