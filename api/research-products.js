const { Configuration, OpenAIApi } = require("openai");

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { niche } = req.body;
  const nichePrompt = niche ? `in the ${niche} niche` : "across high-demand markets";

  try {
    const configuration = new Configuration({
      apiKey: (process.env.OPENAI_API_KEY || "").trim(),
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `Recommend 5 high-demand affiliate products with RECURRING commissions ${nichePrompt}. Return JSON array with: name, description, demandReason, commission, cookieDuration, affiliateUrl.` }],
      temperature: 0.8,
    });
    const content = completion.data.choices[0].message.content;
    const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const products = JSON.parse(jsonStr);
    return res.status(200).json({ products: Array.isArray(products) ? products : products.products || [] });
  } catch (error) {
    return res.status(200).json({ products: [], error: error.message });
  }
};