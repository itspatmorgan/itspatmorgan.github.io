# Design Studio Landing Page

## Status

Complete — implemented and verified locally; not deployed.

## Context

Patrick wants a shareable project landing page for Design Studio, an open-source
design environment. The repository `design-studio-starter` is the starter kit
used to create your own studio. The page should give the tool an official home
while feeling native to his personal website. Design for the released experience
now, including installation and repository links, so Patrick can test it before
promoting it. The page has now been implemented for local testing; deployment remains separate.

Prior website work was committed as `6026b2b` before this review. The sibling
repository was inspected without intentional source changes. Its existing build
was served locally to visually review all three marketing concepts.

### References reviewed

Sibling source: `../design-studio-starter/src/prototypes/patrick/design-studio-marketing/`

- `project-brief.md`: shared introduction → examples → installation → usage story.
- `landing-v1.tsx`: Direct; large left-aligned promise and interface-led demo.
- `landing-v2.tsx`: Open; centered invitation, broad geometry, canvas-led demo.
- `landing-v3.tsx`: Connected; split hero, architectural geometry, Human/Agent modes.
- `_components/landing-page.tsx`, `landing.module.css`, `agent.txt`: content and behavior.
- `assets/`: real View, Diagram, Canvas, Document, and Studio home previews.
- Project `README.md` and `LICENSE`: purpose, audience, early-beta description,
  setup requirements, and MIT license.

Use “Design Studio” for the product throughout the page. Use “starter kit” when
explaining how visitors create their own copy, and `design-studio-starter` for
the repository name. Patrick has explicitly requested the released-page design;
do not add coming-soon messaging or gate its installation experience.

## Desired Outcome

- A polished, direct URL at `/design-studio` that explains the project.
- A visitor can understand its purpose, intended audience, concrete capabilities,
  and current availability without opening the repository.
- Visuals connect the project to Patrick's personal brand and show real software.
- The full release experience can be tested before Patrick promotes the project.
- Setup and repository actions have accurate destinations and usable instructions.

## Approach

### Direction and site integration

Use V3's split hero and architectural geometry with direct, product-specific
copy. V2's large centered composition delays the product demonstration and
is less suited to the website's sidebar layout.

Build a dedicated Astro route using the existing `PageLayout`: keep the personal
site navigation, mobile header, theme toggle, and footer. Do not add a second
navigation system or a top-level sidebar item in the first pass. The direct URL
is the sharing destination; add broader homepage/Lab promotion when Patrick is
ready. A project landing page serves a different purpose from a Work case study
or an interactive Lab tool, so no collection/schema changes are needed.

Use Geist Sans, Geist Mono labels, semantic website tokens, warm paper/dark
surfaces, restrained copper accents, and existing border/radius conventions.
Reuse the prototype's simple Studio mark and architectural geometry as local
SVG/code assets, adapted to the site's colors. Avoid importing the sibling's
Marketing system, fonts, Untitled UI components, or its application shell.

### Proposed page sequence

1. **Project identity and hero.** Studio mark and “Design Studio.”
   Headline: “Design with agents. Build on your terms.”
   Description: “A home for the things you’re building. Create working prototypes
   with your coding agent and your design system, with flows, explorations, and
   context all in one place.”
   Split copy/geometry on desktop; stack on mobile. Primary link: “Get started”
   to the setup section. Secondary link: “View on GitHub” to
   `https://github.com/itspatmorgan/design-studio-starter`.
2. **Show the work.** “One idea. Every part of the story.” Show the real Feedback
   Inbox examples: interactive prototype, diagram, canvas, and document. Use a
   large image area with four artifact tabs. Keep captions and provenance footnotes
   off the page, per Patrick’s review.
3. **Make it yours.** Three concise points: bring your design system; work with
   the coding agent/editor you already use; keep context and artifacts together
   in a codebase you own. Keep this section concise without the Studio home screenshot.
4. **Run your own studio.** Introduce designers and product managers, working
   individually or with a team. Explain that this is a local development
   environment used alongside a coding agent. Provide the prototype's three-step
   template-first setup: create a repository with “Use this template,” clone
   that new repository, then install and start Studio with mise/pnpm. Include
   copyable install commands and explain where to find the local URL. Keep the
   placeholder clone commands uncopyable and the full section in one column. Avoid suggesting
   a hosted SaaS service or universal agent support.
