function buildShortPlan({
  winner = {},
  campaignIntelligence = {},
  productIntelligence = {},
  assets = {}
} = {}) {

  const hook =
    campaignIntelligence.hooks?.[0] ||
    `Discover ${winner.name}`;

  const painPoint =
    campaignIntelligence.painPoints?.[0] ||
    "Most people waste time using outdated tools.";

  const desire =
    campaignIntelligence.desires?.[0] ||
    "Work faster and get better results.";

  const feature =
    productIntelligence.features?.[0] ||
    "Powerful automation features";

  const benefit =
    productIntelligence.benefits?.[0] ||
    "Save hours every week";

  const logo =
    assets.logos?.[0] || null;

  const screenshot =

  assets.renderableAssets?.[0] ||

  assets.screenshots?.[0] ||

  null;

  return {

    title:
      assets.ogTitle ||
      `${winner.name} Review`,

    videoType:
      "short",

    duration:
      45,

    themeColor:
      assets.themeColor,

    scenes: [

      {
        scene: 1,

        purpose:
          "hook",

        duration:
          5,

        narration:
          hook,

        visualType:
          "screenshot",

        assets:
          screenshot
            ? [screenshot]
            : []
      },

      {
        scene: 2,

        purpose:
          "problem",

        duration:
          8,

        narration:
          painPoint,

        visualType:
          "stock",

        assets: []
      },

      {
        scene: 3,

        purpose:
          "solution",

        duration:
          10,

        narration:
          `${winner.name} helps solve this.`,

        visualType:
          "dashboard",

        assets:
          screenshot
            ? [screenshot]
            : []
      },

      {
        scene: 4,

        purpose:
          "feature",

        duration:
          10,

        narration:
          feature,

        visualType:
          "screenshot",

        assets:
          screenshot
            ? [screenshot]
            : []
      },

      {
        scene: 5,

        purpose:
          "benefit",

        duration:
          7,

        narration:
          benefit,

        visualType:
          "screenshot",

        assets:
          screenshot
            ? [screenshot]
            : []
      },

      {
        scene: 6,

        purpose:
          "cta",

        duration:
          5,

        narration:
          `Try ${winner.name} using the link below.`,

        visualType:
          "logo",

        assets:
          logo
            ? [logo]
            : []
      }

    ]

  };

}

module.exports = {
  buildShortPlan
};