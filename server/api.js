/* Personal-account API for power.tianrenyuan.com (Phase 2A accounts).
   No npm dependencies — Node built-ins only. Run behind nginx:
     location /api/ { proxy_pass http://127.0.0.1:3100; }
   Data lives OUTSIDE the git repo (POWER_API_DATA, default /var/lib/power_api)
   so deploys never touch user data. Each user's personal network payload is
   an opaque JSON blob private to that account. */
"use strict";
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PORT = 3100;
const DATA = process.env.POWER_API_DATA || "/var/lib/power_api";
const UDIR = path.join(DATA, "users");
fs.mkdirSync(UDIR, { recursive: true });

const USERS_F = path.join(DATA, "users.json");
const TOKENS_F = path.join(DATA, "tokens.json");
let users = fs.existsSync(USERS_F) ? JSON.parse(fs.readFileSync(USERS_F, "utf8")) : {};
let tokens = fs.existsSync(TOKENS_F) ? JSON.parse(fs.readFileSync(TOKENS_F, "utf8")) : {};
const saveUsers = () => fs.writeFileSync(USERS_F, JSON.stringify(users));
const saveTokens = () => fs.writeFileSync(TOKENS_F, JSON.stringify(tokens));

const TOKEN_DAYS = 60;
const MAX_BODY = 3 * 1024 * 1024;

function hashPw(pw, salt) {
  return crypto.scryptSync(pw, salt, 64).toString("hex");
}
function newToken(email) {
  const tk = crypto.randomBytes(32).toString("hex");
  tokens[tk] = { email, exp: Date.now() + TOKEN_DAYS * 864e5 };
  // prune expired
  for (const k of Object.keys(tokens)) if (tokens[k].exp < Date.now()) delete tokens[k];
  saveTokens();
  return tk;
}
function authed(req) {
  const h = req.headers.authorization || "";
  const tk = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!tk || !tokens[tk] || tokens[tk].exp < Date.now()) return null;
  return { token: tk, email: tokens[tk].email, user: users[tokens[tk].email] };
}

/* naive per-IP rate limit for auth endpoints */
const hits = {};
function limited(ip) {
  const now = Date.now();
  const h = hits[ip] = (hits[ip] && hits[ip].reset > now) ? hits[ip] : { n: 0, reset: now + 600000 };
  h.n++;
  return h.n > 30;
}

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8",
                        "Cache-Control": "no-store" });
  res.end(body);
}
function readBody(req, cb) {
  let buf = "";
  let dead = false;
  req.on("data", d => {
    buf += d;
    if (buf.length > MAX_BODY && !dead) { dead = true; req.destroy(); }
  });
  req.on("end", () => {
    if (dead) return;
    try { cb(JSON.parse(buf || "{}")); } catch (e) { cb(null); }
  });
}

http.createServer((req, res) => {
  const ip = req.headers["x-real-ip"] || req.socket.remoteAddress || "?";
  const url = (req.url || "").split("?")[0];

  if (req.method === "POST" && (url === "/api/register" || url === "/api/login")) {
    if (limited(ip)) return send(res, 429, { error: "too many attempts, try later" });
    return readBody(req, b => {
      if (!b) return send(res, 400, { error: "bad request" });
      const email = String(b.email || "").trim().toLowerCase();
      const pw = String(b.password || "");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return send(res, 400, { error: "invalid email" });
      if (url === "/api/register") {
        if (pw.length < 8) return send(res, 400, { error: "password must be at least 8 characters" });
        if (users[email]) return send(res, 409, { error: "account exists — sign in instead" });
        const salt = crypto.randomBytes(16).toString("hex");
        users[email] = { id: crypto.randomBytes(8).toString("hex"), salt,
                         hash: hashPw(pw, salt), created: Date.now() };
        saveUsers();
        return send(res, 200, { token: newToken(email), email });
      }
      const u = users[email];
      if (!u) return send(res, 401, { error: "no such account" });
      const ok = crypto.timingSafeEqual(Buffer.from(hashPw(pw, u.salt)), Buffer.from(u.hash));
      if (!ok) return send(res, 401, { error: "wrong password" });
      return send(res, 200, { token: newToken(email), email });
    });
  }

  const a = authed(req);
  if (url === "/api/me" && req.method === "GET") {
    return a ? send(res, 200, { email: a.email }) : send(res, 401, { error: "not signed in" });
  }
  if (!a) return send(res, 401, { error: "not signed in" });

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
    return readBody(req, b => {
      if (!b || typeof b.data !== "object") return send(res, 400, { error: "bad request" });
      fs.writeFileSync(pf, JSON.stringify(b.data));
      return send(res, 200, { ok: true, at: Date.now() });
    });
  }
  if (url === "/api/personal" && req.method === "DELETE") {
    if (fs.existsSync(pf)) fs.unlinkSync(pf);
    return send(res, 200, { ok: true });
  }
  send(res, 404, { error: "not found" });
}).listen(PORT, "127.0.0.1", () => console.log("power api on :" + PORT));
