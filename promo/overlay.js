/* Injected into every captured page (before the page's own scripts).
   1. A virtual clock: performance.now, requestAnimationFrame and CSS animations/transitions
      advance only when the capture script calls __step(ms) — every frame is deterministic.
   2. The promo overlay in the navgcc.com style: titles, step list, sample-data tag, note,
      recap, subtitles and the closing card. State comes from window.__PROMO (set by render.py). */
(() => {
  /* ---------- virtual clock ---------- */
  let vt = 0;
  const rafQ = [];
  performance.now = () => vt;
  window.requestAnimationFrame = cb => { rafQ.push(cb); return rafQ.length; };
  window.cancelAnimationFrame = () => {};
  const born = new WeakMap();
  window.__vt = () => vt;
  window.__step = ms => {
    vt += ms;
    const q = rafQ.splice(0);
    for (const cb of q) { try { cb(vt); } catch (e) { console.error(e); } }
    for (const a of document.getAnimations()) {
      if (!born.has(a)) { born.set(a, vt); try { a.pause(); } catch (e) {} }
      try { a.currentTime = vt - born.get(a); } catch (e) {}
    }
  };

  /* ---------- overlay ---------- */
  const CSS = `
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700&display=swap");
  #pv{position:fixed;inset:0;z-index:2147483000;pointer-events:none;font-family:Inter,system-ui,sans-serif;color:#EEF2F8;-webkit-font-smoothing:antialiased}
  #pv .scrim{position:absolute;left:0;top:70px;bottom:0;width:980px;background:linear-gradient(90deg,rgba(10,17,32,.92) 0%,rgba(10,17,32,.72) 42%,rgba(10,17,32,0) 100%);opacity:0}
  #pv .head{position:absolute;left:84px;top:150px;max-width:860px}
  #pv .eyebrow{display:flex;align-items:center;gap:12px;font:600 19px Inter;letter-spacing:.16em;text-transform:uppercase;color:#A3AEFF;opacity:0}
  #pv .eyebrow i{width:10px;height:10px;border-radius:50%;background:#7C8CFF;box-shadow:0 0 0 6px rgba(124,140,255,.2)}
  #pv h1{font:600 76px/1.08 Sora,Inter,sans-serif;letter-spacing:-.02em;margin:16px 0 0;opacity:0;text-shadow:0 2px 30px rgba(10,17,32,.9)}
  #pv .steps{margin-top:34px;display:flex;flex-direction:column;gap:16px}
  #pv .step{display:flex;align-items:center;gap:16px;font:500 34px Inter;opacity:0}
  #pv .step b{width:44px;height:44px;border-radius:50%;flex:none;display:grid;place-items:center;font:600 21px Sora;color:#0A1120;background:#7C8CFF}
  #pv .step.done{color:#B1BCCD} #pv .step.done b{background:rgba(124,140,255,.28);color:#EEF2F8}
  #pv .tag{position:absolute;left:84px;display:inline-flex;align-items:center;gap:10px;font:600 21px Inter;color:#F8D58C;
           background:rgba(242,181,68,.12);border:1.5px dashed rgba(242,181,68,.65);border-radius:999px;padding:7px 18px;opacity:0}
  #pv .note{position:absolute;left:84px;font:500 24px Inter;color:#B1BCCD;opacity:0;display:flex;align-items:center;gap:10px}
  #pv .note svg{width:24px;height:24px;stroke:#A3AEFF;fill:none;stroke-width:2;stroke-linecap:round}
  #pv .recap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;background:radial-gradient(900px 420px at 50% 50%,rgba(10,17,32,.86),rgba(10,17,32,.5) 60%,rgba(10,17,32,0) 100%);opacity:0}
  #pv .recap div{font:600 64px Sora,Inter;letter-spacing:-.015em;opacity:0;text-shadow:0 2px 34px rgba(10,17,32,.95)}
  #pv .recap div:nth-child(2){color:#A3AEFF}
  #pv .sub{position:absolute;bottom:58px;left:0;right:0;display:flex;justify-content:center;padding:0 60px}
  #pv .sub span{font:500 37px/1.35 Inter;text-align:center;max-width:1240px;padding:12px 28px;border-radius:16px;
                background:rgba(10,17,32,.8);border:1px solid rgba(148,163,184,.18);box-shadow:0 10px 30px rgba(2,6,16,.45);opacity:0}
  #pv .ripple{position:absolute;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;border:3px solid #A3AEFF;opacity:0}
  #pv .end{position:absolute;inset:0;opacity:0;display:flex;align-items:center;justify-content:center;
           background:radial-gradient(1200px 640px at 72% -10%,rgba(124,140,255,.16),transparent 62%),#0A1120}
  #pv .card{display:flex;flex-direction:column;align-items:center;text-align:center}
  #pv .card img{width:132px;height:132px;border-radius:30px;box-shadow:0 22px 60px rgba(76,87,197,.35)}
  #pv .card .w{font:700 92px Sora;letter-spacing:.06em;margin-top:34px}
  #pv .card .tl{font:500 38px Inter;color:#B1BCCD;margin-top:10px}
  #pv .card .url{font:600 44px Sora;color:#A3AEFF;margin-top:30px}
  #pv .card .hr{width:120px;height:2px;background:rgba(148,163,184,.3);margin:44px 0 30px}
  #pv .card .k{font:600 21px Inter;letter-spacing:.18em;text-transform:uppercase;color:#8190A7}
  #pv .card .nm{font:600 40px Sora;margin-top:12px}
  #pv .card .em{font:500 34px Inter;color:#EEF2F8;margin-top:6px}
  #pv .fade{position:absolute;inset:0;background:#0A1120;opacity:0}
  `;
  function build() {
    if (document.getElementById("pv")) return;
    const st = document.createElement("style"); st.textContent = CSS + (window.__PROMO && window.__PROMO.hideCss || "");
    document.head.appendChild(st);
    const d = document.createElement("div"); d.id = "pv";
    d.innerHTML = `<div class="scrim"></div>
      <div class="head"><div class="eyebrow"><i></i><span></span></div><h1></h1><div class="steps"></div></div>
      <div class="tag">Sample data · illustrative contacts</div>
      <div class="note"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span>Potential paths. Introductions are not guaranteed.</span></div>
      <div class="recap"><div>Understand the landscape.</div><div>Find your place.</div><div>Discover your path.</div></div>
      <div class="ripple"></div>
      <div class="sub"><span></span></div>
      <div class="end"><div class="card"><img src="/favicon.svg" alt="">
        <div class="w">NAVGCC</div><div class="tl">Navigate the GCC. Connect with confidence.</div>
        <div class="url">navgcc.com</div><div class="hr"></div>
        <div class="k">Get in touch</div><div class="nm">Qi Zhang</div><div class="em">qizhan@umich.edu</div></div></div>
      <div class="fade"></div>`;
    document.body.appendChild(d);
  }
  const clamp = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp(x); return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
  /* visibility of a [t0, t1] window with fade in/out */
  const win = (t, t0, t1, fi = .6, fo = .5) => t < t0 || t > t1 ? 0 : Math.min(ease((t - t0) / fi), ease((t1 - t) / fo));
  let ripple = null;
  window.__ripple = (x, y, t) => { ripple = {x, y, t}; };

  window.__ov = t => {
    build();
    const P = window.__PROMO || {}, q = s => document.querySelector("#pv " + s);
    /* scene titles */
    const sc = (P.titles || []).find(s => t >= s.t0 && t <= s.t1);
    const head = q(".head"), h1 = q("h1"), eb = q(".eyebrow"), steps = q(".steps");
    let ho = 0;
    if (sc) {
      if (h1.dataset.k !== sc.title) {
        h1.dataset.k = sc.title; h1.textContent = sc.title; eb.querySelector("span").textContent = sc.eyebrow || "";
        steps.innerHTML = (sc.steps || []).map((s, i) => `<div class="step"><b>${i + 1}</b><span>${s.text}</span></div>`).join("");
      }
      ho = win(t, sc.t0, sc.t1, .8, .6);
      eb.style.opacity = ho; h1.style.opacity = ho;
      h1.style.transform = `translateY(${(1 - ease((t - sc.t0) / .9)) * 18}px)`;
      (sc.steps || []).forEach((s, i) => {
        const el = steps.children[i]; if (!el) return;
        const o = win(t, s.t, sc.t1, .5, .6);
        el.style.opacity = o * (el.classList.contains("done") ? .85 : 1);
        el.style.transform = `translateX(${(1 - ease((t - s.t) / .5)) * -16}px)`;
        const next = sc.steps[i + 1];
        el.classList.toggle("done", !!next && t >= next.t);
      });
    } else { eb.style.opacity = 0; h1.style.opacity = 0; [...steps.children].forEach(e => e.style.opacity = 0); }
    q(".scrim").style.opacity = Math.max(ho * (sc && sc.scrim != null ? sc.scrim : 1), 0);
    head.style.top = (sc && sc.top || 150) + "px";
    /* sample-data tag and note, placed under the head block */
    const hb = head.getBoundingClientRect();
    const tag = q(".tag"), note = q(".note");
    tag.style.top = (hb.bottom + 30) + "px"; tag.style.opacity = (P.tag || []).reduce((m, w) => Math.max(m, win(t, w[0], w[1])), 0);
    note.style.top = (hb.bottom + 30 + (tag.style.opacity > 0 ? 62 : 0)) + "px";
    note.style.opacity = (P.note || []).reduce((m, w) => Math.max(m, win(t, w[0], w[1])), 0);
    /* recap */
    q(".recap").style.opacity = win(t, (P.recap || [0])[0] - 0.3, P.recapEnd + 0.4, .6, .8);
    [...q(".recap").children].forEach((el, i) => {
      const r = (P.recap || [])[i]; if (!r) return;
      el.style.opacity = win(t, r, P.recapEnd, .5, .7);
      el.style.transform = `translateY(${(1 - ease((t - r) / .6)) * 14}px)`;
    });
    /* subtitles: centred over the visible map, never under an open side panel */
    const cue = (P.cues || []).find(c => t >= c.t0 && t <= c.t1);
    const sub = q(".sub"), span = q(".sub span");
    const panel = document.querySelector("#mypanel.open, #detail.open");
    const pw = panel ? Math.max(0, window.innerWidth - panel.getBoundingClientRect().left) : 0;
    sub.style.right = pw + "px";
    if (cue) { if (span.textContent !== cue.text) span.textContent = cue.text; span.style.opacity = win(t, cue.t0, cue.t1, .18, .18); }
    else span.style.opacity = 0;
    /* click ripple */
    const rp = q(".ripple");
    if (ripple && t - ripple.t < .7) {
      const u = (t - ripple.t) / .7;
      rp.style.left = ripple.x + "px"; rp.style.top = ripple.y + "px";
      rp.style.opacity = (1 - u) * .95; rp.style.transform = `scale(${1 + u * 2.6})`;
    } else rp.style.opacity = 0;
    /* closing card and global fades */
    q(".end").style.opacity = P.end ? ease((t - P.end) / 1.0) : 0;
    q(".fade").style.opacity = P.fadeIn ? 1 - ease((t - P.fadeIn[0]) / P.fadeIn[1]) : 0;
  };
})();
