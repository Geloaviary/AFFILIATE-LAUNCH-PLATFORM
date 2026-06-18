const { kv } = require("@vercel/kv");

const {
  getCampaignIndex
} = require(
  "./campaign-index"
);

async function updateProductionAsset({

  campaignId,

  assetId,

  status

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

  const previousStatus =
  asset.approvalStatus;

  asset.approvalStatus =
        status;

  if (

  status ===
  "approved" &&

  previousStatus !==
  "approved"

) {

  const {
    queueProductionAsset
  } = require(
    "./queue-production-asset"
  );

  await queueProductionAsset({

    campaignId,

    assetId

  });

}

  await kv.set(
    index.campaignKey,
    campaign
  );

  return asset;

}

module.exports = {
  updateProductionAsset
};