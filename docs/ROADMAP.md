# Anomaly Lab — Delivery Roadmap v2
Status: approved direction; implementation not started. Updated: 2026-10-08.

## Product
A five-minute, phone-first, daily paranormal deduction puzzle in the Department 42 universe. Observe specimens, select limited experiments, infer one rule, make one deducible containment decision. Deadpan bureaucracy, not a management game.

## Non-negotiables
- Daily puzzle is core; launch needs a sustainable, validated generation strategy.
- No guesses disguised as difficulty. Worst-case adaptive solvability under the test budget.
- Keep the core loop short and comprehensible on a phone; gate mechanic complexity by playtesting.
- Mobile laboratory action must remain visible; results use symbols and labels as well as colour.
- Monetisation only after beta proves repeat interest.
- Pluto Studio Lite evaluation must not block shipping via direct Codex.

## Milestones and ordered slices
| ID | Slice | Depends on | Acceptance / gate |
|---|---|---|---|
| AL-A01 | Baseline audit, tests, CI, AGENTS | — | Confirm local/remote status, enumerate gameplay states, automated smoke tests; no gameplay changes. |
| AL-A02 | Extract pure engine, case schema and validator baseline | A01 | Existing case unchanged; deterministic unit tests; validator reports solvability, ambiguity, triviality and minimum worst-case experiments. |
| AL-A03 | Four handcrafted rule-variety cases | A02 | Cases validated and playable on phone; baseline case retained. |
| AL-G01 | **Mobile playtest gate** | A03 | 5+ independent testers; observe comprehension, run time and confusion; decide simplify/proceed before complex rule engine. |
| AL-B01 | Rule refinements informed by playtests | G01 | No extra interaction dimensions without positive evidence; all rules deterministic and tested. |
| AL-B02 | Template-based generator and exhaustive validator | B01 | Hundreds of distinct accepted puzzles; reject unsolvable/ambiguous/trivial outputs; deterministic seed replay; generation failures safe. |
| AL-B03 | Daily puzzle, deterministic date and resume | B02 | Same puzzle for all users by **UTC day**; pinned per started case; refresh/resume; midnight rollover doesn't replace active game; offline behavior explicit. |
| AL-B04 | Daily results and spoiler-free share | B03 | Share tests used, outcome and date, never hidden rule/objects; text fallback and non-colour symbols. |
| AL-C01 | Case archive, history and optional free practice | B03 | Local-first persistence; data migration; repeat play does not overwrite daily score. |
| AL-C02 | Scoring and balance refinement | B04 | Score prioritises correct deduction, then test efficiency; no speed pressure by default. |
| AL-D01 | Mobile visual shell and specimen clarity | G01 | Main scene visible at 320px; touch targets >=44px; no horizontal overflow; reduced motion. |
| AL-D02 | One experiment animation and feedback polish | D01 | One procedure improved, other procedures remain usable; no logic coupling; reduced-motion fallback. |
| AL-D03 | Expand visuals incrementally | D02 | Per-specimen/procedure slices, screenshots mobile + desktop. |
| AL-E01 | Accessibility, reliability, performance | B04,D01 | Keyboard and screen reader journeys; storage failures handled; reload and offline tested. |
| AL-E02 | Beta and balance study | C02,D03,E01 | 20+ testers if feasible, track confusion, completion, return interest and defects; no unverified retention claims. |
| AL-F01 | Monetisation decision **after beta** | E02 | Evaluate free daily + optional one-off case packs, premium, ads; no monetisation implementation before decision. |

Parallelism: D01 may begin after G01 alongside B01/B02; do not parallelise dependent engine/schema/validator edits. C01 may overlap visual work. All code slices require tests and a manual mobile smoke pass.

## Gate G01: playtest contract
Use four varied authored cases plus prototype. Ask testers to play without coaching on a phone. Record first-action success, rule comprehension, mistakes, completion time, frustration and whether they'd play again. If confusing, simplify to property-based binary rules; defer procedure combinations. Do not optimise for added mechanic count.

## Launch criteria
Stable daily generation; proven worst-case solvability; seven days of repeatable seed checks without collisions that spoil intended freshness (longer uniqueness horizon tested offline); mobile/accessibility checks; privacy/telemetry decision; no blocking defects. Twenty authored cases alone are not a sustainable daily feed.

## Analytics decision
Start with consent-free aggregate Cloudflare Web Analytics (subject to current provider configuration and privacy disclosure) for visits/performance. Gameplay completion and difficulty cannot be inferred from page views. For beta use explicitly volunteered anonymous playtest forms / sessions; decide separately on an opt-in, minimal event endpoint only if balance evidence requires it. Do not silently add identifiers, tracking pixels or detailed gameplay logs.

## Open product decisions for reviewer
Is UTC rollover acceptable to UK audience? Should daily be accessible only once or allow unscored replay? Is generated variety engaging without increased rule dimensions? Is a one-off case pack valuable? Review and record decisions before code alters behavior.
