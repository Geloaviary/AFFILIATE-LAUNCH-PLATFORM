const { Configuration, OpenAIApi } = require("openai");

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { niche } = req.body;
  const nichePrompt = niche ? `in the ${niche} niche` : "across high-demand markets like SaaS, hosting, subscriptions, online tools";

  try {
    const configuration = new Configuration({
      apiKey: (process.env.OPENAI_API_KEY || "").trim(),
    });
    const openai = new OpenAIApi(configuration);

    // First, search for real affiliate programs
    const searchCompletion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Search your knowledge for 5 high-demand affiliate products with RECURRING commissions ${nichePrompt}. For each, provide the REAL affiliate sign-up URL (not made up). Return ONLY JSON array: [{"name":"...","description":"...","demandReason":"...","commission":"...","cookieDuration":"30 days","affiliateUrl":"https://..."}]`
      }],
      temperature: 0.5,
    });

    const content = searchCompletion.data.choices[0].message.content;
    const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const products = JSON.parse(jsonStr);
    const productList = Array.isArray(products) ? products : products.products || [];

    return res.status(200).json({ products: productList });
  } catch (error) {
    // Fallback to GPT-3.5 if GPT-4 fails
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: `Recommend 5 high-demand affiliate products with RECURRING commissions ${nichePrompt}. Return JSON array with: name, description, demandReason, commission, cookieDuration, affiliateUrl. Use REAL affiliate sign-up URLs when possible.` }],
        temperature: 0.8,
      });
      const content = completion.data.choices[0].message.content;
      const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const products = JSON.parse(jsonStr);
      return res.status(200).json({ products: Array.isArray(products) ? products : products.products || [] });
    } catch (fallbackError) {
      return res.status(200).json({ products: [], error: error.message });
    }
  }
};