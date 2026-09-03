# Network Intelligence — Phase 2 Personalization Specification

**Product:** `power.tianrenyuan.com`  
**Phase 1:** Network Intelligence — *We Map the Network*  
**Phase 2:** Personalization — *We Map You Into the Network*  
**Document type:** Product + UX + Data + Technical Specification  
**Version:** 1.0  

---

## 1. Executive Summary

`power.tianrenyuan.com` should remain the **shared intelligence layer**: a curated map of important people, institutions, sectors, projects, and relationships.

Phase 2 adds a private user-specific layer on top of that shared intelligence graph. The product should allow a user to connect their professional network — starting with LinkedIn — match those contacts against the existing intelligence graph, and calculate the user's **accessibility** to people, institutions, sectors, and opportunities.

The product therefore evolves from:

> **Who matters, and how is the market connected?**

into:

> **Who matters to me, who do I already know, how close am I to a target, and what is my best path to reach them?**

The key Phase 2 product concept is **Accessibility**, not merely “LinkedIn import.” LinkedIn is the first personal-network data source; Accessibility is the durable product capability.

### Product formula

```text
PHASE 1 — GLOBAL INTELLIGENCE
We Map the Network
        +
PHASE 2 — PERSONAL NETWORK
We Map You Into the Network
        ↓
PERSONAL ACCESS GRAPH
Who can I reach? Through whom? How strong is the path?
        ↓
ACTION INTELLIGENCE
What is the best route to the person, institution, or opportunity I care about?
```

---

## 2. Product Architecture: One Product, Two Layers

Phase 2 should **not** become a separate website or a disconnected CRM module. It should be integrated into the existing `power.tianrenyuan.com` experience as a second layer of the same graph.

### 2.1 Layer A — Intelligence Network

This is the existing Phase 1 product.

It contains shared, curated intelligence such as:

- People
- Government entities
- Sovereign wealth funds
- Investment institutions
- Corporates
- Projects
- Opportunities
- Sectors
- Countries / geographies
- Entity relationships
- Reporting lines
- Ownership / control relationships
- Project participation
- Known professional relationships

It answers:

- Who matters?
- Which institution does this person belong to?
- How are institutions connected?
- Which people are relevant to a sector, country, project, or opportunity?
- What is the structure of the network?

### 2.2 Layer B — Personal Network

This is private to each user.

It contains:

- The user's professional identity
- LinkedIn first-degree connections, where available through authorized integration
- Imported contacts
- User-confirmed relationships
- Relationship-strength signals
- Optional interaction recency signals
- Identity matches between personal contacts and Intelligence Network entities

It answers:

- Who do I know?
- Which people in the Intelligence Network are already in my network?
- Which institutions can I reach directly?
- Where do I have strong or weak coverage?

### 2.3 Layer C — Personal Access Graph

This is a **computed layer** produced by combining the Intelligence Network and Personal Network.

It answers:

- How close am I to a target?
- What is the shortest credible path?
- What is the strongest credible path?
- Through whom should I approach the target?
- How confident is the system that this path is real?
- Which important institutions are one introduction away?

```text
GLOBAL GRAPH                     PERSONAL GRAPH
(Shared Intelligence)           (Private to User)

ADIA ─ Person A                 ME ─ Ahmed
  │                                │
Person B                           Kevin
  │                                │
Project X                          John

           \                      /
            \                    /
             ENTITY MATCHING
                   ↓
            PERSONAL ACCESS GRAPH
                   ↓
      ME → Ahmed → Person A → ADIA
```

---

## 3. The Core New Variable: Accessibility

Phase 1 has a concept similar to **Importance**: how important a person, institution, or project is in the objective network.

Phase 2 introduces **Accessibility**: how reachable that same entity is **for a specific user**.

This distinction is fundamental.

```text
GLOBAL ATTRIBUTE
Importance(Person A) = 95

USER-SPECIFIC ATTRIBUTE
Accessibility(Person A, User Jeremy) = 88
Accessibility(Person A, User B) = 24
```

The Intelligence Network is shared.  
Accessibility is personalized.

### 3.1 Accessibility output shown to the user

