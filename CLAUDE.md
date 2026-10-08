<!-- SPECKIT START -->
Rules: `.specify/memory/constitution.md` (v2.0.0). Interface: `design/marginalia/`
(read its `README.md` first; `tokens.json`, `components/index.d.ts` and
`components/*/README.md` are authoritative, and win over any other doc). Active spec:
`specs/002-marginalia-rebuild/spec.md` (no plan yet; the stack is chosen in its plan).
Why and what: `docs/vision.md`, `PRODUCT.md`; what's next: `docs/roadmap.md`, `TODOS.md`.
Historical, not sources: `specs/001-core-engine/` (the superseded Core Engine; its code
still runs, and `/test-pyramid` tests it), `src/`, `docs/ceo-review-2026-06-20.md`.
<!-- SPECKIT END -->

## gstack

Use gstack for all web browsing — the `gstack` skill (or `/qa`, `/scrape`,
`/design-review`, which drive a real Chromium). Never use
`mcp__claude-in-chrome__*` tools. Note: there is no `/browse` slash command —
`browse` is gstack's browser engine, used internally by those skills.

Available gstack skills: /office-hours, /plan-ceo-review, /plan-eng-review,
/plan-design-review, /design-consultation, /design-shotgun, /design-html,
/review, /ship, /land-and-deploy, /canary, /benchmark,
/connect-chrome, /qa, /qa-only, /scrape, /design-review, /setup-browser-cookies,
/setup-deploy, /setup-gbrain, /retro, /investigate, /document-release,
/document-generate, /codex, /cso, /autoplan, /plan-devex-review,
/devex-review, /careful, /freeze, /guard, /unfreeze, /gstack-upgrade, /learn.
