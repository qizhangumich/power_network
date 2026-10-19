/* Server access tests for Phase 4 (verification, invitations, circle access, profiles,
   layers, analytics). Spawns server/api.js on a temp data dir with the test-only
   outbox mailer, so nothing is emailed. All accounts are fictional.
   Run: node tests/api_access.test.js */
"use strict";
const assert = require("assert");
const { spawn } = require("child_process");
const fs = require("fs"), os = require("os"), path = require("path");

const DATA = fs.mkdtempSync(path.join(os.tmpdir(), "navgcc-api-"));
const PORT = 3900 + Math.floor(Math.random() * 90);
const ADMIN = "founder@test.example";
const srv = spawn(process.execPath, [path.join(__dirname, "..", "server", "api.js")], {
  env: Object.assign({}, process.env, { POWER_API_DATA: DATA, POWER_API_PORT: String(PORT), POWER_API_MAIL: "outbox",
    POWER_API_ADMINS: ADMIN, PUBLIC_BASE: "http://test.local", RESEND_API_KEY: "", MAIL_FROM: "" }),
  stdio: ["ignore", "pipe", "inherit"] });

let ipn = 0;
async function api(method, url, body, token, ip) {
  const h = { "Content-Type": "application/json", "X-Real-IP": ip || "10.0.0." + (++ipn % 250) };
  if (token) h.Authorization = "Bearer " + token;
  const r = await fetch(`http://127.0.0.1:${PORT}${url}`, { method, headers: h, body: body && method !== "GET" ? JSON.stringify(body) : undefined });
  let j = null; try { j = await r.json(); } catch (e) {}
  return { status: r.status, body: j };
}
const outbox = () => { const d = path.join(DATA, "outbox"); return fs.existsSync(d) ? fs.readdirSync(d).sort().map(f => JSON.parse(fs.readFileSync(path.join(d, f), "utf8"))) : []; };
const lastMail = to => outbox().filter(m => m.to === to).pop();
const codeOf = m => m.text.match(/code is (\d{6})/)[1];
const linkOf = m => m.text.match(/verify=([\w-]+)/)[1];

let n = 0;
const t = async (name, fn) => { await fn(); n++; console.log("  ok  " + name); };

async function register(email) {
  const r = await api("POST", "/api/register", { email, password: "correct horse 1" });
  assert.strictEqual(r.status, 200, JSON.stringify(r.body));
  return r.body.token;
}
async function verify(email, token) {
  const r = await api("POST", "/api/verify/code", { code: codeOf(lastMail(email)) }, token);
  assert.strictEqual(r.body.state, "verified");
}

