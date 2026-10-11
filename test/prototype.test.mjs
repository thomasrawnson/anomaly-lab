import test from "node:test";
import assert from "node:assert/strict";
import { loadPrototype } from "./helpers/prototype.mjs";

function begin() {
  const app = loadPrototype();
  app.el("closeTutorial").click();
  return app;
}
function choose(app, group, text) {
  const button = app.el(group).children.find((child) => child.textContent.includes(text));
  assert.ok(button, `Missing ${group} option: ${text}`);
  button.click();
  return button;
}
function experiment(app, specimen, procedure) {
  choose(app, "specimens", specimen);
  choose(app, "procedures", procedure);
  assert.equal(app.el("runTest").disabled, false);
  app.el("runTest").click();
}
function hidden(app, id, expected) {
  assert.equal(app.el(id).classList.contains("hidden"), expected, id);
}

test("initial state, tutorial controls, partial selection and first-test submission gate", () => {
  const app = loadPrototype();
  hidden(app, "tutorialModal", false);
  hidden(app, "finalSection", true);
  hidden(app, "resultsSection", true);
  assert.equal(app.el("specimens").children.length, 5);
  assert.equal(app.el("procedures").children.length, 3);
  assert.equal(app.el("rules").children.length, 4);
  assert.equal(app.el("testsUsedTop").textContent, "0 / 3");
  for (const id of ["runTest", "submitRule", "hintButton", "confirmPlacement"]) {
    assert.equal(app.el(id).disabled, true, id);
    app.el(id).click();
  }
  app.el("closeTutorial").click();
  hidden(app, "tutorialModal", true);
  assert.equal(app.document.activeElement, app.el("openTutorial"));
  app.el("openTutorial").click();
  assert.equal(app.document.body.style.overflow, "hidden");
  assert.equal(app.document.activeElement, app.el("closeTutorial"));
  app.el("tutorialModal").click(app.el("closeTutorial"));
  hidden(app, "tutorialModal", false);
  app.el("tutorialModal").click();
  hidden(app, "tutorialModal", true);
  assert.equal(app.document.body.style.overflow, "");
  choose(app, "rules", "visible mutations");
  assert.equal(app.el("submitRule").disabled, true);
  choose(app, "procedures", "TEA BATH");
  assert.equal(app.el("runTest").disabled, true);
  assert.match(app.el("selectionSummary").textContent, /Choose a specimen/);
  choose(app, "specimens", "Three-Eyed Frog");
  assert.equal(app.el("runTest").disabled, false);
  assert.match(app.el("selectionSummary").textContent, /READY TO TEST/);
});

test("two-test critical path, duplicate protection, read-only review, containment and restart", () => {
  const app = begin();
  experiment(app, "Three-Eyed Frog", "TEA BATH");
  assert.equal(app.el("reactionResult").textContent, "BREACH ✕");
  assert.match(app.el("logList").textContent, /A \+ Tea Bath.*BREACH ✕.*Finance/s);
  hidden(app, "firstTurnGuide", true);
  assert.equal(app.el("runTest").disabled, true);
  choose(app, "specimens", "Three-Eyed Frog");
  assert.equal(app.el("runTest").disabled, true);
  choose(app, "procedures", "TEA BATH");
  assert.equal(app.el("runTest").disabled, true);
  app.el("runTest").click();
  assert.equal(app.el("testsUsedTop").textContent, "1 / 3");
  experiment(app, "Watching Mushroom", "PHOTOCOPIER");
  assert.equal(app.el("logList").children.length, 2);
  choose(app, "rules", "Even-numbered");
  choose(app, "rules", "visible mutations");
  app.el("submitRule").click();
  hidden(app, "investigationArea", true);
  hidden(app, "investigationSummary", false);
  hidden(app, "finalSection", false);
  assert.match(app.el("summaryText").textContent, /2 tests used · Rule filed/);
  assert.equal(app.el("confirmPlacement").disabled, true);
  app.el("reviewButton").click();
  hidden(app, "investigationArea", false);
  for (const group of ["specimens", "procedures", "rules"]) {
    assert.ok(app.el(group).children.every((button) => button.disabled), group);
  }
  for (const id of ["runTest", "submitRule", "hintButton"]) assert.equal(app.el(id).disabled, true);
  app.el("reviewButton").click();
  hidden(app, "investigationArea", true);
  choose(app, "placement", "Ordinary Frog");
  choose(app, "placement", "Three-Eyed Slug");
  app.advance(65_000);
  app.el("confirmPlacement").click();
  hidden(app, "resultsSection", false);
  assert.equal(app.el("resultStamp").textContent, "CONTAINMENT APPROVED");
  assert.equal(app.el("timeResult").textContent, "01:05");
  assert.equal(app.el("testsResult").textContent, "2 / 3");
  assert.equal(app.el("hintResult").textContent, "Not used");
  assert.equal(app.el("confirmPlacement").disabled, true);
  assert.ok(app.el("placement").children.every((button) => button.disabled));
  app.el("tryAgain").click();
  app.flushTimers();
  for (const id of ["finalSection", "resultsSection", "investigationSummary", "guidance"]) hidden(app, id, true);
  hidden(app, "investigationArea", false);
  hidden(app, "firstTurnGuide", false);
  hidden(app, "tutorialModal", true);
  assert.equal(app.el("testsUsedTop").textContent, "0 / 3");
  assert.equal(app.el("reactionResult").textContent, "");
  assert.ok(app.el("mobileStep1").classList.contains("active"));
  experiment(app, "Three-Eyed Frog", "TEA BATH"); // Used-test set reset.
  choose(app, "rules", "visible mutations");
  app.el("submitRule").click();
  choose(app, "placement", "Three-Eyed Slug");
  app.advance(2_000);
  app.el("confirmPlacement").click();
  assert.equal(app.el("timeResult").textContent, "00:02");
});