5. **Context and closing.** Patrick attribution, MIT/open-source context, a
   repeated setup or GitHub action, and “Why I'm building it” linking to
   `/writing/build-a-design-os`. The existing Unknown Arts newsletter can remain
   a secondary way to follow Patrick's work.

### Release experience and testing

Include “Get started,” “Use this template,” clone/install commands, and GitHub
links in the first implementation. No coming-soon label, waitlist, signup form,
or launch-state switch is needed. Publishing and promotion remain separate from
building and testing this page.

Verify repository access and template behavior during implementation, and report
any unavailable destination without changing the page back to a teaser. Link to
the repository's README/setup guide using verified destinations. Prototype paths such as `/documentation/guide` and
`/systems/marketing` belong to the Studio app and must not be copied onto this
website. Keep detailed setup instructions in the project's README/Guide to
avoid duplicating the full Guide. The landing page owns a compact, testable
getting-started path; review its commands against the current README.

V3's Human/Agent mode is interesting but defer it from the first pass: the
prototype's agent text primarily contains installation instructions. A later
machine-readable project guide should have a clear purpose, accurate public URLs,
and setup guidance consistent with the human page.

### Implementation details

- Prefer static Astro markup. Enhance only the gallery, command copying, and hero geometry.
- Use four ordinary anchor links and visible figures as the no-JavaScript
  baseline. A small local script can enhance these into an accessible tabbed
  gallery once initialized, including keyboard navigation and focus handling.
  No React or new component dependency is necessary for the initial landing page.
- Copy selected screenshots into website-owned assets and optimize to WebP or
  JPEG. Do not cross-import files from the sibling checkout at build time.
- Preserve readable UI details, dimensions, useful alt text, lazy loading below
  the fold, and responsive aspect ratios. Review screenshots for placeholder,
  personal, or unreleased information before including them publicly.
- Keep all primary content visible before JavaScript. Any motion is optional,
  restrained, and respects reduced-motion preferences.
- Set page-specific title, description, custom-domain canonical URL, and a social
  preview image. Reuse existing BaseLayout metadata plumbing.

## Scope

In: One project page, scoped visuals/gallery, optimized real screenshots, sharing
metadata, released-product messaging, and a usable setup path.

Out: Repository release operations, changes to the starter kit, hosted Studio demos,
lead collection, full documentation port, new global navigation, site redesign,
dependency upgrades, and deployment during planning.

## Files To Modify

- `src/pages/design-studio.astro`: landing page and small gallery script.
- `src/components/design-studio/StudioAtmosphere.astro`: scoped architectural
  SVG, ambient animation, pointer response, and motion controls.
- `public/images/design-studio/`: selected optimized screenshots and
  project social preview image.
- `agent-os/system-map.md`: register the new route after implementation.
- This plan: track implementation and decisions.

## Steps

- [x] Commit existing website work.
- [x] Read project brief, source concepts, and project documentation.
- [x] Visually review V1, V2, and V3 from the existing Studio build.
- [x] Select a proposed direction and released-page content strategy.
- [x] Incorporate Patrick's product naming and full-release experience corrections.
- [x] Confirm direction with Patrick before implementation.
- [x] Build the Astro page with static content and adapted brand geometry.
- [x] Select, review, optimize, and add product screenshots.
- [x] Enhance the gallery and add social metadata.
- [x] Verify responsive layout, themes, keyboard use, and content visibility.
- [x] Review copy, template/setup path, and links; complete the build.
- [x] Update the system map and choose any durable learnings.

## Review

- Product: Make purpose, audience, setup, and next action clear.
- Editorial: Use Design Studio as the product name; emphasize
  both individual and team use; retain a concrete explanation near the headline.
- Design: Preserve the prototype's restrained geometry and generous spacing,
  translated into the site's typography, colors, and sidebar-aware layout.
- Architecture: One route, local assets, no sibling runtime dependencies.
- Maintenance: Project documentation owns detailed setup; the landing page
  owns positioning, demonstrations, and a compact getting-started path.