For each target person or institution, show a concise access summary:

```text
ACCESS TO TARGET

Strong Access · 2 hops
Access Score: 84 / 100
Best Path: You → Ahmed → Target
Confidence: High
Relationship Context: Warm
```

The user should not be forced to understand the scoring formula. The score exists to rank and compare paths; the product should explain **why** a path is recommended.

---

## 4. LinkedIn: Primary Personalization Entry Point

The ideal Phase 2 onboarding experience is:

> **Connect LinkedIn → Authorize → Sync → Match → Review → Personalize the Network**

LinkedIn should be treated as the first **Personal Network Connector**, not as the permanent architecture of the personalization product.

### 4.1 Target user experience

A new user who has purchased the Personalization tier sees:

```text
PERSONALIZE YOUR NETWORK

Connect your professional network to discover
who you already know, where you have access,
and the best path to reach important people.

[ Connect LinkedIn ]

Your data remains private to your account.
```

After authorization:

```text
LinkedIn connected

2,146 connections discovered
1,382 relevant to the current intelligence universe
428 high-confidence matches
97 possible matches require review

[ View My Network ]
```

### 4.2 LinkedIn API reality and implementation requirement

The product UX should aim for a seamless authorized LinkedIn connection, but the codebase must **not assume unrestricted LinkedIn connection access**.

As of 2026, LinkedIn's official Connections API is restricted to approved developers. Where access is granted, it returns the authenticated member's **first-degree connections** and does not allow browsing the connections of those connections.

Therefore the implementation must support two connector modes behind the same product interface:

#### Mode A — Authorized LinkedIn OAuth Sync

Use when the application has the required LinkedIn approval and permissions.

Flow:

```text
Connect LinkedIn
→ LinkedIn OAuth consent
→ Access token
→ Retrieve permitted first-degree connection data
→ Normalize
→ Match
→ Store private user graph
→ Periodic re-sync, subject to token and API policy
```

#### Mode B — LinkedIn Data Export Import

Fallback when direct connection access is unavailable.

Flow:

```text
Connect LinkedIn
→ Explain secure import option
→ User downloads LinkedIn data archive / connections export
→ User uploads file
→ Normalize
→ Match
→ Store private user graph
```

The front end should still present this as one coherent **Connect LinkedIn** journey; the backend connector capability determines whether the user receives OAuth sync or secure import.

### 4.3 Explicit non-goals

The product should not depend on:

- Scraping LinkedIn pages
- Browser automation designed to bypass LinkedIn access controls
- Harvesting second-degree connections from LinkedIn
- Using one user's personal network data to enrich another user's account

Second-hop and third-hop access should be computed from **our own Intelligence Graph + the user's authorized direct relationships + verified graph relationships**, not from unauthorized LinkedIn friend-of-friend crawling.

---

## 5. Personalization User Journey

### Step 1 — Upgrade / Unlock Personalization

The current Intelligence product remains fully usable without personalization.

Navigation should expose a clear upgrade path:

```text
Network
People
Institutions
Sectors
Projects

My Network 🔒
My Access  🔒
```

After upgrading:

```text
My Network
My Access
```

Commercially, this supports two product tiers:

1. **Network Intelligence** — subscribe to the curated intelligence network.
2. **Personal Intelligence** — overlay the user's network and compute accessibility.

### Step 2 — Connect a Personal Network Source

Initial connector:

- LinkedIn

Future connectors should fit the same framework:

- Google Contacts
- Outlook / Microsoft Contacts
- CRM
- Email relationship signals
- Calendar / meeting history
- Phone contacts
- CSV / spreadsheet
- Manual entry

### Step 3 — Normalize Personal Contacts

Incoming records must be normalized before matching.

Examples:

```text
"Mubadala Investment Company" → canonical institution: MUBADALA
"Mubadala"                    → canonical institution: MUBADALA

"Mohamed Al Qubaisi"
"Mohammed Al Qubaisi"
"Mohamed Ahmed Darwish Al Qubaisi"
→ potential same-person candidates
```

Normalization should cover:

