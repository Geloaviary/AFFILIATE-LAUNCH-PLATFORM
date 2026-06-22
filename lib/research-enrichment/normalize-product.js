function normalizeProduct(
  product = {},
  niche = null
) {

  return {

    ...product,

    name:
      product.name || null,

    productName:
      product.productName ||
      product.name ||
      null,

    niche:
      product.niche ||
      niche ||
      null,

    productUrl:
      product.productUrl ||
      null,

    affiliateUrl:

      product.affiliateUrl ||

      product.validation?.sourceUrl ||

      product.affiliateProgramUrl ||

      null,

    description:

      product.description ||

      product.summary ||

      `${product.name} is a leading solution in the ${niche} market.`,

    validation:
      product.validation || {},

    assets:
      product.assets || {},

    socialAccounts:
      product.socialAccounts || {},

    publishingProfile:
      product.publishingProfile || null

  };

}

module.exports = {
  normalizeProduct
};