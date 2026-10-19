/* Account + pilot API for navgcc.com. Node built-ins only. Runs behind nginx/Caddy:
     location /api/ { proxy_pass http://127.0.0.1:3100; }
   Data lives OUTSIDE the git repo (POWER_API_DATA, default /var/lib/power_api), so
   deploys never touch user data.

   Phase 4 adds, all enforced here (the browser is never trusted):
   - email-ownership verification (code + link, expiry, attempt limits, resend throttle)
   - admin-issued, email-bound, expiring, single-use invitations to an alumni circle
   - circle access = signed in AND email verified AND (invited member OR admin)
   - circle records = public-source alumni + fictional demo records + members'
     own submissions (per-field visibility); directory-derived data is never served
   - per-user layer preferences, own-profile edit/withdraw with claim review,
     feedback, and minimal pilot analytics (no codes, notes or search content)

   Email delivery: RESEND_API_KEY + MAIL_FROM (HTTPS API). POWER_API_MAIL=outbox
   writes messages to DATA/outbox for local testing only. Without either, sending
   reports "not configured" and accounts stay unverified. */
"use strict";
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = +(process.env.POWER_API_PORT || 3100);
const HOST = process.env.POWER_API_HOST || "127.0.0.1";   // 0.0.0.0 when containerized
const DATA = process.env.POWER_API_DATA || "/var/lib/power_api";
const UDIR = path.join(DATA, "users");
fs.mkdirSync(UDIR, { recursive: true });
/* mail secrets may live in DATA/mail.json ({"RESEND_API_KEY","MAIL_FROM"}), outside the repo */
try { const mj = JSON.parse(fs.readFileSync(path.join(DATA, "mail.json"), "utf8"));
      for (const k of ["RESEND_API_KEY", "MAIL_FROM"]) if (!process.env[k] && mj[k]) process.env[k] = mj[k]; } catch (e) {}
const BASE = (process.env.PUBLIC_BASE || "https://navgcc.com").replace(/\/$/, "");

const USERS_F = path.join(DATA, "users.json");
const TOKENS_F = path.join(DATA, "tokens.json");
const CIRCLES_F = path.join(DATA, "circles.json");
const EVENTS_F = path.join(DATA, "events.ndjson");
const load = (f, d) => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, "utf8")) : d;
let users = load(USERS_F, {});
let tokens = load(TOKENS_F, {});
let cdb = load(CIRCLES_F, {});
for (const k of ["members", "invites", "profiles", "claims", "requests", "feedback"]) cdb[k] = cdb[k] || (k === "claims" || k === "requests" || k === "feedback" ? [] : {});
const saveUsers = () => fs.writeFileSync(USERS_F, JSON.stringify(users));
const saveTokens = () => fs.writeFileSync(TOKENS_F, JSON.stringify(tokens));
const saveC = () => fs.writeFileSync(CIRCLES_F, JSON.stringify(cdb));

const TOKEN_DAYS = 60;
const ADMINS = new Set((process.env.POWER_API_ADMINS || "zhangqi362@gmail.com")
  .split(",").map(s => s.trim().toLowerCase()).filter(Boolean));
const REPO = process.env.POWER_REPO || path.join(__dirname, "..");
const MAX_BODY = 3 * 1024 * 1024;
const VER_MIN = 30, VER_TRIES = 5;
const CIRCLES = { "insead-emba": { name: "INSEAD EMBA — classmate pilot", school: "insead",
                                   fixtures: "insead_emba_demo.json" } };

const sha = s => crypto.createHash("sha256").update(String(s)).digest("hex");
const rnd = n => crypto.randomBytes(n).toString("base64url");
const eqHash = (a, b) => a && b && a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

