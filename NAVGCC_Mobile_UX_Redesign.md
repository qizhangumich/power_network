# NAVGCC Mobile UX Redesign — Implementation Brief

## Executive Overview

The current NAVGCC desktop experience is already strong and should remain largely unchanged. The mobile experience should **not** be treated as a compressed desktop version. Instead, redesign mobile as a dedicated intelligence-navigation experience optimized for small screens, touch interaction, fast lookup, and meeting-time usage.

The core product principle is:

> **Desktop = Network Analysis Workspace**  
> **Mobile = GCC Intelligence Navigator**

Desktop should continue to help users understand the whole network. Mobile should help users quickly answer four questions:

1. **Who matters?**
2. **Which institution matters?**
3. **How are they connected?**
4. **What should I know before I meet them?**

The mobile product should prioritize **Explore, Search / Ask the Network, People, Institutions, and focused network exploration**, rather than showing the entire graph by default. The graph remains important, but becomes one exploration layer inside the mobile experience rather than the starting interface.

The implementation goal is that a user can reach useful intelligence within **three taps**, while preserving the current desktop experience. Do not rebuild the desktop. Do not fork the whole codebase. Reuse the same data, APIs, intelligence layer, profiles, and graph model, while creating mobile-specific layouts and interaction patterns where needed.

Implementation priority:

**Phase 1:** Mobile foundation, navigation, Explore page, Ask/Search, graph cleanup, node interaction, bottom sheets.  
**Phase 2:** People, institutions, sectors, filters, sources, saved entities.  
**Phase 3:** PWA and app-like mobile experience.  
**Phase 4:** Meeting brief, watchlists, alerts, and personalized intelligence.

---

## 1. Objective

The current NAVGCC desktop experience is already strong and should remain largely unchanged.

The mobile experience, however, should **not be a compressed version of desktop**.

Redesign NAVGCC for mobile as a dedicated mobile-first intelligence experience.

The fundamental distinction should be:

> **Desktop = Network Analysis Workspace**  
> **Mobile = GCC Intelligence Navigator**

Desktop is optimized for seeing and analyzing complex networks.

Mobile should be optimized for quickly answering:

> **Who matters?**  
> **Which institution matters?**  
> **How are they connected?**  
> **What should I know before I meet them?**

A mobile user should be able to reach useful intelligence within **three taps**.

---

## 2. Critical Requirement: Protect Desktop

Do **not** redesign the existing desktop product.

Use responsive breakpoints and mobile-specific components/layout behavior.

Recommended breakpoints:

```text
Desktop: ≥ 1024px
Tablet: 768–1023px
Mobile: < 768px
Small Mobile: < 390px
```

Desktop functionality, information density and graph behavior should remain substantially unchanged.

Mobile may use completely different presentation and interaction patterns where appropriate.

---

## 3. Mobile Product Architecture

The mobile experience should have four primary modes:

### Explore
Default mobile homepage for a selected market.

### Search / Ask
Search people, institutions and ask natural-language questions about the network.

### Network
Interactive visual relationship graph.

### Saved
Saved people, institutions and eventually briefings.

The important change is:

**Network should NOT be the default mobile experience.**

The graph becomes one powerful exploration tool within the product rather than the entire product interface.

---

## 4. Market Selection Page

The existing mobile market-selection page is directionally good and should not be completely redesigned.

But improve information hierarchy.

Current:

> Choose a market  
> Eight living maps of power across the Gulf...

Consider simplifying the mobile headline to:

### Navigate the GCC.
### Know who matters.

Supporting copy:

> People, institutions and networks shaping business across the Gulf.

Then:

### GCC Map

Reduce map vertical height approximately **25–35%** compared with the current implementation.

The map is navigation/context, not the primary content.

Below it:

### Market Cards

Example:

**Abu Dhabi**  
412 people · 205 institutions

**Dubai**  
232 people · 86 institutions

**Saudi Arabia**  
xxx people · xxx institutions

Cards should:

- use full available width
- have large touch areas
- minimum 44px interactive target
- provide clear pressed state
- avoid unnecessary decorative information

Ideally 1.5–2 market cards should remain visible on a normal iPhone screen after the map.

---

## 5. Mobile Market Home

When the user enters Abu Dhabi, do **not** immediately open the full network visualization.

Instead open:

# Abu Dhabi

with a clean intelligence dashboard.

Suggested structure:

