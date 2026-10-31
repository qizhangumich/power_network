"""Render the NavGCC promo (instruction/phase5_promotion.md) from the real site.

Scene 1 uses the landing page's GCC map (promo/scene1.html); scenes 2-5 drive the live
Abu Dhabi map engine under a virtual clock, so every frame is exact. Overlays (titles,
sample-data tag, subtitles, closing card) come from promo/overlay.js.

  python promo/narration.py            # voice clips + timings  (once)
  python promo/music.py 86             # background music       (once)
  python promo/render.py --stills 12,36,44,58,80   # quick look at key moments
  python promo/render.py               # full render → promo/out/navgcc_promo.mp4 (+ .srt)
"""
import argparse, functools, http.server, json, os, re, subprocess, sys, threading
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
BUILD, OUT = os.path.join(HERE, "build"), os.path.join(HERE, "out")
FPS, W, H = 30, 1920, 1080
END = 85.0                      # total length (s)
XF0, XF1 = 6.0, 6.8             # scene 1 → live map crossfade
PORT = 8765

# ---------------------------------------------------------------- timeline
TITLES = [
    {"t0": 10.2, "t1": 29.4, "eyebrow": "01", "title": "Understand the landscape."},
    {"t0": 30.2, "t1": 49.6, "eyebrow": "02", "title": "Find your place.", "steps": [
        {"t": 33.4, "text": "Select people you know"},
        {"t": 37.2, "text": "Add LinkedIn profile links"},
        {"t": 41.5, "text": "Import contacts via CSV"}]},
    {"t0": 50.2, "t1": 69.4, "eyebrow": "03", "title": "Discover your path."},
]
TAG = [[32.6, 69.4]]                 # "Sample data · illustrative contacts"
NOTE = [[53.8, 69.4]]                # "Potential paths. Introductions are not guaranteed."
RECAP, RECAP_END = [71.0, 72.8, 74.4], 76.0
END_CARD = 76.2

SAMPLE_CSV = "Name,Company,Title\\nAhmad Ali Alwan,Hub71,CEO\\nAli Al Dhaheri,Tadweer,CEO\\nSamia Bouazza,2PointZero,Group CEO\\n"

HELPERS = r"""
window.__h = {
  el(sel){ return document.querySelector(sel); },
  click(sel, opts){ const el = document.querySelector(sel); if(!el) return 'missing ' + sel;
    if(opts && opts.scroll) el.scrollIntoView({block:'center'});
    const r = el.getBoundingClientRect(); __ripple(r.left + r.width/2, r.top + r.height/2, window.__g);
    if(!(opts && opts.noClick)) el.click(); return 'ok'; },
  clickText(text){ const el = [...document.querySelectorAll('button,label,a')].find(e => e.offsetParent && e.innerText.trim().startsWith(text));
    if(!el) return 'missing ' + text; const r = el.getBoundingClientRect(); __ripple(r.left + r.width/2, r.top + r.height/2, window.__g); return 'ok'; },
  type(sel, text){ const el = document.querySelector(sel); if(!el) return 'missing ' + sel; el.focus({preventScroll:true});
    el.value = text; el.dispatchEvent(new Event('input', {bubbles:true})); return 'ok'; },
  /* frame nodes but keep them right of the title column: a phantom node widens the box to the left */
  fitR(list, ms, maxK, frac){ list = list.filter(Boolean); if(!list.length) return;
    let x0 = 1e9, x1 = -1e9, y = 0; list.forEach(n => { x0 = Math.min(x0, n.x); x1 = Math.max(x1, n.x); y += n.y; });
    const w = Math.max(220, x1 - x0); const ph = {x: x0 - w * (frac ?? 0.55), y: y / list.length, radius: 1};
    __map.fitNodes(list.concat([ph]), {ms, maxK}); },
  around(n){ return [...__map.nbrs(n, new Set())]; },
  /* the brief shows only three ways to add contacts: hide the panel's other sections while filming */
  tidy(){ const b = document.getElementById('mp-body'); if(!b) return; let hide = false;
    [...b.children].forEach(el => {
      if(el.classList.contains('sect')) hide = /insead|classmate|account|saved|校友|账户/i.test(el.textContent);
      if(hide) el.style.display = 'none';
    });
    b.querySelectorAll('[data-mp="delete"]').forEach(x => { (x.closest('.actrow') || x).style.display = 'none'; }); },
  mine(){ const M = __map.ME; if(!M) return []; const s = new Set([M]);
    M.adj.forEach(a => { s.add(a.n); a.n.adj.forEach(b => { if(b.n.kind === 'inst' && !b.e.former && b.e.kind !== 'pot') s.add(b.n); }); });
    return [...s]; },
};
"""

