function buildReviewPlan({
  winner = {},
  campaignIntelligence = {},
  productIntelligence = {},
  assets = {}
} = {}) {

  const hook =
    campaignIntelligence.hooks?.[0] ||
    `Is ${winner.name} worth it?`;

  const painPoint =
    campaignIntelligence.painPoints?.[0] ||
    "Most people struggle to find the right tool.";

  const desire =
    campaignIntelligence.desires?.[0] ||
    "A faster and easier way to get results.";

  const feature1 =
    productIntelligence.features?.[0] ||
    "Powerful automation";

  const feature2 =
    productIntelligence.features?.[1] ||
    "Easy-to-use dashboard";

  const benefit1 =
    productIntelligence.benefits?.[0] ||
    "Save time";

  const benefit2 =
    productIntelligence.benefits?.[1] ||
    "Improve productivity";

  const objection =
    campaignIntelligence.objections?.[0] ||
    "Is it worth the price?";

  const logo =
    assets.logos?.[0] || null;

  const screenshot1 =
    assets.screenshots?.[0] || null;

  const screenshot2 =
    assets.screenshots?.[1] ||
    screenshot1;

  return {

    title:
      assets.ogTitle ||
      `${winner.name} Review`,

    videoType:
      "review",

    duration:
      120,

    themeColor:
      assets.themeColor,

    scenes: [

      {
        scene: 1,

        purpose:
          "hook",

        duration:
          10,

        narration:
          hook,

        visualType:
          "screenshot",

        assets:
          screenshot1
            ? [screenshot1]
            : []
      },

      {
        scene: 2,

        purpose:
          "overview",

        duration:
          15,

        narration:
          `${winner.name} is designed to help users achieve better results faster.`,

        visualType:
          "logo",

        assets:
          logo
            ? [logo]
            : []
      },

      {
        scene: 3,

        purpose:
          "problem",

        duration:
          15,

        narration:
          painPoint,

        visualType:
          "stock",

        assets: []
      },

      {
        scene: 4,

        purpose:
          "solution",

        duration:
          15,

        narration:
          `${winner.name} solves this problem with modern tools and automation.`,

        visualType:
          "dashboard",

        assets:
          screenshot1
            ? [screenshot1]
            : []
      },

      {
        scene: 5,

        purpose:
          "feature",

        duration:
          15,

        narration:
          feature1,

        visualType:
          "screenshot",

        assets:
          screenshot1
            ? [screenshot1]
            : []
      },

      {
        scene: 6,

        purpose:
          "feature",

        duration:
          15,

        narration:
          feature2,

        visualType:
          "screenshot",

        assets:
          screenshot2
            ? [screenshot2]
            : []
      },

      {
        scene: 7,

        purpose:
          "benefit",

        duration:
          10,

        narration:
          benefit1,

        visualType:
          "screenshot",

        assets:
          screenshot1
            ? [screenshot1]
            : []
      },

      {
        scene: 8,

        purpose:
          "benefit",

        duration:
          10,

        narration:
          benefit2,

        visualType:
          "screenshot",

        assets:
          screenshot2
            ? [screenshot2]
            : []
      },

      {
        scene: 9,

        purpose:
          "objection",

        duration:
          10,

        narration:
          objection,

        visualType:
          "stock",

        assets: []
      },

      {
        scene: 10,

        purpose:
          "verdict",

        duration:
          10,

        narration:
          `${winner.name} is a strong choice for users looking for long-term value and productivity gains.`,

        visualType:
          "logo",

        assets:
          logo
            ? [logo]
            : []
      },

      {
        scene: 11,

        purpose:
          "cta",

        duration:
          5,

        narration:
          `Check out ${winner.name} using the link below.`,

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
  buildReviewPlan
};