const { kv } = require(
  "@vercel/kv"
);

const PRODUCT_PREFIX =
  "portfolio:";

function slugify(
  value = ""
) {

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}

function buildProductKey(
  niche,
  productName
) {

  return (
    PRODUCT_PREFIX +
    slugify(niche) +
    ":" +
    slugify(productName)
  );

}

async function getProduct(
  niche,
  productName
) {

  return kv.get(
    buildProductKey(
      niche,
      productName
    )
  );

}

async function saveProduct(
  product
) {

  await kv.set(

    buildProductKey(
      product.niche,
      product.productName
    ),

    product

  );

  return product;

}

async function deleteProduct(
  niche,
  productName
) {

  await kv.del(

    buildProductKey(
      niche,
      productName
    )

  );

}

async function getAllProducts() {

  const keys =
    await kv.keys(
      `${PRODUCT_PREFIX}*`
    );

  if (
    !keys.length
  ) {

    return [];

  }

  const products =
    await kv.mget(
      keys
    );

  return products.filter(
    Boolean
  );

}

module.exports = {

  slugify,

  buildProductKey,

  getProduct,

  saveProduct,

  deleteProduct,

  getAllProducts

};