def events():
    """(global time, javascript) — run once, in order, when the timeline reaches them"""
    E = []
    def at(t, js): E.append((t, js))
    m = "const m = __map, B = m.byId, h = __h;"
    # scene 2 — the landscape
    at(6.0, m + "m.S.reveal = {t0: performance.now()}; h.fitR(m.nodes.filter(n => !n.layer && n.power >= 70), 7000, 0.62, 0.32);")
    at(12.4, m + "h.fitR(h.around(B.mubadala), 2600, 1.05, 0.5);")
    at(13.9, m + "m.S.selected = B.mubadala; m.computeVisible();")
    at(18.8, m + "m.S.selected = B.khaldoon; m.computeVisible(); h.fitR(h.around(B.khaldoon), 2400, 1.1, 0.5);")
    at(23.6, m + "m.S.selected = B.adnoc; m.computeVisible(); h.fitR(h.around(B.adnoc), 2400, 1.05, 0.5);")
    at(27.6, m + "m.S.selected = null; m.computeVisible(); h.fitR(m.nodes.filter(n => !n.layer && n.power >= 66), 2600, 0.7, 0.35);")
    # scene 3 — find your place
    at(32.6, m + "m.openMyPanel();")
    for i, s in enumerate(["H", "Ha", "Has", "Hasa", "Hasan"]):
        at(33.5 + i * 0.17, f"__h.type('#mp-q', {json.dumps(s)});")
    at(35.2, "__h.click('[data-pick=\"hasan_nowais\"]');")
    at(35.9, m + "h.fitR(h.mine(), 1400, 1.0, 0.45);")
    at(37.1, "__h.click('[data-mp-tab=\"li\"]');")
    url = "linkedin.com/in/deepak-khullar"
    for k in range(6, len(url) + 1, 4):
        at(37.6 + (k - 6) * 0.045, f"__h.type('#mp-url', {json.dumps(url[:k])});")
    at(38.75, f"__h.type('#mp-url', {json.dumps(url)});")
    at(39.1, "__h.type('#mp-name', 'Deepak Khullar');")
    at(39.8, "__h.click('#mp-addurl');")
    at(40.7, "__h.click('#mp-body [data-dec=\"1\"]', {scroll: true});")
    at(41.0, m + "document.getElementById('mp-body').scrollTop = 0; h.fitR(h.mine(), 1400, 1.0, 0.45);")
    at(41.4, "__h.click('[data-mp-tab=\"manual\"]');")
    at(42.5, "__h.clickText('Upload CSV or Excel');")
    at(43.3, "const inp = document.getElementById('oth-in'); const dt = new DataTransfer();"
             f"dt.items.add(new File([\"{SAMPLE_CSV}\"], 'sample-contacts.csv', {{type: 'text/csv'}}));"
             "inp.files = dt.files; inp.dispatchEvent(new Event('change', {bubbles: true}));")
    at(44.3, m + "h.fitR(h.mine(), 1200, 1.0, 0.45);")
    at(45.5, "__h.click('#mp-close');")
    at(46.0, m + "m.setMyHL(true); h.fitR(h.mine(), 2600, 1.0, 0.42);")
    # scene 4 — discover your path
    at(51.3, "__h.click('#ask', {noClick: true}); document.getElementById('ask').focus({preventScroll: true});"
             "const o = document.getElementById('askout'); if(o) o.style.visibility = 'hidden';")
    q = "how can I meet Peng Xiao"
    for k in range(1, len(q) + 1):
        at(51.6 + k * 0.062, f"__h.type('#ask', {json.dumps(q[:k])});")
    at(53.3, m + "m.setMyHL(false); m.runAsk(" + json.dumps(q) + "); const o = document.getElementById('askout'); if(o) o.style.visibility = 'hidden';")
    at(53.5, m + "h.fitR(m.S.path.nodes, 1300, 1.05, 0.9);")
    for i, k in enumerate([1, 2, 3]):
        at(56.2 + i * 1.3, f"__map.stepPath({k}); __h.fitR(__map.S.path.nodes, 900, 1.05, 0.9);")
    at(60.4, m + "h.fitR(m.S.path.nodes, 1400, 1.05, 0.9);")
    at(63.4, "__h.click('#dbody [data-alt=\"1\"]');")
    at(63.6, m + "h.fitR(m.S.path.nodes, 1500, 1.0, 0.75);")
    # scene 5 — close
    at(69.7, m + "const a = document.getElementById('ask'); a.value = ''; a.blur(); m.clearPath(); m.closeDetail(); m.S.selected = null; m.setMyHL(true); m.computeVisible();"
               "m.fitNodes(m.nodes.filter(n => !n.layer), {ms: 6000, maxK: 0.5});")
    return sorted(E, key=lambda e: e[0])

