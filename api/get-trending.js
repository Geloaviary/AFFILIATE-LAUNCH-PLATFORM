exports.default = async function handler(req, res) {
  const { platform } = req.body;
  const trending = {
    tiktok: { sound: "original sound - trending", hashtag: "#fyp #viral" },
    instagram: { sound: "popular reel audio", hashtag: "#reels #viral" },
    youtube: { sound: "upbeat background", hashtag: "#shorts #viral" },
    facebook: { sound: "inspiring", hashtag: "#viral #trending" },
  };
  return res.status(200).json(trending[platform] || trending.tiktok);
};