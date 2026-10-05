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
