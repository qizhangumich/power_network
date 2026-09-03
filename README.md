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

19 sectors · 3 edge types (roles, ownership/control, family) · power score drives node size.
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

## Phase 2 — other emirates
Copy the engine, swap `network_data.js` for a Dubai dataset (Al Maktoum core,
ICD / Dubai Holding / DP World layers), then link maps through the federal nodes
already present here (UAE Cabinet, CBUAE, EIA, e&, MoFA).
