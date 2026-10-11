# AL-A01 — Baseline audit

Audit date: 2026-10-08 (local evidence timestamp: 18:32:10 UTC). Status: REVIEW; the bounded repair resolves startup and all 15 automated tests pass. Remote verification, hosted CI and manual mobile checks remain unverified. No acceptance or integration approval is implied.

## Git evidence

- Isolated worktree: `/Users/tomrawnson/Developer/pluto-ai-studio/runtime/lite/worktrees/d43cca12-6068-44c5-b850-b4d87ab8214d`.
- Branch: `pluto-lite/anomaly-lab/al-a01-d43cca12-606`.
- Exact baseline HEAD: `adfd7216c22d40387a7209d4043de55728e9fa67` (`Add Case 001 behavioral tests and Lite validation bootstrap`).
- Initial `git status --short --branch`: branch header only; clean index and working tree. Current task changes are uncommitted.
- Origin fetch/push URL: `https://github.com/thomasrawnson/anomaly-lab.git`.
- Cached `origin/HEAD` points to `origin/main`; cached `origin/main` and local `main` equal the baseline SHA. The task branch has no upstream shown by `git branch -avv`. Cached equality is not a live remote confirmation.
- Read-only live check: `git ls-remote --symref origin HEAD refs/heads/main` failed with `Could not resolve host: github.com`. No live remote SHA, ahead/behind relationship, remote CI status or branch protection has been established.
- Cloudflare integration, production branch and deployed SHA were not checked. No other checkout was modified, no fetch changed shared refs, and no commit, merge, push or deployment was performed.

## Existing implementation and startup defect

`index.html` contains styling, markup, state and event handlers. It loads `case-001.js` as a classic script before its inline classic script. `case-001.js` provides the data and evaluator, with CommonJS and global exports. There are no runtime dependencies, build, framework, backend, daily generator, save storage or network calls in these files.

At the baseline, both scripts declare a top-level `const caseData`; the inline script also declares constants with the same names as the external script's `evaluateExperiment` and `isCorrectPlacement` functions. Loading them in one global context raises `SyntaxError: Identifier 'caseData' has already been declared` before inline initialization. The existing five Node tests import only the case module and therefore pass despite this integration defect. The new smoke harness preserves script order and shared global scope and catches this failure. Do not mask it by wrapping scripts only in tests.

The authorized bounded repair encloses the existing `case-001.js` body in a function scope, retaining the CommonJS and `globalThis.case001` exports. This removes the global declaration collision without changing case data, rule evaluation or interaction logic. The shared-scope smoke harness is unchanged. The following states now pass automated interaction checks; real browser verification remains pending.

## State inventory from source

Evidence: `index.html` state declaration and named functions below; case definitions and helpers in `case-001.js`.

