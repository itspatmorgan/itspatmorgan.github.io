# Design Studio Homepage Feature

## Status

Complete — six-view preview carousel implemented and verified.

## Context

The homepage introduces Patrick as a designer who builds, but Design Studio has
no direct presence. Its dedicated page presents a substantial open-source
product that connects design systems, agent collaboration, and prototyping.
The user approved giving it a dedicated homepage feature and navigation link,
and requested this work on its own branch.

## Desired Outcome

Visitors recognize Design Studio as a current, authored product and can explore
it directly from the homepage and primary navigation.

## Current Concept

Sequence: introduction → Design Studio → Work → Writing → Lab → Community.
Navigation: Home → About → Work → Design Studio → Writing → Lab → Community.
Writing separates the two grids of Work and Lab, introducing Patrick's
perspective between professional impact and smaller experiments.

A full-width project card uses the same rounded border, textured image area,
and hover treatment as Work. A Featured section label follows the homepage's
section-header pattern. On desktop, a large screenshot of the live Design Studio
interface occupies two-thirds of the card on the right, with concise copy on the left.
On mobile and tablet, the copy sits above the preview. The preview cycles through
Prototype view, Lo-fi prototype, Diagram, Canvas, Document, and Design system.
Each view uses a real 1280×720 capture in both themes. Caption, count, previous,
next, and play/pause controls sit above the image. The preview and copy link to
Design Studio separately so carousel controls are never nested in a link.

Copy:

- Section label: Featured
- Title: Design Studio
- Body: A prototype sandbox for designers and product managers. Build with your
  agent, using your components, context, and design principles.
- Link: Explore Design Studio →

The introduction names and links Design Studio in place of the generic reference
to building software with agents. Primary navigation places Design Studio after
Work, using the Hugeicons canvas outline icon to match the other sidebar icons.

## Approach

Use Astro and existing semantic styling tokens. Use static PNG screenshots of
the public Design Studio demo in an Astro carousel rather than a homepage demo.
Advance every six seconds with a short crossfade. Stop on hover, focus, manual
browsing, an off-screen preview, or a hidden document. Reduced-motion preference
starts the carousel paused and removes the fade; readers can still browse or
explicitly play. A server-rendered first image and link remain usable without JS.
The dedicated page
retains its existing interactive illustration. Removed the previously added
static illustration mode since the homepage no longer uses that component.
Keep setup on the dedicated page. Make only the changes required for the feature
and its discovery paths.

## Scope

In: homepage copy and feature; six-view preview carousel; desktop/mobile
navigation; operating map.

Out: case-study collections, Lab restructuring, dedicated-page redesign,
publishing, and unrelated navigation refactors.

## Files To Modify

- `src/pages/index.astro`: introduction and dedicated feature before Work.
- `src/components/design-studio/StudioPreviewCarousel.astro`: progressively
  enhanced preview carousel, controls, and visibility/motion handling.
- `public/images/design-studio/home-preview-{light,dark}.png`: 1280×720 browser
  captures of the live Feedback Inbox screen, with States collapsed to show
  related Discovery artifacts. Source:
  `https://itspatmorgan.com/design-studio-starter/prototypes/patrick/feedback-inbox/app/feedback-inbox`.
- `public/images/design-studio/home-{lofi,diagram,canvas,document,system}-{light,dark}.png`:
  paired captures from the same live example: `discovery/lofi-inbox`,
  `discovery/feedback-flow`, `eng-handoff`, and `discovery/project-context` below
  the prototype path; system capture from `/design-studio-starter/systems/product/button`.
  Handoff canvas is framed at 46% zoom to emphasize the connected main flow,
  its notes, and the beginning of the Create group. Both themes recaptured
  after feedback that the original 26% view was too distant.
- `src/components/layout/Sidebar.astro`: Design Studio navigation and mark.
- `src/data/site-config.ts`: mobile/shared navigation entry.
- `src/components/layout/MobileNav.astro`: seventh-item entrance timing.
- `agent-os/system-map.md`: homepage orientation.

## Steps

- [x] Inspect existing homepage, product page, and conventions.
- [x] Create `codex/design-studio-homepage`.
- [x] Draft the concept and copy.
- [x] Implement the first version.
- [x] Verify build, responsive layouts, themes, and navigation.
- [x] Record review and durable-learning decision.

## Review

Landing-page follow-up: replace the second section's bespoke artifact gallery
with the shared six-view screenshot carousel. Keep its heading and introductory
copy, remove the replaced gallery's tabs and script/styles, and make the preview
link open the live demo rather than link back to its own page. Reuse the existing
assets and playback/accessibility behavior. No additional durable learning needed.
Verified the landing-page carousel on desktop and 390px mobile, automatic
advancement and keyboard next control, loaded images, live-demo link destination,
and absence of horizontal overflow. Production build passed (43 pages).

Final polish: copy precedes the homepage preview; captions and controls precede
screenshots on both pages. Homepage hover now uses the Work modules' 4px lift,
shadow; screenshots and controls stay at their original scale. Removed the
separate copy-background hover. Browser review confirmed the computed hover
lift/scale, header order, working next controls, and mobile layout. Motion
preferences suppress the lift. After feedback, removed screenshot zoom so the
image remains aligned with the playback frame. Browser hover verification
confirmed no image scale or transform.

- Product: Design Studio leads current proof of work and links to its own page.
- Editorial: Use full product name and clearly establish Patrick's authorship.
- Design: Match existing warmth, typography, spacing, and restrained palette.
- Architecture: Existing Astro component; no new client framework or collection.
- Maintenance: Reuse established product art and keep the scope narrow.
- Verification: `pnpm build` passed (43 pages); `git diff --check` passed.
  Browser review at 1280px desktop and 390px mobile confirmed the feature's
  two-column/stacked layouts, light and dark desktop styling, motion pause
  control, and navigation from the feature and mobile menu to Design Studio.
  Existing illustration includes reduced-motion handling; no new motion was
  introduced. Screenshots captured in `/private/tmp/design-studio-home-concept/`.
  After user feedback, checked the full-width card at desktop and 390px mobile,
  both desktop themes, whole-card navigation, and the dedicated page's retained
  motion control. Build passed again; revised screenshots use `module-*` names.
  The high-fidelity version was reviewed on desktop in both themes and at 390px
  mobile; final review screenshots use `product-*` names.
  The carousel revision passed the 43-page build and whitespace check. Browser
  verification confirmed all twelve images loaded, all six views and wraparound,
  previous/next controls, keyboard activation, automatic advancement, persistent
  pause and resume, phone layout, dark imagery, and preview-link navigation.
  Carousel screenshots use `carousel-*` names. Reduced-motion preferences start
  playback paused; hover, focus, visibility, and off-screen handling suspend it.
  The first preview remains available without JavaScript.

## Learnings

Updated the system map for the new homepage hierarchy. No separate learning
note or cross-agent rule is needed. The design review established that homepage
project features should share the surrounding modules' visual language; larger
editorial compositions can compete with the personal introduction.
