const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
try {
const userId =
req.method === "GET"
? req.query.userId
: req.body.userId;

if (!userId) {
  return res.status(400).json({
    error: "Missing userId"
  });
}

// LOAD CAMPAIGNS
if (req.method === "GET") {
  const keys = await kv.keys(
    `${userId}-campaign-*`
  );

  const campaigns = [];

  for (const key of keys) {
    const data = await kv.get(key);

    if (data) {
      campaigns.push({
        id: key.replace(
          `${userId}-campaign-`,
          ""
        ),
        ...data
      });
    }
  }

  campaigns.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return res.status(200).json({
    campaigns
  });
}

// CREATE CAMPAIGN
if (req.method === "POST") {
  const {
    name,
    productUrl,
    niche,
    affiliateUrl
  } = req.body;

  if (!name || !productUrl) {
    return res.status(400).json({
      error:
        "Campaign name and product URL required"
    });
  }

  const campaignId =
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 8);

  const campaign = {
    name,
    productUrl,
    affiliateUrl: affiliateUrl || "",
    niche: niche || "",
    package: null,
    createdAt:
      new Date().toISOString()
  };

  await kv.set(
    `${userId}-campaign-${campaignId}`,
    campaign
  );

  return res.status(200).json({
    campaignId,
    campaign
  });
}

return res.status(405).json({
  error: "Method Not Allowed"
});

} catch (error) {
return res.status(500).json({
error: error.message
});
}
};
