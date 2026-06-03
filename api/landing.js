const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  const { action } = req.query;

  // Capture email
  if (req.method === "POST" && action === "capture") {
    const { email, campaignId } = req.body;
    console.log("Email captured:", email, campaignId);
    return res.redirect(`/api/landing?c=${campaignId}&success=1`);
  }

  // Serve landing page
  const { c } = req.query;
  if (!c) return res.status(400).send("Missing campaign");
  const record = await kv.get(`landing-${c}`);
  if (!record) return res.status(404).send("Not found");
  res.setHeader("Content-Type", "text/html");
  return res.send(record.html);
};