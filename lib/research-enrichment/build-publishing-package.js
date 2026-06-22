function slugify(
  text = ""
) {

  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

}

function buildPublishingPackage(
  winner = {}
) {

  const brandName =
    winner?.brandName ||
    winner?.name ||
    "Brand";

  return {

    brandName,

    username:
      slugify(
        brandName
      ),

    bio:
      `Tips, tutorials and strategies about ${brandName}.`,

    tagline:
      `Learn. Build. Grow.`

  };

}

module.exports = {
  buildPublishingPackage
};