- Name casing
- Name order
- Transliteration variants
- Arabic / English spelling variants where possible
- Institution aliases
- Title normalization
- Country / location normalization
- LinkedIn profile URL normalization
- Email normalization when legally and technically available

### Step 4 — Identity Resolution / Matching

The system attempts to match each personal contact to an existing Intelligence Network entity.

This is one of the most important technical capabilities in Phase 2.

#### Matching signals

Use a weighted combination of:

1. Exact LinkedIn member/profile identifier, if available and permitted
2. Profile URL
3. Email, if available and permitted
4. Full name similarity
5. Institution / employer similarity
6. Job title similarity
7. Location similarity
8. Career-history overlap, where available in both datasets
9. Known aliases / transliterations

#### Matching confidence bands

Suggested initial thresholds, configurable by environment:

```text
≥ 0.97  Auto-match
0.80–0.97  Review recommended
< 0.80  Leave unmatched
```

The system must never silently merge low-confidence identities.

### Step 5 — Review Ambiguous Matches

A lightweight review workflow:

```text
IS THIS THE SAME PERSON?

Your LinkedIn
Mohamed Al Qubaisi
ADIA

Intelligence Network
Mohamed Ahmed Darwish Al Qubaisi
Abu Dhabi Investment Authority

Match confidence: 91%

[ Yes, Match ]   [ Not the Same Person ]
```

Confirmed decisions become user-specific matching signals and can improve future matching quality without exposing private user data across tenants.

### Step 6 — Overlay Personal Relationships

After matching, the user can turn on a new graph layer:

```text
[ Global Network ]  [ My Network ✓ ]
```

Visual rule:

- Global network = neutral grey system
- User's personal relationships = one controlled accent color
- Verified relationship = solid line
- Inferred / possible access = dashed line
- Current recommended path = stronger emphasis of the same accent family

The graph should remain visually quiet. Do not introduce multiple bright colors for different relationship types.

### Step 7 — Calculate Accessibility

The Access Engine calculates reachable targets and ranks paths.

### Step 8 — Ask and Act

The user can ask questions such as:

- Who do I know at ADIA?
- Who can introduce me to Mubadala?
- What is my strongest path into QIA?
- Which GCC sovereign wealth funds are one introduction away?
- Show my strongest relationships in the Middle East.
- Which people relevant to data centers can I reach directly?
- Where are my network gaps in Abu Dhabi?

---

## 6. Accessibility Model

Accessibility should represent **credible reachability**, not merely graph distance.

### 6.1 Core variables

#### A. Directness

How many credible hops are required?

```text
Direct connection     strongest
2 hops                strong potential
3 hops                possible
>3 hops                usually weak / exploratory
```

#### B. Relationship Strength

How strong is the user's relationship with the first-hop contact?

Possible signals:

- User manually labels relationship strength
- Frequency of known interaction
- Recency of interaction
- Shared organization / prior employment
- Confirmed meeting history
- User notes

Do not fabricate relationship strength from weak proxy data.

#### C. Recency

More recent verified interaction usually increases practical accessibility.

#### D. Institutional Relevance

Does the intermediary have a credible relationship with the target person or target institution?

A colleague in the same institution is not automatically an introducer to every executive in that institution.

#### E. Context Fit

If known, assess whether the intermediary is relevant to the user's purpose.

Example:

```text
Target: ADIA Infrastructure
Purpose: Data-center co-investment

An intermediary with direct infrastructure exposure
should rank above an unrelated contact in another function.
```

#### F. Confidence

How confident is the system in the underlying identity and edge data?

### 6.2 Suggested V1 score

Keep the exact formula configurable rather than hard-coded into the UI.

Example:

```text
Access Score =
  35% Directness
+ 25% Relationship Strength
+ 15% Recency
+ 15% Institutional Relevance
+ 10% Data Confidence
```

Context Fit can first be used as a path-ranking adjustment and later become a formal score component once sufficient data exists.

### 6.3 Access labels

The UI should translate numerical scores into intuitive labels:

```text
85–100  Very Strong Access
70–84   Strong Access
50–69   Moderate Access
30–49   Weak Access
0–29    No Reliable Access
```

Thresholds should be configurable after observing real user behavior.

---