test("three-test budget, SAFE label, single-use guidance and reset after guidance", () => {
  const app = begin();
  experiment(app, "Ordinary Slug", "FILING DRAWER");
  assert.equal(app.el("reactionResult").textContent, "SAFE ○");
  assert.match(app.el("logList").textContent, /B \+ Filing Drawer.*SAFE ○/s);
  app.el("hintButton").click();
  hidden(app, "guidance", false);
  assert.match(app.el("guidance").textContent, /GUIDANCE 42-B:.*equipment may be a distraction/);
  const hint = app.el("guidance").textContent;
  app.el("hintButton").click();
  assert.equal(app.el("guidance").textContent, hint);
  experiment(app, "Ordinary Slug", "TEA BATH"); // Same specimen, different procedure is charged.
  experiment(app, "Office Mushroom", "PHOTOCOPIER");
  assert.equal(app.el("testsUsedTop").textContent, "3 / 3");
  assert.equal(app.el("logCount").textContent, "3 / 3");
  assert.equal(app.el("hintButton").disabled, true);
  for (const group of ["specimens", "procedures"]) assert.ok(app.el(group).children.every((b) => b.disabled));
  app.el("runTest").click();
  assert.equal(app.el("logList").children.length, 3);
  choose(app, "rules", "visible mutations");
  app.el("submitRule").click();
  choose(app, "placement", "Three-Eyed Slug");
  app.el("confirmPlacement").click();
  assert.equal(app.el("hintResult").textContent, "Used");
  app.el("tryAgain").click();
  hidden(app, "guidance", true);
  assert.equal(app.el("guidance").textContent, "");
  assert.equal(app.el("hintButton").classList.contains("used"), false);
  assert.equal(app.el("hintButton").disabled, true);
  experiment(app, "Ordinary Slug", "FILING DRAWER");
  assert.equal(app.el("hintButton").disabled, false);
});

for (const [rule, placement, count, hint, assessment, ruleCorrect, placementCorrect] of [
  ["visible mutations", "Three-Eyed Slug", 2, false, "CONCERNINGLY EFFICIENT", true, true],
  ["visible mutations", "Three-Eyed Slug", 3, false, "ACCEPTABLE", true, true],
  ["visible mutations", "Three-Eyed Slug", 1, true, "ADEQUATE WITH SUPERVISION", true, true],
  ["Even-numbered", "Three-Eyed Slug", 1, false, "CONCERNINGLY LUCKY", false, true],
  ["visible mutations", "Ordinary Frog", 1, false, "TECHNICALLY CORRECT", true, false],
  ["Even-numbered", "Ordinary Moth", 1, false, "MANAGEMENT MATERIAL", false, false],
]) {
  test(`result branch: ${assessment}`, () => {
    const app = begin();
    for (const procedure of ["FILING DRAWER", "TEA BATH", "PHOTOCOPIER"].slice(0, count)) {
      experiment(app, "Three-Eyed Frog", procedure);
    }
    if (hint) app.el("hintButton").click();
    choose(app, "rules", rule);
    app.el("submitRule").click();
    choose(app, "placement", placement);
    app.el("confirmPlacement").click();
    assert.equal(app.el("assessment").textContent, `EMPLOYEE ASSESSMENT: ${assessment}`);
    assert.equal(app.el("ruleResult").textContent, ruleCorrect ? "✓ Correct" : "✕ Incorrect");
    assert.equal(app.el("placementResult").textContent, placementCorrect ? "✓ Correct" : "✕ Incorrect");
    assert.equal(app.el("resultStamp").textContent, ruleCorrect && placementCorrect ? "CONTAINMENT APPROVED" : "FORM RETURNED");
  });
}

test("reload starts a fresh case; prototype does not resume", () => {
  const app = begin();
  experiment(app, "Three-Eyed Frog", "TEA BATH");
  const reloaded = loadPrototype();
  hidden(reloaded, "tutorialModal", false);
  assert.equal(reloaded.el("testsUsedTop").textContent, "0 / 3");
  assert.equal(reloaded.el("submitRule").disabled, true);
});
