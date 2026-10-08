import test from "node:test";
import assert from "node:assert/strict";

import case001 from "../case-001.js";

const { caseData, evaluateExperiment, finalBreaches, isCorrectPlacement } = case001;

const procedures = ["Filing Drawer", "Tea Bath", "Photocopier"];
const experiments = Object.values(caseData.objects).flatMap((object) =>
  procedures.map((procedure) => ({ object, procedure }))
);

test("Case 001 exposes the intended candidates, experiment space, and budget", () => {
  assert.deepEqual(caseData.rules.map(({ id }) => id), ["altered", "even", "frog-moth", "drawer"]);
  assert.equal(experiments.length, 15);
  assert.equal(caseData.testLimit, 3);
  assert.equal(caseData.trueRuleId, "altered");
});

test("all four rules produce their defined outcomes across all 15 experiments", () => {
  const expectedByRule = {
    altered: { A: true, B: false, C: false, D: true, E: false },
    even: { A: false, B: false, C: true, D: true, E: true },
    "frog-moth": { A: true, B: false, C: false, D: false, E: true }
  };

  for (const { object, procedure } of experiments) {
    for (const [ruleId, outcomes] of Object.entries(expectedByRule)) {
      assert.equal(evaluateExperiment(ruleId, object, procedure), outcomes[object.id], `${ruleId}: ${object.id} + ${procedure}`);
    }
    assert.equal(evaluateExperiment("drawer", object, procedure), procedure === "Filing Drawer", `drawer: ${object.id} + ${procedure}`);
  }
});

test("candidate rules are behaviorally distinct and adaptively identifiable within three experiments", () => {
  const signatures = caseData.rules.map(({ id }) =>
    experiments.map(({ object, procedure }) => Number(evaluateExperiment(id, object, procedure))).join("")
  );
  assert.equal(new Set(signatures).size, caseData.rules.length);

  const memo = new Map();
  function minimax(ruleIds, available) {
    if (ruleIds.length === 1) return 0;
    const key = `${ruleIds.join(",")}|${available.join(",")}`;
    if (memo.has(key)) return memo.get(key);
    let best = Infinity;
    for (const experimentIndex of available) {
      const experiment = experiments[experimentIndex];
      const branches = new Map([[false, []], [true, []]]);
      for (const ruleId of ruleIds) {
        branches.get(evaluateExperiment(ruleId, experiment.object, experiment.procedure)).push(ruleId);
      }
      if ([...branches.values()].some((branch) => branch.length === ruleIds.length)) continue;
      const remaining = available.filter((index) => index !== experimentIndex);
      const worstBranch = Math.max(...[...branches.values()].filter((branch) => branch.length).map((branch) => minimax(branch, remaining)));
      best = Math.min(best, 1 + worstBranch);
    }
    memo.set(key, best);
    return best;
  }

  const depth = minimax(caseData.rules.map(({ id }) => id), experiments.map((_, index) => index));
  assert.equal(depth, 2);
  assert.ok(depth <= caseData.testLimit);
});

test("configured experiment outcomes and final containment use the true rule", () => {
  assert.equal(evaluateExperiment(caseData.trueRuleId, caseData.objects.A, "Tea Bath"), true);
  assert.equal(evaluateExperiment(caseData.trueRuleId, caseData.objects.C, "Filing Drawer"), false);
  assert.equal(evaluateExperiment(caseData.trueRuleId, caseData.objects.D, "Photocopier"), true);

  assert.deepEqual(finalBreaches(caseData.trueRuleId), ["F"]);
  assert.equal(isCorrectPlacement(caseData.trueRuleId, "F"), true);
  assert.equal(isCorrectPlacement(caseData.trueRuleId, "G"), false);
  assert.equal(isCorrectPlacement(caseData.trueRuleId, "H"), false);
});

test("containment requires exactly one breach rather than accepting an arbitrary matching specimen", () => {
  assert.deepEqual(finalBreaches("even"), ["H"]);
  assert.deepEqual(finalBreaches("frog-moth"), ["G", "H"]);
  assert.deepEqual(finalBreaches("drawer"), []);
  assert.equal(isCorrectPlacement("even", "H"), true);
  assert.equal(isCorrectPlacement("frog-moth", "G"), false);
  assert.equal(isCorrectPlacement("drawer", "F"), false);
});
