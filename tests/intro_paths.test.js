/* Fixture tests for intro_paths.js (Phase 4 §10). All people/orgs are fictional.
   Run: node tests/intro_paths.test.js */
"use strict";
const assert = require("assert");
const IP = require("../intro_paths.js");

const R = (org, title, type, extra) => Object.assign({org, title, type: type || "executive", v: "v", former: false}, extra || {});
function fixture(){
  const people = {
    b: {name: "Bea Fictional",  roles: [R("orgX", "Head of Strategy")]},
    c: {name: "Cal Fictional",  roles: [R("orgX", "CFO")]},
    d: {name: "Dana Fictional", roles: [R("orgY", "CEO")]},
    e: {name: "Eli Fictional",  roles: [R("orgZ", "Director")]},
    f: {name: "Fay Fictional",  roles: [R("orgW", "Partner")]},
    g: {name: "Gus Fictional",  roles: [R("orgV", "Advisor")]},
    h: {name: "Hal Fictional",  roles: [R("orgY", "Analyst"), R("orgZ", "Associate")]},
    old: {name: "Ola Fictional", roles: [R("orgY", "Former COO (2010–2015)", "executive", {former: true})]},
    s1: {name: "Sam Fictional", roles: [R("ins", "EMBA", "alumni")]},
    s2: {name: "Sue Fictional", roles: [R("ins", "EMBA", "alumni")]},
    lone: {name: "Lone Fictional", roles: []},
    x: {name: "Xan Fictional",  roles: [R("orgY", "Engineer")]},
  };
  const orgs = {orgX: {name: "Org X"}, orgY: {name: "Org Y"}, orgZ: {name: "Org Z"}, orgW: {name: "Org W"},
                orgV: {name: "Org V"}, ins: {name: "School S"}};
  const family = [["c", "d", "sibling", "v"], ["f", "g", "spouse", "v"], ["g", "d", "cousin", "v"]];
  return IP.build({people, orgs, family, prov: {c: ["official", "orgx.example", "https://orgx.example/team"]}});
}
let n = 0;
const t = (name, fn) => { fn(); n++; console.log("  ok  " + name); };

t("Me → B → C → D ends at the person, organization stays context", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "d", starts: [{pid: "b", conf: "me", s: "strong"}]});
  assert.strictEqual(r.status, "ok");
  const p = r.paths[0];
  assert.deepStrictEqual(p.people.map(x => x.id), ["__me", "b", "c", "d"]);
  assert.strictEqual(p.people[p.people.length - 1].id, "d");
  assert.ok(p.people.every(x => !x.id.startsWith("org")), "no organization in the human chain");
  assert.deepStrictEqual(p.links[1].orgNames, ["Org X"], "org is evidence on the B–C link");
});

t("same-company-only B–C link stays visibly unconfirmed", () => {
  const ix = fixture();
  const p = IP.find(ix, {target: "d", starts: [{pid: "b", conf: "me", s: "strong"}]}).paths[0];
  assert.strictEqual(p.links[1].type, "colleague");
  assert.notStrictEqual(p.links[1].status, "confirmed");
  assert.strictEqual(p.links[1].gap, "colleague");
  assert.notStrictEqual(p.label, "better");
});

t("longer confirmed route outranks a shorter inferred one", () => {
  const ix = fixture();
  /* short: Me → X → D, 2 links, the X–D link only "same employer" (inferred)
     long : Me → F → G → D, 3 links, both onward links public family records (confirmed) */
  const r = IP.find(ix, {target: "d", starts: [{pid: "x", conf: "me", s: "strong"}, {pid: "f", conf: "me", s: "strong"}]});
  assert.strictEqual(r.status, "ok");
  const best = r.paths[0];
  assert.deepStrictEqual(best.people.map(x => x.id), ["__me", "f", "g", "d"]);
  assert.strictEqual(best.label, "better");
  const short = r.paths.find(p => p.first === "x");
  assert.ok(short, "the shorter route is still offered");
  assert.strictEqual(short.linkCount, 2);
  assert.ok(short.linkCount < best.linkCount && short.label !== "better", "shorter but speculative ranks below");
});

t("multiple distinct routes when supported, fewer when not", () => {
  const ix = fixture();
  const many = IP.find(ix, {target: "d", starts: [{pid: "b", conf: "me"}, {pid: "e", conf: "me"}, {pid: "f", conf: "me"}]});
  assert.strictEqual(many.paths.length, 3);
  assert.strictEqual(new Set(many.paths.map(p => p.first)).size, 3, "different first contacts");
  const one = IP.find(ix, {target: "d", starts: [{pid: "f", conf: "me"}]});
  assert.ok(one.paths.length >= 1 && one.paths.length <= 3);
  one.paths.forEach(p => assert.strictEqual(new Set(p.people.map(x => x.id)).size, p.people.length, "no cycles"));
});

