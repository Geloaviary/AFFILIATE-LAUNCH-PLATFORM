function scoreAsset(
  asset = {},
  scene = {}
) {

  let score = 0;

  const keyword =
    String(

      scene.searchKeyword ||

      scene.keyword ||

      scene.intent ||

      ""

    ).toLowerCase();

  const assetText = [

    asset.alt,

    asset.title,

    asset.url,

    ...(asset.tags || [])

  ]
    .join(" ")
    .toLowerCase();

  /*
   * RELEVANCE
   */

  if (
    keyword &&
    assetText.includes(
      keyword
    )
  ) {

    score += 40;

  }

  /*
   * VERTICAL BONUS
   */

  if (
    asset.orientation ===
    "vertical"
  ) {

    score += 30;

  }

  /*
   * QUALITY
   */

  score +=
    Math.min(
      asset.qualityScore || 0,
      30
    );

  /*
   * BRAND BONUS
   */

  if (

    asset.source ===
      "website" ||

    asset.source ===
      "og-image"

  ) {

    score += 20;

  }

  return {

    ...asset,

    relevanceScore:
      keyword &&
      assetText.includes(
        keyword
      )
        ? 40
        : 0,

    brandScore:

      asset.source ===
        "website"

      ? 20

      : 0,

    finalScore:
      score

  };

}

module.exports = {
  scoreAsset
};