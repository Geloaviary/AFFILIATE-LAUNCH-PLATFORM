const fetch = require("node-fetch");

const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

const CORE_NICHES = [
  "AI Tools",
  "Email Marketing",
  "Web Hosting",
  "VPN",
  "SEO Tools",
  "Creator Economy",
  "E-commerce",
  "Sales Funnels",
  "Online Courses",
  "Finance Software",
  "Productivity Software",
  "Marketing Automation"
];

async function runTrendScout() {

  const prompt = `
You are a world-class affiliate marketing trend scout.

Your job is to identify the best long-term affiliate niches capable of generating recurring commissions for years.

Prioritize:

- recurring commissions
- SaaS products
- software subscriptions
- strong customer retention
- high customer lifetime value (LTV)
- evergreen demand
- long-term market growth
- creator economy tools
- business tools
- B2B software

Avoid:

- physical products
- one-time commissions
- low-ticket products
- seasonal products
- fad products
- temporary trends
- hype-driven products

Only select from:

${CORE_NICHES.join(", ")}

Return ONLY JSON.

{
  "bestNiche":"",
  "opportunities":[
    {
      "niche":"",
      "score":0,
      "recurringPotential":0,
      "retentionPotential":0,
      "evergreenScore":0,
      "competitionLevel":"",
      "reason":""
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
          temperature: 0.7
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

  let result;

try {

  result =
    JSON.parse(jsonStr);

} catch (e) {

  console.error(
    "Trend Scout parse failed:",
    e.message
  );

  result = {
    bestNiche: "AI Tools",
    opportunities: [
      {
        niche: "AI Tools",
        score: 90,
        reason:
          "fallback niche"
      }
    ]
  };
}

const VALID_NICHES = [

  "AI Tools",

  "Email Marketing",

  "Web Hosting",

  "VPN",

  "SEO Tools",

  "Creator Economy",

  "E-commerce",

  "Sales Funnels",

  "Online Courses",

  "Finance Software",

  "Productivity Software",

  "Marketing Automation"

];

if (
  !VALID_NICHES.includes(
    result.bestNiche
  )
) {

  console.log(
    "Invalid niche returned:",
    result.bestNiche
  );

  const bestValid =
    (result.opportunities || [])
      .filter(
        item =>
          VALID_NICHES.includes(
            item.niche
          )
      )
      .sort(
        (a, b) =>
          (b.score || 0) -
          (a.score || 0)
      )[0];

  result.bestNiche =
    bestValid?.niche ||
    "AI Tools";

}

console.log(
  "TREND SCOUT RESULT:",
  JSON.stringify(
    result,
    null,
    2
  )
);

return result;
}

module.exports = {
  runTrendScout
};