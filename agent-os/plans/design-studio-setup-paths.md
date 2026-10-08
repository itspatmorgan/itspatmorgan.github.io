# Design Studio setup paths

## Status

Complete locally; not deployed.

## Context and desired outcome

Starter SETUP.md now owns four agent-assisted paths: Codex, Claude Code, Cursor,
and direct source. Replace the landing page's mandatory GitHub/template/terminal
sequence with tool-specific choices and exact prompts. Personal use needs no
GitHub account. The source currently describes an experimental plugin distributed
through local/repository installs, not reviewed marketplace listings.

## Approach, scope, and files

Use four native disclosure rows, each with concise desktop/local instructions,
the canonical setup prompt, a copy button, and the required restart/activation
handoff. Keep one shared full-instructions link below the choices. Keep manual setup as
a link in the direct-source option. Remove the obsolete clone illustration and
terminal sequence. Update src/data/design-studio-agent.txt and the final CTA to
match the same choice of paths. Source: sibling SETUP.md and plugin README.

## Steps and verification

- Read source setup and release status; preserve exact prompts and host names.
- Implement the four choices, ownership guidance, and synchronized Agent guide.
- Run pnpm build and diff check; verify native disclosures, copy interaction,
  desktop/mobile readability, and link destinations in the browser.
- Leave a local preview for review; deployment is separate from this change.

## Review and learnings

No dependency or framework changes. Native details work without JavaScript;
prompts remain selectable if clipboard permission is unavailable. Do not promise
reviewed listings or universal clean-machine setup. No shared convention needed;
SETUP.md remains the authoritative source for future instructions.

## Verification results

Public main SETUP.md matches the inspected sibling file byte for byte. All four
prompts match its blockquotes exactly. Production build passes (43 pages), and
diff check passes. Browser checks verified disclosure switching, copy success
announcement, direct-source instructions and links, and the Cursor prompt at
390px with no horizontal overflow. Browser clipboard readback returned empty,
so exact copied-byte verification was unavailable; prompt source equality and
the UI success path were verified. Desktop screenshot:
`/private/tmp/design-studio-four-paths-final.png`.

Setup data lives in `src/data/design-studio-setup.ts`; the text Agent guide is
updated with the same four canonical setup paths. No plugin was installed or
studio created as part of reviewing these source instructions.

## Setup section review refinements

Applied the user's nine browser comments: ChatGPT Codex naming, explicit
host-specific prompt instructions, clearer Claude desktop steps, agent harness
terminology, beta wording with the extra permission sentence removed, one shared
guide link, and a full-size primary copy action. Prompts remain unchanged.
Reused the site's ChatGPT and Claude SVG marks. Cursor's cube SVG comes from the
official kit linked at https://cursor.com/brand (General Logos/Cube/SVG/CUBE_2D_DARK.svg).
Hugeicons provides the GitHub mark without adding a library. Brand marks are
decorative beside visible labels and adapt to the site's foreground color.

Refinement verification: production build passes (43 pages), diff check passes,
browser copy action announces success, the shared guide appears exactly once,
and the 390px layout has no horizontal overflow. Reviewed mobile dark mode and
restored the desktop light preview. Screenshot:
`/private/tmp/design-studio-setup-refined.png`. Changes remain local.

Later naming review: use Design Studio consistently in public copy. The direct
source prompt now expands “my studio” and “running studio” to Design Studio per
the user's explicit naming rule; it otherwise follows the canonical procedure.
This small wording adaptation supersedes the original exact-byte prompt claim.
Recorded the durable naming rule in content conventions. The prototype CTA now
reads “Explore a published prototype”; its destination is unchanged.

## Complete setup requests

The approved follow-up in design-studio-complete-setup.md extends the plugin
prompts through local creation, preview, and workspace handoff. Prompts now
adapt upstream SETUP.md procedures rather than mirror its installation-only
blockquotes. Codex also offers a separate create-and-publish request, explicitly
limited to local chats where ChatGPT Sites is enabled and available. Required
restart/reload/new-chat guidance remains; one request does not promise an
uninterrupted journey on every host. The direct-source fallback remains.
