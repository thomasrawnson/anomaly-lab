# Anomaly Lab — Delivery Roadmap v2.1
Status: approved direction and feedback-led sequencing (planning only; not gameplay implementation). Updated: 2026-10-11.
Authority: this file owns the delivery order and Codex task definitions; docs/GAME-DESIGN.md owns puzzle-validation rules. No second task registry is maintained in this repo.

## Current delivery status and integration guard
- AL-A01 exists on feature branch pluto-lite/anomaly-lab/al-a01-d43cca12-606. The owner reports 15/15 local tests and the pushed branch has a successful GitHub Actions run. **AL-A01 is not accepted or integrated into main.**
- The feature branch and main diverged after a separate main startup-fix commit. Before accepting AL-A01, review the exact diff against current main, reconcile without discarding either change, complete the outstanding manual browser/phone smoke checklist, rerun tests and obtain owner approval for integration.
- **Do not start AL-A02 or dependent code tasks until AL-A01 is accepted and safely integrated.** Passing tests alone never authorises merge, deployment or a subsequent task.
- This v2.1 revision updates planning documents only. It does not authorise a new tutorial level, relaxed/challenge modes, gameplay modifications, or AL-A01 integration.

## Product
A five-minute, phone-first, daily paranormal deduction puzzle in the Department 42 universe. Observe specimens, select informative experiments, infer **one hidden rule shared across all available procedures**, then apply that rule to one deducible containment decision. The same experiment may depend on both specimen and apparatus, but there is never a separate hidden rule to solve for each apparatus in a case. Deadpan bureaucracy, not a management game.

## Non-negotiables
- Daily puzzle is core; launch needs a sustainable, validated generation strategy.
- No guesses disguised as difficulty. Require worst-case adaptive solvability within the configured case budget and an unambiguous final answer for the configured true rule.
- **Comprehension is a design gate, not an afterthought.** Tests demonstrating mathematical solvability do not prove that first-time players understand how to select experiments.
- Before the first experiment, identify the shared-rule objective and which procedure will be used in the final check. Keep final specimen identities hidden until the final stage.
- Keep the core loop short and comprehensible on a phone; gate mechanic complexity by playtesting. Do not replace confusing instructions with more text by default.
- Mobile laboratory action must remain visible; results use symbols and labels as well as colour.
- Monetisation only after beta proves repeat interest. Pluto Studio Lite evaluation must not block direct Codex development.

## Milestones and ordered slices
| ID | Slice | Depends on | Acceptance / gate |
|---|---|---|---|
| AL-A01 | Baseline audit, tests, CI, AGENTS; safe acceptance/integration | — | Verify branch against current main, browser/mobile smoke, 15-test regression and CI; owner accepts and safely integrates. No gameplay changes. |
| AL-A02 | Extract pure engine, case schema and validator baseline | **A01 accepted and integrated** | Preserve existing Case 001 behavior. Parameterise case test budget and explicit final procedure; deterministic tests and validator reporting solvability, ambiguity, triviality, minimum worst-case experiments and unique final containment for configured truth. |
| AL-UX01 | Clarify one-rule objective and final check | A02 | Explain one shared rule across all procedures and disclose final procedure before testing; simplify duplicated copy, preserve hidden final specimens and existing gameplay; phone/desktop smoke. |
| AL-G01 | **Early mobile comprehension playtest gate** | UX01 | At least five independent uncoached testers on Case 001; record understanding, first-action reasoning, fairness, completion and frustration. Owner records proceed / revise decision **before AL-A03**. |
| AL-UX02 | Conditional playable training case — **not authorised** | Failed G01 **and explicit owner approval** | If authorised later, create one-procedure, three-specimen teaching puzzle with deterministic evidence and a final decision; validate and retest G01 before continuing. Do not begin by default. |
| AL-A03 | Four handcrafted rule-variety cases | A02 and **G01 passed** (possibly after approved UX02) | Four validated cases plus baseline; all played on phone; retain simple, legible rule interactions and record real-player comprehension of the variation. |
| AL-B01 | Rule refinements informed by playtests | A03 and G01 passed | No extra interaction dimensions without positive evidence; all rules deterministic and tested. |
| AL-B02 | Template-based generator and exhaustive validator | B01 | Hundreds of distinct accepted puzzles; reject unsolvable/ambiguous/trivial outputs and invalid final decisions; deterministic seed replay; bounded safe fallback. |
| AL-B03 | Daily puzzle, deterministic date and resume | B02 | Same puzzle for all users by **UTC day**; pin started case, refresh/resume, no active-game midnight replacement; explicit offline behavior. |
| AL-B04 | Daily results and spoiler-free share | B03 | Share tests used, outcome and date, never hidden rule/objects; text fallback and non-colour symbols. |
| AL-C01 | Case archive, history and optional free practice | B03 | Local-first persistence; migration; repeat play does not overwrite daily score. |
| AL-C02 | Scoring and balance refinement | B04 | Score correct deduction first, test efficiency second; no default speed pressure. Investigate generous test budgets or modes only on playtest evidence and explicit approval. |
| AL-D01 | Mobile visual shell and specimen clarity | G01 passed | Main scene visible at 320px; touch targets >=44px; no horizontal overflow; reduced motion. |
| AL-D02 | One experiment animation and feedback polish | D01 | One procedure improved; others usable; no logic coupling; reduced-motion fallback. |
| AL-D03 | Expand visuals incrementally | D02 | Per-specimen/procedure slices; screenshots mobile + desktop. |
| AL-E01 | Accessibility, reliability, performance | B04 and D01 | Keyboard and screen reader journeys; storage failures handled; reload and offline tested. |
| AL-E02 | Beta and balance study | C02, D03 and E01 | 20+ testers if feasible; track confusion, completion, return interest and defects; no unverified retention claims. |
| AL-F01 | Monetisation decision **after beta** | E02 | Evaluate free daily + optional one-off case packs, premium or ads; no monetisation code before decision. |

