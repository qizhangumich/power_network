Please upgrade the user experience and visual design of **NABJCC.com**. Start by reviewing the existing website, code, features, and data structure. Build on the current product and preserve its working functionality.

The central experience should feel like entering a park:

**First, understand the map. Then, find your position. Finally, discover a path to the person you want to meet.**

Organize the experience around three stages:

**Navigate → Locate Yourself → Find Your Path**

## 1. Create an animated, interactive onboarding experience

Help first-time users quickly understand what the platform does and how to begin. The onboarding should connect directly to the actual product.

### Step 1: Navigate — Understand the landscape

Introduce the relationship network as an explorable map.

- Begin with an overview, then smoothly zoom into industry groups.
- Gradually reveal people, organizations, and their connections.
- Present industries as distinct areas, using consistent colors and labels.
- Allow users to tap an industry or person to try the basic map interactions.
- Use the park metaphor to make the experience intuitive, while keeping the interface focused on a clear relationship map.

Suggested copy:

**“Explore the landscape. Discover people, industries, and connections.”**

### Step 2: Locate Yourself — Find your place on the map

Provide two clear ways to add people the user knows:

1. Add or import LinkedIn contact information using the capabilities actually available.
2. Manually enter a person’s name and select the correct match.

Once contacts are confirmed, animate the user’s node appearing on the map and connecting to those people.

Requirements:

- Resolve duplicate names using details such as company and job title.
- Do not assume that entering a LinkedIn URL provides access to the user’s complete contact network.
- Only display a relationship as confirmed when the user or a reliable data source has confirmed it.
- If LinkedIn import is not connected yet, clearly show its status and provide manual entry as an alternative.
- Let users skip this step and explore the map first.

Suggested copy:

**“Add people you know. Find your place on the map.”**

### Step 3: Find Your Path — Discover a connection route

Let users select someone they want to meet and explore available connection paths.

Example:

**You → Your Contact → Mutual Connection → Target Person**

Animate the route by highlighting its nodes and connections in sequence.

Requirements:

- Show the intermediate people and the basis for each relationship.
- If multiple routes exist, show a clear default route and allow users to explore alternatives.
- Use relationship strength to rank routes only if supporting data exists.
- Distinguish confirmed relationships from potential connections.
- If no route exists, explain this clearly and suggest adding contacts or exploring a relevant industry.
- Present routes as possible opportunities for an introduction, without promising that an introduction will happen.

Suggested copy:

**“Choose who you want to meet. Discover a path through your network.”**

Include Next, Back, Skip, and Replay controls. Keep animations brief and purposeful. Do not force returning users to repeat onboarding.

Provide a **“Try a Demo”** option with clearly labeled example people and relationships.

## 2. Refresh the visual design

Make the website feel more fashionable, contemporary, and distinctive while remaining credible for professional networking.

Build a consistent design system around exploration and connection:

- Use deep navy or graphite as the foundation, with vibrant, distinguishable industry colors.
- Use modern typography, generous spacing, and a clear visual hierarchy.
- Apply consistent styling to people nodes, industry labels, search fields, buttons, cards, and panels.
- Use subtle transitions for zooming, revealing nodes, and highlighting paths.
- Maintain strong text contrast and readability.
- Keep decorative effects restrained so the map remains easy to understand.

Use concise, natural English throughout the interface and retain the existing brand name.

## 3. Add an industry legend

Create a clear legend based on the website’s actual industry categories. Do not invent categories unsupported by the existing data.

Each industry should have:

- A consistent color.
- A simple icon.
- A readable name.

Use the same visual mapping throughout the network, filters, and profile details. Do not rely on color alone; include labels or icons.

Interactions:

- Clicking an industry filters or highlights its people.
- Unselected nodes fade enough to emphasize the selection while preserving context.
- Support multiple industry selections and a “Reset” option.
- If different line styles represent different relationships, provide a separate connection legend.

On desktop, use a sidebar or compact floating legend. On mobile, use a compact filter strip or expandable panel that does not obstruct the map.

## 4. Redesign the mobile experience

Mobile is a primary use case. The current network appears too small on phones. Design the mobile layout and interactions specifically for touchscreens.

### Make the map the primary visual area

- Give the map most of the first-screen space.
- Start with a readable local view centered on the user, selected person, or exploration starting point.
- Show the most relevant people and connections at a useful scale.
- Offer a full-screen exploration mode.
- Adapt node density, label visibility, and initial zoom to the screen size.

### Support progressive exploration

- Initially show the central person and a manageable set of nearby connections.
- Reveal additional relationships when users select or expand a person.
- Support pinch-to-zoom, dragging, recentering, and fitting the current selection.
- Reduce secondary labels when zoomed out and reveal details when zoomed in or selected.
- Use clustering or progressive loading for large networks.

### Use touch-friendly detail panels

- Tapping a person opens a bottom sheet with their name, company, role, industry, and available actions.
- Include clear actions such as “Add Someone I Know” and “Find a Connection Path.”
- Allow the panel to collapse so users can continue exploring.
- Provide sufficiently large touch targets for nodes and controls.

### Create a dedicated path mode

- Automatically focus on the selected route and fade unrelated nodes.
- Make long routes explorable step by step.
- Offer a synchronized list view so users can read each connection clearly on a small screen.

### Ensure smooth performance and complete states

- Check common phone sizes, iOS Safari, and Android Chrome.
- Account for changing browser viewport height and device safe areas.
- Provide clear loading, empty, import-error, and no-path states.
- Respect reduced-motion preferences.

## 5. Implementation and acceptance criteria

First identify which features are supported by the current data and integrations, and which require additional work. Then implement the redesign and interactions.

Every control should have a meaningful response. Clearly identify features that are not yet connected.

Provide desktop and mobile previews, and demonstrate this complete journey using clearly labeled sample data:

**Enter the website → Understand the industry map → Add known contacts → Locate yourself → Select a target person → Explore a connection path.**

Acceptance criteria:

1. First-time users can quickly understand the platform’s purpose and their next action.
2. The three onboarding stages connect smoothly to working product features.
3. Industry colors, labels, and legends are consistent.
4. Key people and connections are readable and easy to interact with on mobile.
5. Connection paths clearly distinguish confirmed relationships, potential relationships, and demo data.
6. Desktop and mobile share one visual identity, with layouts tailored to each device.

The intended user reaction is:

**“I understand the map, I know where I am, and I can discover a path to the person I want to meet.”**