```text
NAVGCC                         ☰

Abu Dhabi ▼

┌─────────────────────────────┐
│ Ask the Abu Dhabi network   │
│ Search people, institutions │
└─────────────────────────────┘

KEY PEOPLE                    See all >

[ Person ] [ Person ] [ Person ] →

KEY INSTITUTIONS              See all >

[ ADIA ]
[ Mubadala ]
[ ADQ ]
[ ADNOC ]

EXPLORE

Government
Sovereign Capital
Energy
Technology
Healthcare
Infrastructure

EXPLORE THE NETWORK        →
```

This should become the default mobile experience.

---

## 6. Make “Ask the Network” a Hero Feature

NAVGCC should not feel like merely a database or visualization website.

Its differentiated experience is:

> **Ask the Network**

On mobile this should become much more prominent.

Instead of the current narrow top navigation input, create a nearly full-width search/AI input.

Placeholder:

> Ask the Abu Dhabi network...

Example queries can rotate underneath:

> Who controls healthcare investment?

> Who are the key decision makers at ADIA?

> How are ADQ and Mubadala connected?

> Who matters in Abu Dhabi data centers?

Search should support both:

### Entity Search

- Person
- Institution
- Board
- Sector

and

### Intelligence Question

Natural-language questions.

---

## 7. Completely Redesign the Mobile Network Graph

This is the biggest priority.

The current mobile implementation tries to display:

**node + label + node + label + relationships**

simultaneously.

This produces severe label collision.

### Never display every label simultaneously on mobile.

Default mobile network should display approximately:

**15–25 key nodes**

rather than hundreds.

Only approximately:

**5–8 highest-priority nodes**

should have persistent labels.

All remaining nodes appear visually without labels.

---

## 8. Progressive Disclosure

Use progressive disclosure aggressively.

Initial state:

```text
           ○

      ○         ○

           ●
          ADIA

     ○           ○

           ○
```

Only key nodes show names.

When the user taps ADIA:

```text
           ○
        Chairman

      ○────●────○
          ADIA

        ╱     ╲
       ○       ○
```

Then:

- ADIA moves/focuses toward center
- first-degree relationships become prominent
- unrelated nodes fade
- first-degree connected node labels appear
- unrelated labels disappear

This creates a much cleaner exploration experience.

---

## 9. Node Selection Interaction

When the user taps a person or institution:

### Step 1 — Focus graph

Selected node becomes visually prominent.

### Step 2 — Show direct connections

First-degree relationships become visible.

### Step 3 — Fade irrelevant network

Do not remove everything completely because users need spatial context.

Use reduced opacity.

### Step 4 — Open Bottom Sheet

Never use a traditional centered modal for node information on mobile.

Use an iOS/Android-style draggable bottom sheet.

---

## 10. Person Bottom Sheet

Example:

```text
────────────────────────────
Sheikh XXXXXXXXX

Chairman
XXXX Institution

Government · Sovereign Capital

Why this person matters

One or two sentence explanation
of their role in the Abu Dhabi
decision-making network.

KEY ROLES

Chairman
Institution A

Board Member
Institution B

KEY CONNECTIONS

→ Person A
→ Institution B
→ Institution C

[ View Full Profile ]
────────────────────────────
```

Bottom sheet should support:

- collapsed state
- half-height state
- full-screen state
- swipe down to dismiss

---

## 11. Institution Bottom Sheet

Example:

```text
ADIA

Abu Dhabi Investment Authority

Sovereign Wealth Fund

WHY IT MATTERS

Short intelligence summary.

LEADERSHIP

Chairman
XXXXXXXX

Managing Director
XXXXXXXX

KEY RELATIONSHIPS

→ Abu Dhabi Government
→ Investment Committee
→ Portfolio entities

[ View Institution ]
```

Again, graph remains behind the sheet.

---

## 12. Mobile Graph Gestures

Support native-feeling gestures:

### Tap
Select node.

### Tap empty area
Deselect node.

### Drag
Pan graph.

### Pinch
Zoom.

### Double tap
Zoom/focus.

### Double tap empty area
Reset graph.

Graph movement should feel stable and deliberate.

Avoid excessive physics animation.

After initial graph stabilization, reduce or stop force simulation where possible.

Users should feel they are navigating an intelligence map, not watching particles move around.

---

## 13. Mobile Label Rules

Implement explicit label logic.

