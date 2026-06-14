const {
  getProduct,
  saveProduct,
  buildProductKey
} = require(
  "./portfolio-store"
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
      "DISCOVERED",

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
      existing?.campaignId ||
      null,

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

    exhaustedAt:
      existing?.exhaustedAt ||
      null,

    cooldownUntil:
      existing?.cooldownUntil ||
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