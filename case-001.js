const caseData = {
  id: "001",
  testLimit: 3,
  trueRuleId: "altered",
  objects: {
    A: { id: "A", kind: "frog", altered: true, tag: 3, name: "Three-Eyed Frog" },
    B: { id: "B", kind: "slug", altered: false, tag: 7, name: "Ordinary Slug" },
    C: { id: "C", kind: "mushroom", altered: false, tag: 4, name: "Office Mushroom" },
    D: { id: "D", kind: "mushroom", altered: true, tag: 8, name: "Watching Mushroom" },
    E: { id: "E", kind: "moth", altered: false, tag: 2, name: "Ordinary Moth" }
  },
  rules: [
    { id: "altered", name: "Specimens with visible mutations breach", evaluate: (object) => object.altered === true },
    { id: "even", name: "Even-numbered specimens breach", evaluate: (object) => object.tag % 2 === 0 },
    { id: "frog-moth", name: "Frogs and moths breach", evaluate: (object) => object.kind === "frog" || object.kind === "moth" },
    { id: "drawer", name: "Anything put in the Filing Drawer breaches", evaluate: (_object, procedure) => procedure === "Filing Drawer" }
  ],
  placement: {
    procedure: "Photocopier",
    objects: {
      F: { id: "F", kind: "slug", altered: true, tag: 5, name: "Three-Eyed Slug" },
      G: { id: "G", kind: "frog", altered: false, tag: 9, name: "Ordinary Frog" },
      H: { id: "H", kind: "moth", altered: false, tag: 6, name: "Ordinary Moth" }
    }
  },
  hint: "The equipment may be a distraction. Compare the specimens that caused a breach. Do they share something visible?",
  incidentNotes: {
    "A|Filing Drawer": "The frog has requested a union representative.",
    "A|Tea Bath": "The frog drank the test medium. Finance has queried this.",
    "A|Photocopier": "Copy came out with four eyes. Original still has three.",
    "B|Filing Drawer": "Slug filed under S. This was apparently acceptable.",
    "B|Tea Bath": "Slug has become marginally more slug.",
    "B|Photocopier": "Photocopy indistinguishable from original at normal office resolution.",
    "C|Filing Drawer": "Mushroom remains technically a stationery issue.",
    "C|Tea Bath": "Tea now tastes of printer toner. Nobody is surprised.",
    "C|Photocopier": "Copy produced. HR have asked that we stop doing this.",
    "D|Filing Drawer": "Mushroom attempted to file itself as a dependent.",
    "D|Tea Bath": "Cap rotated 11°. Procurement notified.",
    "D|Photocopier": "Machine printed 'SEE ATTACHED' without paper.",
    "E|Filing Drawer": "Moth now classified as archived correspondence.",
    "E|Tea Bath": "Moth refused beverage. Sensible.",
    "E|Photocopier": "Moth copied successfully. Copy immediately flew away."
  }
};

function findRule(ruleId, data = caseData) {
  const rule = data.rules.find((candidate) => candidate.id === ruleId);
  if (!rule) throw new Error(`Unknown rule: ${ruleId}`);
  return rule;
}

function evaluateExperiment(ruleId, object, procedure, data = caseData) {
  return findRule(ruleId, data).evaluate(object, procedure);
}

function finalBreaches(ruleId, data = caseData) {
  return Object.values(data.placement.objects)
    .filter((object) => evaluateExperiment(ruleId, object, data.placement.procedure, data))
    .map((object) => object.id);
}

function isCorrectPlacement(ruleId, placementId, data = caseData) {
  const breaches = finalBreaches(ruleId, data);
  return breaches.length === 1 && breaches[0] === placementId;
}

const case001 = { caseData, findRule, evaluateExperiment, finalBreaches, isCorrectPlacement };

if (typeof module !== "undefined" && module.exports) module.exports = case001;
if (typeof globalThis !== "undefined") globalThis.case001 = case001;
