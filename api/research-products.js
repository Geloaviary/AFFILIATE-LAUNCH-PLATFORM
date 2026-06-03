const fetch = require("node-fetch");

const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { niche } = req.body;
  const nichePrompt = niche ? `in the ${niche} niche` : "across high-demand markets like SaaS, hosting, subscriptions, online tools";

  const prompt = `Recommend 5 high-demand affiliate products with RECURRING commissions ${nichePrompt}. For each product, provide the REAL affiliate sign-up URL AND the product landing page URL. Return ONLY a JSON array: [{"name":"...","description":"...","demandReason":"...","commission":"...","cookieDuration":"30 days","affiliateUrl":"https://...","productUrl":"https://..."}]`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const content = data.choices[0].message.content;
    const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const products = JSON.parse(jsonStr);
    return res.status(200).json({ products: Array.isArray(products) ? products : products.products || [] });
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
      const products = JSON.parse(jsonStr);
      return res.status(200).json({ products: Array.isArray(products) ? products : products.products || [] });
    } catch (fbError) {
      return res.status(200).json({ products: [], error: error.message });
    }
  }
};