const fetch = require("node-fetch");

const SHOTSTACK_KEY = (process.env.SHOTSTACK_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PEXELS_KEY = (process.env.PEXELS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const ELEVENLABS_KEY = (process.env.ELEVENLABS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

const VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const VIDEO_LENGTH = 25;

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
    let audioSrc = null;
    try {
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: "POST",
        headers: { "xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ text: videoConcept.script, model_id: "eleven_turbo_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
      });
      if (r.ok) {
        const buf = await r.buffer();
        audioSrc = "data:audio/mpeg;base64," + buf.toString("base64");
      }
    } catch (e) {}

    // Get footage or use gradient
    let videoSrc = null;
    try {
      const q = encodeURIComponent((videoConcept.hook || "").split(" ").slice(0, 5).join(" "));
      const r = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=1&orientation=portrait`, {
        headers: { "Authorization": PEXELS_KEY }
      });
      const d = await r.json();
      if (d.videos?.length) {
        const vf = d.videos[0].video_files.find(f => f.width === 1080 && f.height === 1920) || d.videos[0].video_files[0];
        if (vf) videoSrc = vf.link;
      }
    } catch (e) {}

    // Build clips - SIMPLE, FLAT array
    const clips = [];

    // Background clip
    if (videoSrc) {
      clips.push({
        asset: { type: "video", src: videoSrc, volume: 0 },
        start: 0,
        length: VIDEO_LENGTH,
      });
    } else {
      clips.push({
        asset: { type: "html", html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1e3a5f,#7c3aed);display:flex;align-items:center;justify-content:center"><p style="color:white;font-size:40px;font-weight:bold;text-align:center;padding:30px">${videoConcept.hook}</p></div>` },
        start: 0,
        length: VIDEO_LENGTH,
      });
    }

    // Text overlay
    clips.push({
      asset: { type: "title", text: videoConcept.hook, style: "minimal", size: "large", background: "#00000099", position: "center" },
      start: 0,
      length: VIDEO_LENGTH,
    });

    // Audio if available
    if (audioSrc) {
      clips.push({
        asset: { type: "audio", src: audioSrc, volume: 1 },
        start: 0,
        length: VIDEO_LENGTH,
      });
    }

    const json = {
      timeline: {
        soundtrack: { src: "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3c5c6.mp3", effect: "fadeInFadeOut", volume: audioSrc ? 0.2 : 0.6 },
        background: "#000000",
        tracks: [{ clips }],
      },
      output: { format: "mp4", resolution: "hd", aspectRatio: "9:16" },
    };

    const sr = await fetch("https://api.shotstack.io/edit/stage/render", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": SHOTSTACK_KEY },
      body: JSON.stringify(json),
    });
    const sd = await sr.json();
    
    if (!sd.success) {
      return res.status(500).json({ error: "Shotstack failed", details: sd });
    }

    return res.status(200).json({ jobId: sd.response.id });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

async function checkVideo(req, res) {
  const { jobId } = req.body;
  const r = await fetch(`https://api.shotstack.io/edit/stage/render/${jobId}`, {
    headers: { "x-api-key": SHOTSTACK_KEY },
  });
  const d = await r.json();
  return res.status(200).json({
    status: (d.response?.url || d.response?.status === "done") ? "done" : "processing",
    videoUrl: d.response?.url || null,
  });
}