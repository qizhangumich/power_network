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

## Design system (per `Network Design Tools.pdf`)
The map follows the Constellation / Intelligence Map spec — three states:
- **Ambient** — near-black canvas (#111214) with a faint dot grid; nodes are quiet stars
  (dark centers, colored strokes) in four size levels; most of the graph is neutral slate,
  with mint green reserved for hero entities, muted cobalt for key institutions, and
  semantic-zoom labels (few at low zoom, most when zoomed in).
- **Exploration** — hovering brightens a node's direct relationships and reveals neighbor labels.
- **Investigation** — clicking a node fades ~95% of the network to a fraction of its opacity
  and illuminates the node's direct paths in electric violet (#845DF0, thin + soft glow)
  with indirect (2nd-degree) paths at lower intensity. Purple appears **only** here.
Amber marks uncertainty (unverified edges are faint & dashed; news badges are amber);
edges curve gently; family ties are dotted amber.

## Using the map
Click = investigation mode + dossier panel · double-click = isolate ego network ·
drag/scroll = pan & zoom · sidebar = search + layer/type/edge/sector filters ·
**Fit view** rescales to your window. `window.__map` exposes a debug/automation handle.
**EN / 中文** button (top right) switches the interface language — UI chrome only;
all data (names, roles, institutions) stays English by design. Choice persists locally.

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
