/* Real numbers for the product images: counts straight from each market's data files.
   Run: node promo/stats.js  → promo/build/stats.json */
const fs = require("fs"), path = require("path"), vm = require("vm");
const ROOT = path.join(__dirname, "..");
const REG = {abudhabi: "", dubai: "dubai", northern: "northern", saudi: "saudi", qatar: "qatar", bahrain: "bahrain", oman: "oman", kuwait: "kuwait"};
const load = f => { const ctx = {window: {}}; vm.runInNewContext(fs.readFileSync(f, "utf8").replace(/^const /gm, "var "), ctx); return ctx; };
const out = {regions: {}, people: 0, orgs: 0, links: 0, news: 0};
for (const [r, d] of Object.entries(REG)) {
  const c = load(path.join(ROOT, d, "network_data.js"));
  const P = c.PEOPLE || [], I = c.INSTITUTIONS || [];
  const links = P.reduce((s, p) => s + (p.roles || []).length, 0) + (c.FAMILY || []).length + (c.OWNERSHIP || []).length;
  let news = 0;
  const nf = path.join(ROOT, d, "news_data.js");
  if (fs.existsSync(nf)) { try { const n = load(nf); const N = n.window.NEWS_ITEMS || []; news = N.length; } catch (e) {} }
  out.regions[r] = {people: P.length, orgs: I.length, links, news};
  out.people += P.length; out.orgs += I.length; out.links += links; out.news += news;
}
const prov = fs.readFileSync(path.join(ROOT, "data", "provenance.csv"), "utf8").trim().split("\n").slice(1).map(l => l.split(","));
const day = s => new Date(s + "T00:00:00Z").getTime(), now = day("2026-10-31");
out.added7 = prov.filter(r => now - day(r[0]) <= 7 * 864e5).length;
out.added30 = prov.filter(r => now - day(r[0]) <= 30 * 864e5).length;
out.added7p = prov.filter(r => now - day(r[0]) <= 7 * 864e5 && r[3] === "person").length;
out.added7i = prov.filter(r => now - day(r[0]) <= 7 * 864e5 && r[3] === "institution").length;
const src = fs.readFileSync(path.join(ROOT, "data", "sources.csv"), "utf8").trim().split("\n");
out.sources = src.length - 1;
fs.mkdirSync(path.join(__dirname, "build"), {recursive: true});
fs.writeFileSync(path.join(__dirname, "build", "stats.json"), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
