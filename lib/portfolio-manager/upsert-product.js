const {
  getProduct,
  saveProduct,
  buildProductKey
} = require(
  "./portfolio-store"
);

const {
  PRODUCT_STATUS
} = require(
  "./product-status"
);

async function upsertProduct(
  product = {}
) {

  const existing =
    await getProduct(
      product.niche,
      product.productName
    );

  const now =
    new Date()
      .toISOString();

  const record = {

    id:
      buildProductKey(
        product.niche,
        product.productName
      ),

    niche:
      product.niche,

    productName:
      product.productName,

    productUrl:
      product.productUrl || "",

    affiliateUrl:
      product.affiliateUrl || "",

    status:
      product.status ||
      existing?.status ||
      PRODUCT_STATUS.DISCOVERED,

    score:
      product.score ??
      existing?.score ??
      0,

    commissionType:
      product.commissionType ||
      existing?.commissionType ||
      null,

    commissionValue:
      product.commissionValue ||
      existing?.commissionValue ||
      null,

    campaignId:
  product.campaignId ??
  existing?.campaignId ??
  null,

campaignsCreated:
  product.campaignsCreated ??
  existing?.campaignsCreated ??
  0,

videosCreated:
  product.videosCreated ??
  existing?.videosCreated ??
  0,

clicks:
  product.clicks ??
  existing?.clicks ??
  0,

conversions:
  product.conversions ??
  existing?.conversions ??
  0,

revenue:
  product.revenue ??
  existing?.revenue ??
  0,

portfolioWeight:
  product.portfolioWeight ??
  existing?.portfolioWeight ??
  0,

diversificationScore:
  product.diversificationScore ??
  existing?.diversificationScore ??
  0,

firstDiscoveredAt:
  existing?.firstDiscoveredAt ||
  now,

lastResearchAt:
  now,

selectedAt:
  existing?.selectedAt ||
  null,

activatedAt:
  existing?.activatedAt ||
  null,

archivedAt:
  existing?.archivedAt ||
  null,

failedAt:
  existing?.failedAt ||
  null,

exhaustedAt:
  existing?.exhaustedAt ||
  null,

cooldownUntil:
  existing?.cooldownUntil ||
  null,

failureReason:
  existing?.failureReason ||
  null

  };

  await saveProduct(
    record
  );

  return record;

}

module.exports = {
  upsertProduct
};