const { kv } = require("@vercel/kv");

const {
  getCampaignIndex
} = require(
  "./campaign-index"
);

async function updateCampaignProduction({

  campaignId,

  job,

  result

} = {}) {

  if (!campaignId) {

    throw new Error(
      "campaignId is required"
    );

  }

  const index =
    await getCampaignIndex(
      campaignId
    );

  if (!index) {

    throw new Error(
      `Campaign index not found: ${campaignId}`
    );

  }

  const campaign =
    await kv.get(
      index.campaignKey
    );

  if (!campaign) {

    throw new Error(
      `Campaign not found: ${campaignId}`
    );

  }

  const now =
    new Date()
      .toISOString();

  campaign.campaignPackage =
  campaign.campaignPackage || {};

campaign.campaignPackage.productionAssets =
  campaign.campaignPackage.productionAssets || [];

campaign.workspace =
  campaign.workspace || {};

campaign.workspace.production =
  campaign.workspace.production || {};

let productionAsset = null;

const state =
  result?.state || "completed";

if (
  state === "processing"
) {

  campaign.workspace.production.processing =
    (campaign.workspace.production.processing || 0) + 1;

}

else if (
  state === "failed"
) {

  campaign.workspace.production.failed =
    (campaign.workspace.production.failed || 0) + 1;

  campaign.workspace.production.processing =
  Math.max(
    0,
    (campaign.workspace.production.processing || 0) - 1
  );

}

else {

  productionAsset = {

  id:
    `${Date.now()}-${job?.id || "asset"}`,

  jobId:
    job?.id || null,

  campaignId:
    campaignId,

  type:
    job?.payload?.planType ||
    job?.type ||
    "video",

  title:
    result?.oracleBlueprint?.title ||
    null,

  approvalStatus:
    "pending",

  qcStatus:
    "pending",

  renderUrl:
    result?.renderResult?.url ||

    null,

  renderFile:
    result?.renderResult?.file ||

    null,

  oracleBlueprint:
    result?.oracleBlueprint ||

    null,

  renderPayload:
    result?.renderPayload ||

    null,

  createdAt:
    now

};

  campaign.campaignPackage.productionAssets.push(
    productionAsset
  );

  campaign.workspace.production.processing =
  Math.max(
    0,
    (campaign.workspace.production.processing || 0) - 1
  );

  campaign.workspace.production.completed =
    (campaign.workspace.production.completed || 0) + 1;

  campaign.workspace.production.lastRenderAt =
    now;

  campaign.workspace.pendingApprovals =
    (campaign.workspace.pendingApprovals || 0) + 1;

}

console.log(
  "CAMPAIGN PRODUCTION UPDATED",
  {
    campaignId,
    state,
    assets:
      campaign.campaignPackage.productionAssets.length
  }
);

  await kv.set(
    index.campaignKey,
    campaign
  );

  return {

    campaignId,

    productionAsset,

    completed:
      campaign.workspace.production.completed

  };

}

module.exports = {

  updateCampaignProduction

};