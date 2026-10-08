---
name: puzzle-validation
description: Validate Anomaly Lab deduction cases and generated puzzles for adaptive worst-case solvability, unambiguous hypotheses, meaningful difficulty, and a deducible final containment decision. Use when changing rules, cases, generators, difficulty or test budgets.
---

# Puzzle validation

## Read first
- `docs/GAME-DESIGN.md` for the authoritative definitions and daily contract.
- `docs/ROADMAP.md` for active slice and the mandatory mobile playtest gate.
- Current case data and tests; do not assume future architecture is already implemented.

## Procedure
1. Enumerate each candidate rule and each permitted unique specimen/procedure experiment.
2. Build the binary result vector (BREACH/SAFE) for every rule; reject behavioural duplicates, including distinct rule labels with identical results for all permitted tests.
3. Calculate minimax adaptive decision depth. At each hypothesis set, try each unused experiment, partition by response, and recursively minimise the **worst-case** branch. Memoise (remaining hypotheses, used tests). Terminal success requires exactly one remaining candidate. An impossible branch has infinite depth.
4. Validate that the minimum worst-case depth is within the case's test budget for **every possible true rule**, not only the configured answer.
5. Confirm the final containment decision is uniquely and deterministically implied by the identified rule. Reject hidden guessing.
6. Examine triviality: one-test shortcuts, implausible distractors, visually leaked answers and experiments that cannot provide useful discrimination. Explicitly exempt a labelled tutorial where appropriate.
7. Run existing automated tests; add targeted regression checks for new rules and boundaries. Never silently weaken or delete tests.
8. For generated cases, verify deterministic seeds, reject invalid output, enforce bounded retries and tested fallback.

## Required report
- Case ID and generator/rule version
- Candidate rules and experiment count
- Minimum guaranteed worst-case test depth and budget
- Indistinguishable pairs and ambiguity status
- Unique final choice status
- Triviality observations and tutorial exemptions
- Automated test commands with actual pass/fail counts
- Verdict: ACCEPT / REJECT / REVIEW, with precise reasons

## Guardrails
- Do not classify difficulty from an arbitrarily reduced budget.
- Do not mistake a lucky strategy for a guaranteed strategy.
- Do not describe conceptual checks as executed tests.
- Preserve short mobile sessions; do not add mechanics without AL-G01 playtest approval.
