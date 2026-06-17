const fetch = require("node-fetch");

const {
  getNiches
} = require(
  "../niche-catalog/get-niches"
);

const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

async function discoverBrands(
  niche = "AI Tools"
) {

  const nicheCatalog =
  getNiches();

const nicheInfo =
  nicheCatalog.find(
    item =>
      item.id === niche
  );

const nicheName =
  nicheInfo?.name ||
  niche;

const nicheCategory =
  nicheInfo?.category ||
  "";

  console.log(
  "NICHE CONTEXT:",
  nicheInfo
);

  const prompt = `
You are an elite affiliate marketing researcher.

Niche ID:
${niche}

Niche Name:
${nicheName}

Niche Category:
${nicheCategory}

Your task is to discover the best affiliate programs within the niche.

You MUST ONLY return affiliate programs directly related to this niche.

If the niche is:
- wordpress-hosting -> return WordPress hosting companies only
- shopify-apps -> return Shopify app companies only
- keyword-research -> return SEO keyword research tools only
- sleep-optimization -> return sleep products, sleep programs, sleep software
- investment-platforms -> return investment and trading platforms only

Do NOT return generic SaaS products unless they are directly relevant to the niche.

Find 20 REAL affiliate programs.

Requirements:

- Active affiliate program
- Public affiliate signup page
- Recurring commissions preferred
- High customer lifetime value
- Evergreen demand
- Strong content opportunities
- Suitable for TikTok, YouTube, Facebook, Instagram
- Suitable for AI automation
- Suitable for building a long-term affiliate business

Avoid:

- Companies without affiliate programs
- One-time low-ticket offers
- Physical products
- Seasonal products
- MLM programs
- Temporary trends
Find actual products and brands that can be promoted directly.

Do NOT return:
Awin
CJ
Rakuten
Impact
FlexOffers
ShareASale
ClickBank
MaxBounty
Skimlinks
Admitad

Return ONLY JSON.

{
  "brands":[
    {
      "name":"",
      "domain":"",
      "affiliateProgramUrl":"",
      "category":"",
      "commissionType":""
    }
  ]
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
          temperature: 0.2
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

  const result =
    JSON.parse(jsonStr);

  console.log(
    "DISCOVERED AFFILIATE PROGRAMS:",
     result.brands
  );

  return result.brands || [];

}

function generateAffiliateCandidates(
  brand
) {

  const domain =
    brand.domain
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "");

  return {

  name:
    brand.name,

  productUrl:
    "https://" + domain,

  affiliateProgramUrl:
    brand.affiliateProgramUrl || "",

  category:
    brand.category || "",

  commissionType:
    brand.commissionType || "",

  affiliateCandidates: [
    brand.affiliateProgramUrl
  ].filter(Boolean)

};

}

module.exports = {
  discoverBrands,
  generateAffiliateCandidates
};