const fetch = require("node-fetch");
const { kv } = require("@vercel/kv");

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { videoUrl, caption, platforms, apiKey, profileKey, videoStyle, campaignId, postStories, userId } = req.body;
  if (!videoUrl || !apiKey || !profileKey) return res.status(400).json({ error: "Missing fields" });

  const platformList = platforms || ["facebook", "instagram", "tiktok", "youtube"];
  const results = [];

  for (const platform of platformList) {
    try {
      const r = await fetch("https://api.ayrshare.com/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ post: caption, platforms: [platform], mediaUrls: [videoUrl], profileKey }),
      });
      const d = await r.json();
      const success = d.status === "success";
      const postId = success ? d.postIds?.[0]?.id || null : null;
      if (success && postId) {
        await kv.set(`${userId}-${Date.now()}-${platform}`, { postId, platform, videoUrl, style: videoStyle, timestamp: new Date().toISOString(), campaignId });
      }
      results.push({ platform, success, postId });
    } catch (err) { results.push({ platform, success: false, error: err.message }); }
  }

  return res.status(200).json({ results });
};