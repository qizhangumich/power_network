# Abu Dhabi Power Network — V3 · Intelligence Map

Full-scale, no-cap network map of Abu Dhabi's key industries, institutions and key people,
organized in four layers — now with an automation pipeline for news and your LinkedIn network.

## Files
| File | What it is |
|---|---|
| `abu_dhabi_power_hub.html` | **The map.** Open in any browser (keep it in this folder — it loads the three .js files below). |
| `network_data.js` | **Source of truth.** All sectors, institutions, people, ownership, family ties, aliases. Edit → refresh browser. No build step. |
| `news_data.js` | Auto-generated news signals (`tools/match_news.py`). |
| `my_network.js` | Auto-generated LinkedIn overlay (`tools/import_linkedin.py`). **Private — keep local.** |
| `news_inbox/` | Drop news articles here as `.md`/`.txt` (two `[SAMPLE]` items included — delete them). |
| `tools/` | Automation scripts (Python 3, stdlib only). |
| `data_dictionary.md` | Data model and operating rules. |
| `abu_dhabi_power_hub_v1_plotly_backup.html` | Old V1 Plotly map, kept for reference. |

## The layer model
| Layer | Contents |
|---|---|
| **L0 · Ruling Core** | Al Nahyan ruling family, Presidential Court, Executive Council, SCFEA, UAE Cabinet |
| **L1 · Sovereign Capital & State** | ADIA, Mubadala, ADQ, IHC/Royal Group, department chairs, ministers, super-connectors |
| **L2 · Operators & Sector Leaders** | Operating companies and their CEOs across every sector |
| **L3 · Private & International Partners** | Energy majors (TotalEnergies, bp, Shell, Exxon…), Big Tech (Microsoft, OpenAI, NVIDIA), global finance (BlackRock, Goldman), consulting/audit/law gatekeepers, local private groups (Waha, Trojan, Rotana…) |

**Local-people policy:** global HQ executives (Sam Altman, Jensen Huang, Larry Fink, the
energy-major CEOs, …) are deliberately excluded — the people layer is local. L3 companies
are anchor nodes; the people who serve them in the UAE surface through the LinkedIn overlay,
and get promoted into `PEOPLE` once their local role (country manager, UAE managing partner,
Gulf CEO) is verified.

**Sectors = GICS 11 + government-side**, identical across every region:
Energy 能源 · Materials 原材料 · Industrials 工业 (incl. transport, defense companies,
professional services) · Consumer Discretionary 可选消费 · Consumer Staples 必选消费 ·
Health Care 医疗保健 · Financials 金融 · Information Technology 信息技术 ·
Communication Services 通信服务 (telecom + media + entertainment/sport) · Utilities 公用事业 ·
Real Estate 房地产 — plus Government & Political, Sovereign Capital, Education & Research,
Family Conglomerates. Every region covers all 11 GICS sectors (checked by
`tools/gics_migrate.py` conventions; keys: `energy, materials, industry, consumer_disc,
consumer_stap, health, finance, tech, comm, utilities, realestate, gov, sovereign,
education, conglomerate`).

3 edge types (roles, ownership/control, family) · power score drives node size.
Current scale: **~100 people · ~143 institutions · ~298 edges. No cap.**

## Automation pipeline

### 0. Fully automated loop (no human needed)
`.github/workflows/update.yml` runs **every 6 hours** on GitHub Actions:
fetch fresh news (`tools/fetch_news.py`, Google News RSS for 20 entity queries)
→ match to network nodes → detect co-mentions → commit. The Alicloud server
pulls every 5 minutes, so new signals appear on the live map unattended.
Candidate relationships accumulate in `data/suggested_edges.csv` — entity pairs
that keep sharing articles but have no edge yet; review and promote the real
ones into `ownership.csv`/`roles.csv`.

For manual data edits, one command does everything:
```bash
python tools/update.py "describe the change"
```
(validates + imports CSVs, re-matches news, commits, pushes → live in ~5 min)

### 1. News → map signals
```bash
python tools/match_news.py
```
Drop articles into `news_inbox/` (`2026-08-25_title.md`; first line = title; optional
`source:` / `url:` lines). The matcher scans them against every node name + alias
(`AKA` block in `network_data.js`), handles line-broken names, suppresses
fragment false-positives ("Al Jaber" inside "Sultan Al Jaber"), and regenerates
`news_data.js`. Matched nodes get a **gold badge** on the map and a
**Recent signals** section in their panel. Idempotent — re-run any time.

### 2. LinkedIn → warm-intro overlay
```bash
python tools/import_linkedin.py
```
Export your connections first: LinkedIn → Settings & Privacy → Data privacy →
*Get a copy of your data* → Connections → put `Connections.csv` in this folder.
The importer fuzzy-matches employers against all institutions (suffix-stripping,
alias-aware) and writes `my_network.js`. Institutions you can reach get a
**green dashed ring** and your contacts appear in their detail panel — so the path
*you → contact → institution → key person* is visible on the map.
**Privacy:** `my_network.js` contains your personal contacts — never share it with the map.