- Verification: `pnpm build`; desktop/mobile browser review in light/dark modes;
  gallery keyboard and no-JavaScript baseline checks; reduced-motion check;
  local asset/link and metadata inspection. Stop dev before building and restart
  it afterward so preview does not use stale optimized modules.

## Learnings

Updated the system map with `/design-studio`. No new convention or learning
note is needed for this single page.

## Implementation and Verification

- Built one Astro page using PageLayout, the existing button styles, inline
  geometric SVG, and a small progressively enhanced gallery/copy script.
- Optimized four reference images to WebP (12–65 KB each); added a social image.
- Confirmed with GitHub CLI that the repository is public and is a template.
- Setup copy follows the starter README and the referenced prototype.
- `pnpm build` passed with 43 pages; `git diff --check` passed.
- Generated HTML checks verified one H1, custom-domain canonical and social
  metadata, all four visible gallery figures before JavaScript, and local assets/links.
- Browser review covered desktop and 390px mobile in light and dark themes.
  Fixed mobile setup-grid overflow and verified page width equals viewport width.
- Gallery click and ArrowRight navigation passed; command copying announced
  success; Get started navigated to the setup section.
- No signup, React island, extra runtime dependency, global navigation entry,
  sibling source edit, repository release operation, or deployment was added.

## Browser Annotation Refinement

Addressed Patrick’s 14 review comments: removed section eyebrows, geometry caption,
gallery captions, provenance note, and the Studio home image. Widened the gallery
intro, aligned numbered step baselines, and made setup a single column. Only
usable install commands retain a copy button.

Changed the hero to “Design with agents. Build on your terms.” and updated sharing
artwork. Added a restrained line-drawing entrance, pointer tilt, and three clickable
geometric arrangements, with native keyboard access and reduced-motion handling.
The closing heading is “Design Studio,” followed by a personal first-person note,
Patrick’s portrait and signature, and the related article link.

Verification: production build passed (43 pages), diff check passed, and browser
review confirmed desktop/mobile layouts, no mobile document overflow at 390px,
click/Enter geometry changes, single-column setup, and the personal closing section.
No new durable learning is needed beyond the existing system map entry.

### Gallery caption follow-up

Patrick clarified that the changing caption content is useful. Restored it as a
single column directly between the tabs and screenshot, so its change is visible
without scrolling past the image. Rewrote each caption around the artifact shown
in the Feedback Inbox example. The image and caption enter together with a brief
fade, disabled for reduced motion. Panel descriptions reference their captions.
Verified keyboard switching changes both the visible screenshot and caption.

### Ambient hero refinement

Replace the click-to-rearrange tile with a living architectural composition:
layered arcs, modular planes, fine construction lines, and slow continuous motion.
Pointer movement across the hero gently offsets layers. Use a scoped Astro/SVG
component so the artwork exists before JavaScript and follows site theme tokens.
The pattern engine's existing generators were reviewed; custom geometry gives
this composition precise architectural alignment without expanding the engine.
Pause motion with a small accessible control, honor reduced motion, and suspend
animation outside the viewport. Verify theme, responsive layout, pause/resume,
static artwork, pointer response, and production build.

Implemented orbiting arcs (60-second cycle), a slowly turning central plane,
breathing fills, and a traveling point. Layer offsets respond to pointer movement
across the whole hero. Artwork stays static before JS, in reduced-motion mode,
and when paused. Browser checks confirmed pause/resume, pointer offsets, theme
rendering, and no document overflow at 390px. No pattern-engine changes or new
dependencies were needed. This refinement does not require a new durable learning.

### Human/Agent reading mode

Patrick requested the previously deferred toggle. Replaced the header license label
with accessible Human/Agent tabs. Agent mode presents a copyable project brief and
setup guide from one shared source, also served at /design-studio/agent.txt. The
Human page remains visible before JavaScript; the Agent link opens the plain-text
endpoint as its fallback. Keep setup aligned with the starter README and local
Guide, and use full public reference URLs. Verify switching, keyboard access, copy,
mobile overflow, and the static text endpoint.