| State / transition | Existing behavior and evidence |
|---|---|
| Orientation | `tutorialModal` initially visible in markup. `closeTutorial` hides it and focuses help; `openTutorial` locks body scrolling and focuses Begin. Overlay click closes only when the overlay itself is targeted. Initial markup visibility does not call `openTutorial`. |
| Fresh investigation | `state` has null specimen/procedure/rule/placement, no tests, empty used set, no hint, no timer, no submitted/confirmed/review flags. Initial render creates five specimens, three procedures, four rules and three hidden placement cards. Run, submit, hint and confirmation start disabled. |
| Tentative rule | `renderRules` allows selection/change before tests; `updateRule` requires at least one test before submission. Rule selection itself does not start the timer. |
| Partial / ready experiment | `card`, `renderProcedures`, `updateSelectionSummary` support either selection order. First specimen/procedure click starts elapsed time. Both selections are required to run. Mobile progress advances to testing. |
| Observation | `runTest` evaluates the configured true rule, records the incident note and unique specimen/procedure key, clears both selections and hides first-turn guidance. `playReaction` and `renderLog` show BREACH ✕ or SAFE ○, independent of colour; animation class clears after 900 ms. |
| Duplicate selection | `updateTest` disables an already used pair; `runTest` also guards the used set. A different procedure on the same specimen is a new charged experiment. |
| Guidance | `updateRule` enables it after the first test. `useHint` records a single hint and displays fixed guidance; repeated calls do nothing. The button becomes disabled on the next `updateRule` call, rather than immediately in `useHint`. |
| Budget exhausted | At three tests, `card`/`renderProcedures` disable experiment choices and `updateTest` disables Run. Rule selection and submission remain available. |
| Rule filed / final check | `submitRule` locks experiment and rule controls, collapses investigation, shows summary and three new photocopier specimens. It does not reveal whether the rule is correct. Submission is allowed after one, two or three tests. |
| Review | `toggleReview` opens/closes investigation after submission; controls remain locked. |
| Placement selected | `card(..., true)` permits changing selection until confirmation. `updatePlacement` enables confirmation only with a choice. |
| Complete | `confirmPlacement` locks placement, stops elapsed time and shows rule correctness, placement correctness, tests, hint status, elapsed time, stamp and assessment. Placement is checked against the true rule, not the submitted rule. |
| Restart | `restart` clears tests, used keys, selections, hint, timer and review; restores investigation and first-turn guide; hides final/results/summary/guidance; restores mobile step 1. It does not reopen orientation. |
| Reload | All state is memory-only; a fresh page starts from orientation with zero tests. No resume/daily rollover contract exists yet (AL-B03). |

`performance` has six branches: correct rule + correct placement, no hint and <=2 tests gives CONCERNINGLY EFFICIENT; three tests gives ACCEPTABLE; correct both with hint gives ADEQUATE WITH SUPERVISION; wrong rule/right placement gives CONCERNINGLY LUCKY; right rule/wrong placement gives TECHNICALLY CORRECT; wrong both gives MANAGEMENT MATERIAL. Only correct both produces CONTAINMENT APPROVED; otherwise FORM RETURNED. Time is displayed but does not determine assessment.

## Case 001 audit

Case/rule version: Case `001` at the baseline SHA; no generator or explicit schema/rule version. Budget 3; four rules; five specimens × three procedures = 15 possible experiments. Rules: visible mutation (`altered`), even tag (`even`), frog or moth (`frog-moth`), Filing Drawer (`drawer`).

Specimens: A three-eyed frog, altered, tag 3; B ordinary slug, tag 7; C office mushroom, tag 4; D watching mushroom, altered, tag 8; E ordinary moth, tag 2. Final Photocopier choices: F three-eyed slug, altered, tag 5; G ordinary frog, tag 9; H ordinary moth, tag 6.

The complete outcome matrix below is checked by `test/case-001.test.mjs`. B = BREACH, S = SAFE.

| Experiment | altered | even | frog-moth | drawer |
|---|---|---|---|---|
| A + Filing Drawer | B | S | B | B |
| A + Tea Bath | B | S | B | S |
| A + Photocopier | B | S | B | S |
| B + Filing Drawer | S | S | S | B |
| B + Tea Bath | S | S | S | S |
| B + Photocopier | S | S | S | S |
| C + Filing Drawer | S | B | S | B |
| C + Tea Bath | S | B | S | S |
| C + Photocopier | S | B | S | S |
| D + Filing Drawer | B | B | S | B |
| D + Tea Bath | B | B | S | S |
| D + Photocopier | B | B | S | S |
| E + Filing Drawer | S | B | B | B |
| E + Tea Bath | S | B | B | S |
| E + Photocopier | S | B | B | S |

Minimum guaranteed adaptive depth is **2**, within budget 3. No indistinguishable pairs. Example witness: A + Tea Bath splits {altered, frog-moth} from {even, drawer}; D + Photocopier then distinguishes each pair. The existing minimax test evaluates all informative experiment partitions and every candidate branch, not only the configured true rule. One binary test cannot distinguish four candidates. B + Tea Bath and B + Photocopier are uninformative. Some outcomes of other tests immediately identify one candidate, but do not guarantee one-test identification for every candidate. Visible mutations and the hint make this a simple introductory case; no formal tutorial-difficulty exemption is declared in case metadata and no human difficulty study is claimed.