Labels should be determined by something like:

```text
priority =
importance score
+ selected relevance
+ connection relevance
+ zoom level
```

Default:

Top 5–8 nodes show labels.

Selected node:

Always show label.

Direct connections:

Show labels.

Zoom in:

Gradually reveal more labels.

Zoom out:

Hide lower-priority labels.

### Critical rule

Never allow labels to overlap heavily.

If collision occurs:

hide the lower-priority label.

Do **not** simply shrink fonts until everything fits.

---

## 14. Mobile Graph Filters

Do not expose every filter simultaneously.

Add one button:

### Filter

Tap → bottom sheet:

```text
FILTER NETWORK

Entity Type

☑ People
☑ Institutions

Sector

□ Government
□ Sovereign Capital
□ Energy
□ Healthcare
□ Technology
□ Infrastructure

Relationship

□ Leadership
□ Board
□ Ownership
□ Investment
□ Family / Royal
```

Apply filters without navigating away.

---

## 15. Sector Exploration

Mobile users often know the subject before they know the person.

Therefore make sectors prominent.

For Abu Dhabi:

```text
Explore by Sector

Government
Sovereign Capital
Energy
Finance
Healthcare
Technology & AI
Infrastructure
Real Estate
Utilities
Education
```

Tap:

### Energy

Then show:

```text
ENERGY

Key Institutions

ADNOC
TAQA
Masdar
EWEC

Key People

Person A
Person B
Person C

[ View Energy Network ]
```

This will be far easier to use on mobile than starting from a giant graph.

---

## 16. Person Profile Page

A person's mobile profile should be designed vertically.

Structure:

```text
← Abu Dhabi

PERSON NAME

Current Position
Institution

WHY THIS PERSON MATTERS

Concise intelligence summary.

CURRENT ROLES

Role
Institution

Role
Institution

BOARD MEMBERSHIPS

Institution
Role

KEY CONNECTIONS

[Person] [Person] [Institution]

NETWORK POSITION

[Small focused network]

RELATED NEWS

SOURCES
```

The small graph here should show only the immediate neighborhood.

Do **not** embed the entire Abu Dhabi network.

---

## 17. Institution Profile

Similar structure:

```text
INSTITUTION

ADIA

Sovereign Wealth Fund

WHY IT MATTERS

LEADERSHIP

OWNERSHIP / GOVERNANCE

KEY PEOPLE

SUBSIDIARIES / RELATED ENTITIES

KEY RELATIONSHIPS

NETWORK

RECENT DEVELOPMENTS

SOURCES
```

---

## 18. Mobile Navigation

Avoid squeezing desktop navigation into mobile.

Recommended persistent bottom navigation:

```text
Explore     Search     Network     Saved
   ⌂           ⌕          ◎          ☆
```

Keep it simple.

Do not exceed four or five primary navigation items.

Account/settings/market switching can live in the top menu.

---

## 19. Mobile Header

Current mobile header contains too many horizontally compressed controls.

Replace with something closer to:

```text
[NAVGCC]              Abu Dhabi ▼   ☰
```

or:

```text
NAVGCC                         ☰

Abu Dhabi ▼
```

Then place Ask/Search below.

Do not put:

Logo + long product name + market selector + search + hamburger

all in one horizontal row.

---

## 20. Remove “Abu Dhabi Power Network” From Mobile Header

On desktop this terminology can work.

On mobile, it consumes too much space and reinforces the idea that the product is only a visualization.

Prefer:

### NAVGCC

Market context underneath:

### Abu Dhabi

The network is one view inside NAVGCC.

---

## 21. Mobile Typography

Optimize for readability.

Recommended approximate sizes:

```text
Page title          28–32px
Section heading     18–22px
Person name         17–20px
Body                15–17px
Metadata            13–15px
Graph label         11–13px
```

Do not solve density problems by reducing text below comfortable mobile readability.

---

## 22. Touch Targets

Every interactive control should be at least:

**44 × 44 px**

Prefer:

**48 × 48 px**

for important controls.

This includes:

- menu
- filter
- node actions
- market selector
- bottom navigation
- close button
- search
- graph reset

---

## 23. Safe Areas

Optimize explicitly for iPhone Safari and installed PWA.

