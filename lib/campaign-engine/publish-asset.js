const { kv } = require(
  "@vercel/kv"
);

const {
  getCampaignIndex
} = require(
  "./campaign-index"
);

async function publishAsset({

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

  const queue =
    campaign.campaignPackage
      ?.publishingQueue || [];

  const item =
    queue.find(
      q =>
        q.id === assetId
    );

  if (!item) {

    throw new Error(
      "Publishing item not found"
    );

  }

  item.publishingStatus =
    "published";

  item.publishedAt =
    new Date()
      .toISOString();

  await kv.set(
    index.campaignKey,
    campaign
  );

  return item;

}

module.exports = {
  publishAsset
};