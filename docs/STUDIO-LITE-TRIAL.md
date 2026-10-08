# Pluto Studio Lite — Anomaly Lab Trial Protocol
Updated 2026-10-08

## Purpose
Evaluate whether Lite provides governed, cost-effective execution compared with direct Codex; do not block Anomaly Lab if Lite fails.

## Setup
Register Anomaly Lab in Pluto Studio Lite using existing Night Parcel Office project/task YAML conventions. Preserve existing project configurations and priorities; don't guess config schema. Initially queue only AL-A01, with later slices blocked on dependencies and G01 manual review. A task registry is a proposal until local Studio configuration is inspected and tested.

## A/B trial
Choose a well-specified self-contained slice (recommended AL-A02 subtask: *case schema extraction only*, or AL-A03 first authored case after engine exists). Start from identical commit SHAs on two isolated worktrees, same task brief, tests and permitted tools. One executes via direct Codex, one via Studio Lite. Avoid simultaneous overlapping writes. Blindly score acceptance criteria first; then compare telemetry. Do not merge both implementations.

## Precommitted Lite success threshold
- No more regressions or failed acceptance checks than direct Codex.
- Human interventions <= 1.5x direct Codex (record absolute counts; if direct uses zero, require Lite <=1).
- Successful completion without bypassing QA, safety gates or task scope.
- Token/cost and elapsed-time comparisons are descriptive, not conclusive, with such small sample size.
- Record model, usage-source, missing telemetry and any warm-cache effects.
- If Lite exceeds regression/intervention thresholds, pause its use for critical-path slices and continue through direct Codex. No roadmap rewrite needed.

## Per-run record
Run ID, task ID, branch, base SHA, executor, start/end timestamp, provider/model, reported prompt/output tokens, cost estimate or unavailable, intervention counts, QA attempts/revisions, tests pass/fail, defects, integration outcome, final decision.

## Safe batch rules
Begin sequentially: AL-A01 -> AL-A02 -> AL-A03 -> G01 (human). Only batch independent content/visual tasks after tests demonstrate isolation. Set explicit task-count and cost caps. Review dirty worktrees, revision gates and locks before scheduling. Never auto-push to production. Measure actual Lite telemetry from runtime; do not invent figures.
