const { kv } = require("@vercel/kv");

const CAMPAIGN_INDEX_PREFIX =
  "campaign-index:";

function buildCampaignIndexKey(
  campaignId
) {
  return (
    CAMPAIGN_INDEX_PREFIX +
    campaignId
  );
}

async function createCampaignIndex({

  campaignId,

  userId,

  campaignKey

}) {

  if (
    !campaignId ||
    !userId ||
    !campaignKey
  ) {

    throw new Error(
      "campaignId, userId and campaignKey are required"
    );

  }

  const record = {

    campaignId,

    userId,

    campaignKey,

    createdAt:
      new Date()
        .toISOString()

  };

  await kv.set(

    buildCampaignIndexKey(
      campaignId
    ),

    record

  );

  return record;

}

async function getCampaignIndex(
  campaignId
) {

  if (!campaignId) {

    return null;

  }

  return kv.get(

    buildCampaignIndexKey(
      campaignId
    )

  );

}

async function deleteCampaignIndex(
  campaignId
) {

  if (!campaignId) {

    return;

  }

  await kv.del(

    buildCampaignIndexKey(
      campaignId
    )

  );

}

module.exports = {

  createCampaignIndex,

  getCampaignIndex,

  deleteCampaignIndex

};