# Anomaly Lab — Game Design & Validation Contract
Updated 2026-10-08

## Player promise
A compact investigation with a fair solution. Four candidate rules, a few labelled specimens, limited binary observations (BREACH/SAFE), and a final containment choice that follows from the identified rule. No reflex timers or pay-to-win hints.

## Definitions
- Candidate rules are deterministic functions of specimen attributes and procedure.
- An experiment (specimen, procedure) produces an observable BREACH or SAFE; identical experiments should not be charged twice.
- A hypothesis set contains every candidate rule still consistent with observations.
- A valid puzzle requires a strategy that **guarantees** the correct candidate in at most K experiments for **every possible true rule**. Strategies can choose the next experiment based on previous observations.
- Report minimax depth: for each unused experiment, partition remaining hypotheses by observed outcome; choose a branch-minimising strategy against worst-case outcomes; memoize state. Terminal success requires exactly one identifiable rule. Reject if any indistinguishable pair yields the same outcome for every allowed experiment.
- If candidate rules are semantically indistinguishable over all available experiments, reject even if their written descriptions differ.
- Final containment action must be uniquely derivable for every actual puzzle outcome from the correct identified rule, with no extra hidden information.
- Difficulty derives from minimum guaranteed worst-case tests, branching structure, hint need and observed playtest friction. Do not declare Expert simply by limiting experiments.
- Reject uninteresting/trivial cases: e.g. rules separated immediately by a single obvious action, obviously false distractors, duplicate behavioural rules, inaccessible evidence. Some tutorial cases may deliberately allow simple solutions if labelled tutorial.

## Generator
Begin with hand-authored templates and rule/specimen combinations. Generate with seeded deterministic PRNG and stable generator version. Validate and reject outputs until an upper bounded attempt limit; use a verified fallback case on exhaustion. Ensure uniqueness of daily seeds/identifiers over an agreed horizon; test distribution and repeat patterns; do not pretend randomness alone guarantees uniqueness.

## Daily contract
- Canonical day key: YYYY-MM-DD **UTC** (provisional, to be confirmed before launch).
- Seed determined by day and version; store the generated puzzle snapshot and version when a session starts.
- Refresh recovers the same specimens, prior experiments, hint use and selections; completing a day locks the scored result. Replays, if offered, are clearly unscored.
- Midnight transition must not replace an active investigation; subsequent new game uses the new day's key.
- If offline and no case cached, supply clear explanation and a deterministic locally generated fallback only if validated. Prevent corrupted saves from crashing the game; use schema versions.
- Share: date, verdict, test count, optional emoji/symbol grid; **no rule text, specimen identities, experiment sequence, or answer**.
- Keep colour-independent outcomes (text + icons), focus states, keyboard use, and reduced motion.
- No required account or personal profile for launch.

## Existing case audit requirements
Case 001: four proposed rules, five specimens, three procedures, three experiments, and a final three-specimen photocopier choice. Independently enumerate all 15 possible tests and check all four candidate interpretations by minimax. Check whether each rule can be uniquely identified within 3 moves and whether the final choice is provable. Do not infer correctness from hardcoded console.assert checks which test only the true rule.

## Scope guard
Only introduce procedure-specific interaction mechanics if G01 player testing demonstrates they improve clarity and enjoyment. The daily puzzle is the product; employee ranks, weekly challenges, audio and complex environmental rule systems are post-beta ideas.
