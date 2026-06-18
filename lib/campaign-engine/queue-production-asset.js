const { kv } = require("@vercel/kv");

const {
  getCampaignIndex
} = require(
  "./campaign-index"
);

async function queueProductionAsset({

  campaignId,

  assetId

} = {}) {

  const index =
    await getCampaignIndex(
      campaignId
    );

  if (!index) {

    throw new Error(
      "Campaign index not found"
    );

  }

  const campaign =
    await kv.get(
      index.campaignKey
    );

  if (!campaign) {

    throw new Error(
      "Campaign not found"
    );

  }

  const assets =
    campaign.campaignPackage
      ?.productionAssets || [];

  const asset =
    assets.find(
      item =>
        item.id === assetId
    );

  if (!asset) {

    throw new Error(
      "Asset not found"
    );

  }

  campaign.campaignPackage
    .publishingQueue =
      campaign.campaignPackage
        .publishingQueue || [];

  campaign.campaignPackage
    .publishingQueue.push({

      ...asset,

      publishingStatus:
        "queued",

      queuedAt:
        new Date()
          .toISOString()

    });

  await kv.set(
    index.campaignKey,
    campaign
  );

  return asset;

}

module.exports = {
  queueProductionAsset
};