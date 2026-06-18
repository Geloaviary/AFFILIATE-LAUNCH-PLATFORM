const { kv } = require("@vercel/kv");

const {
  createCampaignIndex
} = require(
  "../lib/campaign-engine"
);

const {
  markCampaignCreated
} = require(
  "../lib/portfolio-manager"
);

const {
  generateCampaignPackage
} = require(
  "../lib/business-strategist/generate-campaign-package"
);

exports.default = async function handler(req, res) {
try {
const userId =
req.method === "GET"
? req.query.userId
: req.body.userId;

if (!userId) {
  return res.status(400).json({
    error: "Missing userId"
  });
}

// LOAD CAMPAIGNS
if (req.method === "GET") {
  const keys = await kv.keys(
    `${userId}-campaign-*`
  );

  const campaigns = [];

  for (const key of keys) {
    const data = await kv.get(key);

    if (data) {
      campaigns.push({
        id: key.replace(
          `${userId}-campaign-`,
          ""
        ),
        ...data
      });
    }
  }

  campaigns.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return res.status(200).json({
    campaigns
  });
}

// CREATE CAMPAIGN
if (req.method === "POST") {

  if (
  req.body?.action ===
  "update-production-asset"
) {

  const {

    campaignId,

    assetId,

    status

  } = req.body;

  const {
    updateProductionAsset
  } = require(
    "../lib/campaign-engine"
  );

  const asset =
    await updateProductionAsset({

      campaignId,

      assetId,

      status

    });

  return res.status(200).json({

    success: true,

    asset

  });

}

  const {

  name,

  productUrl,

  niche,

  affiliateUrl,

  winner,

  revenueGoal,

  revenueProjection,

  productIntelligence,

  campaignIntelligence

} = req.body;

  if (!name || !productUrl) {
    return res.status(400).json({
      error:
        "Campaign name and product URL required"
    });
  }

  const existingKeys =
  await kv.keys(
    `${userId}-campaign-*`
  );

for (
  const key of existingKeys
) {

  const existingCampaign =
    await kv.get(key);

  if (

    existingCampaign?.productUrl ===
    productUrl

  ) {

    return res.status(409).json({

      error:
        "Campaign already exists",

      campaignId:
        key.replace(
          `${userId}-campaign-`,
          ""
        )

    });

  }

}

  const campaignId =
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 8);

  const campaignPackage =
  generateCampaignPackage({

    winner,

    affiliateLink:
      affiliateUrl,

    revenueGoal,

    revenueProjection,

    productIntelligence,

    campaignIntelligence

  });

  const campaign = {

  name,

  productUrl,

  affiliateUrl,

  niche,

  status:
    "active",

  winner,

  revenueGoal,

  revenueProjection,

  campaignPackage,

  workspace: {

    health: "healthy",

    activeTasks: 0,

    pendingApprovals: 0,

    aiRecommendations: [],

    production: {

      queued: 0,

      processing: 0,

      completed: 0,

      failed: 0,

      lastRenderAt: null

    }

  },

  createdAt:
    new Date().toISOString()

};

  await kv.set(
    `${userId}-campaign-${campaignId}`,
    campaign
  );

  await createCampaignIndex({

  campaignId,

  userId,

  campaignKey:
    `${userId}-campaign-${campaignId}`

});

  try {

  await markCampaignCreated({

    niche:
      niche || "",

    productName:
      name,

    campaignId

  });

} catch (e) {

  console.error(
    "Portfolio update failed:",
    e.message
  );

}

  return res.status(200).json({
    campaignId,
    campaign
  });
}

return res.status(405).json({
  error: "Method Not Allowed"
});

} catch (error) {
return res.status(500).json({
error: error.message
});
}
};