## 7. Verified vs. Inferred Relationships

This distinction is mandatory for product trust.

### Verified edge

Evidence supports the relationship.

```text
You ───────── Ahmed
Ahmed ─────── Institution A
```

Render as solid lines.

### Inferred access

The system believes a path may exist but cannot verify the introduction relationship.

```text
Ahmed - - - - - Target Person
```

Render as dashed / lighter lines and label clearly:

> Possible access — not a verified introduction path.

The product must never claim:

> “Ahmed can introduce you to Target”

when the evidence only shows that Ahmed and Target work at the same institution.

Instead say:

> “Ahmed may provide a possible path into the target institution.”

---

## 8. UX Integration into `power.tianrenyuan.com`

The existing site remains **Network-first**. Personalization should add a layer, not create a second visual language.

The existing design principles remain authoritative:

- **Giorgia Lupi** — information expression: make complex information meaningful and human.
- **Mike Bostock** — relationship visualization: make networks explorable, understandable, and interactive.
- **Linear** — product interface: quiet, precise, modern, low-noise product UI.

### 8.1 Primary navigation

Recommended structure:

```text
INTELLIGENCE
Overview
Network
People
Institutions
Sectors
Projects
Opportunities

PERSONAL
My Network
My Access

SYSTEM
Ask
Settings
```

Do not visually over-separate these into two products. “Personal” is a mode of the Intelligence Network.

### 8.2 Global / Personal toggle

On Network pages:

```text
[ Intelligence ]  [ My Overlay ]
```

Possible states:

```text
Intelligence only
Intelligence + My Network
My Access focus
```

### 8.3 My Network

Purpose:

> Show which parts of the Intelligence Network are already connected to the user.

Key views:

- Matched contacts
- Directly connected institutions
- Geography coverage
- Sector coverage
- Unmatched contacts
- Match review queue

### 8.4 My Access

This is the most important new Phase 2 destination.

Instead of showing “everyone in the network,” it prioritizes targets by personal reachability.

Example:

```text
MY ACCESS — ADIA

Person A       DIRECT
Person B       STRONG · 2 HOPS
Person C       STRONG · 2 HOPS
Person D       MODERATE · 3 HOPS
Person E       NO RELIABLE PATH
```

Filters:

- Institution
- Country
- Sector
- Target type
- Access strength
- Direct / 2-hop / 3-hop
- Verified only

### 8.5 Target detail panel

When a user opens a target person or institution, the Phase 1 intelligence detail remains visible, with a new user-specific Access section:

```text
TARGET PERSON
Name
Institution
Role
Sector

GLOBAL INTELLIGENCE
Importance: 94
Relevant projects: 3
Relevant relationships: 12

MY ACCESS
Strong Access · 2 hops
Best path: You → Ahmed → Target
Confidence: High

[ Show Path ]
[ Ask About This Target ]
```

### 8.6 Recommended path visualization

When the user clicks **Show Path**, suppress unrelated graph noise.

```text
YOU
 │
Ahmed
 │
Target Person
 │
ADIA
```

Everything unrelated fades into the background.

---

## 9. Ask the Network — Personalization Mode

The existing Ask experience becomes materially more powerful after Phase 2.

The query engine must understand both:

- Global intelligence
- User-specific accessibility

### 9.1 Query classes

#### Global question

> Who is important in Abu Dhabi data centers?

Uses Global Intelligence only.

#### Personal question

> Who do I know in Abu Dhabi data centers?

Uses personal matches + Global Intelligence.

#### Access question

> How can I reach Person X?

Uses Access Engine.

#### Comparative access question

> Which GCC sovereign wealth funds are easiest for me to reach?

Ranks institutions using user-specific accessibility.

#### Gap-analysis question

> Where are my biggest relationship gaps in the water sector?

Compares Importance against Accessibility.

### 9.2 Important product insight: Importance × Accessibility

Phase 2 allows the system to identify high-value gaps.

```text
HIGH IMPORTANCE + HIGH ACCESSIBILITY
→ Act now

HIGH IMPORTANCE + LOW ACCESSIBILITY
→ Network gap / relationship-building priority

LOW IMPORTANCE + HIGH ACCESSIBILITY
→ Useful but not strategic

LOW IMPORTANCE + LOW ACCESSIBILITY
→ Low priority
```

