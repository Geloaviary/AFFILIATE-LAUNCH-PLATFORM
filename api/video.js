const fetch = require("node-fetch");

const CREATOMATE_KEY = (process.env.CREATOMATE_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PEXELS_KEY = (process.env.PEXELS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const ELEVENLABS_KEY = (process.env.ELEVENLABS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

const VOICE_ID = "pNInz6obpgDQGcFmaJgB";

exports.default = async function handler(req, res) {
  const { action } = req.query;
  if (action === "check") return checkVideo(req, res);
  return generateVideo(req, res);
};

async function generateVideo(req, res) {
  const { videoConcept } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  try {
    // Get Pexels footage
    let videoSource = null;
    try {
      const q = encodeURIComponent((videoConcept.hook || "technology").split(" ").slice(0, 3).join(" "));
      const r = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=3&orientation=portrait`, {
        headers: { "Authorization": PEXELS_KEY }
      });
      const d = await r.json();
      if (d.videos?.length) {
        for (const v of d.videos) {
          const vf = v.video_files.find(f => f.width <= 1080 && f.height >= 1920) 
            || v.video_files.find(f => f.quality === "hd") 
            || v.video_files[0];
          if (vf?.link?.startsWith("http")) {
            videoSource = vf.link;
            break;
          }
        }
      }
    } catch (e) {}

    // Build elements
    const elements = [];

    // Background video or gradient
    if (videoSource) {
      elements.push({
        type: "video",
        source: videoSource,
        fit: "cover",
        x: "0%", y: "0%", width: "100%", height: "100%",
        duration: 25,
      });
    } else {
      elements.push({
        type: "shape",
        shape: "rectangle",
        x: "0%", y: "0%", width: "100%", height: "100%",
        fillColor: "#1e3a5f",
        duration: 25,
      });
    }

    // Hook text
    elements.push({
      type: "text",
      text: videoConcept.hook,
      x: "50%", y: "45%", width: "90%",
      duration: 25,
      fontSize: 36,
      fontWeight: 800,
      fillColor: "#ffffff",
      backgroundColor: "rgba(0,0,0,0.6)",
      alignment: "center",
    });

    // CTA
    elements.push({
      type: "text",
      text: "Link in bio! 🔗",
      x: "50%", y: "85%", width: "70%",
      duration: 25,
      fontSize: 24,
      fontWeight: 700,
      fillColor: "#ffffff",
      backgroundColor: "#2563eb",
      alignment: "center",
    });

    // TTS if available
    if (ELEVENLABS_KEY) {
      try {
        const ttsR = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: "POST",
          headers: { "xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ text: videoConcept.script, model_id: "eleven_turbo_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
        });
        if (ttsR.ok) {
          const buf = await ttsR.buffer();
          const audioUrl = "data:audio/mpeg;base64," + buf.toString("base64");
          elements.push({
            type: "audio",
            source: audioUrl,
            duration: 25,
            volume: 1,
          });
        }
      } catch (e) {}
    }

    // Submit to Creatomate
    const body = { source: { output_format: "mp4", width: 1080, height: 1920, elements } };
    const cr = await fetch("https://api.creatomate.com/v1/renders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
      body: JSON.stringify(body),
    });
    const d = await cr.json();
    const result = Array.isArray(d) ? d[0] : d;

    if (!result?.id) {
      return res.status(500).json({ error: "Creatomate failed", raw: d });
    }

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