# ---------------------------------------------------------------- subtitles
def cues():
    """one subtitle per narration clip (each is at most two lines), timed to the spoken words,
    worded exactly as the script — the voice service's word list drops punctuation"""
    vo = json.load(open(os.path.join(BUILD, "vo.json")))
    out = []
    for seg in vo:
        w = seg["words"]
        t0 = seg["start"] + (w[0]["t"] if w else 0) - 0.1
        t1 = seg["start"] + ((w[-1]["t"] + w[-1]["d"]) if w else seg["duration"]) + 0.45
        out.append({"t0": round(t0, 3), "t1": round(t1, 3), "text": seg["text"]})
    for a, b in zip(out, out[1:]):
        if a["t1"] > b["t0"] - 0.05: a["t1"] = b["t0"] - 0.05
    return out

def srt(cs, path):
    def ts(x):
        ms = int(round(x * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
    with open(path, "w", encoding="utf-8") as f:
        for i, c in enumerate(cs, 1):
            f.write(f"{i}\n{ts(c['t0'])} --> {ts(c['t1'])}\n{c['text']}\n\n")

# ---------------------------------------------------------------- capture
class Quiet(http.server.SimpleHTTPRequestHandler):
    """static files for the capture — never the private ones"""
    PRIVATE = re.compile(r"(^|/)(my_network\.js|Connections\.csv|deploy_key|\.git|instruction|server)(/|$|\?)")
    def log_message(self, *a): pass
    def do_GET(self):
        if self.PRIVATE.search(self.path.split("?")[0]):
            self.send_error(404); return
        super().do_GET()

def serve():
    h = functools.partial(Quiet, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

def scene1_page():
    idx = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    svg = re.search(r'<div class="mapcard">\s*(<svg viewBox="0 0 720 452".*?</svg>)', idx, re.S).group(1)
    page = open(os.path.join(HERE, "scene1.html"), encoding="utf-8").read().replace("<!--GCC_SVG-->", svg)
    os.makedirs(BUILD, exist_ok=True)
    open(os.path.join(BUILD, "scene1.html"), "w", encoding="utf-8").write(page)
    return f"http://127.0.0.1:{PORT}/promo/build/scene1.html"

def ffmpeg_sink(path):
    return subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-c:v", "mjpeg", "-i", "-",
                             "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", str(FPS), path],
                            stdin=subprocess.PIPE)

def run(stills=None):
    os.makedirs(OUT, exist_ok=True)
    cs = cues()
    srt(cs, os.path.join(OUT, "navgcc_promo.en.srt"))
    promo = {"titles": TITLES, "tag": TAG, "note": NOTE, "recap": RECAP, "recapEnd": RECAP_END, "end": END_CARD, "cues": cs,
             "hideCss": "#nudge,#hint,#toast,#stats,#mapctl,#demobar,#tip,#legend,#chipstrip{display:none!important} body{cursor:none!important}"}
    overlay = open(os.path.join(HERE, "overlay.js"), encoding="utf-8").read()
    srv = serve()
    shots = sorted(stills or [])
    with sync_playwright() as pw:
        br = pw.chromium.launch(args=["--disable-gpu-vsync", "--force-color-profile=srgb"])
        ctx = br.new_context(viewport={"width": W, "height": H}, device_scale_factor=1, color_scheme="dark")
        ctx.add_init_script("window.__PROMO = " + json.dumps(promo) + ";")
        ctx.add_init_script(overlay)

        def capture(page, g, sink, tag):
            if stills is not None:
                if shots and g >= shots[0] - 1e-6:
                    page.screenshot(path=os.path.join(OUT, f"still_{shots.pop(0):05.1f}.png"))
                return
            sink.stdin.write(page.screenshot(type="jpeg", quality=93))

        # ---- scene 1: GCC map
        p1 = ctx.new_page(); p1.goto(scene1_page()); p1.evaluate("document.fonts.ready")
        p1.wait_for_timeout(600)
        sink = ffmpeg_sink(os.path.join(BUILD, "seg1.mp4")) if stills is None else None
        n1 = int(round(XF1 * FPS))
        for f in range(n1):
            g = f / FPS
            p1.evaluate(f"__s1({g}); __ov({g});")
            capture(p1, g, sink, "s1")
        if sink: sink.stdin.close(); sink.wait()
        p1.close()

        # ---- scenes 2-5: the live map
        ctx.add_init_script("try{localStorage.clear();localStorage.setItem('nv_tour_v1','done');localStorage.setItem('nv_lg','c');"
                            "localStorage.setItem('nv_hint','1');localStorage.setItem('pm_lang','en');}catch(e){}")
        p2 = ctx.new_page()
        p2.on("console", lambda msg: msg.type == "error" and "404" not in msg.text and print("  page error:", msg.text[:160]))
        p2.goto(f"http://127.0.0.1:{PORT}/abudhabi/")
        p2.wait_for_function("window.__map && window.__map.nodes.length > 100")
        p2.evaluate("document.fonts.ready")
        p2.evaluate(HELPERS)
        p2.evaluate("for (let i = 0; i < 24; i++) __step(1000/60);")       # boot screen away, physics warm
        p2.wait_for_timeout(700)
        ev = events()
        sink = ffmpeg_sink(os.path.join(BUILD, "seg2.mp4")) if stills is None else None
        f0, f1 = int(round(XF0 * FPS)), int(round(END * FPS))
        for f in range(f0, f1):
            g = f / FPS
            p2.evaluate(f"window.__g = {g};")
            while ev and ev[0][0] <= g + 1e-6:
                t, js = ev.pop(0)
                r = p2.evaluate("(() => { " + js + " })()")
                if isinstance(r, str) and r.startswith("missing"): print(f"  {t:5.1f}s  {r}")
            p2.evaluate(f"__step(1000/60); __step(1000/60); __h.tidy(); __ov({g});")
            capture(p2, g, sink, "s2")
            if f % 150 == 0: print(f"  {g:5.1f}s"); sys.stdout.flush()
        if sink: sink.stdin.close(); sink.wait()
        br.close()
    srv.shutdown()
    if stills is None:
        mux(cs)

# ---------------------------------------------------------------- audio + final
def mux(cs):
    vo = json.load(open(os.path.join(BUILD, "vo.json")))
    video = os.path.join(BUILD, "video.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(BUILD, "seg1.mp4"), "-i", os.path.join(BUILD, "seg2.mp4"),
                    "-filter_complex", f"[0:v][1:v]xfade=transition=fade:duration={XF1 - XF0}:offset={XF0},format=yuv420p[v]",
                    "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-r", str(FPS), video], check=True)
    ins, parts = ["-i", os.path.join(BUILD, "music.wav")], []
    for i, s in enumerate(vo, 1):
        ins += ["-i", s["file"]]
        d = int(round(s["start"] * 1000))
        parts.append(f"[{i}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={d}|{d}[v{i}]")
    n = len(vo)
    fc = ";".join(parts) + ";" + "".join(f"[v{i}]" for i in range(1, n + 1)) + \
         f"amix=inputs={n}:normalize=0:dropout_transition=0,asplit=2[vo][key];" \
         "[0:a]volume=0.24[mus];[mus][key]sidechaincompress=threshold=0.025:ratio=5:attack=25:release=450:makeup=1[duck];" \
         f"[duck][vo]amix=inputs=2:normalize=0,atrim=0:{END},loudnorm=I=-16:TP=-1.5:LRA=11[a]"
    audio = os.path.join(BUILD, "audio.m4a")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", fc, "-map", "[a]", "-ar", "48000",
                    "-c:a", "aac", "-b:a", "192k", audio], check=True)
    final = os.path.join(OUT, "navgcc_promo.mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", video, "-i", audio, "-i", os.path.join(OUT, "navgcc_promo.en.srt"),
                    "-map", "0:v", "-map", "1:a", "-map", "2:s", "-c:v", "copy", "-c:a", "copy", "-c:s", "mov_text",
                    "-metadata:s:s:0", "language=eng", "-movflags", "+faststart", "-t", str(END), final], check=True)
    print("done:", final)

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--stills", help="comma-separated seconds: save PNGs instead of rendering")
    a = ap.parse_args()
    run([float(x) for x in a.stills.split(",")] if a.stills else None)
