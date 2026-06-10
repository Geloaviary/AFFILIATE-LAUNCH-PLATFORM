const fetch = require("node-fetch");

const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

async function scoreLongTermOpportunity(
  product = {},
  validation = {}
) {

    const recurringBonus =
  validation.commissionType ===
  "Recurring"
    ? 15
    : 0;

  const prompt = `
You are an elite affiliate portfolio manager.

Your goal is NOT to maximize short-term commissions.

Your goal is to maximize recurring monthly income over the next 3 years.

Prioritize:

- recurring commissions
- subscription businesses
- SaaS products
- customer retention
- high LTV customers
- evergreen demand
- stable companies

Penalize:

- one-time commissions
- seasonal products
- fad products
- temporary trends
- low-ticket offers

Evaluate this affiliate opportunity.

PRODUCT:

${JSON.stringify(product, null, 2)}

VALIDATION:

${JSON.stringify(validation, null, 2)}

Score:

- recurring revenue potential
- customer retention
- customer lifetime value
- evergreen demand
- market growth
- content opportunities
- brand stability
- competition difficulty

Return ONLY JSON.

{
  "score":0,
  "grade":"",
  "recommendation":"",
  "recurringPotential":0,
  "retentionScore":0,
  "ltvScore":0,
  "evergreenScore":0,
  "competitionScore":0,
  "brandStability":0,
  "contentOpportunity":0,
  "automationFit":0,
  "reason":""
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

  result.score =
  Math.min(
    100,
    (result.score || 0) +
    recurringBonus
  );

return result;

}

module.exports = {
  scoreLongTermOpportunity
};