This is a major path from Personalization to future **Action Intelligence**.

---

## 10. Mobile Experience

Phase 2 must preserve the V1.1 mobile principle:

> **Desktop = Explore complexity. Mobile = Focus, Ask, Confirm, Act.**

Do not shrink the desktop graph into a phone screen.

### 10.1 Mobile home

Keep only:

```text
My Network
My Access
Ask
```

Primary mobile entry:

> **Ask your network…**

### 10.2 Mobile target view

Show:

- Target identity
- Institution
- Importance
- Personal access strength
- Best path
- One primary action

Avoid permanent sidebars, dense filter bars, or multi-column panels.

### 10.3 Mobile path view

Present a guided path vertically:

```text
YOU
 ↓
Ahmed
 ↓
Target
 ↓
Institution
```

Tap each node for a bottom sheet.

### 10.4 Mobile matching review

Use a simple card-based confirm flow:

```text
Possible Match

LinkedIn contact
vs.
Intelligence person

[ Match ]
[ Not Same ]
```

This is a high-value mobile task because it is quick and focused.

---

## 11. Privacy and Data Separation

Personalization requires strict tenant isolation.

### 11.1 Data classes

#### Shared Global Data

- Global entities
- Global relationships
- Curated intelligence
- Projects
- Institutions
- Sectors

#### Private User Data

- User contacts
- LinkedIn connector tokens
- Imported personal-network records
- User-confirmed relationships
- Relationship-strength labels
- Personal notes
- Match decisions
- Personal access scores and paths

### 11.2 Mandatory rules

1. A user's personal network is never visible to another user.
2. Personal contacts must not automatically become shared Global Intelligence entities.
3. Personal relationship signals must not be used to enrich the global graph without explicit policy and user consent.
4. Disconnecting LinkedIn must revoke or delete connector credentials as appropriate.
5. The user must be able to delete imported personal data.
6. OAuth tokens must be encrypted at rest.
7. Access to private graph data must be enforced server-side, not only hidden in the UI.
8. Every personal-graph query must be tenant/user scoped.
9. Sync and matching actions should be auditable.
10. Product copy must distinguish verified, user-provided, and inferred relationships.

---

## 12. Proposed Data Model

The existing Phase 1 schema should remain authoritative for the Intelligence Graph. Add a private personalization schema rather than duplicating the global entities.

### 12.1 Global entities

```text
GlobalEntity
- id
- entity_type
- canonical_name
- aliases[]
- institution_id
- title
- country
- sector_ids[]
- importance_score
- metadata
```

```text
GlobalEdge
- id
- source_entity_id
- target_entity_id
- relationship_type
- confidence
- verification_status
- source_metadata
```

### 12.2 Connector account

```text
ConnectorAccount
- id
- user_id
- provider                 // linkedin, google, outlook, csv
- connection_mode          // oauth, export_import, manual
- provider_account_id
- encrypted_access_token
- encrypted_refresh_token
- token_expiry
- permission_scope
- sync_status
- last_synced_at
- created_at
- disconnected_at
```

### 12.3 Personal contact

```text
PersonalContact
- id
- user_id
- connector_account_id
- provider_contact_id
- raw_name
- normalized_name
- company_raw
- company_normalized
- title_raw
- title_normalized
- location
- profile_url
- email_hash_or_value      // only if permitted and required
- raw_payload_reference
- imported_at
- last_seen_at
```

### 12.4 Identity match

```text
IdentityMatch
- id
- user_id
- personal_contact_id
- global_entity_id
- match_score
- match_status              // auto_matched, review, confirmed, rejected
- match_reasons[]
- confirmed_by
- confirmed_at
- model_version
```

### 12.5 Personal edge

```text
PersonalEdge
- id
- user_id
- source_personal_or_user_id
- target_personal_or_global_id
- edge_type                 // knows, worked_with, met, introduced_by, etc.
- relationship_strength
- verification_status
- last_interaction_at
- source
- confidence
```

### 12.6 Access result

