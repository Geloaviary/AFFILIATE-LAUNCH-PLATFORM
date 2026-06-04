const fetch = require("node-fetch");

const CREATOMATE_KEY = (process.env.CREATOMATE_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  const { action } = req.query;
  if (action === "check") return checkVideo(req, res);
  return generateVideo(req, res);
};

async function generateVideo(req, res) {
  const { videoConcept } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  const elements = [
    {
      type: "shape",
      shape: "rectangle",
      x: "0%", y: "0%", width: "100%", height: "100%",
      fillColor: "#1e3a5f",
      duration: 25,
    },
    {
      type: "text",
      text: videoConcept.hook,
      x: "50%", y: "40%", width: "90%",
      duration: 25,
      fontSize: 36,
      fontWeight: 800,
      fillColor: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.5)",
      alignment: "center",
    },
    {
      type: "text",
      text: "Link in bio!",
      x: "50%", y: "85%", width: "60%",
      duration: 25,
      fontSize: 22,
      fontWeight: 700,
      fillColor: "#ffffff",
      backgroundColor: "#2563eb",
      alignment: "center",
    },
  ];

  const body = { 
    source: { output_format: "mp4", width: 1080, height: 1920, elements },
  };

  try {
    const cr = await fetch("https://api.creatomate.com/v1/renders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
      body: JSON.stringify(body),
    });
    const d = await cr.json();
    const result = Array.isArray(d) ? d[0] : d;
    if (!result?.id) return res.status(500).json({ error: "Creatomate failed", raw: d });
    return res.status(200).json({ jobId: result.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

async function checkVideo(req, res) {
  const { jobId } = req.body;
  const r = await fetch("https://api.creatomate.com/v1/renders/" + jobId, {
    headers: { "Authorization": "Bearer " + CREATOMATE_KEY },
  });
  let d = await r.json();
  if (Array.isArray(d)) d = d[0];
  const done = d?.status === "completed" || d?.status === "succeeded";
  return res.status(200).json({
    status: done ? "done" : "processing",
    videoUrl: done ? (d.url || null) : null,
  });
}