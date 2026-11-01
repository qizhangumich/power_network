/* Phase 6 AI endpoints (meeting notes, follow-up email, business card, transcription).
   Spawns server/api.js with POWER_API_AI=stub — no network calls, no cost. All data fictional.
   Run: node tests/ai_api.test.js */
"use strict";
const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");

const DATA = fs.mkdtempSync(path.join(os.tmpdir(), "navgcc-ai-"));
const PORT = 3990 + Math.floor(Math.random() * 9);
const srv = spawn(process.execPath, [path.join(__dirname, "..", "server", "api.js")], {
  env: Object.assign({}, process.env, { POWER_API_DATA: DATA, POWER_API_PORT: String(PORT), POWER_API_MAIL: "outbox",
    POWER_API_AI: "stub", POWER_API_AI_DAILY: "12", ANTHROPIC_API_KEY: "", RESEND_API_KEY: "", MAIL_FROM: "" }),
  stdio: ["ignore", "pipe", "inherit"] });

let ipn = 0;
async function call(method, url, body, token, type) {
  const h = { "X-Real-IP": "10.1.0." + (++ipn % 250) };
  if (token) h.Authorization = "Bearer " + token;
  let payload;
  if (Buffer.isBuffer(body)) { payload = body; h["Content-Type"] = type || "audio/webm"; }
  else if (body) { payload = JSON.stringify(body); h["Content-Type"] = "application/json"; }
  const r = await fetch(`http://127.0.0.1:${PORT}${url}`, { method, headers: h, body: payload });
  let j = null; try { j = await r.json(); } catch (e) {}
  return { status: r.status, body: j };
}
const code = to => {
  const d = path.join(DATA, "outbox");
  const m = fs.readdirSync(d).sort().map(f => JSON.parse(fs.readFileSync(path.join(d, f), "utf8"))).filter(x => x.to === to).pop();
  return m.text.match(/code is (\d{6})/)[1];
};
let n = 0;
const t = async (name, fn) => { await fn(); n++; console.log("  ok  " + name); };

(async () => {
  await new Promise(res => srv.stdout.once("data", res));
  const reg = async e => (await call("POST", "/api/register", { email: e, password: "correct horse 1" })).body.token;
  const user = await reg("notes@test.example");
  const raw = await reg("unverified@test.example");
  await call("POST", "/api/verify/code", { code: code("notes@test.example") }, user);
  const NOTE = { transcript: "We agreed I will send the deck to Layla by Friday and meet again next month." };

  await t("status is public and says what is configured", async () => {
    const s = (await call("GET", "/api/ai/status")).body;
    assert.strictEqual(s.notes, true); assert.strictEqual(s.card, true); assert.strictEqual(s.transcribe, true);
    assert.strictEqual(s.signedIn, false);
  });

  await t("signed-out and unverified accounts are refused", async () => {
    for (const ep of ["notes", "email", "card"]) assert.strictEqual((await call("POST", "/api/ai/" + ep, NOTE)).status, 401, ep);
    assert.strictEqual((await call("POST", "/api/ai/transcribe", Buffer.alloc(2000))).status, 401);
    const r = await call("POST", "/api/ai/notes", NOTE, raw);
    assert.strictEqual(r.status, 403); assert.strictEqual(r.body.reason, "verify");
  });

  await t("notes: structured summary, points, next steps with owner and due", async () => {
    const r = await call("POST", "/api/ai/notes", Object.assign({ people: ["Layla Example"], date: "2026-11-01" }, NOTE), user);
    assert.strictEqual(r.status, 200);
    assert.ok(r.body.summary && Array.isArray(r.body.key_points) && Array.isArray(r.body.next_steps));
    assert.deepStrictEqual(Object.keys(r.body.next_steps[0]).sort(), ["due", "owner", "text"]);
    assert.strictEqual((await call("POST", "/api/ai/notes", { transcript: "hi" }, user)).status, 400, "too short");
  });

  await t("follow-up email draft needs note content", async () => {
    const ok = await call("POST", "/api/ai/email", { note: { summary: "Agreed next steps", next_steps: [{ text: "Send deck", owner: "me", due: "Fri" }] },
                                                      to: { name: "Layla Example" } }, user);
    assert.strictEqual(ok.status, 200); assert.ok(ok.body.subject && ok.body.body);
    assert.strictEqual((await call("POST", "/api/ai/email", { note: {} }, user)).status, 400);
  });

  await t("card: only real images are accepted", async () => {
    const img = Buffer.alloc(3000, 7).toString("base64");
    const ok = await call("POST", "/api/ai/card", { image: img, media_type: "image/jpeg" }, user);
    assert.strictEqual(ok.status, 200);
    for (const k of ["name", "name_ar", "title", "company", "email", "phone", "mobile", "website", "address"]) assert.ok(k in ok.body, k);
    assert.strictEqual((await call("POST", "/api/ai/card", { image: img, media_type: "application/pdf" }, user)).status, 415);
    assert.strictEqual((await call("POST", "/api/ai/card", { image: "not base64!", media_type: "image/png" }, user)).status, 400);
  });

  await t("transcription: audio only, empty refused, oversize refused", async () => {
    assert.strictEqual((await call("POST", "/api/ai/transcribe", Buffer.alloc(5000, 1), user, "audio/webm")).status, 200);
    assert.strictEqual((await call("POST", "/api/ai/transcribe", Buffer.alloc(5000, 1), user, "text/plain")).status, 415);
    assert.strictEqual((await call("POST", "/api/ai/transcribe", Buffer.alloc(100), user, "audio/webm")).status, 400);
  });

  await t("daily AI limit protects cost", async () => {
    let last;
    for (let i = 0; i < 8; i++) last = await call("POST", "/api/ai/notes", NOTE, user);
    assert.strictEqual(last.status, 429);
  });

  await t("nothing from the requests is written to disk", async () => {
    const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
    const all = walk(DATA).filter(f => !f.includes("outbox")).map(f => fs.readFileSync(f, "utf8")).join("\n");
    assert.ok(!all.includes("deck to Layla") && !all.includes("Layla Example"));
  });

  console.log(`\nai api: ${n} tests passed`);
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => { srv.kill(); fs.rmSync(DATA, { recursive: true, force: true }); });