Do not persist every possible path indefinitely. Cache high-value computed results.

```text
AccessResult
- id
- user_id
- target_global_entity_id
- access_score
- access_label
- hop_count
- best_path_json
- confidence
- explanation_json
- calculation_version
- calculated_at
- expires_at
```

---

## 13. Service / Module Boundaries

Do not immediately create many independent microservices unless the current platform already uses that architecture. Start with clean module boundaries and extract services when scale or ownership requires it.

### 13.1 Intelligence Graph Module

Existing Phase 1 responsibility:

- Global entities
- Global edges
- Intelligence queries
- Existing network views

### 13.2 Connector Module

Responsibilities:

- LinkedIn authorization
- LinkedIn export import
- Future connectors
- Token management
- Sync jobs
- Connector capability detection

Suggested interface:

```ts
interface PersonalNetworkConnector {
  authorize(userId: string): Promise<AuthResult>
  sync(userId: string): Promise<SyncResult>
  normalize(record: unknown): Promise<NormalizedContact>
  disconnect(userId: string): Promise<void>
}
```

### 13.3 Identity Resolution Module

Responsibilities:

- Candidate generation
- Name matching
- Company matching
- Title matching
- Location matching
- Alias matching
- Confidence scoring
- Review queue
- Confirm / reject feedback

### 13.4 Personal Graph Module

Responsibilities:

- Private contacts
- Private edges
- User-specific relationship metadata
- Personal graph overlay queries

### 13.5 Access Engine

Responsibilities:

- Direct access detection
- K-hop path search
- Path ranking
- Access scoring
- Path confidence
- Explanation generation

### 13.6 Ask / Query Orchestrator

Responsibilities:

- Classify global vs. personal vs. access question
- Resolve named entities
- Query Global Graph
- Query Personal Graph
- Query Access Engine
- Return grounded answer + graph focus state

### 13.7 Privacy / Audit Module

Responsibilities:

- Consent records
- User-data deletion
- Token lifecycle
- Audit logs
- Data retention
- Tenant isolation checks

---

## 14. Proposed API Surface

Names can be adapted to the existing backend style.

### LinkedIn / connector

```http
POST /api/v1/personal/connectors/linkedin/authorize
GET  /api/v1/personal/connectors/linkedin/callback
POST /api/v1/personal/connectors/linkedin/sync
POST /api/v1/personal/connectors/linkedin/import
GET  /api/v1/personal/connectors
DELETE /api/v1/personal/connectors/{connectorId}
```

The authorize endpoint may return one of two capability modes:

```json
{
  "mode": "oauth",
  "authorization_url": "..."
}
```

or:

```json
{
  "mode": "export_import",
  "instructions": "linkedin_data_export"
}
```

### Matching

```http
POST /api/v1/personal/matching/run
GET  /api/v1/personal/matching/review
POST /api/v1/personal/matching/{matchId}/confirm
POST /api/v1/personal/matching/{matchId}/reject
```

### Personal graph

```http
GET /api/v1/personal/network/summary
GET /api/v1/personal/network/overlay
GET /api/v1/personal/network/contacts
GET /api/v1/personal/network/institutions
```

### Accessibility

```http
GET  /api/v1/access/target/{globalEntityId}
POST /api/v1/access/query
GET  /api/v1/access/institutions
GET  /api/v1/access/gaps
```

Example response:

```json
{
  "target_id": "person_123",
  "access_score": 84,
  "access_label": "Strong Access",
  "hop_count": 2,
  "confidence": 0.91,
  "path": [
    {"type": "user", "id": "me"},
    {"type": "person", "id": "person_45"},
    {"type": "person", "id": "person_123"}
  ],
  "explanation": {
    "directness": "2 hops",
    "first_hop_strength": "strong",
    "target_edge": "verified professional relationship"
  }
}
```

### Personal Ask

```http
POST /api/v1/ask
```

Request:

```json
{
  "query": "Who is my strongest path into ADIA infrastructure?",
  "mode": "auto"
}
```

Response should include both natural-language output and graph instructions:

