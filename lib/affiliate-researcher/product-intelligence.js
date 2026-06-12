const fetch = require("node-fetch");

const OPENAI_KEY =
  (process.env.OPENAI_API_KEY || "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

async function analyzeProduct(product = {}) {

  const prompt = `
You are an elite affiliate marketing strategist.

Analyze this affiliate product for affiliate marketing.

Product:

${JSON.stringify(product, null, 2)}

Infer likely buyer intent, audience, pain points,
desires, objections, competitors, use cases,
features and benefits from the product name,
description, website URL and business category.

Do not leave fields empty.

Generate at least 3 items for every array.

Return ONLY valid JSON.

{
  "audience":[
    ""
  ],

  "painPoints":[
    ""
  ],

  "desires":[
    ""
  ],

  "objections":[
    ""
  ],

  "competitors":[
    ""
  ],

  "useCases":[
    ""
  ],

  "features":[
    ""
  ],

  "benefits":[
    ""
  ],

  "buyerKeywords":[
    ""
  ],

  "contentAngles":[
    ""
  ],

  "videoHooks":[
    ""
  ],

  "visualThemes":[
    ""
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

    return JSON.parse(jsonStr);

  } catch (e) {

    console.error(
      "Product Intelligence parse failed:",
      e.message
    );

    return {

  audience: [],

  painPoints: [],

  desires: [],

  objections: [],

  competitors: [],

  useCases: [],

  features: [],

  benefits: [],

  buyerKeywords: [],

  contentAngles: [],

  videoHooks: [],

  visualThemes: []

};

  }

}

module.exports = {
  analyzeProduct
};