Reading-mode verification passed: build, keyboard mode switching, mutually
exclusive panels, clipboard success announcement, and 390px layout without
horizontal overflow. Both the generated text artifact and HTTP response exactly
match the shared source; HTTP content type is text/plain with UTF-8. The in-app
browser blocks opening standalone plain-text responses, so the endpoint was
verified through its response and the embedded Agent view remains fully usable.
Updated the system map with the text endpoint; no new convention is needed.

### One-prototype walkthrough

Patrick approved simplifying the artifact section around one prototype containing
four kinds of work. Replace the independent gallery tabs with a persistent
Feedback Inbox project navigation: View, Diagram, Canvas, Document, each paired
with a short purpose. Use closer captures of the live example's artifact surfaces,
without repeated navigation or excess whitespace. Keep a single product window
and concise example-specific captions. Rename Prototype to View so the container
and artifact aren't confused. Retain progressive enhancement, keyboard access,
full-size image links, reduced-motion support, and a readable mobile layout.
Verify all four selections, responsive framing, no-JS content, and build. No new
library, sibling edit, or durable convention is needed for this page refinement.

Walkthrough verification: all four artifact selections and ArrowDown navigation
passed; mobile layout stays within its 390px viewport. Native browser captures
replace the older full-window assets (13–66 KB each). Desktop uses a stable
preview frame; mobile follows image height. Full-size captures remain linked.
Build and diff check passed. Updated this plan; no separate learning is needed.

### Collaborative drafting-table hero

Patrick requested a more communicative graphic. Replace abstract orbiting geometry
with four recognizable sheets: a code view, Mermaid flow, Markdown context, and
Excalidraw canvas. Connect them to shared text-based source, with You/Agent cursors
working on the same drafting surface. Retain construction lines, hatching, subtle
pointer parallax, ambient connection traces, pause control, and reduced motion.
Verify meaningful labels, theme, mobile, pause behavior, and build. This is a
conceptual illustration, while the next section shows actual product captures.

Drafting-table verification: pause/resume reported paused/running animation states;
light-mode mobile review showed all sheets and collaborators without horizontal
overflow at 390px. Static markup includes the full illustration and descriptive
accessible label. Production build and diff check passed. No new dependencies or
shared conventions are required; this plan records the page-specific direction.

### Creator portrait treatment

Reuse the homepage desktop portrait's source, crop, responsive dimensions,
polaroid padding, rotation, shadows, and fading dot texture for the creator note.
Keep the existing About link. Scope the background to the portrait field and
contain it on mobile. No homepage refactor or new shared abstraction is needed.
Verify desktop/mobile framing and build.

Verified the creator portrait at desktop and 390px mobile widths, including the
stacked photo, fading texture, and absence of horizontal overflow. `pnpm build`
passes. This reuses an existing visual treatment; no new durable learning or
convention is needed.

### Two capability stories and an open platform

Context: Patrick clarified the product's two primary capabilities: connected
prototype artifacts, and discrete design systems containing visual foundations
plus agent context, rules, and skills. Ownership and extensibility support both.

Desired outcome: make those capabilities clear across hero, walkthrough, a
new dedicated systems section, platform positioning, creator note, metadata,
and the Agent brief. Preserve the existing headline, screenshots, interactions,
setup instructions, and site styling.

Approach: promote systems from a brief foundation card into a full section;
explain themes/components, context, and rules/skills as parts of each system.
Follow it with concrete open-platform benefits. Tie the creator note to the
variety of startup codebases and the reason for an adaptable foundation.

Files: src/pages/design-studio.astro, src/data/design-studio-agent.txt, this plan.
Review: avoid example-specific marketing, unsupported automatic behavior, or
promises of universal integration. Verify the resulting hierarchy on desktop
and mobile, the Human/Agent views, and production build. Record page-specific
learnings here; no new shared convention is anticipated.

Messaging review complete: prototypes and systems have dedicated sections;
ownership/extensibility supports both without implying universal automatic
integration. Desktop and 390px mobile layouts reviewed with no horizontal
overflow. Human/Agent switching presents the matching updated brief. Production
build passes. The clarified two-capability positioning is recorded in this plan;
no shared architecture or styling convention changed.

