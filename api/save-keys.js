const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { apiKey, profileKey, userId } = req.body;
  await kv.set(`keys-${userId}`, { apiKey, profileKey });
  return res.status(200).json({ success: true });
};