const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  const { action } = req.query;

  // ============ CAPTURE EMAIL ============
  if (req.method === "POST" && action === "capture") {
    const { email, campaignId, name } = req.body;

    if (!email) return res.status(400).json({ error: "Missing email" });

    // Store lead in KV
    const leadKey = `lead:${email}`;
    const existing = await kv.get(leadKey);

    const lead = {
      email,
      name: name || email.split("@")[0],
      campaignId,
      createdAt: new Date().toISOString(),
      visits: (existing?.visits || 0) + 1,
    };

    await kv.set(leadKey, lead);

    // Add to email sequence
    const sequence = await kv.get(`sequence:${campaignId}`) || [];
    sequence.push({ email, name: lead.name, stage: 1, joinedAt: new Date().toISOString() });
    await kv.set(`sequence:${campaignId}`, sequence);

    // Send welcome email (if ConvertKit/Mailchimp configured)
    await sendWelcomeEmail(email, lead.name, campaignId);

    return res.status(200).json({ success: true, message: "Email captured and sequence started" });
  }

  // ============ SERVE LANDING PAGE ============
  const { c } = req.query;
  if (!c) return res.status(400).send("Missing campaign");

  const record = await kv.get(`landing-${c}`);
  if (!record) return res.status(404).send("Not found");

  res.setHeader("Content-Type", "text/html");
  return res.send(record.html);
};

// ============ EMAIL AUTO-RESPONDER ============
async function sendWelcomeEmail(email, name, campaignId) {
  // Try ConvertKit if configured
  const CONVERTKIT_KEY = process.env.CONVERTKIT_API_KEY;
  const CONVERTKIT_FORM = process.env.CONVERTKIT_FORM_ID;

  if (CONVERTKIT_KEY && CONVERTKIT_FORM) {
    try {
      const fetch = require("node-fetch");
      await fetch(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: CONVERTKIT_KEY,
          email,
          first_name: name,
          tags: [campaignId || "affiliate-tool"],
        }),
      });
      console.log(`✅ ${email} subscribed to ConvertKit`);
      return;
    } catch (e) {
      console.error("ConvertKit error:", e.message);
    }
  }

  // Try Mailchimp if configured
  const MAILCHIMP_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_LIST = process.env.MAILCHIMP_LIST_ID;
  const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER || "us1";

  if (MAILCHIMP_KEY && MAILCHIMP_LIST) {
    try {
      const fetch = require("node-fetch");
      await fetch(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "apikey " + MAILCHIMP_KEY,
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
          merge_fields: { FNAME: name },
          tags: [campaignId || "affiliate-tool"],
        }),
      });
      console.log(`✅ ${email} subscribed to Mailchimp`);
      return;
    } catch (e) {
      console.error("Mailchimp error:", e.message);
    }
  }

  // Fallback: Log to console
  console.log(`📧 Welcome email should be sent to ${email} for campaign ${campaignId}`);
  console.log(`📋 Email Sequence:
    Day 1: Welcome + Product intro
    Day 3: Case study / Testimonial
    Day 5: Comparison with competitors
    Day 7: Limited offer / Discount
    Day 10: Follow-up + CTA`);
}