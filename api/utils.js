exports.default = async function handler(req, res) {
  const { action } = req.query;

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

  if (action === "optimal-time") {
    return res.status(200).json({ time: "11:00 AM", hour: 11 });
  }

  if (action === "usage") {
    return res.status(200).json({ bandwidthGB: 0, bandwidthPercent: 0, functionCalls: 0, functionPercent: 0, warning: false });
  }

  return res.status(404).json({ error: "Unknown action" });
};