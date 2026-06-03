const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { campaignId, userId } = req.body;
  const keys = await kv.keys(`${userId}-*`);
  const records = [];
  for (const key of keys) {
    const record = await kv.get(key);
    if (record && (!campaignId || record.campaignId === campaignId)) {
      record.analytics = { views: 0, likes: 0, comments: 0, shares: 0, engagement: 0 };
      records.push(record);
    }
  }
  return res.status(200).json({ records });
};