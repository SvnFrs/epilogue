<!-- SPECKIT START -->
Active plan: `specs/001-core-engine/plan.md` (Core Engine, Phase 2a). For the tech
stack, project structure, and constraints, read that plan and its companions:
`research.md`, `data-model.md`, `contracts/api.md`, `deployment.md`, `testing.md`,
`ux-ui.md`. Governance: `.specify/memory/constitution.md` (v1.1.0). Run the testing
pyramid via the `/test-pyramid` skill.
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
