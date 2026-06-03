const fetch = require("node-fetch");

exports.default = async function handler(req, res) {
  const { videoUrl } = req.body;
  const cr = await fetch("https://api.creatomate.com/v1/renders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + process.env.CREATOMATE_API_KEY },
    body: JSON.stringify({
      source: { output_format: "mp4", width: 1080, height: 1920, elements: [{ type: "video", source: videoUrl, duration: 15 }] },
    }),
  });
  const d = await cr.json();
  return res.status(200).json({ jobId: d.id });
};