# NavGCC daily growth agent — runbook

This is the complete, self-contained mandate for the daily enrichment run of the GCC Power
Network (repo `qizhangumich/power_network`, live at https://nav.gcc.com). It is executed by a
**Claude cloud routine** (no access to the owner's PC), so everything the agent needs is in this
repo. Read this whole file before doing anything.

**Mandate:** the network grows meaningfully EVERY day — both **institutions** and **people**.
Long-term target: full boards + top AND middle management for every significant GCC company,
government body and state/sovereign entity (≈7,000+ people). A day with +0 people or +0
institutions is a failed day.

---

## 0. Cloud environment

- Linux checkout of the repo at the working directory; use `python3` (stdlib only — no pip installs needed).
- Scratch/research files go in `/tmp/enrich/` (create it). Never commit scratch files.
- Research: `WebSearch` + `WebFetch`, and parallel research subagents (`Task`) that write CSVs into `/tmp/enrich/`.
- `tools/update.py` ends with an SSH "direct deploy" to the old Alicloud box; in the cloud it prints
  `Direct deploy skipped (...)` — that is expected and fine. Both web servers pull `main` from GitHub
  every 5 minutes, so a successful `git push` to `main` is the deploy.
- **If `git push` to `main` is rejected for permission reasons** (not a normal non-fast-forward), push
  the same commit to a branch `claude/enrich-<YYYY-MM-DD>` and say so prominently at the top of the
  digest — the owner must then allow direct pushes or merge the branch.
- Private files (`my_network.js`, `Connections.csv`, `deploy_key_github*`) are gitignored and absent in
  the cloud. Never create, read or commit them.

## 1. Before anything else

1. `git status --porcelain` — must be clean. `git log --oneline -5` — note any `enrich:` commit already
   made today (UTC) by another run (only to avoid re-doing the same companies — it is NOT a reason to stop;
   see §9, which applies to the catch-up run only).
2. Read `reports/growth_state.json` (last two days) to know yesterday's totals and weakest regions.
3. Pick today's work (sections 4–5), then start the first research batch **within the first 10 minutes**.

## 2. The system

- Root `index.html` = GCC landing page (region stats auto-stamped by `tools/build_regions.py`).
  `map_template.html` = shared map engine; all region pages are stamped from it.
- Eight region maps. **Abu Dhabi**: database = `data/*.csv` (people, roles, institutions, ownership,
  family, aka), regenerated into root `network_data.js` by `tools/import_csv.py`; `abudhabi/network_data.js`
  and `abudhabi/news_data.js` are COPIES made by build_regions — never edit them. **dubai/, northern/,
  saudi/, qatar/, bahrain/, oman/, kuwait/**: each has its own hand-editable `<region>/network_data.js`
  (blocks `INSTITUTIONS`, `PEOPLE`, `OWNERSHIP`, `FAMILY`, `AKA`).
- GitHub Actions (`.github/workflows/update.yml`) fetches news + scrapes 25 tier-1 outlets every 6h and
  re-renders the growth report. `tools/growth_report.py` keeps one snapshot per day in
  `reports/growth_state.json` and renders `reports/growth.html` (the owner's daily progress page).
- Queues: `data/backfill_queue.csv` (institutions thin on leadership), `data/institution_candidates.csv`
  (organisations named in ≥2 recent news items that no map has; status pending/added/rejected),
  `data/suggested_edges.csv` (co-mention candidates), `data/listings/*.csv` (exchange registries).
- **Sector keys** (same in every region): energy, materials, industry, consumer_disc, consumer_stap,
  health, finance, tech, comm, utilities, realestate, gov, sovereign, education, conglomerate.
- **Tiers**: 0 ruling core / apex government, 1 sovereign & state champions, 2 operators & authorities,
  3 private groups / smaller / international.

## 3. Ingestion tools (always merge institutions BEFORE people that reference them)

### Institutions
1. Research agents write `/tmp/enrich/inst_<batch>.csv` with header
   `region,name,short,sector,tier,power,parent_name,relation,verification,source_url,aliases`
   (full official English `name`; `short` ≤20-char map label; acronyms/former names in `aliases`
   separated by `|`; `verification` v only when an official page states the parent relationship).
2. `python3 tools/stage_institutions.py /tmp/enrich inst_a.csv inst_b.csv …` → `data/institution_additions_stage.csv`
   (+ `/tmp/enrich/pending_pass2.csv` for children whose parent is in the same batch).
3. `python3 tools/merge_institutions.py --dry-run --verbose` — **read every `+` line and every near-match.**
   Fix with `/tmp/enrich/stage_cfg.py` (`FORCE`, `DROP`, `REGION_FIX`, `PARENT_HINT`) and re-stage.
4. `python3 tools/merge_institutions.py`; then pass 2: `cp /tmp/enrich/pending_pass2.csv /tmp/enrich/p2.csv`,
   `python3 tools/stage_institutions.py /tmp/enrich p2.csv`, dry-run, merge.
5. Power guidance: national champions/giga-projects 70–80, major authorities 62–72, portfolio companies
   56–64, small 52. From rankings: top-10 72–78, 11–30 64–70, 31–60 58–63, rest 54–57.

### People
1. Research agents write `/tmp/enrich/people_<batch>.csv` with header
   `region,institution_id,person_name,title,role_type,verification,source_url`
   (institution ids must exist in that region's map — look them up first; `role_type` board|executive).
2. `python3 tools/dedupe_people.py /tmp/enrich 'people_*.csv'` — review every `ROLE-ADD [fuzzy]` line;
   put wrong matches into `/tmp/enrich/dedupe_cfg.py` `SKIP_MATCH`, lst_* shadows into `REMAP`.
3. `python3 tools/dedupe_people.py /tmp/enrich 'people_*.csv' --apply` → then `python3 tools/merge_people.py`
   (dedupes, ids, power: chair 62 / CEO 60 / C-suite 58 / board 52 / middle management 46).
4. Only AFTER merging, apply demotions to former (see §6) — the pre-pass ignores former roles, so a stale
   official page would otherwise re-add a live role next to the former one.

### Validate
- `node` may be absent in the cloud; validate region JS with
  `python3 -c "import sys; sys.path.insert(0,'tools'); from netdata import load_nodes; [print(r, len(load_nodes(r+'/network_data.js'))) for r in ['dubai','northern','saudi','qatar','bahrain','oman','kuwait']]"`
  and let `tools/import_csv.py` (run by update.py) validate the Abu Dhabi CSVs.

## 4. Daily streams

1. **MANAGEMENT EXTRACTION** (primary people stream, ~10–12 companies/day → 80–150 people): companies not yet
   covered in depth — first the institutions added in the last few days (no people yet), then curated
   institutions with <3 people, then listed `lst_*` companies; rotate regions (favour the lowest daily
   growth in `growth_state.json`). For each, capture the FULL published team from official pages: board,
   C-suite, and the middle layer (EVPs, SVPs, division CEOs, heads of major units). Run 3–4 research
   subagents in parallel, ~12 companies each.
2. **BACKFILL** (3–5): top pending rows of `data/backfill_queue.csv` — chair/CEO/board of government bodies and
   funds (official "board members"/"leadership" pages, e.g. tec.gov.ae, ec.shj.ae, cbk.gov.kw, eia.gov.ae).
3. **NEWS-DRIVEN**: scan the last 2 days of `scraped_news/**` and `news_inbox/` for appointments, resignations,
   deaths, mergers, renames and take-privates; apply structural changes (successor added + predecessor
   demoted to former; renames: update `n:` and keep the old name as AKA; ownership notes).
4. **LISTED-COMPANY PROMOTION** (2–3): `lst_*` nodes that matter get real power (55–72), proper names/shorts,
   and ownership edges.
5. **VERIFICATION ROTATION** (~5): re-verify `ns` roles against official pages; flip to v, or correct
   (ended role → former, never deleted).
6. **SOURCE HEALTH**: read the "Source health" section of the latest `reports/*.md`. Fix genuinely dead scraper
   URLs in `tools/scrape_news.py` SOURCES; re-run `tools/import_listings.py` if a listings registry is >30 days old.
   Known and NOT fixable by URL changes: `bahrain/BNA`, `kuwait/KUNA`, `oman/ONA`, `regional/Arabian Business`
   (IP blocks on the Actions runner) and `saudi/Arab News` (Cloudflare wall).
7. **INSTITUTION DISCOVERY** (+30–60 institutions/day, each with a parent/ownership edge where one exists):
   (a) every day the top ~10 pending rows of `data/institution_candidates.csv` — confirm on the official site,
   stage the real GCC ones, set status `added` or `rejected` (generic phrases, foreign firms with no GCC entity,
   duplicates → rejected; for a duplicate add the news form as an AKA instead);
   (b) plus ONE rotating source by weekday (UTC): **Mon** sovereign/state portfolios (PIF, ADQ, Mubadala, ICD,
   Dubai Holding, IHC, QIA, OIA, Mumtalakat, KIA/Wafra, Bapco Energies, QatarEnergy, KPC); **Tue** government
   directories (ministries, authorities, regulators, free zones, funds); **Wed** business rankings (Forbes
   Middle East, Brand Finance GCC, Arabian Business/Gulf Business lists — names and facts only); **Thu**
   subsidiaries & JVs of the largest groups from annual reports; **Fri** private family groups & chamber
   member lists; **Sat** universities, hospitals, media groups, think tanks; **Sun** listed-company
   subsidiaries + the region with the lowest institution count.

## 5. Sources and policy

- **LinkedIn: NEVER** fetch or scrape linkedin.com (ToS). LinkedIn exists only as manual buttons in the UI.
- People data only from official public sources: company leadership/board pages, annual/integrated/governance
  reports, exchange disclosures, official press releases. `v` only from those; news-only facts are `ns`.
  No Wikipedia/Crunchbase/ZoomInfo/RocketReach/theorg as sources.
- Always confirm a fetched page names the targeted company — domains get repointed
  (`zamilindustrial.com` → senaat.com; `qewc.com` → nebrasenergy.qa).
- Sites that return no names (SPA/WAF) — skip after ~6 fetches, try the annual/governance report PDF instead:
  Alinma, Bank Albilad, ANB, Salik, TECOM, ICD, EDGE, ADX, Waha, DFM, EQUATE, stc, Almarai, QatarEnergy,
  Omantel, Agility, KIPCO, AUS, Emirates Group, QCB, QatarEnergy LNG, Qatar Foundation, ROSHN, Saudia,
  hmg.com (Al Habib BOD page). ADQ's leadership page 404s (don't retry unless news says the site was rebuilt).
  Exchange sites are mostly dead ends (tadawul.com.sa, boursakuwait 403, qe.com.qa, msx.om JS); Bahrain Bourse
  disclosures work.

## 6. Records, naming, dedupe lessons

- **Never delete departed leaders.** Demote: AD `data/roles.csv` → `status` = `former:until <Mon YYYY>` and
  tenure in the title ("Group CEO (2020–2025)"), person kept, note names the successor. Region JS → 5th element:
  `["inst_id","Title (2019–Feb 2026)","executive","v","former:until Feb 2026"]`. Replacement = add successor AND
  demote predecessor in the same change. Delete only records that were factually wrong.
- **Naming:** full formal names as published (news-matchable). Rulers/officials get AKA aliases in news style
  ("Ruler of Sharjah", "Saud bin Saqr Al Qasimi"). Acronym institutions get the full official name in `n:` or AKA.
  Keep "Sheikh/Prince/Sayyid" only as part of royal names; strip H.E./Dr./Eng./Mr./Capt.
- **People dedupe traps:** ~50% of researched rows are people already in the map. Same-name different people
  exist (ENEC CEO vs SIB secretary "Mohamed Ibrahim Al Hammadi"; Sharjah Finance chair vs RAK Crown Prince
  "Mohammed bin Saud Al Qasimi"; Hamdan bin Zayed vs Zayed bin Hamdan; DEWA EVP "Hussain Lootah" vs ALEC chair
  "Hussain Nasser Lootah"). Al Thani token-subset matches are often wrong ("Khalifa bin Abdulla bin Khalifa" ≠
  "Khalifa bin Thani bin Abdullah"). lst_* nodes shadow curated ones (lst_eand↔e_and, lst_adports↔adports,
  lst_kproj↔kipco, lst_airarabia(dubai)↔airarabia(northern), lst_ajmanbank(dubai)↔ajmanbank(northern)) — REMAP.
- **Institution dedupe traps:** research re-adds existing nodes under variant spellings (OQ SAOC = OQ Group,
  ALSAYER = Al Sayer, Almana = Al Mana, Saudi Arabian Mining Co = Maaden) and mislabels HQ regions (Al Faisal
  Holding / Power International / AbuIssa → Qatar; GMG → Dubai). Distinct entities with generic names get
  flagged as near-matches (Saudi Industrial Development *Fund* vs listed SIDC) — FORCE after checking.
- Official pages go stale: e.g. Suhail Bahwan (died Nov 2025) still listed as chairman — cross-check news for
  deaths/resignations before adding a "current" role.

## 7. Shipping

- **Ship early, ship twice.** Interrupted runs are the #1 cause of zero-growth days. As soon as the first
  batch has merged cleanly: `python3 tools/update.py "enrich: <summary>"` (imports CSVs, matches news, reports,
  growth report, backfill queue, institution candidates, stamps region pages, commits `git add -A`, pulls,
  pushes). Fix validation errors and rerun. Ship again at the end of the run.
- After every ship: `git log --oneline -2`, `git status --porcelain` (must be clean), and check that
  `scraped_news/health.json` parses (`python3 -c "import json;json.load(open('scraped_news/health.json',encoding='utf-8-sig'))"`)
  and `git grep -n '^<<<<<<<' HEAD` finds nothing — update.py's autostash can commit conflict markers when the
  Actions bot touched the same file; if so fix and ship a repair commit.
- If a commit you did not write appeared between your merge and your ship (another run), do not run update.py;
  stage only your own paths, commit, push (pull only if rejected).
- **NEVER**: force-push, commit private files, hand-edit generated files (root `network_data.js`, any
  `news_data.js`, region `index.html` pages, `abudhabi/network_data.js`, `reports/growth.html` — engine changes
  go in `map_template.html` + `tools/build_regions.py`), scrape LinkedIn, delete departed leaders, or edit
  `tools/update.py`'s commit trailer (it is shared by every run — never hardcode a session URL or model name there).

## 8. Output — the GROWTH DIGEST (final message)

Line 1: `📈 Today: +N people, +M institutions, +K roles → totals P people / I institutions / R roles`
(deltas = today's vs yesterday's snapshot in `reports/growth_state.json`).
Line 2: per-region adds today (only regions with adds).
Then: institutions added (by source, per region, new ownership edges), teams extracted (company: N people,
source), backfill adds, promotions, corrections (incl. roles demoted to former), ns→v flips, source-health
issues, decisions needed. End with: full history at https://nav.gcc.com/reports/growth.html

## 9. Catch-up mode (ONLY for the afternoon catch-up run)

This section applies **only** when your prompt explicitly says you are the AFTERNOON CATCH-UP run.
A regular/morning run (or a manual "run now") must ALWAYS execute the full runbook, even if an
`enrich:` commit already exists today — growth compounds, a second full run on the same day is wanted.

When started as the afternoon catch-up: run `git fetch origin && git log origin/main --since="<today> 00:00 UTC" --format="%ci | %s"`.
If an `enrich:` commit exists today AND today's people total in `reports/growth_state.json` is above yesterday's,
reply with one line `✅ Already enriched today: <subject> (+N people)` and stop. Otherwise run this whole runbook.
