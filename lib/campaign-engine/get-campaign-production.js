const { kv } = require("@vercel/kv");

const {
  getCampaignIndex
} = require(
  "./campaign-index"
);

async function getCampaignProduction({

  campaignId

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

  const assets =

    campaign
      ?.campaignPackage
      ?.productionAssets || [];

  const production =

    campaign
      ?.workspace
      ?.production || {};

  return {

    campaignId,

    queued:
      production.queued || 0,

    processing:
      production.processing || 0,

    completed:
      production.completed || 0,

    failed:
      production.failed || 0,

    lastRenderAt:
      production.lastRenderAt || null,

    assets,

    totalAssets:
      assets.length

  };

}

module.exports = {

  getCampaignProduction

};