```json
{
  "answer": "Your strongest known path is through ...",
  "mode": "personal_access",
  "target_entities": ["..."],
  "focus_path": ["me", "person_45", "person_123", "adia"],
  "confidence": 0.91
}
```

---

## 15. Graph Query Logic

### 15.1 Shortest path is not always best path

The system should distinguish:

- **Shortest Path** — minimum number of hops
- **Strongest Path** — best combined relationship strength and confidence
- **Best Path** — optimized for practical access, combining distance, strength, relevance, and confidence

Example:

```text
Path A
You → Weak Contact → Target
2 hops

Path B
You → Strong Contact → Trusted Intermediary → Target
3 hops
```

The product may recommend Path B even though it is longer.

### 15.2 Path search constraints

Initial defaults:

- Prefer 1–3 hops
- Avoid paths containing low-confidence identity matches
- Penalize inferred edges
- Penalize stale relationships
- Penalize irrelevant institutional paths
- Do not route through users' private contacts belonging to another tenant

---

## 16. Visual System for Personalization

The personalization layer must use the same design language as Phase 1.

### 16.1 Color

Maintain a restrained system:

- Neutral background
- Neutral global graph
- One accent color for “My Network / My Access”
- Semantic warning/error colors only when necessary

Suggested hierarchy:

```text
Global entity           Neutral dark
Global relationship     Neutral light grey
My direct connection    Accent
My access path          Accent, stronger emphasis
Possible/inferred path  Accent, low opacity / dashed
Selected target         Dark focus state
```

Avoid:

- Rainbow relationship types
- Bright CRM-style status badges everywhere
- Heat-map coloring of the entire graph

### 16.2 Node semantics remain consistent

- Person = avatar
- Government = symbol / institutional mark
- Fund = logo
- Company = logo
- Project = rounded rectangle
- Opportunity = diamond

Personalization should change **relationship emphasis**, not redefine the identity system.

---

## 17. Subscription / Entitlement Model

### Tier 1 — Network Intelligence

**Promise:** *We Map the Network.*

Includes:

- Intelligence graph
- People and institution intelligence
- Sector / geography / project views
- Global Ask

### Tier 2 — Personal Intelligence

**Promise:** *We Map You Into the Network.*

Includes Tier 1 plus:

- LinkedIn / personal-network connection
- Identity matching
- My Network overlay
- My Access
- Access scores
- Best-path discovery
- Personal Ask
- Network-gap analysis

The upgrade message should be value-led:

> **See where you already have access — and discover the best path to the people who matter.**

Avoid generic “Upgrade to Premium” language.

---

## 18. Implementation Plan

### Phase 2A — Personal Network Foundation

Goal:

> **Map the user into the Intelligence Network.**

Build:

1. User entitlement for Personalization
2. Connector framework
3. LinkedIn connector with OAuth capability + export-import fallback
4. PersonalContact model
5. Normalization pipeline
6. Identity Resolution Engine
7. Match review UI
8. My Network overlay
9. Privacy and deletion controls

**Phase 2A is complete when a user can connect/import LinkedIn, see their contacts matched to Intelligence entities, review uncertain matches, and visually overlay verified personal relationships.**

### Phase 2B — Accessibility Engine

Goal:

> **Tell the user how close they are to important targets.**

Build:

1. Direct-access detection
2. 2-hop / 3-hop path engine
3. Access Score V1
4. Best Path ranking
5. Verified vs inferred path handling
6. My Access page
7. Target Access panel
8. Institution-level access rollup

### Phase 2C — Personal Ask

Goal:

> **Turn the personalized graph into a conversational intelligence system.**

Build:

1. Personal query classification
2. Entity resolution in questions
3. Personal graph retrieval
4. Access Engine integration
5. Answer + graph-focus response
6. Gap-analysis questions
7. Recommended-path questions

### Phase 2D — Broader Personal Data Connectors

After LinkedIn is stable:

- Google Contacts
- Microsoft / Outlook
- CRM
- Email / calendar relationship signals, with explicit user consent
- Manual relationship updates

---

## 19. Feature Flags

Recommended flags:

```text
personalization_enabled
linkedin_connector_enabled
linkedin_oauth_enabled
linkedin_export_import_enabled
identity_matching_v1
personal_graph_overlay
access_engine_v1
personal_ask_enabled
mobile_personalization_enabled
```

