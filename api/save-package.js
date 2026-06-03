const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  const { campaignId, package: pkg, userId } = req.body;
  const key = `${userId}-campaign-${campaignId}`;
  const existing = await kv.get(key);
  if (!existing) return res.status(404).json({ error: "Campaign not found" });
  existing.package = pkg;
  await kv.set(key, existing);
  return res.status(200).json({ success: true });
};