| Rule | Final breaches | Unique choice |
|---|---|---|
| altered (configured truth) | F | Yes |
| even | H | Yes |
| frog-moth | G, H | No |
| drawer | none | No |

Verdict: **REVIEW**. The configured case has distinct hypotheses, sufficient budget and a provable F answer. It cannot be reused unchanged with arbitrary true rules under the all-outcomes containment contract. Preserve this behavior in AL-A01; a future validator must reject the invalid alternate configurations. The original startup failure is resolved by the bounded repair; manual playable-baseline verification remains pending.

## Automated coverage and CI

Baseline `npm test`: **5 passed, 0 failed**, Node v24.21.0 / npm 11.19.0.

During the initial autonomous task execution, the task-local `npm test` run (after `package.json` had been changed to `node --test test/*.test.mjs`) reported **5 passed, 10 failed**, all smoke failures caused by the duplicate global declaration. A temporary diagnostic fixture previously confirmed the proposed scope repair and was removed.

After the authorized bounded repair, that task-local `npm test` command reports **15 passed, 0 failed** on Node v24.21.0, including all ten smoke tests against actual production scripts. No test expectations, harness behavior or validation commands were changed during the repair attempt. `git diff --check` passes. `index.html` is unchanged; the only production change is the function wrapper in `case-001.js`. The separate runner-validation count is explained in the post-run addendum below.

`test/prototype.test.mjs` adds ten interaction smoke tests covering orientation, selection gates, a two-test solution, duplicate prevention, both observable labels, three-test cap, guidance, locked review, final choice, all six assessment branches, restart and fresh reload. `test/helpers/prototype.mjs` loads actual scripts in page order, uses actual element IDs/classes/disabled attributes, captures click listeners and controls time deterministically. It contains no copied game rules. It is a narrow DOM adapter, not a browser: no layout, HTML nesting repair, CSS, bubbling, real focus navigation, storage environment or accessibility tree.