This allows rollout without destabilizing Phase 1.

---

## 20. Acceptance Criteria

### LinkedIn connection

- User can initiate Connect LinkedIn from inside `power.tianrenyuan.com`.
- Connector automatically uses the supported integration mode.
- OAuth tokens are never exposed to the client after callback handling.
- User sees sync/import status and last-sync time.
- User can disconnect and delete imported personal data.

### Matching

- Imported contacts are normalized.
- High-confidence matches can be auto-matched.
- Ambiguous matches appear in a review queue.
- Low-confidence matches remain separate.
- User decisions are retained for that user.

### Graph overlay

- Global graph remains readable when Personal Overlay is enabled.
- Personal relationships use one restrained accent system.
- Verified and inferred edges are visually distinct.
- Selecting a path fades unrelated graph elements.

### Accessibility

- A target can return direct / 2-hop / 3-hop / no-reliable-path status.
- Best Path is not assumed to equal Shortest Path.
- Every recommended path includes a confidence level and explanation.
- Inferred paths are never described as guaranteed introductions.

### Privacy

- All personal records are user-scoped.
- No private graph data leaks through global search, cache, logs, exports, or another user's query.
- User can delete their personal imported data.
- Connector credentials are encrypted.

### Mobile

- Personalization is usable without displaying a desktop-scale graph.
- Ask, Best Path, Match Review, and Target Access are first-class mobile flows.
- Detail appears in focused mobile surfaces / bottom sheets rather than permanent side panels.

---

## 21. Success Metrics

Do not measure success only by number of imported connections.

### Onboarding

- % of Personalization subscribers who connect a network source
- Connection/import completion rate
- Time to first matched contact
- % of contacts matched automatically
- % requiring review

### Value

- % of users who open My Access
- Number of target access queries per active user
- % of important Intelligence entities with a known personal path
- Number of “Show Path” interactions
- Number of Personal Ask queries

### Quality

- Match-confirmation accuracy
- Match-rejection rate
- Access-path correction rate
- % of recommended paths using verified vs inferred edges
- User feedback on path usefulness

### Strategic metric

A useful north-star metric for Phase 2:

> **Meaningful Targets with Credible Access per Active User**

This measures whether the system is turning intelligence into practical reachability.

---

## 22. Future: From Personalization to Action Intelligence

Personalization should create the foundation for a later third stage, but Phase 2 should not overbuild this now.

```text
1. MAP
What does the network look like?

2. POSITION
Where am I inside the network?

3. ACCESS
How can I reach the people who matter?

4. ACTION
Who should I approach next, and why?
```

Future features may include:

- Priority relationship recommendations
- High-importance / low-access gap alerts
- Suggested people to reconnect with
- Meeting-preparation intelligence
- Opportunity-to-network matching
- Relationship coverage by strategic objective

These should be built only after the Personal Graph and Accessibility Engine are trusted.

---

## 23. Product North Star

The combined product should be explainable in three sentences:

> **We Map the Network.**  
> Understand who matters and how the market is connected.

> **We Map You Into the Network.**  
> Connect your professional relationships and see where you already have access.

> **We Show You the Best Path.**  
> Discover who can help you reach the people, institutions, and opportunities that matter.

The technical north star is equally simple:

```text
GLOBAL GRAPH
+
PRIVATE PERSONAL GRAPH
+
IDENTITY RESOLUTION
+
ACCESSIBILITY ENGINE
=
PERSONAL NETWORK INTELLIGENCE
```

---

## 24. LinkedIn Implementation References

For implementation planning, validate current permissions and product access against LinkedIn's official documentation before production deployment.

- LinkedIn Connections API — official Microsoft Learn documentation
  - Restricted to approved developers
  - Returns first-degree connections for the authenticated member when authorized
  - Does not permit browsing second-degree connections
- LinkedIn member data export — official LinkedIn Help documentation
  - Supports user-requested export of connection data

The application architecture should remain connector-agnostic so future changes in LinkedIn API policy do not require rebuilding the Personalization product.
