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

Your job is to identify the best affiliate niches to promote right now.

Prioritize:

- recurring commissions
- SaaS products
- software subscriptions
- creator economy tools
- business tools

Avoid:

- physical products
- one-time commissions
- low-ticket products

Only select from:

${CORE_NICHES.join(", ")}

Return ONLY JSON.

{
  "bestNiche":"",
  "opportunities":[
    {
      "niche":"",
      "score":0,
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