`.github/workflows/test.yml` runs `npm test` on push, pull request and manual dispatch with Node 24 on Ubuntu, read-only contents permission and a five-minute timeout. No install/build/deploy step is needed. Configuration was checked against GitHub Actions documentation via Context7: [Node workflow example](https://docs.github.com/en/actions/tutorials/migrate-to-github-actions/manual-migrations/migrate-from-travis-ci) and [CI overview](https://docs.github.com/en/actions/get-started/continuous-integration). A hosted run remains pending; local tests do not establish hosted CI success.

## Manual browser / phone checklist — not performed

With the startup repair applied, open the static page with developer console visible. At 320px, a typical phone width and desktop width, complete the two-test A/Tea then D/Photocopier route, submit mutations and choose F. Repeat with guidance and wrong answers, review and restart. Check no console errors, overflow, obstructed scene or clipped controls; measure touch targets >=44px; confirm text/symbol outcomes without colour. Test keyboard focus, orientation open/close, screen reader announcements, and OS reduced motion (including scrolling). Source has a reduced-motion animation rule, but still requests smooth scrolling; source inspection does not prove accessibility. Mark actual device/browser and results when performed. No UI/CSS changes are part of this audit.

## Studio Lite run record

### Observations available during task execution

- Run/task: worktree `d43cca12-6068-44c5-b850-b4d87ab8214d`, AL-A01.
- Executor: Codex via Pluto Studio Lite. The serving model and reasoning effort were not emitted and remain unknown.
- The initial agent asked a scope question after finding the startup defect. No owner response was observed during the run. Pluto Lite then invoked its automatic bounded repair path; the question itself was not an owner intervention.
- QA observed by the task: the expanded production-source suite exposed the startup defect (5 passed / 10 failed). One automatic bounded repair applied the function wrapper; the task-local `npm test` then passed all 15 declared tests. No test expectations were weakened.
- Integration outcome: uncommitted worktree only; no integration attempted. Final acceptance remains an owner decision after outstanding evidence is supplied. AL-A02 is not automatically unblocked.

### Owner-authorised post-run review addendum

This addendum was added after execution from the preserved durable result at `runtime/lite/results/d43cca12-6068-44c5-b850-b4d87ab8214d.json`. It is an owner-authorised factual correction, not part of the original autonomous task output and not task acceptance.

- Durable timing: started `2026-10-08T18:27:44.003Z`, finished `2026-10-08T18:34:52.992Z`, elapsed **428,989 ms** (**7 minutes 8.989 seconds**).
- Attempts: **2 Codex invocations** — one initial invocation (**370,319 ms**) and one automatic bounded-repair invocation (**58,284 ms**). No manual retry occurred.
- Aggregate usage fields: **704,633 input tokens**, of which **612,480 were cached input tokens**, and **14,146 output tokens**. The durable result separately records `reasoningOutputTokens: 1,476`; its schema does not establish that this field should be added to `outputTokens`, so no combined output total is claimed. Initial invocation fields were 509,814 input / 458,240 cached input / 12,452 output / 1,450 reasoning output; repair fields were 194,819 input / 154,240 cached input / 1,694 output / 26 reasoning output.
- Model identity and reasoning effort remain unknown: both invocation records contain `model: null`, `modelStatus: not_emitted` and `reasoningEffort: null`. Cost is unknown and is not estimated.
- The result records approval-interruption count, approval wait and owner-active time as unavailable/null. No owner response was observed between the agent's scope question and automatic repair. Formal interruption and owner-time measurements therefore remain unavailable.
- The durable stage validator reports **16 discovered test entries** both before and after repair (6 passed / 10 failed, then 16 passed / 0 failed), whereas the task-local and current `npm test` report **15 declared tests**. This is explained by execution-stage command resolution, not a changed gameplay assertion count: the approved snapshot stored the earlier `npm test` script as `node --test`; the runner resolves and executes that frozen script directly, so Node auto-discovers `test/helpers/prototype.mjs` and reports the helper file itself as a sixteenth passing entry. During the task, `package.json` changed the current script to `node --test test/*.test.mjs`, whose file expansion selects the two `*.test.mjs` files and reports their 15 declared tests without the helper entry. Reproduction on Node v24.21.0 produced 16 entries for `node --test` and 15 for `node --test test/*.test.mjs`.

## Acceptance and handoff

| Criterion | Evidence / status |
|---|---|
| Local and remote baseline | Local clean starting state and exact HEAD/cached remote SHA recorded. Live remote check blocked by DNS; current remote status not confirmed. |
| Gameplay states and Case 001 | Enumerated above from source, including 15 tests, adaptive depth, all final outcomes and known limitations. |
| Automated smoke and CI | Ten smoke tests added and wired to CI. All 15 local tests pass after startup repair; hosted CI has not run. |
| Repository guidance | AGENTS and README now describe actual architecture, commands, limitations and approval boundaries; roadmap gates retained. |
| No gameplay changes | `index.html` and existing case tests unchanged. `case-001.js` only gains a function wrapper to resolve startup; case data, rules and gameplay logic unchanged. No framework/backend/runtime dependency added. |

Changed files across AL-A01: `case-001.js`, `AGENTS.md`, `README.md`, `package.json`, `docs/AI-SKILLS-REGISTER.md`, this audit, `.github/workflows/test.yml`, `test/helpers/prototype.mjs`, `test/prototype.test.mjs`.

Bounded repair changed only `case-001.js`, `README.md` and this audit. Existing task edits were preserved. Branch remains `pluto-lite/anomaly-lab/al-a01-d43cca12-606`, HEAD remains `adfd7216c22d40387a7209d4043de55728e9fa67`; no commit was created.

Human decision needed: acceptance of AL-A01 after outstanding evidence is supplied. Remote and hosted CI checks require a network-capable follow-up; a real phone smoke pass remains pending. No commit, push or deployment is authorized by this report.