t("no fabricated probabilities: output carries labels, not success odds", () => {
  const ix = fixture();
  const p = IP.find(ix, {target: "d", starts: [{pid: "b", conf: "me"}]}).paths[0];
  assert.ok(["better", "verify", "exploratory"].includes(p.label));
  assert.ok(!("probability" in p) && !("successRate" in p));
});

t("organization target asks for a person first", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "orgY", targetKind: "inst", starts: [{pid: "b", conf: "me"}]});
  assert.strictEqual(r.status, "needPerson");
  assert.ok(r.candidates.some(c => c.id === "d"));
  assert.ok(!r.candidates.some(c => c.id === "old"), "former staff are not offered as current people");
});

t("historical employment does not create links", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "old", starts: [{pid: "h", conf: "me"}]});
  assert.notStrictEqual(r.status, "ok");
  assert.ok(r.notes.some(x => x.code === "targetHistorical"));
  assert.ok(r.reasons.some(x => x.code === "onlyHistorical"));
});

t("no route: explains the missing information", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "lone", starts: [{pid: "b", conf: "me"}]});
  assert.strictEqual(r.status, "none");
  assert.ok(r.reasons.some(x => x.code === "noRoles"));
});

t("no starting contact: discovery only, no chain", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "d", starts: []});
  assert.strictEqual(r.status, "noStart");
  assert.ok(Array.isArray(r.discovery) && !r.paths);
});

t("shared school alone is labeled, never treated as acquaintance", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "s2", starts: [{pid: "s1", conf: "me"}]});
  assert.strictEqual(r.paths[0].links[1].type, "alumni");
  assert.strictEqual(r.paths[0].label, "exploratory");
});

t("private evidence changes ranking for this user only", () => {
  const ix = fixture();
  const starts = [{pid: "b", conf: "me", s: "strong"}];
  const before = IP.find(ix, {target: "d", starts}).paths[0];
  const confirmed = {links: {[IP.pairKey("b", "c")]: {status: "confirmed"}}};
  const after = IP.find(ix, {target: "d", starts, evidence: confirmed}).paths[0];
  assert.strictEqual(after.links[1].type, "known");
  assert.strictEqual(after.label, "better");
  assert.ok(after.cost < before.cost);
  const rejected = {links: {[IP.pairKey("b", "c")]: {status: "rejected"}}};
  const r3 = IP.find(ix, {target: "d", starts, evidence: rejected});
  assert.ok(r3.status !== "ok" || !r3.paths.some(p => p.people.map(x => x.id).join() === "__me,b,c,d"));
  // a fresh index (another user) still sees only the public inference
  const other = IP.find(fixture(), {target: "d", starts}).paths[0];
  assert.strictEqual(other.links[1].type, "colleague");
});

t("unwilling intermediary is deprioritized, willingness stays separate from existence", () => {
  const ix = fixture();
  const starts = [{pid: "b", conf: "me"}, {pid: "f", conf: "me"}];
  const ev = {willing: {g: "unwilling"}};
  const r = IP.find(ix, {target: "d", starts, evidence: ev});
  const viaG = r.paths.find(p => p.people.some(x => x.id === "g"));
  assert.ok(!viaG || viaG.unwilling.includes("g"));
  assert.strictEqual(r.paths[0].first, "b");
});

t("imported, unconfirmed first contact needs verification", () => {
  const ix = fixture();
  const p = IP.find(ix, {target: "d", starts: [{pid: "f", conf: "auto"}]}).paths[0];
  assert.strictEqual(p.links[0].type, "imported");
  assert.notStrictEqual(p.label, "better");
});

t("direct contact is reported as direct", () => {
  const ix = fixture();
  assert.strictEqual(IP.find(ix, {target: "d", starts: [{pid: "d", conf: "me"}]}).status, "direct");
});

t("a classmate can start a route but never counts as known", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "c", starts: [{pid: "b", conf: "alumni"}]});
  assert.strictEqual(r.status, "ok");
  assert.strictEqual(r.paths[0].links[0].type, "classmate");
  assert.strictEqual(r.paths[0].links[0].status, "verify");
  assert.strictEqual(r.paths[0].label, "exploratory");
  assert.notStrictEqual(IP.find(ix, {target: "b", starts: [{pid: "b", conf: "alumni"}]}).status, "direct");
});

t("a known contact outranks a classmate start", () => {
  const ix = fixture();
  const r = IP.find(ix, {target: "d", starts: [{pid: "b", conf: "alumni"}, {pid: "f", conf: "me", s: "strong"}]});
  assert.strictEqual(r.paths[0].first, "f");
});

console.log(`\nintro_paths: ${n} tests passed`);
