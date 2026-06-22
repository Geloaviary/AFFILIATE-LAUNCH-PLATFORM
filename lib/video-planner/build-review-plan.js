function buildReviewPlan({
  winner = {},
  campaignIntelligence = {},
  productIntelligence = {},
  assets = {}
} = {}) {

  if (
    !winner?.name
  ) {

    throw new Error(
      "REVIEW PLAN FAILED: winner missing"
    );

  }

  const hook =
    campaignIntelligence?.hooks?.[0];

  const feature =
    productIntelligence?.features?.[0];

  const benefit =
    productIntelligence?.benefits?.[0];

  if (
    !hook ||
    !feature ||
    !benefit
  ) {

    throw new Error(
      "REVIEW PLAN FAILED: research intelligence missing"
    );

  }

  const logo =
    assets.logos?.[0] || null;

  const screenshot =
    assets.screenshots?.[0] ||
    assets.renderableAssets?.[0] ||
    null;

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
        "product",

      assets:
        screenshot
          ? [screenshot]
          : []
    },

    {
      scene: 2,

      purpose:
        "feature",

      duration:
        8,

      narration:
        `${winner.name}'s standout feature is ${feature}.`,

      visualType:
        "feature",

      assets:
        screenshot
          ? [screenshot]
          : []
    },

    {
      scene: 3,

      purpose:
        "benefit",

      duration:
        8,

      narration:
        benefit,

      visualType:
        "benefit",

      assets:
        screenshot
          ? [screenshot]
          : []
    },

    {
      scene: 4,

      purpose:
        "verdict",

      duration:
        8,

      narration:
        `${winner.name} earned the highest opportunity score in our research and is recommended for users seeking long-term value.`,

      visualType:
        "verdict",

      assets:
        logo
          ? [logo]
          : []
    },

    {
      scene: 5,

      purpose:
        "cta",

      duration:
        6,

      narration:
        `Learn more about ${winner.name} using the link below.`,

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
      `${winner.name} Review`,

    videoType:
      "review",

    duration:
      36,

    themeColor:
      assets.themeColor || null,

    scenes

  };

}

module.exports = {
  buildReviewPlan
};