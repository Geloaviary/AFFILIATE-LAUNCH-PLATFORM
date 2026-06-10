const {
  runTrendScout
} = require("./trend-scout");

const {
  discoverBrands,
  generateAffiliateCandidates
} = require("./product-discovery");

const {
  validateAffiliateProduct
} = require("./affiliate-validator");

const {
  scoreLongTermOpportunity
} = require("./longterm-scorer");

const {
  researchAssets
} = require("./asset-researcher");

const {
  buildCampaignIntelligence
} = require("./campaign-intelligence");

const {
  analyzeProduct
} = require("./product-intelligence");

async function runAffiliateResearcher(
  options = {}
) {

  const {
    niche = null,
    autoDiscover = true
  } = options;

  let targetNiche =
    niche;

  /*
   * STEP 1
   * TREND SCOUT
   */

  let trends = null;

  if (
    !targetNiche &&
    autoDiscover
  ) {

    try {

      trends =
        await runTrendScout();

      targetNiche =
        trends.bestNiche;

    } catch (e) {

      console.error(
        "Trend Scout failed:",
        e.message
      );

      targetNiche =
        "AI Tools";

    }

  }

  /*
   * STEP 2
   * BRAND DISCOVERY
   */

  const brands =
    await discoverBrands(
      targetNiche
    );

    const limitedBrands =
        brands.slice(0, 5);

  /*
   * STEP 3
   * AFFILIATE DISCOVERY
   */

  const candidates =
  limitedBrands.map(
    generateAffiliateCandidates
  );

  const validatedProducts =
  [];

for (
  const candidate of candidates
) {

  try {

    const validation =
      await validateAffiliateProduct(
        candidate
      );

    if (
      validation &&
      validation.valid
    ) {

      validatedProducts.push({

        ...candidate,

        validation

      });

      if (
        validatedProducts.length >= 3
      ) {

        console.log(
          "Validation limit reached"
        );

        break;

      }

    }

  } catch (e) {

    console.error(
      "Validation failed:",
      candidate.name,
      e.message
    );

  }

}

  /*
   * STEP 4
   * LONGTERM SCORE
   */

  const scoredProducts =
    [];

  for (
    const product of validatedProducts
  ) {

    try {

      const longtermScore =
        await scoreLongTermOpportunity(
          product,
          product.validation
        );

      scoredProducts.push({

        ...product,

        longtermScore

      });

    } catch (e) {

      console.error(
        "Longterm score failed:",
        product.name,
        e.message
      );

    }

  }

  scoredProducts.sort(
    (a, b) =>
      (b.longtermScore?.score || 0) -
      (a.longtermScore?.score || 0)
  );

  const winner =
    scoredProducts[0];

  if (!winner) {

    return {

      niche:
        targetNiche,

      trends,

      brands,

      validatedProducts: [],

      winner: null

    };

  }

  /*
   * STEP 5
   * ASSET RESEARCH
   */

  let assets = null;

  try {

    assets =
      await researchAssets({
        name:
          winner.name,

        productUrl:
          winner.productUrl
      });

  } catch (e) {

    console.error(
      "Asset Research failed:",
      e.message
    );

  }

  /*
   * STEP 6
   * CAMPAIGN INTELLIGENCE
   */

  let campaignIntelligence =
    null;

  try {

    campaignIntelligence =
      await buildCampaignIntelligence({

        product:
          winner,

        validation:
          winner.validation,

        longtermScore:
          winner.longtermScore,

        assets

      });

  } catch (e) {

    console.error(
      "Campaign Intelligence failed:",
      e.message
    );

  }

  /*
   * STEP 7
   * PRODUCT INTELLIGENCE
   */

  let productIntelligence =
    null;

  try {

    productIntelligence =
      await analyzeProduct({

        name:
          winner.name,

        productUrl:
          winner.productUrl,

        description:
          winner.description || ""

      });

  } catch (e) {

    console.error(
      "Product Intelligence failed:",
      e.message
    );

  }

  /*
   * FINAL PACKAGE
   */

  return {

    niche:
      targetNiche,

    trends,

    brands,

    validatedProducts,

    winner,

    assets,

    campaignIntelligence,

    productIntelligence

  };

}

module.exports = {
  runAffiliateResearcher
};