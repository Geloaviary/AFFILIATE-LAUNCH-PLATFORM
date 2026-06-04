const fetch = require("node-fetch");

const CREATOMATE_KEY = (process.env.CREATOMATE_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PEXELS_KEY = (process.env.PEXELS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const ELEVENLABS_KEY = (process.env.ELEVENLABS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  const { action } = req.query;
  if (action === "check") return checkVideo(req, res);
  return generateVideo(req, res);
};

async function generateVideo(req, res) {
  const { videoConcept } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  try {
    // Generate TTS
    let audioUrl = null;
    try {
      const r = await fetch("https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB", {
        method: "POST",
        headers: { "xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ text: videoConcept.script, model_id: "eleven_turbo_v2" }),
      });
      if (r.ok) {
        const buf = await r.buffer();
        audioUrl = "data:audio/mpeg;base64," + buf.toString("base64");
      }
    } catch (e) { console.log("TTS unavailable"); }

    // Get Pexels footage
    let videoUrl = null;
    try {
      const q = encodeURIComponent(videoConcept.hook.split(" ").slice(0, 5).join(" "));
      const r = await fetch("https://api.pexels.com/videos/search?query=" + q + "&per_page=3&orientation=portrait", {
        headers: { "Authorization": PEXELS_KEY }
      });
      const d = await r.json();
      if (d.videos?.length) {
        for (const v of d.videos) {
          const vf = v.video_files.find(f => f.width === 1080 && f.height === 1920);
          if (vf) { videoUrl = vf.link; break; }
        }
      }
    } catch (e) { console.log("Pexels unavailable"); }

    // Build SIMPLE working template
    const elements = [];

    if (videoUrl) {
      elements.push({
        type: "video",
        source: videoUrl,
        x: "0%", y: "0%", width: "100%", height: "100%",
        duration: 10,
      });
    } else {
      elements.push({
        type: "shape",
        shape: "rectangle",
        x: "0%", y: "0%", width: "100%", height: "100%",
        fillColor: "#1e3a5f",
        duration: 10,
      });
    }

    elements.push({
      type: "text",
      text: videoConcept.hook,
      x: "50%", y: "50%", width: "90%", height: "auto",
      duration: 10,
      fontSize: 32,
      fontWeight: 800,
      fillColor: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.6)",
      alignment: "center",
    });

    if (audioUrl) {
      elements.push({
        type: "audio",
        source: audioUrl,
        duration: 10,
        volume: 1,
      });
    }

    const body = {
      source: {
        output_format: "mp4",
        width: 1080,
        height: 1920,
        elements: elements,
      },
    };

    const cr = await fetch("https://api.creatomate.com/v1/renders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
      body: JSON.stringify(body),
    });
    const d = await cr.json();
    const result = Array.isArray(d) ? d[0] : d;

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
  return res.status(200).json({
    status: (d.status === "completed" || d.status === "succeeded") ? "done" : "processing",
    videoUrl: d.url || null,
  });
}