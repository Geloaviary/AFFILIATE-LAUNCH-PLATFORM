exports.default = async function handler(req, res) {
  const { action } = req.query;

  // Trending
  if (action === "trending") {
    const { platform } = req.body;
    const trending = {
      tiktok: { sound: "original sound - trending", hashtag: "#fyp #viral" },
      instagram: { sound: "popular reel audio", hashtag: "#reels #viral" },
      youtube: { sound: "upbeat background", hashtag: "#shorts #viral" },
      facebook: { sound: "inspiring", hashtag: "#viral #trending" },
    };
    return res.status(200).json(trending[platform] || trending.tiktok);
  }

  // Optimal time
  if (action === "optimal-time") {
    return res.status(200).json({ time: "11:00 AM", hour: 11 });
  }

  // Usage
  if (action === "usage") {
    return res.status(200).json({ bandwidthGB: 0, bandwidthPercent: 0, functionCalls: 0, functionPercent: 0, warning: false });
  }

  // Clone winner
  if (action === "clone-winner") {
    const { Configuration, OpenAIApi } = require("openai");
    const { campaignId, winningStyle } = req.body;
    try {
      const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: `Generate 5 new video concepts in "${winningStyle}" style. Return JSON array with: style, hook, script, visuals, captions, hashtags, musicSuggestion, duration.` }],
        temperature: 0.9,
      });
      const content = completion.data.choices[0].message.content;
      const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const clones = JSON.parse(jsonStr);
      return res.status(200).json({ success: true, clones: Array.isArray(clones) ? clones : clones.videos || [] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Reply comments
  if (action === "reply-comments") {
    console.log("Comment webhook:", req.body);
    return res.status(200).json({ success: true });
  }

  // Invite user
  if (action === "invite-user") {
    return res.status(200).json({ success: true, message: "Invite sent" });
  }

  // Scheduled rotation
  if (action === "rotation") {
    console.log("Rotation check");
    return res.status(200).json({ success: true });
  }

  return res.status(404).json({ error: "Unknown action" });
};