const fetch = require("node-fetch");

const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { jobId } = req.body;
  if (!jobId) return res.status(400).json({ error: "Missing jobId" });

  try {
    const r = await fetch("https://api.creatomate.com/v1/renders/" + jobId, {
      headers: { Authorization: "Bearer " + CREATOMATE_API_KEY },
    });
    const d = await r.json();

    let status = "processing";
    let videoUrl = null;

    if (d.status === "completed") {
      status = "done";
      videoUrl = d.url;
    } else if (d.status === "failed") {
      status = "failed";
    }

    return res.status(200).json({ status, videoUrl });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};