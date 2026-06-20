const {
  buildVideoPlan
} = require(
  "../video-planner"
);

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

const {
  getCachedResearch,
  setCachedResearch
} = require(
  "./research-cache"
);

const {
  upsertProduct,
  getNextWinner
} = require(
  "../portfolio-manager"
);

const {
  buildRevenueProjection
} = require(
  "../business-strategist/revenue-projection"
);

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

  // TEMP DISABLE CACHE

const cached = null;

  /*
 * STEP 2
 * BRAND DISCOVERY
 */

const brands =
  await discoverBrands(
    targetNiche
  );

const limitedBrands =
  brands.slice(0, 20);

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

    console.log(
       "VALIDATION:",
        candidate.name,
        validation
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

  for (
  const product of scoredProducts
) {

  await upsertProduct({

    niche:
      targetNiche,

    productName:
      product.name,

    productUrl:
      product.productUrl,

    affiliateUrl:
      product.validation?.sourceUrl,

    score:
      product.longtermScore?.score || 0,

    commissionType:
      product.validation?.commissionType,

    commissionValue:
      product.validation?.commissionValue

  });

}

const winner =
  await getNextWinner(
    scoredProducts.map(
      product => ({
        ...product,
        niche:
          targetNiche,
        productName:
          product.name
      })
    )
  );

  const evidence = {

  affiliateProgramEvidence:

    validatedProducts.map(
      product => ({
        product:
          product.name,

        source:
          product.validation?.sourceUrl || null,

        affiliateProgram:
          product.validation?.affiliateProgram || null
      })
    ),

  commissionEvidence:

    validatedProducts.map(
      product => ({
        product:
          product.name,

        commissionType:
          product.validation?.commissionType || null,

        commissionValue:
          product.validation?.commissionValue || null
      })
    ),

  competitorEvidence: [],

  trendEvidence:
    trends ? [trends] : [],

  validationEvidence:

    validatedProducts.map(
      product => ({
        product:
          product.name,

        valid:
          product.validation?.valid || false
      })
    )

}; 

  if (!winner) {

  const result = {

    niche:
      targetNiche,

    trends,

    brands,

    validatedProducts: [],

    evidence,

    winner: null

  };

  await setCachedResearch(
    targetNiche,
    result
  );

  return result;

}

const marketIntelligence = {

  trendScore:

    trends?.opportunities?.[0]?.score ||

    winner?.longtermScore?.score ||

    0,

  searchDemand:

    winner?.longtermScore?.evergreenScore ||

    0,

  competitionDensity:

    winner?.longtermScore?.competitionScore ||

    0,

  marketMaturity:

    (
      winner?.longtermScore?.brandStability || 0
    ) >= 70

      ? "mature"

      : "emerging",

  growthRate:

    trends?.opportunities?.[0]?.recurringPotential ||

    0,

  opportunityScore:

    Math.round(

      (

        (winner?.longtermScore?.score || 0) +

        (winner?.longtermScore?.contentOpportunity || 0) +

        (winner?.longtermScore?.automationFit || 0)

      ) / 3

    )

};

const revenueProjection =
  buildRevenueProjection(
    winner
  );

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
        winner.longtermScore

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

  const opportunities = {

  comparisonOpportunities: [

    `${winner.name} vs competitors`,

    `Best alternative to ${winner.name}`,

    `${winner.name} comparison guide`

  ],

  tutorialOpportunities: [

    `How to use ${winner.name}`,

    `${winner.name} beginner guide`,

    `${winner.name} setup tutorial`

  ],

  reviewOpportunities: [

    `${winner.name} review`,

    `${winner.name} pros and cons`,

    `Is ${winner.name} worth it`

  ],

  contentGaps: [

    ...(campaignIntelligence?.objections || [])

  ],

  competitorWeaknesses: [

    ...(productIntelligence?.competitors || [])

  ],

  quickWinTopics: [

    ...(campaignIntelligence?.painPoints || [])

  ]

};

  /*
 * STEP 8
 * VIDEO PLAN
 */

let videoPlan =
  null;

let tutorialPlan =
  null;

let reviewPlan = 
  null;

let comparisonPlan = 
  null;

let listiclePlan = 
  null;

try {
  videoPlan =
    buildVideoPlan(
      "short",
      {
        winner,
        assets,
        campaignIntelligence,
        productIntelligence
      }
    );
} catch (e) {
  console.error("SHORT:", e.message);
}

try {
  tutorialPlan =
    buildVideoPlan(
      "tutorial",
      {
        winner,
        assets,
        campaignIntelligence,
        productIntelligence
      }
    );
} catch (e) {
  console.error("TUTORIAL:", e.message);
}

try {
  reviewPlan =
    buildVideoPlan(
      "review",
      {
        winner,
        assets,
        campaignIntelligence,
        productIntelligence
      }
    );
} catch (e) {
  console.error("REVIEW:", e.message);
}

try {
  comparisonPlan =
    buildVideoPlan(
      "comparison",
      {
        winner,
        assets,
        campaignIntelligence,
        productIntelligence
      }
    );
} catch (e) {
  console.error("COMPARISON:", e.message);
}

try {
  listiclePlan =
    buildVideoPlan(
      "listicle",
      {
        winner,
        assets,
        campaignIntelligence,
        productIntelligence
      }
    );
} catch (e) {
  console.error(
    "LISTICLE:",
    e.message
  );
}

  const result = {

  niche:
    targetNiche,

  trends,

  brands,

  validatedProducts:
    scoredProducts,

  evidence,

  marketIntelligence,

  opportunities,

  winner,

  revenueProjection,

  assets,

  campaignIntelligence,

  productIntelligence,

  plans: {

    short:
      videoPlan,

    tutorial:
      tutorialPlan,

    review:
      reviewPlan,

    comparison:
      comparisonPlan,

    listicle:
      listiclePlan

  }

};

await setCachedResearch(
  targetNiche,
  result
);

return result;

}

module.exports = {
  runAffiliateResearcher
};