### Theme-aware artifact demonstration

The raster captures overwhelm the page in dark mode and make a placeholder
application the focus. Replace the screenshot surface with a native, explicitly
illustrative example of four connected artifacts for a reading prototype. Use
site tokens, typography, generous spacing, and consistent content. Keep the
existing accessible artifact tabs. The view allows filtering saved items and
saving/unsaving an item; other artifacts show the related flow, exploration,
and context. Do not imply this is the full Studio UI or a live embedded Studio.

Files: a scoped StudioArtifactPreview.astro component and the landing route.
Verify view interactions, all four artifact tabs, keyboard navigation, light/dark
contrast, mobile overflow, and production build. Retain original captured assets
for possible future product photography; no image editing or new dependencies.

Native demo verification: saving a second read updates the saved count and shows
both saved items in the filtered list. Diagram, Canvas, and Document selection
and ArrowDown navigation pass. Light and dark treatments reviewed; mobile flow
uses a readable vertical layout rather than shrinking diagram text. Mobile canvas
and flow remain within 390px. Production build passes. Standalone astro check
is unavailable without @astrojs/check; no dependency was added. This page-specific
presentation choice is recorded here; no shared convention or system-map change.

### Portrait texture overflow fix

The desktop portrait pseudo-element's viewport-based width extended past the
page's right gutter, creating 55px of horizontal overflow at 1456px. Size it
relative to the portrait plus a bounded gutter allowance. Verified document
width equals viewport at 390, 768, 1024, and 1456px; texture and polaroid remain
visible. Production build passes. Keep this page-specific fix in the plan;
no shared overflow suppression or convention change is needed.

### Carry the visual language through the remaining sections

Patrick requested standalone, presentation-like compositions for systems,
ownership, and setup, with useful imagery and less text density. Use native
SVG construction lines, warm site tokens, and precise artifact silhouettes.
Systems: pair a concise content column with a layered system feeding a prototype.
Ownership: show a connected, open foundation with agent/code/context as inputs.
Setup: show a three-stage visual sequence, retain a single-column instruction
flow, and place command detail behind clearly labeled disclosures.

Files: StudioFoundation.astro, design-studio.astro, this plan. Preserve setup
commands, links, copy behavior, accessible static fallback, and mobile reading
order. No new dependencies, raster assets, or decorative animation. Verify all
three sections in both themes, mobile overflow and disclosure/copy interactions,
then build. Record this page-specific composition here.

Section composition review: systems use a paired text/diagram composition;
ownership uses a horizontal open-foundation visual; setup uses three artifact
silhouettes and single-column numbered rows with command disclosures. Light/dark
review passes. At 390px, setup/platform labels use native text rather than scaled
SVG labels, and page width remains 390px. Clone disclosure retains placeholders;
install disclosure retains exact commands and reports successful clipboard copy.
Production build passes. No dependencies or shared design convention changed;
this plan records the page-specific visual direction and verification.

### Ownership section: replace the abstract foundation

Patrick found the connected foundation confusing. Replace it with three concrete
illustrations paired directly with their benefits: the four included artifact
types, agent and Studio working side by side, and an owned folder of open-format
files. Retain the restrained drafting treatment and site tokens. Remove the
unused foundation diagram branch. Verify desktop, mobile, both themes, and build.

Ownership revision verified in light/dark themes and at 390px with no horizontal
overflow. Each illustration stays paired with its benefit as columns stack.
Production build passes. No new shared conventions are needed.

### Final messaging refinement

The hero now reads “Design with intent. Build with an agent.” Supporting sections
use one clear statement each. Position the second capability as design operating
systems: themes and components plus context, rules, and skills. Lead ownership
with a thoughtful out-of-the-box foundation that users can customize. Setup
recommends opening the repository in a coding agent and running Design Studio
there. Use the full product name in product references. Remove redundant
marketing captions, the demonstration hint, and caption/setup dividing rules.

Each copy and spacing refinement was verified in the local browser. Existing
mobile, light/dark, accessibility, and interaction checks remain recorded above.
These are page-specific decisions; no durable shared convention changes needed.
