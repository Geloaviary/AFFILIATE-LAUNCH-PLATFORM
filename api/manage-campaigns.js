const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  const { userId } = req.body || req.query;
  if (!userId) return res.status(401).json({ error: "Missing userId" });

  if (req.method === "GET") {
    const keys = await kv.keys(`${userId}-campaign-*`);
    const campaigns = [];
    for (const key of keys) {
      const data = await kv.get(key);
      if (data) campaigns.push({ id: key.replace(`${userId}-campaign-`, ""), ...data });
    }
    return res.status(200).json({ campaigns });
  }

  if (req.method === "POST") {
    const { name, productUrl, niche } = req.body;
    const campaignId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    await kv.set(`${userId}-campaign-${campaignId}`, { name, productUrl, niche: niche || "", createdAt: new Date().toISOString(), package: null });
    return res.status(200).json({ campaignId, campaign: { name, productUrl, niche } });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
};