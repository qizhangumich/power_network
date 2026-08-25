# Data Dictionary — V2 (no scale restrictions)

The V1 scale caps (top-20 / 40 / 60–90, 100–150 total) are **removed**. The network grows
without limit; quality is governed by verification status, not by headcount.

## people
One row per person. Multiple positions are stored in `roles`.
- `tier`: 0 = Ruling Core · 1 = Sovereign Capital & State · 2 = Operators & Sector Leaders

## institutions
Government departments, sovereign funds, regulators, holding companies, operating companies,
universities, media, family conglomerates and major public institutions.
- `tier`: same three-layer model as people
- ownership/control edges build the control tree (an institution may have several parents,
  e.g. Masdar ← ADNOC + TAQA + Mubadala)

## roles
Core fact table linking people and institutions.
- role_type: political / government / board / executive / ownership
- seniority is expressed through `tier` + `power_score` rather than letter grades
- verification_status: `verified` or `needs_source`

## sources
Evidence table. Official government/company pages receive the highest authority rank.

## institution_sectors
18 sectors; one primary sector per node on the map (a node can still hold roles across sectors).

## relationships
Explicit person↔person or non-role ties. V2 policy (relaxed from V1): in addition to fully
sourced relationships, **widely documented family ties** (e.g. Al Nahyan siblings, Al Mubarak
siblings) may be included and are rendered as a distinct "family" edge type. Speculative
friendships or unverified influence claims are still excluded.

## assessments
Analytical layer, 0–100: power_score (drives node size), operating_relevance,
access_relevance, strategic_relevance.

## engagements
Optional private CRM table for the user's own meetings/interactions.

## Hub logic (V2)
The hub generates:
- person ↔ institution edges from roles
- institution ↔ institution edges from ownership/control
- person ↔ person edges from family ties
- three-ring layer layout (L0/L1/L2), sector coloring, power-scaled nodes
- filters (layer / node type / edge type / sector), search, ego-network focus,
  per-node dossier panel with click-through navigation

## Replication to other emirates (Phase 2)
Same schema, same HTML engine, new dataset blocks. Federal nodes (UAE Cabinet, MoFA, CBUAE,
EIA, e&) are the designed join points between emirate maps.
