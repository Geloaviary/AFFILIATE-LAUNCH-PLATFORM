const fetch = require("node-fetch");

const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

async function discoverBrands(
  niche = "AI Tools"
) {

  const prompt = `
You are a software market researcher.

Find 5 REAL companies in this niche:

${niche}

Rules:

- SaaS required
- subscription products required
- recurring affiliate commissions preferred
- strong customer retention
- high customer lifetime value (LTV)
- established companies
- active websites
- global products
- evergreen demand
- B2B software preferred

Avoid:

- physical products
- one-time commission products
- seasonal products
- fad products
- temporary trends

Return ONLY JSON.

{
  "brands":[
    {
      "name":"",
      "domain":"",
      "businessType":"",
      "subscriptionModel":""
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

    affiliateCandidates: [

  "https://" + domain + "/affiliate",

  "https://" + domain + "/affiliates",

  "https://" + domain + "/affiliate-program",

  "https://" + domain + "/partners",

  "https://" + domain + "/partner"

]

  };

}

module.exports = {
  discoverBrands,
  generateAffiliateCandidates
};