### 3. Rolling growth — the network gets larger every day
The database is not static. Growth runs on three streams, executed by the daily
9 AM enrichment agent (a scheduled Claude session on this machine):
- **Leadership backfill**: `data/backfill_queue.csv` (regenerated by
  `tools/backfill_queue.py`) lists every institution still thin on leadership,
  priority-ordered. The agent works the queue daily — researching each company's
  current chairman/CEO/board with sources and adding them.
- **News-driven adds**: new companies/people revealed by the tier-1 +
  Google News pipelines; suggested co-mention edges promoted after verification.
- **Verification rotation**: `ns` flags re-checked against official sources and
  flipped to `v` (or corrected), rotating through the regions weekly.
Every dossier also carries a **Search on LinkedIn ↗** button (people-search
prefilled with the entity name) for manual network digging; automated LinkedIn
scraping is deliberately not part of the system (ToS) — use the official
Connections.csv export + `tools/import_linkedin.py` for your own network.

### Adding more later
The same pattern extends to any content: put items in an inbox, match on the alias
table, emit a `*_data.js` overlay. Candidates: press releases, tender awards,
event attendee lists, podcast transcripts.

## Design system (V4 — per `Network_Intelligence_Visual_Interaction_Design_Brief_CN_V1.1.pdf`)
Network-first Relationship Intelligence, not a dashboard with a chart:
- **Light neutral system** — near-white ground, charcoal ink, hairlines, one accent
  (muted indigo #4C57C5) reserved for focus, paths and primary actions.
- **Node semantics by shape**: person = circle (heroes carry initials), government =
  rounded square, sovereign fund = diamond, company/org = square. Size = power.
- **Edge semantics**: institutional thin gray · family solid warm · unverified dashed-faint ·
  **potential** (news co-mention, from suggested_edges) dashed — clearly marked inferred ·
  indigo only on the active focus/path.
- **4 Views, one canvas** (selection preserved, nodes glide — no reshuffle):
  Network (tier rings) / Sectors (clusters) / Institution (ego rings around the selected
  node) / Control (ownership hierarchy from the Ruler's court outward).
- **Interactions**: click = Focus (unrelated fades to ~15%, never removed) + right-slide
  dossier · click an edge = relationship explanation · **Find path from here** or ask
  "how can I reach X" = Path Mode with hop-by-hop indigo highlighting · double-click =
  isolate ego network.
- **Ask the Network** (top bar): natural-language questions that change the canvas —
  "how can I reach EWEC" (path), "who at ADQ" (people + focus), "show energy" (sector
  focus), or any name (profile).
- **Home**: "Your Network Intelligence" — Ask box, four numbers, recent changes, one CTA.
- **Mobile**: Ask-first top bar, views/filters in a bottom sheet (☰), default density
  limited to key nodes ("Show all" in the sheet), bottom-sheet dossier, 44pt targets.

**EN / 中文** switches UI chrome only; all data stays English. `window.__map` exposes a
debug/automation handle.

## Deployment
Repo: https://github.com/qizhangumich/power_network — `index.html` is the site entry
(identical to `abu_dhabi_power_hub.html`); zero-config static hosting.
- **Vercel:** import the repo at https://vercel.com/new (framework preset: *Other*, no build
  command, output dir default). Every `git push` then auto-deploys. Or CLI: `vercel login`
  once, then `vercel --prod` in this folder.
- **Privacy:** `.gitignore` keeps `my_network.js` (your LinkedIn contacts) and
  `Connections.csv` out of the repo — the public site simply shows no LinkedIn overlay.
  Never commit these files.

## Data quality
Facts vs. analysis stay separate. Roles/edges marked **needs source** are public-record
but not yet re-verified against an official page. L3 "advisory ecosystem" edges
(consultancies → ADDED etc.) are deliberately generic — replace with specific sourced
engagements as you learn them. Parked V1 names pending role verification:
Etienne Petit, Sherif Tawfik, Mohamed Almarzooqi.

## Regions — the GCC
Eight maps on one engine, linked by the folded region menu in the top bar:

| Path | Region | Core |
|---|---|---|
| `/` | Abu Dhabi | Al Nahyan · ADIA/Mubadala/ADQ/IHC · full news pipeline |
| `/dubai/` | Dubai | Al Maktoum · ICD/Dubai Holding · Emirates/DP World/Emaar |
| `/northern/` | Sharjah · RAK · Fujairah · Ajman · UAQ | Al Qasimi/Al Sharqi/Al Nuaimi/Al Mualla · Crescent/BEEAH/Wynn |
| `/saudi/` | Saudi Arabia | Al Saud (MBS) · PIF/Aramco · giga-projects |
| `/qatar/` | Qatar | Al Thani · QIA/QatarEnergy · LNG partners |
| `/bahrain/` | Bahrain | Al Khalifa · Mumtalakat/Bapco/Investcorp |
| `/oman/` | Oman | Al Said · OIA/OQ/PDO |
| `/kuwait/` | Kuwait | Al Sabah · KIA/KPC · merchant families |

Each region: `<region>/network_data.js` (same schema). `tools/build_regions.py`
stamps every region page from the root `index.html`, so design changes propagate
everywhere (update.py runs it; a region ships once its `network_data.js` exists —
add a new one by adding a row to REGIONS and a dataset).
News automation + CSV layer currently cover Abu Dhabi only; per-region
parameterization is the next step. All non-AD datasets are V1 backbones —
review the `ns` flags.
