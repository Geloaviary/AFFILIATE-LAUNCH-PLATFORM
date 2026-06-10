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

  const affiliateUrl =
    product.affiliateUrl;

  if (!affiliateUrl) {

    return {
      valid: false,
      affiliateProgram: false
    };

  }

  const baseUrl =
  affiliateUrl
    .replace(/\/affiliate.*$/i, "")
    .replace(/\/affiliate-program.*$/i, "")
    .replace(/\/partners.*$/i, "")
    .replace(/\/referral.*$/i, "")
    .replace(/\/$/, "");

 const urlsToCheck = [

  affiliateUrl,

  baseUrl + "/terms",

  baseUrl + "/affiliate-program",

  baseUrl + "/partners",

  baseUrl + "/referral"

];

const pages = [];

for (const url of urlsToCheck) {

  try {

    const page =
      await crawlPage(url);

    if (
      page &&
      page.text
    ) {

      pages.push(page);

    }

  } catch (e) {

    console.log(
      "Validator crawl skipped:",
      url
    );

  }

}

const extractedTexts =
  pages
    .map(page => page.text)
    .join("\n\n");

const extracted =
  extractCommission(
    extractedTexts
  );

  const affiliateEvidence =
  /(affiliate|partner|partner program|referral|commission|earn|revshare|recurring commission)/i
    .test(extractedTexts);

   const crawledUrls =
      pages.map(
       page => page.url
    );

  return {

    valid:
      affiliateEvidence,

    affiliateProgram:
      affiliateEvidence,

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
      pages[0]?.title || "",

    sourceUrl:
      affiliateUrl,

    affiliateEvidence,

    crawledUrls,

    evidence:
      extracted.evidence

  };

}

module.exports = {
  validateAffiliateProduct
};