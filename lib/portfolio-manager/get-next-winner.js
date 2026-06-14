const {
  getProduct
} = require(
  "./portfolio-store"
);

const {
  PRODUCT_STATUS
} = require(
  "./product-status"
);

async function getNextWinner(
  scoredProducts = []
) {

  const eligible = [];

  for (
    const product of scoredProducts
  ) {

    const existing =
      await getProduct(
        product.niche,
        product.productName ||
        product.name
      );

    if (
      !existing
    ) {

      eligible.push(
        product
      );

      continue;

    }

    const status =
      existing.status;

    if (

      status ===
      PRODUCT_STATUS.CAMPAIGN_CREATED ||

      status ===
      PRODUCT_STATUS.ACTIVE ||

      status ===
      PRODUCT_STATUS.FAILED ||

      status ===
      PRODUCT_STATUS.ARCHIVED ||

      status ===
      PRODUCT_STATUS.EXHAUSTED

    ) {

      continue;

    }

    if (
      status ===
      PRODUCT_STATUS.COOLDOWN
    ) {

      const cooldownUntil =
        existing.cooldownUntil;

      if (
        cooldownUntil &&
        new Date(
          cooldownUntil
        ) > new Date()
      ) {

        continue;

      }

    }

    eligible.push(
      product
    );

  }

  if (
    !eligible.length
  ) {

    return null;

  }

  eligible.sort(
    (a, b) =>

      (
        b.longtermScore?.score ||
        b.score ||
        0
      ) -

      (
        a.longtermScore?.score ||
        a.score ||
        0
      )
  );

  return eligible[0];

}

module.exports = {
  getNextWinner
};