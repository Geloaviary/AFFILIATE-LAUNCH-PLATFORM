function buildComparisonPlan({
  productA = {},
  productB = {},
  assets = {}
} = {}) {

  const nameA =
    productA.name ||
    "Product A";

  const nameB =
    productB.name ||
    "Product B";

  const logoA =
    productA.assets?.logos?.[0] ||
    null;

  const logoB =
    productB.assets?.logos?.[0] ||
    null;

  const screenshotA =
    productA.assets?.screenshots?.[0] ||
    null;

  const screenshotB =
    productB.assets?.screenshots?.[0] ||
    null;

  const scenes = [

    {
      scene: 1,

      purpose:
        "hook",

      duration:
        8,

      narration:
        `${nameA} vs ${nameB}. Which one is actually worth your money?`,

      visualType:
        "comparison-cover",

      assets: [
        logoA,
        logoB
      ].filter(Boolean)

    },

    {
      scene: 2,

      purpose:
        "overview",

      duration:
        12,

      narration:
        `${nameA} and ${nameB} are two popular solutions, but they serve different users.`,

      visualType:
        "side-by-side",

      assets: [
        screenshotA,
        screenshotB
      ].filter(Boolean)

    },

    {
      scene: 3,

      purpose:
        "features",

      duration:
        15,

      narration:
        `${nameA} focuses on ${productA.primaryFeature || "advanced functionality"}, while ${nameB} focuses on ${productB.primaryFeature || "ease of use"}.`,

      visualType:
        "feature-comparison",

      assets: [
        screenshotA,
        screenshotB
      ].filter(Boolean)

    },

    {
      scene: 4,

      purpose:
        "pricing",

      duration:
        10,

      narration:
        `${nameA} and ${nameB} have different pricing structures depending on your needs.`,

      visualType:
        "pricing-comparison",

      assets: []

    },

    {
      scene: 5,

      purpose:
        "pros",

      duration:
        12,

      narration:
        `${nameA}'s biggest advantage is ${productA.biggestAdvantage || "powerful features"}. ${nameB}'s biggest advantage is ${productB.biggestAdvantage || "simplicity"}.`,

      visualType:
        "pros-comparison",

      assets: [
        screenshotA,
        screenshotB
      ].filter(Boolean)

    },

    {
      scene: 6,

      purpose:
        "cons",

      duration:
        10,

      narration:
        `Neither platform is perfect. Your choice depends on your budget and workflow.`,

      visualType:
        "cons-comparison",

      assets: []

    },

    {
      scene: 7,

      purpose:
        "winner",

      duration:
        12,

      narration:
        `If you need advanced capabilities, choose ${nameA}. If simplicity matters more, choose ${nameB}.`,

      visualType:
        "winner",

      assets: [
        logoA,
        logoB
      ].filter(Boolean)

    },

    {
      scene: 8,

      purpose:
        "cta",

      duration:
        6,

      narration:
        `Check the links below to compare ${nameA} and ${nameB} yourself.`,

      visualType:
        "cta",

      assets: [
        logoA,
        logoB
      ].filter(Boolean)

    }

  ];

  return {

    title:
      `${nameA} vs ${nameB}`,

    videoType:
      "comparison",

    duration:
      scenes.reduce(
        (sum, scene) =>
          sum + scene.duration,
        0
      ),

    themeColor:
      assets.themeColor ||
      null,

    scenes

  };

}

module.exports = {
  buildComparisonPlan
};