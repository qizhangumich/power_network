/* Person-to-person introduction paths (Phase 4, section 10).

   Pure module — no DOM, no network. Loaded by map_template.html (window.IntroPaths)
   and by tests/intro_paths.test.js (require). Organizations never appear in a
   chain: they are the *evidence* for a link between two people (shared current
   employer, shared board), never a stop and never the destination.

   Input data (built by the map from its graph):
     people:  {id: {name, roles:[{org, title, type, v, former}]}}
     orgs:    {id: {name, short}}
     family:  [[personA, personB, label, v]]
     prov:    {id: [kind, source, url]}           // where each record came from
   Per-user, private (never shared, never written to public data):
     starts:   [{pid, conf, s}]   conf: "me" (marked known) | "lic" (LinkedIn,
               match confirmed) | "auto" (imported, match unconfirmed); s: strength
     evidence: {links:{"a|b":{status:"confirmed"|"rejected"}},
                willing:{pid:"willing"|"unwilling"|"unknown"}}

   Ranking is explainable: each link has a cost from its evidence type, the user's
   first-hop strength, how broad a shared organization is, unconfirmed records and
   recorded willingness. Costs are internal ordering only — never shown as a
   probability of a reply or an introduction. */
(function(root){
  "use strict";

  const MAX_ORG_FOR_COLLEAGUE = 150;   // beyond this, "same employer" says nothing
  const LINK = {
    known:    {cost:1.0, status:"confirmed"},   // user-confirmed acquaintance
    linkedin: {cost:1.1, status:"confirmed"},   // user-authorized LinkedIn connection
    imported: {cost:1.7, status:"verify"},      // in an imported list, identity/relationship unconfirmed
    family:   {cost:1.0, status:"confirmed"},   // public family record
    board:    {cost:1.6, status:"inferred"},    // both currently on the same board
    colleague:{cost:2.3, status:"inferred"},    // both currently at the same organization
    alumni:   {cost:3.6, status:"verify"},      // same school — not evidence of acquaintance
  };
  const FIRST = {strong:0.4, medium:0.7, weak:1.1};

  const pairKey = (a, b) => a < b ? a + "|" + b : b + "|" + a;
  const log2 = x => Math.log(x) / Math.LN2;

  function build(data){
    const people = data.people || {}, orgs = data.orgs || {};
    const members = {};                               // org -> [{pid, role}] current, non-alumni
    const alumniOf = {};                              // school -> [pid]
    const family = {};
    Object.keys(people).forEach(pid => {
      (people[pid].roles || []).forEach(r => {
        if(r.type === "alumni"){ (alumniOf[r.org] = alumniOf[r.org] || []).push(pid); return; }
        if(r.former) return;
        (members[r.org] = members[r.org] || []).push({pid, role:r});
      });
    });
    (data.family || []).forEach(f => {
      const [a, b, label, v] = f;
      if(!people[a] || !people[b]) return;
      (family[a] = family[a] || []).push({pid:b, label, v});
      (family[b] = family[b] || []).push({pid:a, label, v});
    });
    return {people, orgs, members, alumniOf, family, prov:data.prov || {}, cache:new Map()};
  }

  /* public-record links of one person (cached); private evidence is applied later */
  function publicLinks(ix, pid){
    if(ix.cache.has(pid)) return ix.cache.get(pid);
    const out = new Map();                            // other pid -> best link
    const offer = (to, link) => {
      if(to === pid) return;
      const cur = out.get(to);
      if(!cur || link.cost < cur.cost) out.set(to, link);
    };
    (ix.family[pid] || []).forEach(f => offer(f.pid, {type:"family", cost:LINK.family.cost + (f.v === "ns" ? 0.5 : 0),
      status:f.v === "ns" ? "verify" : "confirmed", label:f.label, orgs:[]}));
    const me = ix.people[pid];
    (me.roles || []).forEach(r => {
      if(r.type === "alumni"){
        const mates = ix.alumniOf[r.org] || [];
        mates.forEach(o => offer(o, {type:"alumni", cost:LINK.alumni.cost + 0.1 * log2(2 + mates.length),
          status:"verify", orgs:[r.org], titles:[r.title]}));
        return;
      }
      if(r.former) return;                            // historical employment links nobody
      const mem = ix.members[r.org] || [];
      if(mem.length > MAX_ORG_FOR_COLLEAGUE) return;
      mem.forEach(m => {
        if(m.pid === pid) return;
        const board = r.type === "board" && m.role.type === "board";
        const base = board ? LINK.board.cost : LINK.colleague.cost + 0.25 * log2(2 + mem.length);
        const ns = (r.v === "ns" || m.role.v === "ns") ? 0.5 : 0;
        offer(m.pid, {type:board ? "board" : "colleague", cost:base + ns, status:ns ? "verify" : "inferred",
          orgs:[r.org], titles:[r.title, m.role.title], size:mem.length, ns:!!ns});
      });
    });
    ix.cache.set(pid, out);
    return out;
  }

  /* private evidence overrides public inference for this user only */
  function linksOf(ix, pid, ev){
    const base = publicLinks(ix, pid);
    const links = ev && ev.links || {};
    const out = new Map();
    base.forEach((l, o) => {
      const e = links[pairKey(pid, o)];
      if(e && e.status === "rejected") return;
      out.set(o, e && e.status === "confirmed" ? Object.assign({}, l, {type:"known", status:"confirmed",
        cost:LINK.known.cost, userConfirmed:true, publicType:l.type}) : l);
    });
    Object.keys(links).forEach(k => {                 // user-recorded acquaintances with no public link
      const e = links[k];
      if(e.status !== "confirmed") return;
      const [a, b] = k.split("|");
      const o = a === pid ? b : b === pid ? a : null;
      if(o && ix.people[o] && !out.has(o))
        out.set(o, {type:"known", status:"confirmed", cost:LINK.known.cost, userConfirmed:true, orgs:[]});
    });
    return out;
  }

  function firstLink(st){
    const conf = st.conf, s = st.s || "";
    const type = conf === "lic" ? "linkedin" : conf === "auto" ? "imported" : "known";
    let cost = FIRST[s] != null ? FIRST[s] : (type === "known" ? 0.8 : type === "linkedin" ? 0.9 : 1.6);
    const status = type === "imported" && !s ? "verify" : "confirmed";
    return {type, status, cost, strength:s, first:true, orgs:[]};
  }

  function willingAdj(ev, pid){
    const w = ev && ev.willing && ev.willing[pid];
    return w === "unwilling" ? 4 : w === "willing" ? -0.2 : 0;
  }

  /* Dijkstra outward from the target over person-person links */
  function search(ix, target, maxDepth, ev, banned){
    const dist = new Map([[target, 0]]), prev = new Map([[target, null]]), depth = new Map([[target, 0]]);
    const heap = [[0, target]];
    const pop = () => { let bi = 0; for(let i = 1; i < heap.length; i++) if(heap[i][0] < heap[bi][0]) bi = i;
                        const t = heap[bi]; heap[bi] = heap[heap.length - 1]; heap.pop(); return t; };
    let guard = 0;
    while(heap.length && guard++ < 60000){
      const [d, p] = pop();
      if(d > dist.get(p) + 1e-9) continue;
      const h = depth.get(p);
      if(h >= maxDepth) continue;
      linksOf(ix, p, ev).forEach((l, o) => {
        if(banned && banned.has(o)) return;
        const nd = d + l.cost + willingAdj(ev, o);
        if(!dist.has(o) || nd < dist.get(o) - 1e-9){ dist.set(o, nd); prev.set(o, {p, l}); depth.set(o, h + 1); heap.push([nd, o]); }
      });
    }
    return {dist, prev};
  }

  function roleLine(ix, pid){
    const r = (ix.people[pid].roles || []).find(x => !x.former && x.type !== "alumni")
           || (ix.people[pid].roles || []).find(x => x.type !== "alumni");
    return r ? {title:r.title, org:r.org, orgName:ix.orgs[r.org] ? ix.orgs[r.org].name : r.org, former:!!r.former} : null;
  }

  const YEARS = /((?:19|20)\d\d)\s*[–-]\s*((?:19|20)\d\d|present|now|[A-Z][a-z]{2} (?:19|20)\d\d)/;
  function dates(title){ const m = YEARS.exec(title || ""); return m ? m[0] : null; }

  function assemble(ix, chain, links, ev){
    const people = chain.map(pid => pid === "__me" ? {id:"__me", me:true}
      : Object.assign({id:pid, name:ix.people[pid].name}, roleLine(ix, pid) || {}));
    const L = links.map((l, i) => {
      const a = chain[i], b = chain[i + 1];
      const gap = l.status === "confirmed" ? null
        : l.type === "colleague" ? "colleague" : l.type === "board" ? "board"
        : l.type === "alumni" ? "alumni" : l.type === "imported" ? "imported" : "record";
      return Object.assign({}, l, {from:a, to:b,
        orgNames:(l.orgs || []).map(o => ix.orgs[o] ? ix.orgs[o].name : o),
        dates:(l.titles || []).map(dates).filter(Boolean),
        src:[a, b].filter(x => x !== "__me").map(x => ix.prov[x]).filter(Boolean),
        gap});
    });
    const unconfirmed = L.filter(l => l.status !== "confirmed").length;
    const hasAlumni = L.some(l => l.type === "alumni");
    let weakest = 0;
    L.forEach((l, i) => { if(l.cost > L[weakest].cost) weakest = i; });
    const label = unconfirmed === 0 ? "better"
      : (unconfirmed === 1 && !hasAlumni && L[0].status === "confirmed") ? "verify" : "exploratory";
    const intermediaries = chain.length - 2;
    const unwilling = chain.slice(1, -1).filter(p => ev && ev.willing && ev.willing[p] === "unwilling");
    return {people, links:L, label, unconfirmed, weakest, linkCount:L.length, intermediaries,
            first:chain[1], unwilling, cost:L.reduce((s, l) => s + l.cost, 0)
              + chain.slice(1, -1).reduce((s, p) => s + willingAdj(ev, p), 0)};
  }

  /* People at an organization, for "reach this company" requests: confirmed roles first */
  function peopleAt(ix, org){
    return (ix.members[org] || []).map(m => ({id:m.pid, name:ix.people[m.pid].name, title:m.role.title,
      type:m.role.type, confirmed:m.role.v !== "ns"}))
      .sort((a, b) => (b.confirmed - a.confirmed) || rank(b) - rank(a));
  }
  function rank(x){
    const t = (x.title || "").toLowerCase();
    return /chair/.test(t) ? 5 : /chief executive|ceo|managing director|governor|minister|president/.test(t) ? 4
         : /chief|cfo|coo|cto|director general/.test(t) ? 3 : x.type === "board" ? 2 : 1;
  }

  /* Main entry. Returns {status, paths, discovery, notes} */
  function find(ix, opts){
    const target = opts.target, ev = opts.evidence || {}, k = opts.k || 3;
    const maxLinks = opts.maxLinks || 4;
    if(opts.targetKind === "inst") return {status:"needPerson", candidates:peopleAt(ix, target).slice(0, 12)};
    if(!ix.people[target]) return {status:"unknownTarget"};
    const notes = [];
    const troles = (ix.people[target].roles || []).filter(r => r.type !== "alumni");
    if(troles.length && troles.every(r => r.former)) notes.push({code:"targetHistorical"});
    const starts = (opts.starts || []).filter(s => ix.people[s.pid] && s.pid !== target);
    const direct = (opts.starts || []).find(s => s.pid === target);
    if(direct) return {status:"direct", start:direct, notes};
    if(!starts.length) return {status:"noStart", notes, discovery:discover(ix, target, ev)};

    const run = banned => {
      const {dist, prev} = search(ix, target, maxLinks - 1, ev, banned);
      const out = [];
      starts.forEach(st => {
        if(!dist.has(st.pid)) return;
        const chain = ["__me", st.pid], links = [firstLink(st)];
        let cur = st.pid, ok = true;
        while(prev.get(cur)){
          const {p, l} = prev.get(cur);
          if(chain.includes(p)){ ok = false; break; }    // never revisit a person
          chain.push(p); links.push(l); cur = p;
        }
        if(!ok || cur !== target) return;
        if(chain.slice(2, -1).some(p => starts.some(s => s.pid === p))) return;   // you already know someone further along
        out.push(assemble(ix, chain, links, ev));
      });
      return out;
    };
    let cands = run(null).sort((a, b) => a.cost - b.cost);
    /* distinct alternatives: different first contacts first, then different intermediaries */
    const chosen = [], sig = p => p.people.map(x => x.id).join(">");
    const seenFirst = new Set(), seenSig = new Set();
    for(const c of cands){
      if(chosen.length >= k) break;
      if(seenFirst.has(c.first) || seenSig.has(sig(c))) continue;
      chosen.push(c); seenFirst.add(c.first); seenSig.add(sig(c));
    }
    for(let i = 0; chosen.length < k && i < chosen.length; i++){
      const mids = chosen[i].people.slice(2, -1).map(x => x.id);
      if(!mids.length) continue;
      const alt = run(new Set(mids)).sort((a, b) => a.cost - b.cost)
        .find(c => !seenSig.has(sig(c)));
      if(alt){ chosen.push(alt); seenSig.add(sig(alt)); }
    }
    chosen.sort((a, b) => a.cost - b.cost);
    if(!chosen.length) return {status:"none", notes, discovery:discover(ix, target, ev),
                               reasons:noRouteReasons(ix, target)};
    return {status:"ok", paths:chosen, notes};
  }

  /* why there is no route — concrete missing information */
  function noRouteReasons(ix, target){
    const r = [];
    const roles = (ix.people[target].roles || []).filter(x => x.type !== "alumni");
    if(!roles.length) r.push({code:"noRoles"});
    else if(roles.every(x => x.former)) r.push({code:"onlyHistorical"});
    else {
      const big = roles.filter(x => !x.former && (ix.members[x.org] || []).length > MAX_ORG_FOR_COLLEAGUE);
      if(big.length && big.length === roles.filter(x => !x.former).length) r.push({code:"onlyLargeOrgs"});
      if(!publicLinks(ix, target).size) r.push({code:"noPeopleLinks"});
    }
    r.push({code:"addContacts"});
    return r;
  }

  /* potential contacts to explore — explicitly NOT an introduction chain */
  function discover(ix, target, ev){
    const out = [];
    publicLinks(ix, target).forEach((l, o) => out.push({id:o, name:ix.people[o].name, type:l.type,
      orgNames:(l.orgs || []).map(x => ix.orgs[x] ? ix.orgs[x].name : x), cost:l.cost}));
    return out.sort((a, b) => a.cost - b.cost).slice(0, 5);
  }

  const API = {build, find, peopleAt, pairKey, LINK};
  if(typeof module !== "undefined" && module.exports) module.exports = API;
  else root.IntroPaths = API;
})(typeof window !== "undefined" ? window : this);