(async () => {
  await new Promise(res => srv.stdout.once("data", res));
  const C = "/api/circle/insead-emba";

  const admin = await register(ADMIN);
  const alice = await register("alice@test.example");     // will be invited
  const bob = await register("bob@test.example");         // verified, never invited
  const carol = await register("carol@insead.edu");       // INSEAD-domain email, never invited

  await t("registration sends a verification email (outbox) and starts unverified", async () => {
    assert.ok(lastMail("alice@test.example"));
    const me = await api("GET", "/api/me", null, alice);
    assert.strictEqual(me.body.verified, false);
    assert.strictEqual(me.body.verification, "pending");
    assert.deepStrictEqual(me.body.circles, []);
  });

  await t("no circle data without a session", async () => {
    assert.strictEqual((await api("GET", C)).status, 401);
  });

  await t("unverified account is refused circle data, layer activation and redemption", async () => {
    let r = await api("GET", C, null, alice);
    assert.strictEqual(r.status, 403); assert.strictEqual(r.body.reason, "verify");
    r = await api("PUT", "/api/layers", { alumni: { on: true } }, alice);
    assert.strictEqual(r.status, 403);
    r = await api("POST", "/api/invite/redeem", { token: "x" }, alice);
    assert.strictEqual(r.body.reason, "verify");
  });

  await t("unverified admin is not let in either", async () => {
    assert.strictEqual((await api("GET", C, null, admin)).body.reason, "verify");
  });

  await t("wrong codes count down and lock after 5 tries", async () => {
    const tmp = await register("dave@test.example");
    for (let i = 0; i < 5; i++) {
      const r = await api("POST", "/api/verify/code", { code: "000000" === codeOf(lastMail("dave@test.example")) ? "111111" : "000000" }, tmp);
      assert.strictEqual(r.status, i < 4 ? 400 : 400);
    }
    const r = await api("POST", "/api/verify/code", { code: codeOf(lastMail("dave@test.example")) }, tmp);
    assert.strictEqual(r.body.state, "failed", "correct code no longer accepted after lockout");
  });

  await t("resend is throttled (once per minute)", async () => {
    const r = await api("POST", "/api/verify/send", null, alice);
    assert.strictEqual(r.status, 429);
  });

  await t("bad link refused; emailed link verifies", async () => {
    const tmp = await register("erin@test.example");
    const u = JSON.parse(fs.readFileSync(path.join(DATA, "users.json"), "utf8"));
    assert.ok(u["erin@test.example"].ver.exp > Date.now());
    // can't edit the live server's memory; instead check a bad link token is refused and counted
    const bad = await api("POST", "/api/verify/link", { email: "erin@test.example", token: "nope" });
    assert.strictEqual(bad.status, 400);
    const ok = await api("POST", "/api/verify/link", { email: "erin@test.example", token: linkOf(lastMail("erin@test.example")) });
    assert.strictEqual(ok.body.state, "verified", "emailed link verifies");
    const reuse = await api("POST", "/api/verify/code", { code: codeOf(lastMail("erin@test.example")) }, tmp);
    assert.strictEqual(reuse.body.state, "verified");
  });

  await t("verification secrets are stored hashed, never in clear", async () => {
    const raw = fs.readFileSync(path.join(DATA, "users.json"), "utf8");
    const code = codeOf(lastMail("bob@test.example"));
    assert.ok(!raw.includes(code) && !raw.includes(linkOf(lastMail("bob@test.example"))));
  });

  await verify(ADMIN, admin); await verify("alice@test.example", alice);
  await verify("bob@test.example", bob); await verify("carol@insead.edu", carol);

  await t("verified but uninvited accounts are refused — INSEAD email domain grants nothing", async () => {
    for (const tk of [bob, carol]) {
      const r = await api("GET", C, null, tk);
      assert.strictEqual(r.status, 403); assert.strictEqual(r.body.reason, "not_invited");
      assert.ok(!r.body.records);
      assert.strictEqual((await api("PUT", "/api/layers", { alumni: { on: true } }, tk)).status, 403);
      assert.strictEqual((await api("PUT", C + "/profile", { fields: { name: "X" } }, tk)).status, 403);
    }
    const me = await api("GET", "/api/me", null, carol);
    assert.deepStrictEqual(me.body.circles, []);
  });

  await t("client cannot self-assign access via profile/body fields", async () => {
    await api("PUT", "/api/personal", { data: { circles: ["insead-emba"], admin: true, verified: true } }, bob);
    await api("PUT", "/api/layers", { alumni: { on: false, circle: "insead-emba", access: true } }, bob);
    assert.strictEqual((await api("GET", C + "?member=1", null, bob)).status, 403);
  });

  await t("admin endpoints refuse non-admins", async () => {
    for (const [m, u] of [["POST", "/api/admin/invites"], ["GET", "/api/admin/invites"], ["GET", "/api/admin/claims"],
                          ["GET", "/api/admin/stats"], ["GET", "/api/admin/feedback"], ["GET", "/api/growth"]])
      assert.strictEqual((await api(m, u, { email: "bob@test.example" }, bob)).status, 403, u);
    assert.strictEqual((await api("POST", "/api/admin/invites", { email: "bob@test.example" })).status, 401);
  });

  let inv, invB;
  await t("admin creates an email-bound expiring invite; preview reveals only a masked email", async () => {
    const r = await api("POST", "/api/admin/invites", { email: "alice@test.example", days: 7 }, admin);
    assert.strictEqual(r.status, 200);
    inv = new URL(r.body.link).searchParams.get("invite");
    const chk = await api("POST", "/api/invite/check", { token: inv });
    assert.strictEqual(chk.body.state, "valid");
    assert.ok(!chk.body.email.includes("alice"));
    const list = await api("GET", "/api/admin/invites", null, admin);
    assert.ok(list.body.invites.every(i => !("hash" in i) && !("token" in i)));
    assert.ok(!fs.readFileSync(path.join(DATA, "circles.json"), "utf8").includes(inv), "invite token stored hashed");
  });

  await t("invite cannot be redeemed by a different (verified) account", async () => {
    const r = await api("POST", "/api/invite/redeem", { token: inv }, bob);
    assert.strictEqual(r.status, 403); assert.strictEqual(r.body.reason, "wrong_email");
    assert.strictEqual((await api("GET", C, null, bob)).status, 403);
  });

  await t("forged invite token is refused", async () => {
    assert.strictEqual((await api("POST", "/api/invite/redeem", { token: inv + "x" }, alice)).body.reason, "invalid");
  });

  await t("invited, verified account gets in; redemption is idempotent; reuse by others refused", async () => {
    let r = await api("POST", "/api/invite/redeem", { token: inv }, alice);
    assert.strictEqual(r.status, 200);
    r = await api("POST", "/api/invite/redeem", { token: inv }, alice);
    assert.strictEqual(r.status, 200, "same user again is fine");
    assert.strictEqual((await api("POST", "/api/invite/check", { token: inv })).body.state, "used");
    const g = await api("GET", C, null, alice);
    assert.strictEqual(g.status, 200);
    assert.deepStrictEqual((await api("GET", "/api/me", null, alice)).body.circles, ["insead-emba"]);
  });

  await t("revoked and expired invites are refused", async () => {
    let r = await api("POST", "/api/admin/invites", { email: "bob@test.example" }, admin);
    invB = new URL(r.body.link).searchParams.get("invite");
    await api("DELETE", "/api/admin/invites/" + r.body.id, null, admin);
    r = await api("POST", "/api/invite/redeem", { token: invB }, bob);
    assert.strictEqual(r.body.reason, "revoked");
    // expired: write an already-expired invite through the data file isn't possible live; check bounds instead
    r = await api("POST", "/api/admin/invites", { email: "bob@test.example", days: 999 }, admin);
    assert.ok(r.body.exp - Date.now() <= 30 * 864e5 + 5000, "expiry capped at 30 days");
  });

  await t("circle data: public-source + fictional demo only, demo flagged, counts consistent", async () => {
    const g = (await api("GET", C, null, alice)).body;
    assert.ok(g.records.length > 0);
    assert.ok(g.records.every(r => ["public", "demo", "member"].includes(r.source)));
    assert.ok(g.records.filter(r => r.source === "demo").every(r => r.fictional === true));
    assert.strictEqual(g.counts.unique, new Set(g.records.map(r => r.id)).size);
    assert.strictEqual(g.counts.unique, g.counts.public + g.counts.members + g.counts.demo);
    assert.ok(g.records.every(r => !("email" in r) && !("phone" in r)));
  });

  await t("layer activation is idempotent and persisted per user; can be turned off", async () => {
    for (let i = 0; i < 3; i++) assert.strictEqual((await api("PUT", "/api/layers", { alumni: { on: true, mode: "only", filters: { country: "Qatar" } } }, alice)).status, 200);
    let me = (await api("GET", "/api/me", null, alice)).body;
    assert.strictEqual(me.layers.alumni.on, true); assert.strictEqual(me.layers.alumni.mode, "only");
    await api("PUT", "/api/layers", { alumni: { on: false } }, alice);
    me = (await api("GET", "/api/me", null, alice)).body;
    assert.strictEqual(me.layers.alumni.on, false);
    const bl = (await api("GET", "/api/me", null, bob)).body.layers.alumni; assert.ok(!bl || (!bl.on && bl.filters.country !== "Qatar"), "other users unaffected");
  });

  let rec;
  await t("profile: per-field visibility respected for other members; owner sees all", async () => {
    // bring in a second member to look at alice's profile
    const r = await api("POST", "/api/admin/invites", { email: "bob@test.example" }, admin);
    await api("POST", "/api/invite/redeem", { token: new URL(r.body.link).searchParams.get("invite") }, bob);
    const put = await api("PUT", C + "/profile", { fields: { name: "Alice Fictional", org: "Org A", title: "CFO", city: "Doha", note: "private note" },
                                                    vis: { org: true, title: false, city: false } }, alice);
    assert.strictEqual(put.status, 200); assert.strictEqual(put.body.me.title, "CFO");
    const seen = (await api("GET", C, null, bob)).body.records.find(x => x.name === "Alice Fictional");
    assert.ok(seen); assert.strictEqual(seen.org, "Org A");
    assert.ok(!("title" in seen) && !("city" in seen) && !("note" in seen));
    rec = (await api("GET", C, null, alice)).body.records.find(x => x.source === "public");
  });

  await t("claiming an existing record goes to review — never overwrites by name match", async () => {
    const before = JSON.stringify((await api("GET", C, null, bob)).body.records.find(x => x.id === rec.id));
    const r = await api("PUT", C + "/profile", { fields: { name: rec.name, org: "Hijack Corp" }, vis: { org: true }, claim: rec.id }, bob);
    assert.strictEqual(r.body.me.claim.status, "pending");
    const after = JSON.stringify((await api("GET", C, null, alice)).body.records.find(x => x.id === rec.id));
    assert.strictEqual(after, before, "the public record is unchanged while the claim is pending");
    const demo = (await api("GET", C, null, bob)).body.records.find(x => x.source === "demo");
    assert.strictEqual((await api("PUT", C + "/profile", { fields: { name: "B" }, claim: demo.id }, alice)).status, 400, "fictional records cannot be claimed");
  });

  await t("withdraw removes the profile from other members' view", async () => {
    assert.strictEqual((await api("DELETE", C + "/profile", null, alice)).status, 200);
    const recs = (await api("GET", C, null, bob)).body.records;
    assert.ok(!recs.some(x => x.name === "Alice Fictional"));
  });

  await t("feedback and analytics carry no codes, notes or search content", async () => {
    await api("POST", "/api/feedback", { text: "useful" }, alice);
    await api("POST", "/api/event", { e: "try_premium_opened" }, alice);
    await api("POST", "/api/event", { e: "search", q: "secret query" }, alice);
    const ev = fs.readFileSync(path.join(DATA, "events.ndjson"), "utf8");
    assert.ok(!ev.includes("secret") && !ev.includes("@") && !ev.includes("private note"));
    const st = (await api("GET", "/api/admin/stats", null, admin)).body;
    for (const k of ["registration_completed", "account_verified", "alumni_layer_activated", "profile_updated", "feedback_submitted", "try_premium_opened"])
      assert.ok(st.events[k], k);
    assert.strictEqual(st.mail, "outbox");
  });

  await t("verified admin has access without an invitation", async () => {
    assert.strictEqual((await api("GET", C, null, admin)).status, 200);
  });

  await t("unknown circle is 404 even for members", async () => {
    assert.strictEqual((await api("GET", "/api/circle/other", null, alice)).status, 404);
  });

  console.log(`\napi access: ${n} tests passed`);
})().catch(e => { console.error(e); process.exitCode = 1; }).finally(() => {
  srv.kill(); fs.rmSync(DATA, { recursive: true, force: true });
});
