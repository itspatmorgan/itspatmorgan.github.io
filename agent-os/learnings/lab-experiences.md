# Lab Experiences

## Rule

Lab entries should be polished working artifacts, not a dumping ground for
unfinished experiments.

## Why

The Lab is public proof that the site owner builds and explores through working
software. Half-finished entries weaken that signal.

## Use When

- Adding a new Lab entry.
- Changing Lab routes, previews, or interaction patterns.
- Deciding whether an experiment should be public, draft, or omitted.

## Gotchas

- Use `experience: "app"` for immersive tools.
- Use `experience: "demo"` for focused interaction showcases.
- Put dedicated implementation code under `src/lab/<slug>/` when an item needs
  React islands, state, or supporting logic.
- Prefer `.astro` unless interactivity requires React.

## Verification

```bash
pnpm build
pnpm dev
```

Then check the affected `/lab` route in a browser when the change is visual or
interactive.

## Related Files

- `src/content/lab/`
- `src/pages/lab/`
- `src/lab/`
- `src/content.config.ts`