function hashPw(pw, salt) { return crypto.scryptSync(pw, salt, 64).toString("hex"); }
function newToken(email) {
  const tk = crypto.randomBytes(32).toString("hex");
  tokens[tk] = { email, exp: Date.now() + TOKEN_DAYS * 864e5 };
  for (const k of Object.keys(tokens)) if (tokens[k].exp < Date.now()) delete tokens[k];
  saveTokens();
  return tk;
}
function authed(req) {
  const h = req.headers.authorization || "";
  const tk = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!tk || !tokens[tk] || tokens[tk].exp < Date.now() || !users[tokens[tk].email]) return null;
  return { token: tk, email: tokens[tk].email, user: users[tokens[tk].email] };
}

/* per-key rate limits */
const buckets = {};
function limited(key, max, ms) {
  const now = Date.now();
  const b = buckets[key] = (buckets[key] && buckets[key].reset > now) ? buckets[key] : { n: 0, reset: now + (ms || 600000) };
  return ++b.n > (max || 30);
}

/* ---------------- analytics (minimal, pseudonymous) ---------------- */
const ALLOWED_EVENTS = new Set(["registration_completed", "account_verified", "try_premium_opened",
  "alumni_layer_activated", "profile_updated", "return_usage", "feedback_submitted"]);
function track(e, email) {
  if (!ALLOWED_EVENTS.has(e)) return;
  const u = email ? sha("navgcc-pilot:" + email).slice(0, 12) : "anon";
  fs.appendFileSync(EVENTS_F, JSON.stringify({ e, u, d: new Date().toISOString().slice(0, 10) }) + "\n");
}

/* ---------------- mail ---------------- */
function mailStatus() {
  if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) return "resend";
  if (process.env.POWER_API_MAIL === "outbox") return "outbox";
  return "none";
}
async function sendMail(to, subject, text) {
  const mode = mailStatus();
  if (mode === "outbox") {
    const d = path.join(DATA, "outbox"); fs.mkdirSync(d, { recursive: true });
    fs.writeFileSync(path.join(d, Date.now() + "-" + rnd(4) + ".json"), JSON.stringify({ to, subject, text }));
    return true;
  }
  if (mode === "resend") {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], subject, text }) });
    return r.ok;
  }
  return false;
}

/* ---------------- verification ---------------- */
function verState(u) {
  if (u.verified) return "verified";
  const v = u.ver;
  if (!v) return "none";
  if (v.tries >= VER_TRIES) return "failed";
  if (v.exp < Date.now()) return "expired";
  return "pending";
}
async function issueVerification(email) {
  const u = users[email];
  const now = Date.now();
  const sent = (u.ver && u.ver.sent || []).filter(t => t > now - 3600e3);
  if (sent.length && now - sent[sent.length - 1] < 60e3) return { ok: false, code: 429, error: "please wait a minute before requesting another email" };
  if (sent.length >= 5) return { ok: false, code: 429, error: "too many verification emails this hour — try again later" };
  if (mailStatus() === "none") return { ok: false, code: 503, error: "email delivery is not configured on this server yet" };
  const code = String(crypto.randomInt(0, 1e6)).padStart(6, "0");
  const link = rnd(24);
  u.ver = { codeH: sha(code), linkH: sha(link), exp: now + VER_MIN * 60e3, tries: 0, sent: sent.concat(now) };
  saveUsers();
  const url = `${BASE}/premium.html?verify=${link}&e=${encodeURIComponent(email)}`;
  const ok = await sendMail(email, "Your NavGCC verification code",
    `Your NavGCC verification code is ${code}\n\nOr open this link to verify: ${url}\n\nIt expires in ${VER_MIN} minutes. If you did not create a NavGCC account, ignore this email.`);
  return ok ? { ok: true } : { ok: false, code: 502, error: "the email could not be sent — try again later" };
}

/* ---------------- circles ---------------- */
const REGION_DIRS = { abudhabi: "", dubai: "dubai", northern: "northern", saudi: "saudi", qatar: "qatar",
                      bahrain: "bahrain", oman: "oman", kuwait: "kuwait" };
