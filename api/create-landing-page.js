const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  const { campaignId, userId } = req.body;
  const key = `${userId}-campaign-${campaignId}`;
  const campaign = await kv.get(key);
  if (!campaign) return res.status(404).json({ error: "Campaign not found" });

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${campaign.name}</title></head><body><h1>${campaign.name}</h1><form action="/api/capture-email" method="POST"><input type="email" name="email" placeholder="Your email" required><input type="hidden" name="campaignId" value="${campaignId}"><button>Get Access</button></form></body></html>`;
  await kv.set(`landing-${campaignId}`, { html });
  return res.status(200).json({ url: `/api/landing?c=${campaignId}` });
};