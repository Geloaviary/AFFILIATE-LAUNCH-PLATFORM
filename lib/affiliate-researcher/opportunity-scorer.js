const fetch = require("node-fetch");

const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

async function scoreProducts(products = []) {

  if (!Array.isArray(products) || !products.length) {
    return [];
  }

  const prompt = `
You are an elite affiliate marketing analyst.

Evaluate these affiliate products.

Score each product from 1-100 using:

- recurring commissions
- demand
- profitability
- ease of promotion
- content opportunities
- long-term potential

Return ONLY JSON.

{
  "ranked":[
    {
      "name":"",
      "score":0,
      "verdict":"",
      "reason":""
    }
  ]
}

Products:

${JSON.stringify(products, null, 2)}
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

    const result =
      JSON.parse(jsonStr);

    const ranked =
  result.ranked || [];

return ranked.map(rank => {

  const original =
    products.find(
      p => p.name === rank.name
    ) || {};

  return {
    ...original,
    score: rank.score || 50,
    verdict:
      rank.verdict || "REVIEW",
    reason:
      rank.reason || ""
  };

});

  } catch (e) {

    console.error(
      "Opportunity Scorer parse failed:",
      e.message
    );

    return products.map(
      product => ({
        name:
          product.name ||
          "Unknown",
        score: 50,
        verdict:
          "REVIEW",
        reason:
          "Fallback score"
      })
    );

  }

}

module.exports = {
  scoreProducts
};