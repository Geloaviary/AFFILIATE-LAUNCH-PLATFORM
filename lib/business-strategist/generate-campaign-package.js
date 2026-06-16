function generateCampaignPackage({
  winner = {},
  revenueGoal = 0,
  affiliateLink = "",
  productIntelligence = {},
  campaignIntelligence = {},
  revenueProjection = {}
}) {

  const productName =
    winner.name || "Campaign";

  const brandName =
    `${productName} Growth Hub`;

  return {

    version: "1.0",

    status: "active",

    createdAt:
      new Date().toISOString(),

    campaign: {

      productName,

      productUrl:
        winner.productUrl || "",

      affiliateProgramUrl:
        winner.affiliateProgramUrl || "",

      affiliateLink,

      niche:
        winner.niche || "",

      score:
        winner.longtermScore?.score || 0

    },

    revenueStrategy: {

      selectedGoal:
        revenueGoal,

      projectedMonthlyRevenue:
        revenueProjection.projectedMonthlyRevenue || 0,

      conservativeGoal:
        revenueProjection.conservativeGoal || 0,

      targetGoal:
        revenueProjection.targetGoal || 0,

      aggressiveGoal:
        revenueProjection.aggressiveGoal || 0

    },

    productIntelligence,

    campaignIntelligence,

    branding: {

      brandName,

      slogan:
        `Helping users succeed with ${productName}`,

      voice:
        "Authority + Helpful + Results Driven",

      colors: [
        "#2563eb",
        "#16a34a",
        "#0f172a"
      ]

    },

    accounts: {

      tiktok: {
        required: true,
        status: "pending"
      },

      instagram: {
        required: true,
        status: "pending"
      },

      facebook: {
        required: true,
        status: "pending"
      },

      youtube: {
        required: true,
        status: "pending"
      }

    },

    tracking: {

      affiliateLink,

      shortLink: null,

      trackingLink: null,

      utmParameters: {

        source: "affiliate-launch",

        medium: "social",

        campaign:
          productName
            .toLowerCase()
            .replace(/\s+/g, "-")

      }

    },

    automation: {

      manychat: {

        status: "pending",

        commentKeywords: [],

        dmFlows: [],

        faqResponses: []

      }

    },

    contentPlan: {

      shortsPerDay: 3,

      postsPerDay: 2,

      storiesPerDay: 5,

      contentPillars: [],

      hooks: [],

      ctas: []

    },

    productionQueue: [

      {
        type: "review",
        status: "queued"
      },

      {
        type: "tutorial",
        status: "queued"
      },

      {
        type: "comparison",
        status: "queued"
      },

      {
        type: "listicle",
        status: "queued"
      }

    ],

    publishingPlan: {

      tiktok: [
        "09:00",
        "13:00",
        "18:00"
      ],

      instagram: [
        "11:00",
        "17:00"
      ],

      youtube: [
        "15:00"
      ]

    },

    kpis: {

      revenueGoal,

      monthlyVideos: 90,

      monthlyClicks: 10000,

      monthlyLeads: 2500,

      conversionRateTarget: 2.5

    }

  };

}

module.exports = {
  generateCampaignPackage
};