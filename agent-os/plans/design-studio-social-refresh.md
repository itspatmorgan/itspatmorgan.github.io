# Refresh Design Studio social sharing

## Context and outcome

Live OG/Twitter titles match the current headline, but the social image still
shows the old headline and geometric artwork. Refresh the image and description
to match the approved page, and publish with a new image URL for cached previews.

## Approach and scope

Generate a 1200x630 share card using the current headline, audience description,
Design Studio mark, and SVG artwork from StudioAtmosphere. Save its vector source
and JPEG via a repeatable Sharp script. Update the landing-page metadata; OG and
Twitter already share these props through BaseLayout. Keep the previous asset
available for old links.

## Review, verification, and learnings

Inspect the card visually, run the production build, verify rendered OG/Twitter
tags and dimensions, then publish and compare live image hashes and metadata.
Provider page caches can still need a refresh. No shared architecture change;
the generation script documents this page-specific asset workflow.

Local verification complete: card visually reviewed at 1200x630, production
build passes (43 pages), and rendered OG/Twitter tags both use the new description
and `social-design-with-intent.jpg` image URL. Diff check passes.

## Geist typography follow-up

The active prototype-sandbox card retained Helvetica/Arial after the site moved
to Geist. Keep the layout and hero drawing; regenerate text with Geist Sans and
Geist Mono using font outlines so SVG/JPEG rendering cannot silently substitute
system fonts. Tighten headline line spacing, ease its tracking, and reduce the
gap to the description. Scope: generation script, font-outline development
dependency, generated SVG/JPEG, and this plan. Verify the regenerated card
visually, its dimensions, repeatable generation, and production build. No
publishing requested.

Complete locally: the card now uses Geist Sans (500 for the headline) and Geist
Mono for file/cursor labels and the URL. Fontkit shapes and outlines the actual
installed Fontsource fonts after WOFF2 decoding; exported SVG/JPEG assets no
longer depend on a machine's fallback fonts. Headline tracking is -1.45px,
baseline spacing is 64px, and description baseline spacing is 32px. Composition,
copy, and artwork remain intact. Visually reviewed the JPEG, confirmed 1200x630
dimensions and identical hashes on repeat generation, and passed the production
build (43 pages) and diff check. The script records this asset-specific lesson;
no wider styling convention is needed. Changes have not been published.

Local preview recovery: dependency updates triggered repeated Astro dev-server
restarts, after which page scripts did not initialize. The gallery deliberately
shows all artifacts when scripts are unavailable. A clean restart of the local
server restored initialization; verified Diagram, Canvas, Document, and
Prototype view each display exactly one panel. After package/lockfile updates,
verify interactions after a fresh server start, not only production compilation.
