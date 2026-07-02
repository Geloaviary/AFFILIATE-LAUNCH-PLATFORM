console.log("[R001] START");

const {

    buildResearchArtifact

} = require("./artifact");

const {

    execute

} = require(

    "./output"

);

const {
  buildWinnerPackage
} = require(
  "../research-enrichment/build-winner-package"
);

const {
  buildAudiencePackage
} = require(
  "../research-enrichment/build-audience-package"
);

const {
  buildContentPackage
} = require(
  "../research-enrichment/build-content-package"
);

const {
  buildPublishingPackage
} = require(
  "../research-enrichment/build-publishing-package"
);

const {
  buildBrandKit
} = require(
  "../research-enrichment/build-brand-kit"
);

const {
  normalizeProduct
} = require(
  "../research-enrichment/normalize-product"
);

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
  let product of validatedProducts
) {

  product =
    normalizeProduct(
      product,
      targetNiche
    );

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

  const competitor =
  scoredProducts?.[1] || null;

  const top5 =
  scoredProducts
    .slice(0, 5);

let winner =
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

  winner =
  normalizeProduct(
    winner,
    targetNiche
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

  throw new Error(
    "Research failed: no winner selected"
  );

} 

let winnerPackage =
  buildWinnerPackage({

    winner,

    niche:
      targetNiche

  });

winnerPackage.audience =
  buildAudiencePackage(
    winnerPackage
  );

const content =
  buildContentPackage(
    winnerPackage
  );

winnerPackage.keywords =
  content.keywords;

winnerPackage.hashtags =
  content.hashtags;

winnerPackage.hooks =
  content.hooks;

winnerPackage.contentAngles =
  content.contentAngles;

winnerPackage.publishingProfile =
  buildPublishingPackage(
    winnerPackage
  );

winnerPackage.brandKit =
  buildBrandKit(
    winnerPackage
  );

winner =
  winnerPackage;

console.log(
  "WINNER PACKAGE",
  JSON.stringify(
    {
      name:
        winner.name,

      affiliateUrl:
        winner.affiliateUrl,

      audience:
        !!winner.audience,

      publishingProfile:
        !!winner.publishingProfile,

      brandKit:
        !!winner.brandKit,

      keywords:
        winner.keywords?.length,

      hashtags:
        winner.hashtags?.length,

      hooks:
        winner.hooks?.length,

      contentAngles:
        winner.contentAngles?.length
    },
    null,
    2
  )
);



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

  console.log(
  "ASSET RESEARCH INPUT",
  {
    winnerName:
      winner?.name,

    productUrl:
      winner?.productUrl,

    affiliateUrl:
      winner?.affiliateUrl
  }
);

  assets =
    await researchAssets({
      name:
        winner.name,

      productUrl:
        winner.productUrl
    });

  console.log(
    "ASSET COUNTS",
    {
      websiteImages:
        assets?.websiteImages?.length || 0,

      logos:
        assets?.logos?.length || 0,

      screenshots:
        assets?.screenshots?.length || 0,

      renderableAssets:
        assets?.renderableAssets?.length || 0
    }
  );

  console.log(
    "FIRST ASSET",
    assets?.websiteImages?.[0]
  );

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
        competitor,
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
      title:
        `Top ${targetNiche} Affiliate Opportunities`,

      items:
        top5,

      assets
    }
  );
} catch (e) {
  console.error(
    "LISTICLE:",
    e.message
  );
}

console.log(
  "SHORT PLAN",
  JSON.stringify(
    videoPlan,
    null,
    2
  )
);

console.log(
  "TUTORIAL PLAN",
  JSON.stringify(
    tutorialPlan,
    null,
    2
  )
);

console.log(
  "REVIEW PLAN",
  JSON.stringify(
    reviewPlan,
    null,
    2
  )
);

console.log(
  "COMPARISON PLAN",
  JSON.stringify(
    comparisonPlan,
    null,
    2
  )
);

console.log(
  "SHORT NARRATIONS",
  videoPlan?.scenes?.map(
    s => s.narration
  )
);

console.log(
  "TUTORIAL NARRATIONS",
  tutorialPlan?.scenes?.map(
    s => s.narration
  )
);

console.log(
  "REVIEW NARRATIONS",
  reviewPlan?.scenes?.map(
    s => s.narration
  )
);

console.log(
  "COMPARISON NARRATIONS",
  comparisonPlan?.scenes?.map(
    s => s.narration
  )
);

  const researchResult = {

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

  competitor,

  top5,

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

/*
========================================
Research Constitutional Artifact
========================================
*/
console.log("Building Research Artifact");
const artifact =

    buildResearchArtifact({

        payload:

            researchResult,

        campaignId:

            options.campaignId || null,

        sessionId:

            options.sessionId || null,

        requestId:

            options.requestId || null

    });

/*
========================================
Execute Constitutional Submission
========================================
*/

const output =

    await execute(

        artifact,

        {

            campaignId:

                options.campaignId ||

                null,

            sessionId:

                options.sessionId ||

                null,

            requestId:

                options.requestId ||

                null

        }

    );

/*
========================================
Cache Only Certified Research

Platform Memory is the source of truth.

The cache mirrors certified data only.

========================================
*/

if (

    output.certification.certified

) {

    await setCachedResearch(

        targetNiche,

        artifact.payload

    );

}

/*
========================================
Department Exit

Return Department Output.

========================================
*/

return output;

}

module.exports = {
  runAffiliateResearcher
};