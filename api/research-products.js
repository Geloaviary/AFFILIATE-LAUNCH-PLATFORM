const fetch = require("node-fetch");

const {
  runTrendScout
} = require(
  "../lib/affiliate-researcher/trend-scout"
);

const {
  scoreProducts
} = require(
  "../lib/affiliate-researcher/opportunity-scorer"
);

const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const {
  niche,
  autoDiscover = true
} = req.body || {};

  let targetNiche = niche;

  if (!targetNiche && autoDiscover) {

  try {

    const trends =
      await runTrendScout();

    console.log(
      "TREND SCOUT:",
      JSON.stringify(
        trends,
        null,
        2
      )
    );

    targetNiche =
      trends.bestNiche;

    console.log(
      "Trend Scout selected:",
      targetNiche
    );

  } catch (e) {

    console.error(
      "Trend Scout failed:",
      e.message
    );

    targetNiche =
      "AI Tools";
  }
}

  const nichePrompt =
  targetNiche
    ? `in the ${targetNiche} niche`
    : "across high-demand markets like SaaS, hosting, subscriptions, online tools";

  const prompt = `Recommend 5 high-demand affiliate products with RECURRING commissions ${nichePrompt}. For each product, provide the REAL affiliate sign-up URL AND the product landing page URL. Return ONLY a JSON array: [{"name":"...","description":"...","demandReason":"...","commission":"...","cookieDuration":"30 days","affiliateUrl":"https://...","productUrl":"https://..."}]`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_KEY,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const content = data.choices[0].message.content;

const jsonStr = content
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const productsData =
  JSON.parse(jsonStr);

const products =
  Array.isArray(productsData)
    ? productsData
    : productsData.products || [];

const rankedProducts =
  await scoreProducts(products);

console.log(
  "RANKED PRODUCTS:",
  JSON.stringify(
    rankedProducts,
    null,
    2
  )
);

return res.status(200).json({
  products,
  rankedProducts
 });
  } catch (error) {
    // Fallback to GPT-3.5
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + OPENAI_KEY,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
        }),
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const productsData =
  JSON.parse(jsonStr);

const products =
  Array.isArray(productsData)
    ? productsData
    : productsData.products || [];

const rankedProducts =
  await scoreProducts(products);

return res.status(200).json({
  products,
  rankedProducts
});
    } catch (fbError) {

  console.error(
    "Fallback failed:",
    fbError.message
  );

  return res.status(500).json({
    products: [],
    rankedProducts: [],
    error:
      fbError.message || error.message
  });

    }
  }
};