Support:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
env(safe-area-inset-right)
```

Bottom navigation must never conflict with:

- Safari toolbar
- iPhone Home Indicator

This is especially important based on the current screenshots.

---

## 24. Mobile Viewport

Ensure:

```html
<meta
  name="viewport"
  content="width=device-width,
           initial-scale=1,
           viewport-fit=cover"
/>
```

Avoid accidental horizontal overflow.

Nothing should exceed:

```css
max-width: 100vw;
```

unless intentionally part of a horizontal carousel.

---

## 25. Horizontal Carousels

Horizontal scrolling is appropriate for:

### Key People

```text
[Person A] [Person B] [Person C] →
```

### Institutions

```text
[ADIA] [ADQ] [Mubadala] →
```

But avoid horizontal scrolling for normal text/data.

The user should immediately understand that a carousel is swipeable.

Show part of the next card.

---

## 26. Mobile Performance

This is important because the graph/database may become large.

Do **not** load/render hundreds of nodes immediately.

Initial mobile payload should contain only the information necessary for the current view.

For graph:

```text
Initial:
15–25 nodes

After selection:
selected neighborhood

After zoom/filter:
progressively load additional nodes
```

Use lazy loading for:

- profile details
- news
- secondary connections
- large network datasets

---

## 27. Skeleton Loading

Avoid blank screens and generic spinning loaders.

Use skeleton states:

```text
██████████
██████

[████] [████] [████]

████████
████████
```

especially for:

- Explore
- Person Profile
- Institution Profile
- Ask Network answers

---

## 28. Ask Network Mobile Answer Design

This deserves a dedicated mobile result format.

Question:

> Who are the key people in Abu Dhabi healthcare?

Answer should **not** simply be a long AI paragraph.

Structure:

```text
Abu Dhabi Healthcare

The network is primarily shaped by
three institutional clusters...

KEY PEOPLE

1. Person A
   Role
   Institution

2. Person B
   Role
   Institution

KEY INSTITUTIONS

PureHealth
Department of Health
ADQ

NETWORK

[View relevant network]

SOURCES

4 verified sources
```

AI answers should lead back into structured NAVGCC data.

This is important.

**AI should be an interface to the database, not a separate chatbot floating above it.**

---

## 29. Sources and Trust

Your tagline says:

> Connect with Confidence.

Therefore mobile should make trust visible.

On profiles and AI answers show:

```text
Verified
Updated 2 days ago
4 Tier-1 sources
```

Tap:

### Sources

opens a bottom sheet with the supporting sources.

This creates a strong distinction between NAVGCC and generic AI answers.

---

## 30. Saved Intelligence

Build the mobile architecture so that Saved can later support:

```text
Saved People
Saved Institutions
Saved Networks
Saved Searches
```

Eventually:

### Watch

> Notify me when this person's role changes.

> Notify me when ADIA announces a major appointment.

This does not need to be fully implemented in the first redesign, but the architecture should allow it.

---

## 31. Meeting Mode — Design for Future Expansion

Do not necessarily build this now, but prepare the information architecture for it.

Future mobile feature:

# Meeting Brief

Example:

```text
Meeting in 30 min

Ahmed XXXXX
ADIA

5-MINUTE BRIEF

Current Role

Why He Matters

Reporting Line

Board Memberships

Recent Developments

Mutual Connections

Topics Worth Discussing

[View Network]
```

This could eventually become one of NAVGCC's strongest mobile use cases.

---

## 32. PWA — Implement Now If Architecture Allows

Do **not** build a separate native iOS/Android application at this stage.

Instead make the mobile web application PWA-ready.

Support:

- Add to Home Screen
- standalone display
- app icon
- splash behavior
- manifest
- service worker where appropriate
- basic caching
- mobile-safe navigation

Example manifest behavior:

```text
name: NAVGCC
short_name: NAVGCC
display: standalone
```

The goal is:

**navgcc.com should feel like an app when installed on an iPhone.**

---

## 33. Do Not Fork the Entire Codebase

Avoid creating:

```text
desktop-app/
mobile-app/
```

unless absolutely necessary.

Prefer shared:

```text
data
API
authentication
search
AI
entity models
profiles
```

with responsive/mobile-specific presentation components.

Conceptually:

```text
Shared Intelligence Layer
        ↓
 ┌───────────────┐
 Desktop UI
 └───────────────┘

 ┌───────────────┐
 Mobile UI / PWA
 └───────────────┘