Parallelism: AL-UX01 follows the AL-A02 engine baseline to avoid editing overlapping presentation/engine seams. D01 may begin after G01 passes alongside B01/B02. Do not parallelise dependent engine/schema/validator edits. C01 can overlap visual work. Every code slice requires automated tests plus a reported manual mobile smoke pass.

## Next Codex task definitions and acceptance criteria
These task descriptions, together with the table above, are the source of truth for handoff. Execute one authorised slice at a time, without inferred approval to begin successors.

### AL-A01 — Acceptance and safe integration (existing task; do not duplicate)
- Scope: inspect current main, the pushed AL-A01 branch and their divergence; review the audit and workflow evidence, and perform the documented real-browser/mobile smoke checks. Reconcile the branch with the newer main startup fix without overwriting unrelated commits.
- Accept when: regression tests pass (15 declared tests expected); CI is green on the integration candidate; 320px/phone and desktop start and complete Case 001 without console errors or obstructed controls; branch diff and integration approach are reviewed; owner approves and integration is confirmed.
- Exclude: new gameplay, test budgets, tutorial mechanics, UI rewrites, deployment assumptions, automatic start of AL-A02.

### AL-A02 — Engine/schema/validator (existing task; tightened)
- Scope: extract pure production engine and a reusable, explicit case schema, including variable per-case experiment limit, possible specimens, procedures, candidate rules, configured true rule and final procedure/specimen options. Existing Case 001 remains playable and mechanically identical (including three-test limit and Photocopier final).
- Validator: enumerate available specimen–procedure experiments; prove hypotheses are distinguishable by a worst-case **adaptive** strategy; report minimum guaranteed worst-case depth, ambiguous/duplicate signatures and trivial configurations; reject missing/invalid fields and outcomes that exceed budget; calculate final breach set and require **exactly one** final containment choice for the *configured* true rule.
- Variant rule safeguard: any generated/modified case that substitutes a different true rule is a **new configuration** and must be validated on its own. Case 001's alternate hypothetical true rules are not automatically valid: the existing final set gives two breaches for frog-moth and none for drawer. Preserve baseline rather than silently rewriting it or incorrectly requiring all hypothetical alternatives to be valid for the fixed authored case.
- Accept when: deterministic unit tests cover all existing 15 experiments and four hypotheses, the configured final answer, invalid alternate configurations, varying experiment budgets, adaptive branches, ambiguous/impossible/trivial instances and parity with current UI. No gameplay/visual changes, new case, mode or scoring system.
- Handoff: report validator output and any schema design choices before authoring additional cases.

### AL-UX01 — First-screen clarity (new, small UI task)
- Scope: put a short, explicit statement before the first test: "**One hidden rule applies to every procedure. Use experiments to find which candidate rule it is. In the final Photocopier check, use that rule to choose which of three fresh specimens breaches.**" Use case-driven final-procedure text rather than a second hard-coded source of truth. Simplify repeated tutorials/help text instead of lengthening it.
- Accept when: first-time users can see the objective and final procedure before choosing a specimen, the UI does not imply one hidden rule per apparatus, the rule list is clearly a set of competing theories, and final specimen identities remain concealed until rule submission.
- Guard: no automatic rule elimination, guided solution, tutorial case, unlimited tests, new modes, scoring, rule logic or animation overhaul. Preserve all Case 001 outcomes and both local/CI regressions; manual 320px/phone and desktop smoke required.

