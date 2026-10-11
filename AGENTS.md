# AGENTS.md — Anomaly Lab
This document guides coding assistants and Pluto Studio Lite contributors.

## Identity and goals
Anomaly Lab is a separate, five-minute, mobile-first paranormal deduction game set in the Department 42 universe. It shares branding, not code, with the Department 42 game. The daily puzzle is the main product. Read docs/ROADMAP.md and docs/GAME-DESIGN.md before proposing gameplay changes.

## Approved next-work sequence (2026-10-11)
- Read the v2.1 feedback decision and Codex-ready task definitions in docs/ROADMAP.md. That file alone owns task order/acceptance; docs/GAME-DESIGN.md owns logic and fairness requirements.
- AL-A01 is **not accepted or integrated** merely because its feature-branch tests/CI pass. Reconcile it safely against current main, complete manual browser/phone smoke and obtain explicit owner approval before integration or AL-A02.
- After A01 integration: AL-A02 (pure engine, case-specific budgets, configured-final validator); AL-UX01 (state one shared rule and known final procedure up front); AL-G01 (uncoached comprehension playtest) **before** AL-A03.
- AL-UX02 is *conditional and unapproved*: no training level until G01 evidence and new owner authorisation. Do not add unlimited tests, Relaxed/Challenge modes or scoring systems as part of this feedback work.
- Documentation approvals do not authorise gameplay implementation, autonomous successor tasks or deployment.

## Safe development
- Inspect git status and do not overwrite unrelated changes. Work in small scoped branches.
- Keep deployment compatible with a lightweight static Cloudflare Pages site; no new framework/backend by default.
- Preserve prototype functionality during refactors, especially Case 001.
- Separate pure game engine, rules, puzzle data and presentation. Avoid sweeping visual redesign during logic work.
- New cases or logic require deterministic tests. Validate **worst-case adaptive** solvability and the final containment answer, not just one example.
- Do not introduce additional rule complexity until manual mobile playtest gate G01 approves it.
- Test phone layouts, touch targets, colour-independent outcomes and reduced-motion behavior for any UI change.
- Changes to scoring, generation and daily rollover require regression checks for refresh/resume and seed stability.
- Do not add analytics identifiers, ads, paywalls or monetisation code without explicit approval.
- End every task with changed files, tests run/results, known limitations, branch/commit, and any human decision needed.

## Tooling and workflow
The current implementation is a static `index.html` with inline presentation/state code and `case-001.js` for case data and rule helpers. Pure engine/schema extraction is AL-A02, not an existing architecture. Daily generation, persistence and scoring refinements remain later roadmap work.

Use Node.js 24 and `npm test` for all automated checks; `npm run test:smoke` runs the prototype interaction suite alone. No dependency installation or build is required. `.github/workflows/test.yml` runs the same suite on pushes and pull requests, with a manual trigger. The DOM adapter executes the page's scripts in their shared global scope; it does not validate browser layout, CSS, touch, accessibility or reduced motion. Keep a manual phone smoke pass for code slices and report it as pending when not performed. See `docs/BASELINE-AUDIT.md` for source evidence, baseline defects and the manual checklist.

During Studio Lite execution, stay inside the assigned isolated worktree. Do not commit, merge, push, deploy, publish, release or modify another checkout without explicit owner approval. Passing tests do not grant approval. Report cached remote refs separately from a live remote check, and never equate either with the deployed Cloudflare commit.

Use Night Parcel Office's documented AGENTS/skill/test patterns only after reviewing their actual source; do not copy unrelated game semantics. The first reusable skill is `.agents/skills/puzzle-validation/SKILL.md`, governed by `docs/GAME-DESIGN.md`. Read this skill when working on puzzles, rules, or case generation. Record material usage in `docs/AI-SKILLS-REGISTER.md`. For Studio Lite use docs/STUDIO-LITE-TRIAL.md. Only queue tasks whose dependencies and gates are satisfied.
