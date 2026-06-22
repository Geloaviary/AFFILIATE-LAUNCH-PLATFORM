function buildTutorialPlan({
  winner = {},
  campaignIntelligence = {},
  productIntelligence = {},
  assets = {}
} = {}) {

  if (
    !winner?.name
  ) {

    throw new Error(
      "TUTORIAL PLAN FAILED: winner missing"
    );

  }

  const hook =
    productIntelligence?.videoHooks?.[0];

  const steps = (
    productIntelligence?.useCases || []
  ).slice(0, 3);

  const benefit =
    productIntelligence?.benefits?.[0];

  if (
    !hook ||
    steps.length < 3 ||
    !benefit
  ) {

    throw new Error(
      "TUTORIAL PLAN FAILED: tutorial intelligence missing"
    );

  }

  const logo =
    assets.logos?.[0] || null;

  const screenshot1 =
    assets.screenshots?.[0] ||
    assets.renderableAssets?.[0] ||
    null;

  const screenshot2 =
    assets.screenshots?.[1] ||
    screenshot1;

  const screenshot3 =
    assets.screenshots?.[2] ||
    screenshot2;

  const scenes = [

    {
      scene: 1,

      purpose:
        "hook",

      duration:
        6,

      narration:
        hook,

      visualType:
        "tutorial",

      assets:
        screenshot1
          ? [screenshot1]
          : []
    },

    {
      scene: 2,

      purpose:
        "step",

      duration:
        8,

      narration:
        `Step 1. ${steps[0]}`,

      visualType:
        "tutorial",

      assets:
        screenshot1
          ? [screenshot1]
          : []
    },

    {
      scene: 3,

      purpose:
        "step",

      duration:
        8,

      narration:
        `Step 2. ${steps[1]}`,

      visualType:
        "tutorial",

      assets:
        screenshot2
          ? [screenshot2]
          : []
    },

    {
      scene: 4,

      purpose:
        "step",

      duration:
        8,

      narration:
        `Step 3. ${steps[2]}`,

      visualType:
        "tutorial",

      assets:
        screenshot3
          ? [screenshot3]
          : []
    },

    {
      scene: 5,

      purpose:
        "result",

      duration:
        6,

      narration:
        benefit,

      visualType:
        "result",

      assets:
        screenshot1
          ? [screenshot1]
          : []
    },

    {
  scene: 6,

  purpose:
    "cta",

  duration:
    6,

  narration:
    `Try ${winner.name} using the link below.`,

  visualType:
    "cta",

  assets:
    logo
      ? [logo]
      : []
}

  ];

  return {

    title:
      `How To Use ${winner.name}`,

    videoType:
      "tutorial",

    duration:
      42,

    themeColor:
      assets.themeColor || null,

    scenes

  };

}

module.exports = {
  buildTutorialPlan
};