const REGION_GEO = { abudhabi: ["United Arab Emirates", "Abu Dhabi"], dubai: ["United Arab Emirates", "Dubai"],
  northern: ["United Arab Emirates", ""], saudi: ["Saudi Arabia", ""], qatar: ["Qatar", "Doha"],
  bahrain: ["Bahrain", "Manama"], oman: ["Oman", "Muscat"], kuwait: ["Kuwait", "Kuwait City"] };
let pubCache = { key: "", rows: [] };
/* alumni of the circle's school stated in the PUBLIC map data (official bios) */
function publicAlumni(school) {
  const files = Object.entries(REGION_DIRS).map(([r, d]) => [r, path.join(REPO, d, "network_data.js")]);
  const key = files.map(([, f]) => fs.existsSync(f) ? fs.statSync(f).mtimeMs : 0).join(",");
  if (pubCache.key === key) return pubCache.rows;
  const rows = [];
  const ROLE = /\["([^"]*)","((?:[^"\\]|\\.)*)","(\w+)","(\w+)"(?:,"([^"]*)")?\]/g;
  for (const [reg, f] of files) {
    if (!fs.existsSync(f)) continue;
    const t = fs.readFileSync(f, "utf8");
    const inst = {};
    for (const m of t.matchAll(/\{id:"([^"]+)",\s*n:"((?:[^"\\]|\\.)*)",\s*s:"(\w+)",\s*t:/g)) inst[m[1]] = { n: m[2], s: m[3] };
    for (const m of t.matchAll(/\{id:"([^"]+)",\s*n:"((?:[^"\\]|\\.)*)",[^\n]*?s:"(\w+)",[^\n]*?roles:\[(.*?)\]\}/gs)) {
      const roles = [...m[4].matchAll(ROLE)];
      const alum = roles.find(r => r[1] === school && r[3] === "alumni");
      if (!alum) continue;
      const job = roles.find(r => r[3] !== "alumni" && !r[5]);
      rows.push({ id: "pub:" + reg + ":" + m[1], source: "public", nodeId: m[1], region: reg, name: m[2],
        program: alum[2].replace(/\\"/g, '"'), cohort: "", org: job ? (inst[job[1]] || {}).n || job[1] : "",
        title: job ? job[2].replace(/\\"/g, '"') : "", country: REGION_GEO[reg][0], city: REGION_GEO[reg][1],
        industry: m[3], verifiedBy: "official bio" });
    }
  }
  pubCache = { key, rows };
  return rows;
}
function fixtures(c) {
  const f = path.join(__dirname, "fixtures", CIRCLES[c].fixtures);
  if (!fs.existsSync(f)) return [];
  return JSON.parse(fs.readFileSync(f, "utf8")).records.map(r => Object.assign({}, r,
    { id: "demo:" + r.id, source: "demo", fictional: true }));
}
const PFIELDS = ["name", "school", "program", "cohort", "org", "title", "country", "city", "industry", "bio", "url", "interests"];
const PRIVATE_FIELDS = ["note"];
function profileView(p, ownerView) {
  const out = { id: "mem:" + p.id, source: "member", updated: p.updated };
  for (const f of PFIELDS) if (ownerView || p.vis[f]) out[f] = p.fields[f];
  if (ownerView) { out.vis = p.vis; out.listed = p.listed; out.note = p.fields.note || ""; out.claim = p.claim || null; }
  if (p.linked) out.linkedRecord = p.linked;
  return out;
}
function access(a, c) {
  if (!CIRCLES[c]) return { ok: false, code: 404, reason: "unknown_circle" };
  if (!a) return { ok: false, code: 401, reason: "signin" };
  if (!a.user.verified) return { ok: false, code: 403, reason: "verify" };
  if (ADMINS.has(a.email)) return { ok: true, admin: true };
  if (cdb.members[a.email] && cdb.members[a.email][c]) return { ok: true };
  return { ok: false, code: 403, reason: "not_invited" };
}
function circleRecords(c, viewer) {
  const pub = publicAlumni(CIRCLES[c].school);
  const profs = Object.entries(cdb.profiles[c] || {});
  const linked = new Set(profs.map(([, p]) => p.linked).filter(Boolean));
  const recs = pub.filter(r => !linked.has(r.id)).concat(fixtures(c));
  for (const [email, p] of profs) {
    if (email === viewer) continue;
    if (!p.listed || !p.vis.name) continue;
    recs.push(profileView(p, false));
  }
  const counts = { unique: recs.length, public: recs.filter(r => r.source === "public").length,
                   members: recs.filter(r => r.source === "member").length, demo: recs.filter(r => r.source === "demo").length };
  return { records: recs, counts };
}
const toks = s => new Set(String(s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 1 && !["al", "el", "bin", "dr", "he"].includes(w)));

/* ---------------- http plumbing ---------------- */
function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(obj));
}
function readBody(req, cb) {
  let buf = "", dead = false;
  req.on("data", d => { buf += d; if (buf.length > MAX_BODY && !dead) { dead = true; req.destroy(); } });
  req.on("end", () => { if (dead) return; try { cb(JSON.parse(buf || "{}")); } catch (e) { cb(null); } });
}
const str = (v, n) => String(v == null ? "" : v).trim().slice(0, n || 200);
const maskEmail = e => e.replace(/^(.)[^@]*(@.).*?(\.[a-z]+)$/i, "$1***$2***$3");

http.createServer((req, res) => {
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress || "?";
  const [url, qs] = (req.url || "").split("?");
  const q = new URLSearchParams(qs || "");
  const seg = url.split("/").filter(Boolean);       // ["api", ...]
  const body = fn => readBody(req, b => b ? fn(b) : send(res, 400, { error: "bad request" }));

  /* ---- register / login ---- */
  if (req.method === "POST" && (url === "/api/register" || url === "/api/login")) {
    if (limited("auth:" + ip)) return send(res, 429, { error: "too many attempts, try later" });
    return body(async b => {
      const email = str(b.email, 254).toLowerCase();
      const pw = String(b.password || "");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(res, 400, { error: "invalid email" });
      if (url === "/api/register") {
        if (pw.length < 8) return send(res, 400, { error: "password must be at least 8 characters" });
        if (users[email]) return send(res, 409, { error: "account exists — sign in instead" });
        const salt = crypto.randomBytes(16).toString("hex");
        users[email] = { id: crypto.randomBytes(8).toString("hex"), salt, hash: hashPw(pw, salt), created: Date.now(), verified: false };
        saveUsers();
        track("registration_completed", email);
        const v = await issueVerification(email);
        return send(res, 200, { token: newToken(email), email, verification: v.ok ? "sent" : v.error });
      }
      const u = users[email];
      if (!u) return send(res, 401, { error: "no such account" });
      if (!eqHash(hashPw(pw, u.salt), u.hash)) return send(res, 401, { error: "wrong password" });
      return send(res, 200, { token: newToken(email), email });
    });
  }

  /* ---- verification by emailed link (proves mailbox access; no session needed) ---- */
  if (req.method === "POST" && url === "/api/verify/link") {
    if (limited("verlink:" + ip, 20)) return send(res, 429, { error: "too many attempts, try later" });
    return body(b => {
      const email = str(b.email, 254).toLowerCase(), u = users[email];
      if (!u) return send(res, 400, { state: "failed", error: "this verification link is not valid" });
      if (u.verified) return send(res, 200, { state: "verified" });
      const st = verState(u);
      if (st === "expired") return send(res, 410, { state: "expired", error: "this link has expired — request a new email" });
      if (st !== "pending" || !eqHash(sha(b.token || ""), u.ver.linkH)) {
        if (u.ver) { u.ver.tries++; saveUsers(); }
        return send(res, 400, { state: verState(u) === "failed" ? "failed" : "invalid", error: "this verification link is not valid" });
      }
      u.verified = true; u.verifiedAt = Date.now(); delete u.ver; saveUsers();
      track("account_verified", email);
      return send(res, 200, { state: "verified" });
    });
  }

  /* ---- invitation preview: no account data, only whether it is usable ---- */
  if (req.method === "POST" && url === "/api/invite/check") {
    if (limited("invchk:" + ip, 30)) return send(res, 429, { error: "too many attempts, try later" });
    return body(b => {
      const inv = Object.values(cdb.invites).find(i => eqHash(i.hash, sha(b.token || "")));
      if (!inv) return send(res, 404, { state: "invalid", error: "this invitation link is not valid" });
      const state = inv.revoked ? "revoked" : inv.usedAt ? "used" : inv.exp < Date.now() ? "expired" : "valid";
      return send(res, 200, { state, circle: CIRCLES[inv.circle] ? CIRCLES[inv.circle].name : inv.circle,
                              email: maskEmail(inv.email), exp: inv.exp });
    });
  }

  /* ---- anonymous-safe event (only the Try Premium entry) ---- */
  if (req.method === "POST" && url === "/api/event") {
    return body(b => {
      if (b.e === "try_premium_opened") track(b.e, (authed(req) || {}).email);
      return send(res, 200, { ok: true });
    });
  }

  const a = authed(req);
  if (url === "/api/me" && req.method === "GET") {
    if (!a) return send(res, 401, { error: "not signed in" });
    const today = new Date().toISOString().slice(0, 10);
    if (a.user.lastDay && a.user.lastDay !== today) track("return_usage", a.email);
    if (a.user.lastDay !== today) { a.user.lastDay = today; saveUsers(); }
    const circles = Object.keys(CIRCLES).filter(c => access(a, c).ok);
    return send(res, 200, { email: a.email, admin: ADMINS.has(a.email), verified: !!a.user.verified,
      verification: verState(a.user), mail: mailStatus() !== "none", circles, layers: a.user.layers || {} });
  }
  if (!a) return send(res, 401, { error: "not signed in" });
  const isAdmin = ADMINS.has(a.email);

  if (url === "/api/growth" && req.method === "GET") {
    if (!isAdmin) return send(res, 403, { error: "admin only" });
    const gf = path.join(REPO, "reports", "growth.html");
    if (!fs.existsSync(gf)) return send(res, 404, { error: "report not generated yet" });
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
    return res.end(fs.readFileSync(gf));
  }

  if (url === "/api/password" && req.method === "POST") {
    if (limited("auth:" + ip)) return send(res, 429, { error: "too many attempts, try later" });
    return body(b => {
      const cur = String(b.current || ""), nw = String(b.password || "");
      if (nw.length < 8) return send(res, 400, { error: "new password must be at least 8 characters" });
      const u = a.user;
      if (!eqHash(hashPw(cur, u.salt), u.hash)) return send(res, 401, { error: "current password is wrong" });
      u.salt = crypto.randomBytes(16).toString("hex");
      u.hash = hashPw(nw, u.salt);
      saveUsers();
      for (const k of Object.keys(tokens)) if (tokens[k].email === a.email && k !== a.token) delete tokens[k];
      saveTokens();
      return send(res, 200, { ok: true });
    });
  }

  /* ---- verification (signed in) ---- */
  if (url === "/api/verify/send" && req.method === "POST") {
    if (a.user.verified) return send(res, 200, { state: "verified" });
    return (async () => {
      const v = await issueVerification(a.email);
      return v.ok ? send(res, 200, { state: "pending" }) : send(res, v.code, { state: verState(a.user), error: v.error });
    })();
  }
  if (url === "/api/verify/code" && req.method === "POST") {
    if (limited("vercode:" + a.email, 15)) return send(res, 429, { error: "too many attempts, try later" });
    return body(b => {
      const u = a.user;
      if (u.verified) return send(res, 200, { state: "verified" });
      const st = verState(u);
      if (st === "none") return send(res, 400, { state: st, error: "request a verification email first" });
      if (st === "expired") return send(res, 410, { state: st, error: "this code has expired — request a new one" });
      if (st === "failed") return send(res, 429, { state: st, error: "too many wrong codes — request a new one" });
      if (!eqHash(sha(str(b.code, 12)), u.ver.codeH)) {
        u.ver.tries++; saveUsers();
        return send(res, 400, { state: verState(u), error: "that code is not correct", left: Math.max(0, VER_TRIES - u.ver.tries) });
      }
      u.verified = true; u.verifiedAt = Date.now(); delete u.ver; saveUsers();
      track("account_verified", a.email);
      return send(res, 200, { state: "verified" });
    });
  }

  /* ---- invitation redemption: verified account whose email matches ---- */
  if (url === "/api/invite/redeem" && req.method === "POST") {
    if (limited("invred:" + a.email, 10)) return send(res, 429, { error: "too many attempts, try later" });
    return body(b => {
      if (!a.user.verified) return send(res, 403, { reason: "verify", error: "verify your email first" });
      const inv = Object.values(cdb.invites).find(i => eqHash(i.hash, sha(b.token || "")));
      if (!inv) return send(res, 404, { reason: "invalid", error: "this invitation link is not valid" });
      if (inv.revoked) return send(res, 410, { reason: "revoked", error: "this invitation was withdrawn" });
      if (inv.exp < Date.now()) return send(res, 410, { reason: "expired", error: "this invitation has expired — ask for a new one" });
      if (inv.email !== a.email) return send(res, 403, { reason: "wrong_email", error: "this invitation is for a different email address" });
      if (inv.usedAt && inv.usedBy !== a.email) return send(res, 410, { reason: "used", error: "this invitation was already used" });
      cdb.members[a.email] = cdb.members[a.email] || {};
      if (!cdb.members[a.email][inv.circle]) cdb.members[a.email][inv.circle] = { since: Date.now(), via: "invitation", invite: inv.id };
      inv.usedAt = inv.usedAt || Date.now(); inv.usedBy = a.email;
      saveC();
      return send(res, 200, { ok: true, circle: inv.circle });
    });
  }

  /* ---- layer preferences (per user, server-side) ---- */
  if (url === "/api/layers" && req.method === "PUT") {
    return body(b => {
      const al = b.alumni;
      if (!al || typeof al !== "object") return send(res, 400, { error: "bad request" });
      const c = str(al.circle || "insead-emba", 40);
      if (al.on) { const acc = access(a, c); if (!acc.ok) return send(res, acc.code, { reason: acc.reason, error: "no access to this circle" }); }
      const prev = a.user.layers && a.user.layers.alumni;
      const f = al.filters || {};
      a.user.layers = Object.assign({}, a.user.layers, { alumni: { on: !!al.on, circle: c,
        mode: al.mode === "only" ? "only" : "overlay",
        filters: { country: str(f.country, 60), city: str(f.city, 60), industry: str(f.industry, 40), org: str(f.org, 120), cohort: str(f.cohort, 40) } } });
      saveUsers();
      if (al.on && !(prev && prev.on)) track("alumni_layer_activated", a.email);
      return send(res, 200, { layers: a.user.layers });
    });
  }

  /* ---- feedback ---- */
  if (url === "/api/feedback" && req.method === "POST") {
    if (limited("fb:" + a.email, 20, 3600e3)) return send(res, 429, { error: "too many messages, try later" });
    return body(b => {
      const text = str(b.text, 2000);
      if (!text) return send(res, 400, { error: "feedback is empty" });
      cdb.feedback.push({ at: Date.now(), email: a.email, text, rating: str(b.rating, 10) });
      saveC(); track("feedback_submitted", a.email);
      return send(res, 200, { ok: true });
    });
  }

  /* ---- circle data: /api/circle/:c[/profile|/match|/request] ---- */
  if (seg[1] === "circle" && seg[2]) {
    const c = seg[2], sub = seg[3] || "";
    if (sub === "request" && req.method === "POST") {
      if (!CIRCLES[c]) return send(res, 404, { error: "unknown circle" });
      if (!a.user.verified) return send(res, 403, { reason: "verify", error: "verify your email first" });
      return body(b => {
        if (!cdb.requests.some(r => r.email === a.email && r.circle === c && r.status === "open"))
          cdb.requests.push({ at: Date.now(), email: a.email, circle: c, note: str(b.note, 500), status: "open" });
        saveC();
        return send(res, 200, { ok: true });
      });
    }
    const acc = access(a, c);
    if (!acc.ok) return send(res, acc.code, { reason: acc.reason, error: "no access to this circle" });
    cdb.profiles[c] = cdb.profiles[c] || {};
    if (!sub && req.method === "GET") {
      const r = circleRecords(c, a.email);
      const own = cdb.profiles[c][a.email];
      return send(res, 200, { circle: c, name: CIRCLES[c].name, records: r.records, counts: r.counts,
                              me: own ? profileView(own, true) : null });
    }
    if (sub === "match" && req.method === "GET") {
      const want = toks(q.get("name"));
      if (!want.size) return send(res, 200, { candidates: [] });
      const cands = circleRecords(c, a.email).records.filter(r => r.source !== "demo").map(r => {
        const have = toks(r.name); let hit = 0; want.forEach(w => { if (have.has(w)) hit++; });
        return { r, s: hit / Math.max(want.size, have.size) };
      }).filter(x => x.s >= 0.5).sort((x, y) => y.s - x.s).slice(0, 5)
        .map(x => ({ id: x.r.id, name: x.r.name, org: x.r.org, title: x.r.title, source: x.r.source }));
      return send(res, 200, { candidates: cands });
    }
    if (sub === "profile" && req.method === "PUT") {
      if (limited("prof:" + a.email, 30, 3600e3)) return send(res, 429, { error: "too many updates, try later" });
      return body(b => {
        const f = b.fields || {}, vis = b.vis || {};
        const fields = {};
        for (const k of PFIELDS) fields[k] = k === "interests" ? (Array.isArray(f[k]) ? f[k].map(x => str(x, 40)).slice(0, 5) : [])
                                                               : str(f[k], k === "bio" ? 1200 : 160);
        fields.note = str(f.note, 1000);
        if (!fields.name) return send(res, 400, { error: "name is required" });
        if (fields.url && !/^https?:\/\//i.test(fields.url)) return send(res, 400, { error: "profile URL must start with http(s)://" });
        const target = b.claim ? circleRecords(c, a.email).records.find(r => r.id === b.claim && r.source !== "demo") : null;
        if (b.claim && !target) return send(res, 400, { error: "that record cannot be claimed" });
        const prev = cdb.profiles[c][a.email];
        const p = prev || { id: rnd(9), created: Date.now() };
        p.fields = fields; p.updated = Date.now();
        p.vis = {}; for (const k of PFIELDS) p.vis[k] = k === "name" ? true : !!vis[k];
        p.listed = b.listed !== false;
        cdb.profiles[c][a.email] = p;
        /* claiming an existing record never overwrites it: an admin reviews the claim */
        if (b.claim && !p.linked) {
          if (!cdb.claims.some(x => x.email === a.email && x.record === b.claim && x.status === "pending"))
            cdb.claims.push({ id: rnd(6), at: Date.now(), email: a.email, circle: c, record: b.claim, recordName: target.name, status: "pending" });
          p.claim = { record: b.claim, status: "pending" };
        }
        saveC(); track("profile_updated", a.email);
        return send(res, 200, { me: profileView(p, true) });
      });
    }
    if (sub === "profile" && req.method === "DELETE") {
      delete cdb.profiles[c][a.email];
      cdb.claims = cdb.claims.filter(x => !(x.email === a.email && x.circle === c && x.status === "pending"));
      saveC();
      return send(res, 200, { ok: true });
    }
    return send(res, 404, { error: "not found" });
  }

  /* ---- admin: invitations, requests, claims, members, feedback, stats ---- */
  if (seg[1] === "admin") {
    if (!isAdmin) return send(res, 403, { error: "admin only" });
    const what = seg[2];
    if (what === "invites" && req.method === "POST") {
      return body(b => {
        const email = str(b.email, 254).toLowerCase(), c = str(b.circle || "insead-emba", 40);
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(res, 400, { error: "invalid email" });
        if (!CIRCLES[c]) return send(res, 400, { error: "unknown circle" });
        const days = Math.max(1, Math.min(30, +b.days || 7));
        const token = rnd(24), id = rnd(6);
        cdb.invites[id] = { id, hash: sha(token), email, circle: c, created: Date.now(), exp: Date.now() + days * 864e5, by: a.email };
        saveC();
        return send(res, 200, { id, email, circle: c, exp: cdb.invites[id].exp, link: `${BASE}/premium.html?invite=${token}` });
      });
    }
    if (what === "invites" && req.method === "GET")
      return send(res, 200, { invites: Object.values(cdb.invites).map(({ hash, ...i }) => i) });
    if (what === "invites" && req.method === "DELETE" && seg[3]) {
      const inv = cdb.invites[seg[3]];
      if (!inv) return send(res, 404, { error: "not found" });
      inv.revoked = Date.now(); saveC();
      return send(res, 200, { ok: true });
    }
    if (what === "requests" && req.method === "GET") return send(res, 200, { requests: cdb.requests });
    if (what === "claims" && req.method === "GET") return send(res, 200, { claims: cdb.claims });
    if (what === "claims" && req.method === "POST" && seg[3]) {
      return body(b => {
        const cl = cdb.claims.find(x => x.id === seg[3]);
        if (!cl) return send(res, 404, { error: "not found" });
        cl.status = b.decision === "approve" ? "approved" : "rejected"; cl.decided = Date.now();
        const p = (cdb.profiles[cl.circle] || {})[cl.email];
        if (p) { p.claim = { record: cl.record, status: cl.status }; if (cl.status === "approved") p.linked = cl.record; }
        saveC();
        return send(res, 200, { claim: cl });
      });
    }
    if (what === "members" && req.method === "GET") return send(res, 200, { members: cdb.members });
    if (what === "feedback" && req.method === "GET") return send(res, 200, { feedback: cdb.feedback });
    if (what === "stats" && req.method === "GET") {
      const by = {};
      if (fs.existsSync(EVENTS_F)) for (const line of fs.readFileSync(EVENTS_F, "utf8").split("\n")) {
        if (!line) continue;
        try { const ev = JSON.parse(line); (by[ev.e] = by[ev.e] || { count: 0, users: new Set() }).count++; by[ev.e].users.add(ev.u); } catch (e) {}
      }
      const out = {}; for (const k of Object.keys(by)) out[k] = { count: by[k].count, users: by[k].users.size };
      return send(res, 200, { events: out, mail: mailStatus() });
    }
    return send(res, 404, { error: "not found" });
  }

  const pf = path.join(UDIR, a.user.id + ".json");
  if (url === "/api/logout" && req.method === "POST") {
    delete tokens[a.token]; saveTokens();
    return send(res, 200, { ok: true });
  }
  if (url === "/api/personal" && req.method === "GET") {
    if (!fs.existsSync(pf)) return send(res, 200, { data: null });
    return send(res, 200, { data: JSON.parse(fs.readFileSync(pf, "utf8")) });
  }
  if (url === "/api/personal" && req.method === "PUT") {
    return body(b => {
      if (typeof b.data !== "object") return send(res, 400, { error: "bad request" });
      fs.writeFileSync(pf, JSON.stringify(b.data));
      return send(res, 200, { ok: true, at: Date.now() });
    });
  }
  if (url === "/api/personal" && req.method === "DELETE") {
    if (fs.existsSync(pf)) fs.unlinkSync(pf);
    return send(res, 200, { ok: true });
  }
  send(res, 404, { error: "not found" });
}).listen(PORT, HOST, () => console.log("power api on " + HOST + ":" + PORT + " (mail: " + mailStatus() + ")"));
