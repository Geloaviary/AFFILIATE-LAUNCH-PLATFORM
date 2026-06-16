const {
  crawlPage
} = require(
  "./affiliate-crawler"
);

const {
  extractCommission
} = require(
  "./commission-extractor"
);

async function validateAffiliateProduct(
  product = {}
) {

  const affiliateCandidates =
  product.affiliateCandidates || [];

if (
  !Array.isArray(
    affiliateCandidates
  ) ||
  !affiliateCandidates.length
) {

  return {
    valid: false,
    affiliateProgram: false
  };

}

const urlsToCheck = [];

const visited =
  new Set();

for (
  const candidate of affiliateCandidates
) {

  if (
  !visited.has(candidate)
) {

  visited.add(
    candidate
  );

  urlsToCheck.push(
    candidate
  );

}

  const baseUrl =
    candidate
      .replace(
        /\/affiliate.*$/i,
        ""
      )
      .replace(
        /\/affiliate-program.*$/i,
        ""
      )
      .replace(
        /\/partners.*$/i,
        ""
      )
      .replace(
        /\/partner.*$/i,
        ""
      )
      .replace(
        /\/referral.*$/i,
        ""
      )
      .replace(
        /\/reseller.*$/i,
        ""
      )
      .replace(
        /\/$/,
        ""
      );

  const termsUrl =
  baseUrl + "/terms";

if (
  !visited.has(
    termsUrl
  )
) {

  visited.add(
    termsUrl
  );

  urlsToCheck.push(
    termsUrl
  );

}

}

const pages = [];

let bestCandidate = null;

let bestScore = 0;

for (const url of urlsToCheck) {

  try {

    const page =
      await crawlPage(url);

    if (
  page &&
  page.text
) {

  pages.push(page);

  let score = 0;

const text =
  page.text.toLowerCase();

const patterns = [

  {
  pattern:
    /affiliate network/i,
  score: 20
},

{
  pattern:
    /earn up to/i,
  score: 15
},

{
  pattern:
    /commission rate/i,
  score: 20
},

{
  pattern:
    /lifetime commission/i,
  score: 40
},

{
  pattern:
    /60-day cookie/i,
  score: 20
},

{
  pattern:
    /30-day cookie/i,
  score: 15
},

{
  pattern:
    /partnerstack/i,
  score: 30
},

{
  pattern:
    /impact\.com/i,
  score: 30
},

{
  pattern:
    /rewardful/i,
  score: 30
},

{
  pattern:
    /firstpromoter/i,
  score: 30
},

  {
    pattern:
      /affiliate program/i,
    score: 40
  },

  {
    pattern:
      /affiliate/i,
    score: 20
  },

  {
    pattern:
      /commission/i,
    score: 20
  },

  {
    pattern:
      /partner program/i,
    score: 25
  },

  {
    pattern:
      /partner/i,
    score: 15
  },

  {
    pattern:
      /recurring/i,
    score: 30
  },

  {
    pattern:
      /cookie/i,
    score: 15
  },

  {
    pattern:
      /revenue share/i,
    score: 30
  },

  {
    pattern:
      /revshare/i,
    score: 30
  }

];

for (
  const item of patterns
) {

  if (
    item.pattern.test(
      text
    )
  ) {

    score +=
      item.score;

  }

}

if (
  score > bestScore
) {

  bestScore =
    score;

  bestCandidate =
    page;

}

}

  } catch (e) {

    console.log(
      "Validator crawl skipped:",
      url
    );

  }

}

const extractedTexts =
  bestCandidate
    ? bestCandidate.text
    : "";

const extracted =
  extractCommission(
    extractedTexts
  );

  const invalidPage =
  /(access denied|403|404|not found|page not found|forbidden)/i
    .test(extractedTexts);

  const affiliateEvidence =
  /(affiliate|partner|partner program|referral|commission|earn|revshare|recurring commission)/i
    .test(extractedTexts);

   const crawledUrls =
      pages.map(
       page => page.url
    );

  return {

    valid:
        affiliateEvidence &&
        !invalidPage,

    affiliateProgram:
        affiliateEvidence &&
        !invalidPage,

    commissionType:
      extracted.commissionType,

    commissionValue:
      extracted.commissionValue,

    cookieDuration:
      extracted.cookieDuration,

    confidence:
      extracted.evidence.length
        ? 95
        : 40,

    promotionPriority:
      extracted.commissionType ===
      "Recurring"
        ? "HIGH"
        : "MEDIUM",

    pageTitle:
      bestCandidate?.title || "",

    sourceUrl:
      bestCandidate?.url || null,

    bestScore,

    affiliateEvidence,

    crawledUrls,

    evidence:
      extracted.evidence

  };

}

module.exports = {
  validateAffiliateProduct
};