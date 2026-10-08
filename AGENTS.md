# AGENTS.md — Anomaly Lab
This document guides coding assistants and Pluto Studio Lite contributors.

## Identity and goals
Anomaly Lab is a separate, five-minute, mobile-first paranormal deduction game set in the Department 42 universe. It shares branding, not code, with the Department 42 game. The daily puzzle is the main product. Read docs/ROADMAP.md and docs/GAME-DESIGN.md before proposing gameplay changes.

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
Use Night Parcel Office's documented AGENTS/skill/test patterns only after reviewing their actual source; do not copy unrelated game semantics. Start with one potential reusable skill: puzzle-validation (docs/GAME-DESIGN.md is its contract). For Studio Lite use docs/STUDIO-LITE-TRIAL.md. Only queue tasks whose dependencies and gates are satisfied.
