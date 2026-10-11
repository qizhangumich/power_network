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

## Design system (V5 — "the park map": Navigate → Locate yourself → Find your path)
The engine lives in `map_template.html` (stamped into every region page by
`tools/build_regions.py`); the landing page is the hand-editable `index.html`.
- **Deep navy ground** (#0A1120), ink tokens for all text, white for emphasis (selection,
  routes) and one luminous accent (#7C8CFF) for *you* and your links. Fonts: Sora (display)
  and Inter (UI, canvas labels).
- **Industries = the site's 10 existing sector groups** (15 sector keys folded, nothing
  invented), each with a fixed colour, an icon and a name, used identically in the map
  legend, the phone chip strip, filters, profiles, district tags and the landing page.
  Hues are the dataviz reference palette's dark steps, validated against the navy
  surface; identity is never colour-alone (icons + labels everywhere).
- **Legend**: click/tap industries to highlight (multi-select, Reset; others fade but stay
  in context) · separate connection key (role, ownership, family, unverified, potential,
  former, your connection, demo, route) · shapes · latest signals. Desktop: floating
  sidebar; phone: chip strip under the header + "Map key" sheet.
- **Views**: Network (tier rings) · Industries (park districts with name tags) · Focus
  (ego rings) · Ownership (control hierarchy).
- **You on the map**: people you add (by name on the map, LinkedIn `Connections.csv`
  export, a profile link, or manually) appear as a "You" pin linked to them; organizations
  where unmatched contacts work become *possible ways in*. Updates live, no reload.
- **Routes**: Dijkstra from the target over public relationships; each entry point yields
  one route; ranked by hops, verified vs unverified records, how broad a shared
  organization is, and (only if you rated it) your relationship strength. Every hop shows
  its basis and class: **Confirmed** (by you / public record) · **Unverified** record ·
  **Potential** (shared organization, contacts at an organization) · **Demo data**.
  Routes are presented as possible introductions, never guarantees.
- **Path mode**: unrelated nodes fade, segments light up in sequence, synced step list
  with Back/Next (and ←/→), alternatives as chips; no-route and "where do you start"
  states explain what to do next.
- **Guided tour** (first visit only; "Guide" replays it): 3 steps that drive the real map,
  with Next / Back / Skip / Replay and **Try a demo** (`?demo=1`) — sample contacts that
  are clearly labeled and never mixed with real data.
- **Phones**: map-first; bottom sheets (peek / half / full, swipe to dismiss) for profiles,
  routes, tour, My Network and the key; map controls (recenter, fit, full screen, key);
  ~24 key nodes and ≤7 labels by default with collision culling, more on select/expand/
  zoom; 44px targets; safe areas, `dvh` and `visualViewport`; reduced-motion respected.
- **LinkedIn**: OAuth sync is *not connected* (needs LinkedIn partner approval) and the UI
  says so; import uses the user's own data export, processed in the browser.
- **Nudges ("The map becomes yours")** — show, don't tell; one next step at a time:
  - *Act I* (first visit): "A world of connections." over the constellation unfolding from
    the center; nearby nodes lean toward the pointer; one tap flies in and the guide starts.
  - *Act II*: the network dims around an empty "Your starting point" with three ways in
    (import LinkedIn export · add someone you know · explore as a guest). Adding someone:
    you appear, your links grow, a ripple runs through what they open, and the card says
    "The map becomes yours." with a count-up of **key people within 2 introductions**
    (power 70+, outside the ruling core, org-to-org hops counted) and who they include —
    labeled as possible introductions, not relationships. "One connection can open many
    doors · Add another connection".
  - *Act III*: "Every opportunity has a path." Routes say "Your best available path" only
    when clearly cheaper than the alternative and free of potential-only hops; "3
    connections · 2 introductions"; "Start with someone you already know: …"; actions
    *Explore this path* · *Find another route* (honest when there is none) · *Save target*.
  - Saved targets (browser only, listed in My Network): adding a contact that opens or
    shortens a path to one triggers "New path to …".
  - A single quiet nudge pill when no panel is open: "Start with someone you know" →
    "One connection can open many doors" → "X is 2 introductions away"; dismissible for a
    week; never during the tour.
  - Landing page: hero "The world is full of connections." + a six-screen scroll story
    (sticky illustrated constellation, labeled as an illustration).

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
