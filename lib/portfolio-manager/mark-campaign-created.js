const {
  getProduct
} = require(
  "./portfolio-store"
);

const {
  upsertProduct
} = require(
  "./upsert-product"
);

const {
  PRODUCT_STATUS
} = require(
  "./product-status"
);

async function markCampaignCreated({

  niche,

  productName,

  campaignId

}) {

  const product =
    await getProduct(
      niche,
      productName
    );

  if (
    !product
  ) {

    return null;

  }

  return upsertProduct({

    ...product,

    status:
      PRODUCT_STATUS.CAMPAIGN_CREATED,

    campaignId,

    campaignsCreated:
      (product.campaignsCreated || 0) + 1,

    selectedAt:
      new Date()
        .toISOString()

  });

}

module.exports = {
  markCampaignCreated
};