```

One intelligence product, two optimized interfaces.

---

## 34. Mobile Design Philosophy

The visual language should remain consistent with the current NAVGCC brand:

- professional
- institutional
- calm
- premium
- intelligence-oriented
- high trust

Avoid making it look like:

- social media
- crypto dashboard
- flashy startup visualization
- gaming interface
- generic AI chatbot

The target feeling should be closer to:

**Bloomberg / Capital IQ / institutional intelligence product**

but dramatically simpler and more elegant on mobile.

---

## 35. Information Density Rule

For every mobile screen ask:

> What is the single most important thing the user should understand here?

Then show secondary information progressively.

Mobile:

**summary → detail → network**

not:

**everything → shrink everything → unreadable**

---

## 36. Specific Fix for Current Screenshot

The current mobile network screenshot is unacceptable because:

1. labels overlap
2. nodes overlap
3. hierarchy is unclear
4. graph occupies large space without providing readable information
5. top navigation is compressed
6. “Showing key nodes only” message obscures content
7. there is no obvious starting point
8. user cannot understand what to tap first

Replace that experience completely.

The redesigned initial Network screen should resemble:

```text
Abu Dhabi Network

[ Search the network            ]

Government   Capital   Energy   More

              ○

        ○           ○

              ●
             ADIA

        ○           ○

              ○

25 key nodes shown

[ Filters ]             [ Reset ]
```

Clean, sparse and interactive.

---

## 37. Onboarding Hint

Do not permanently show:

> Showing key nodes only — open ≡ to show all

Instead, first visit only:

```text
Tap a node to explore connections
Pinch to zoom
```

Then disappear automatically.

Never cover important graph content with persistent tutorial UI.

---

## 38. Responsive QA

Test at minimum:

```text
320px
375px
390px
393px
402px
430px
768px
1024px+
```

Especially:

- iPhone SE
- standard iPhone
- iPhone Pro
- iPhone Pro Max
- Android equivalent
- iPad portrait
- desktop

Test both Safari and Chrome.

---

## 39. Acceptance Criteria

The redesign is complete only when:

### Homepage
No horizontal overflow.

### Market page
Market selection is understandable without zooming.

### Explore
A user understands what NAVGCC offers within five seconds.

### Search
Ask Network is immediately discoverable.

### Graph
No severe label collision at default zoom.

### Graph
No more than approximately 5–8 labels visible by default.

### Node
One tap clearly selects a node.

### Relationships
Selected node's direct connections are understandable.

### Details
Node information appears through bottom sheet.

### Navigation
Important actions are reachable one-handed.

### Performance
Initial mobile screen feels fast.

### Desktop
Existing desktop UX remains intact.

---

## 40. Implementation Priority

Do this in phases.

### Phase 1 — Fix the foundation

- Mobile header
- Mobile navigation
- Market page
- Explore page
- Ask/Search
- Graph label collision
- Node selection
- Bottom sheet

### Phase 2 — Intelligence navigation

- People pages
- Institution pages
- Sector exploration
- Filters
- Sources
- Saved entities

### Phase 3 — PWA

- Home-screen installation
- Caching
- Standalone experience

### Phase 4 — Advanced Mobile Intelligence

- Meeting Brief
- Watchlists
- Notifications
- Personalized feed
- Recent changes
- Relationship alerts

Do **not** attempt Phase 4 before Phase 1 is excellent.

---

# Final Product Principle

Use this as the guiding principle for every implementation decision:

> **NAVGCC desktop helps users understand the whole network.**
>
> **NAVGCC mobile helps users navigate the network.**
>
> On desktop, maximize analytical context.
>
> On mobile, maximize speed, clarity and actionability.
>
> Never shrink desktop complexity to fit a phone.
>
> Recompose the intelligence for mobile.

---

# AI Coding Agent Execution Instruction

Before changing code, inspect the existing architecture and identify:

1. which components are desktop-specific;
2. which components can be shared;
3. which mobile layouts need dedicated variants;
4. how to preserve desktop behavior exactly;
5. where responsive breakpoints should be introduced;
6. whether the current graph library supports mobile gesture handling, progressive labels, focused neighborhoods, and bottom-sheet interaction.

Then implement **Phase 1 only**, incrementally.

Do not perform a full frontend rewrite unless strictly necessary.

Recommended execution order:

**Protect Desktop → Mobile Explore → Mobile Graph → Bottom Sheet → Ask Network → PWA readiness**
