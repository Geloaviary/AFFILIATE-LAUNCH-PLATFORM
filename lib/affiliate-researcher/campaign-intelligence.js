const fetch = require("node-fetch");

const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

async function buildCampaignIntelligence({
  product = {},
  validation = {},
  longtermScore = {},
}) {

  const campaignInput = {

  productName:
    product.name,

  description:
    product.description,

  productUrl:
    product.productUrl,

  commissionType:
    validation.commissionType,

  commissionValue:
    validation.commissionValue,

  cookieDuration:
    validation.cookieDuration,

  recurringPotential:
    longtermScore.recurringPotential,

  retentionScore:
    longtermScore.retentionScore,

  ltvScore:
    longtermScore.ltvScore,

  evergreenScore:
    longtermScore.evergreenScore,

  brandStability:
    longtermScore.brandStability,

  recommendation:
    longtermScore.recommendation,

  reason:
    longtermScore.reason

};

  const prompt = `
You are an elite affiliate marketing strategist and direct-response marketer.

Your goal is to build a Campaign Intelligence Package that can power:
- tutorials
- reviews
- comparisons
- viral content
- short-form videos
- affiliate conversions

Focus on recurring revenue products and long-term customer acquisition.

Build a Campaign Intelligence Package.

CAMPAIGN INPUT:

${JSON.stringify(
  campaignInput,
  null,
  2
)}

Return ONLY JSON.

{
  "audience":"",
  "painPoints":[],
  "desires":[],
  "buyingTriggers":[],
  "objections":[],
  "angles":[],
  "hooks":[],
  "competitors":[],
  "contentPillars":[],
  "keywords":[],
  "viralTopics":[],
  "reviewTopics":[],
  "comparisonTopics":[],
  "tutorialTopics":[]
}
`;

  const response =
    await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          "Authorization":
            "Bearer " + OPENAI_KEY
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3
        })
      }
    );

  const data =
    await response.json();

  if (data.error) {
    throw new Error(
      data.error.message
    );
  }

  const content =
    data.choices[0]
      .message.content;

  const jsonStr =
    content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

  try {

  return JSON.parse(
    jsonStr
  );

} catch (e) {

  console.error(
    "Campaign Intelligence parse failed:",
    e.message
  );

  return {

    audience: "",

    painPoints: [],

    desires: [],

    buyingTriggers: [],

    objections: [],

    angles: [],

    hooks: [],

    competitors: [],

    contentPillars: [],

    keywords: [],

    viralTopics: [],

    reviewTopics: [],

    comparisonTopics: [],

    tutorialTopics: []

  };

}

}

module.exports = {
  buildCampaignIntelligence
};