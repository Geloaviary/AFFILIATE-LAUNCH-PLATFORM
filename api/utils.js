const fetch = require("node-fetch");
const { kv } = require("@vercel/kv");

const {
  getFeaturedNiches
} = require(
  "../lib/niche-catalog"
);

const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  const { action } = req.query;

  // ============ TRENDING SOUNDS ============
  if (action === "trending") {
    const { platform } = req.body;
    const trending = {
      tiktok: { sound: "original sound - trending", hashtag: "#fyp #viral #trending" },
      instagram: { sound: "popular reel audio", hashtag: "#reels #explore #viral" },
      youtube: { sound: "upbeat background", hashtag: "#shorts #viral" },
      facebook: { sound: "inspiring moment", hashtag: "#viral #trending" },
    };
    return res.status(200).json(trending[platform] || trending.tiktok);
  }

  // ============ OPTIMAL TIME ============
  if (action === "optimal-time") {
    const cached = await kv.get("optimal-times");
    if (cached) return res.status(200).json(cached);
    return res.status(200).json({ time: "11:00 AM", hour: 11 });
  }

  // ============ USAGE ============
  if (action === "usage") {
    return res.status(200).json({ bandwidthGB: 0, bandwidthPercent: 0, functionCalls: 0, functionPercent: 0, warning: false });
  }

  // ============ CLONE WINNER ============
  if (action === "clone-winner") {
    const { campaignId, winningStyle } = req.body;
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `Generate 5 new video concepts in "${winningStyle}" style. Return JSON array with: style, hook, script, visuals, captions, hashtags, musicSuggestion, duration.` }],
          temperature: 0.9,
        }),
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const clones = JSON.parse(jsonStr);
      return res.status(200).json({ success: true, clones: Array.isArray(clones) ? clones : clones.videos || [] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // ============ COMMENT AUTO-REPLY ============
  if (action === "reply-comments") {
    console.log("Comment webhook:", req.body);
    const { comment, username, platform } = req.body;
    const reply = `Thanks @${username}! Check the link in our bio for the best deal! 🔥`;
    return res.status(200).json({ success: true, reply, platform });
  }

  // ============ INVITE USER ============
  if (action === "invite-user") {
    return res.status(200).json({ success: true, message: "Invite sent" });
  }

  // ============ SCHEDULED ROTATION ============
  if (action === "rotation") {
    console.log("Rotation check running...");
    const products = await kv.get("product-rotation");
    if (products) {
      // Rotate: move first product to end
      const rotated = [...products.slice(1), products[0]];
      await kv.set("product-rotation", rotated);
      return res.status(200).json({ success: true, nextProduct: rotated[0] });
    }
    return res.status(200).json({ success: true, message: "No products in rotation" });
  }

  // ============ TRENDING NICHES ============
  if (action === "trending-niches") {
    const data = await kv.get("trending-niches");
    return res.status(200).json(data || { niches: [] });
  }

  // ============ COMPETITOR FINDER ============
  if (action === "competitors") {
    const { productName, niche } = req.body;
    try {
      const cacheKey = `competitors:${productName}`;
      const cached = await kv.get(cacheKey);
      if (cached) return res.status(200).json({ competitors: cached });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `Find the top 3 competitors for "${productName}" in the ${niche || 'tech'} space. For each, provide: name, description, keyDifference, affiliateUrl. Return JSON array.` }],
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const competitors = JSON.parse(jsonStr);
      const result = Array.isArray(competitors) ? competitors : competitors.competitors || [];
      
      await kv.set(cacheKey, result);
      return res.status(200).json({ competitors: result });
    } catch (error) {
      return res.status(200).json({ competitors: [], error: error.message });
    }
  }

  // ============ TREND DETECTOR ============
  if (action === "trend-detect") {
    try {
      const cacheKey = `trends:${new Date().toISOString().slice(0, 7)}`;
      const cached = await kv.get(cacheKey);
      if (cached) return res.status(200).json({ trends: cached });

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "What are the top 5 trending affiliate marketing niches right now? For each provide: niche, trendStrength (1-10), whyTrending, recommendedProduct, monthlySearchVolume. Return JSON array." }],
          temperature: 0.8,
        }),
      });
      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const trends = JSON.parse(jsonStr);
      const result = Array.isArray(trends) ? trends : trends.trends || [];

      await kv.set(cacheKey, result);
      return res.status(200).json({ trends: result });
    } catch (error) {
      return res.status(200).json({ trends: [], error: error.message });
    }
  }

  // ============ AUTO-SCHEDULE ============
  if (action === "auto-schedule") {
    const { campaignId, videos } = req.body;
    const schedule = [];
    let date = new Date();
    date.setHours(11, 0, 0, 0); // 11 AM start

    for (let i = 0; i < (videos || 4); i++) {
      schedule.push({
        date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).toISOString(),
        campaignId,
        videoIndex: i,
      });
    }

    await kv.set(`schedule:${campaignId}`, schedule);
    return res.status(200).json({ success: true, schedule });
  }

  // ============ ADD TO ROTATION ============
  if (action === "add-rotation") {
    const { productName, productUrl } = req.body;
    let products = await kv.get("product-rotation") || [];
    products.push({ name: productName, url: productUrl, added: new Date().toISOString() });
    await kv.set("product-rotation", products);
    return res.status(200).json({ success: true, total: products.length });
  }

  // ============ NICHE CATALOG ============
if (action === "get-niches") {

  return res.status(200).json({

    niches:
      getFeaturedNiches()

  });

}

  return res.status(404).json({ error: "Unknown action" });
};