### AL-G01 — Early uncoached comprehension gate (existing gate; reordered)
- Recruit at least five independent players who did not work on the game, preferably on phones. Avoid coaching during the attempt and capture observations rather than explanations supplied afterward.
- Record: whether they can state that exactly **one** hidden rule spans the three procedures; whether they know the final procedure before testing; first specimen–procedure choice and reasoning; whether they understand SAFE/BREACH; number of tests and successful deductions; whether failure feels like guessing; duration, frustration and replay interest.
- Suggested **decision heuristic**, not statistical proof: seek at least four of five understanding the shared-rule objective and final check without coaching, alongside evidence of purposeful experiment choices and no recurring perceived-luck complaints. Capture contrary observations, not just the pass rate.
- Gate result: owner records **pass and proceed to AL-A03**, **revise AL-UX01 and retest**, or **consider explicitly approving AL-UX02**. A failed gate does not grant automatic permission to build the training case. Reuse the same G01 gate for retesting; do not create a duplicate task.

### AL-UX02 — Conditional teaching case (proposal only; no authorisation yet)
- Trigger: G01 still shows comprehension failure and owner separately approves this task.
- Proposed scope: three specimens, one procedure, small candidate-rule set, generous validated budget, useful teaching observation and a clearly explained final decision. It should teach the **same** one-rule loop used in standard cases.
- Accept if later approved: validator-backed fairness and unique containment; no hidden test restrictions; successful uncoached retest; Case 001 retained as the subsequent challenge.
- Do not build a multi-level progression, a second game mode or an open-ended test/scoring framework under this ID.

### AL-A03 — Four cases (existing task; gated)
- Only start after a recorded G01 pass. Reuse AL-A02's schema and validator, hand-author four genuinely distinct but comprehensible cases, keep the baseline and document manual phone observations; avoid adding procedure-combination complexity merely to increase variety.

## Deferred design suggestions — not authorised for implementation
- Automatic hypothesis-elimination board: possibly useful but could erase the deductive work; reconsider from G01 observations, not in AL-UX01.
- Unlimited or high-budget experiments, efficiency-only scoring and **Relaxed/Challenge** modes: consider under AL-C02 after learning whether comprehension—not budget—is the real problem. No commitment or task to implement now.
- New training level/three-stage progression: AL-UX02 is conditional only; do not make it a dependency unless G01 fails and owner approves.
- New narrative systems, additional apparatus dimensions, visual overhauls and monetisation: outside this feedback response.

## Gate G01 playtest contract and rationale
The existing Case 001 is mathematically identifiable within two strategically chosen tests, with a budget of three. This does **not** mean every arbitrary three-test sequence is informative; a player who thinks there are three separate machine rules could exhaust tests without understanding the logic. The final Photocopier choice is specified in source but not visible at the start of the current UI. Feedback therefore justifies early clarity testing rather than an immediate larger test budget or extra modes.

Use the early G01 result before authoring four more cases. During AL-A03, check that new variations remain comprehensible on phones, and continue into the later AL-E02 beta study for broader balance evidence. If still confusing, prioritise property-based binary rules and defer procedure combinations. Do not optimise for added mechanic count.

## Launch criteria
Stable daily generation; proven worst-case solvability and unique configured final decision; comprehension gate passed; seven days of repeatable seed checks without collisions that spoil freshness (longer uniqueness horizon tested offline); mobile/accessibility checks; privacy/telemetry decision; no blocking defects. Twenty authored cases alone are not a sustainable daily feed.

## Analytics decision
Start with consent-free aggregate Cloudflare Web Analytics (subject to current provider configuration and privacy disclosure) for visits/performance. Gameplay completion and difficulty cannot be inferred from page views. For beta use explicitly volunteered anonymous playtest forms/sessions; decide separately on an opt-in minimal event endpoint only if balance evidence requires it. Do not silently add identifiers, tracking pixels or detailed gameplay logs.

## Open product decisions for later review
Is UTC rollover acceptable to the UK audience? Should daily be accessible only once or allow unscored replay? Is generated variety engaging without increased rule dimensions? Is a one-off case pack valuable? Does G01 provide evidence to authorise a training level or different test budgets/modes? None of these authorises implementation merely by appearing here.
