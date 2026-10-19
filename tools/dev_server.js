/* Local preview: serves the repo as static files and runs server/api.js on a throwaway
   data dir with the test-only outbox mailer (verification emails land in
   <data>/outbox as JSON, nothing is sent). Never point this at production data.
   Run: node tools/dev_server.js   → http://localhost:8080 */
"use strict";
const http = require("http"), fs = require("fs"), path = require("path"), os = require("os");
const { spawn } = require("child_process");
const ROOT = path.join(__dirname, "..");
const PORT = +(process.env.PORT || 8080), API = 3199;
const DATA = process.env.POWER_API_DATA || path.join(os.tmpdir(), "navgcc-dev-data");
fs.mkdirSync(DATA, { recursive: true });
const api = spawn(process.execPath, [path.join(ROOT, "server", "api.js")], { stdio: "inherit",
  env: Object.assign({}, process.env, { POWER_API_PORT: String(API), POWER_API_DATA: DATA, POWER_API_MAIL: "outbox",
    PUBLIC_BASE: "http://localhost:" + PORT, RESEND_API_KEY: "", POWER_API_ADMINS: process.env.POWER_API_ADMINS || "admin@dev.test" }) });
process.on("exit", () => api.kill());
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
                ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
const BLOCK = /(^|\/)(\.git|server|my_network\.js|Connections\.csv|deploy_key)/;
http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    const p = http.request({ host: "127.0.0.1", port: API, path: req.url, method: req.method,
      headers: Object.assign({}, req.headers, { "x-real-ip": "127.0.0.1" }) }, r => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    p.on("error", () => { res.writeHead(502); res.end("api down"); });
    return req.pipe(p);
  }
  let u = decodeURIComponent(req.url.split("?")[0]);
  if (BLOCK.test(u)) { res.writeHead(404); return res.end(); }
  let f = path.join(ROOT, u);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("not found"); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`dev: http://localhost:${PORT}  (api data: ${DATA}, mail: outbox)`));
