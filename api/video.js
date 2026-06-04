const fetch = require("node-fetch");

const SHOTSTACK_KEY = (process.env.SHOTSTACK_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PEXELS_KEY = (process.env.PEXELS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const ELEVENLABS_KEY = (process.env.ELEVENLABS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

const VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const FALLBACK_MUSIC = "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3c5c6.mp3";
const VIDEO_LENGTH = 25; // Fixed 25 seconds

// ============ QUALITY CONTROL ============
async function qualityCheck(concept) {
  const report = { passed: true, issues: [], assets: {} };

  // Check script
  if (!concept.script || concept.script.length < 50) {
    report.issues.push("Script too short for voiceover");
    report.passed = false;
  }
  if (!concept.hook || concept.hook.length < 10) {
    report.issues.push("Hook missing or too short");
    report.passed = false;
  }

  // Check Pexels
  try {
    const q = encodeURIComponent((concept.hook || "test").split(" ").slice(0, 3).join(" "));
    const r = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=1`, {
      headers: { "Authorization": PEXELS_KEY }
    });
    const d = await r.json();
    report.assets.footage = d.videos?.length > 0;
    if (!report.assets.footage) report.issues.push("No stock footage — using gradient");
  } catch (e) {
    report.assets.footage = false;
    report.issues.push("Pexels unavailable");
  }

  // Check TTS
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: { "xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ text: concept.script.substring(0, 100), model_id: "eleven_turbo_v2" }),
    });
    report.assets.tts = r.ok;
    if (!r.ok) report.issues.push("ElevenLabs unavailable — no voiceover");
  } catch (e) {
    report.assets.tts = false;
    report.issues.push("ElevenLabs unavailable");
  }

  return report;
}

// ============ MAIN HANDLER ============
exports.default = async function handler(req, res) {
  const { action } = req.query;
  if (action === "check") return checkVideo(req, res);
  return generateVideo(req, res);
};

// ============ GENERATE VIDEO ============
async function generateVideo(req, res) {
  const { videoConcept } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  // Run quality check first
  const qc = await qualityCheck(videoConcept);

  try {
    // Generate TTS
    let audioUrl = null;
    if (qc.assets.tts !== false) {
      try {
        const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
          method: "POST",
          headers: { "xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json" },
          body: JSON.stringify({ text: videoConcept.script, model_id: "eleven_turbo_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
        });
        if (r.ok) {
          const buf = await r.buffer();
          audioUrl = "data:audio/mpeg;base64," + buf.toString("base64");
        }
      } catch (e) {}
    }

    // Get footage
    let clips = [];
    try {
      const q = encodeURIComponent((videoConcept.hook || "").split(" ").slice(0, 5).join(" "));
      const r = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=3&orientation=portrait`, {
        headers: { "Authorization": PEXELS_KEY }
      });
      const d = await r.json();
      if (d.videos) {
        for (const v of d.videos) {
          const vf = v.video_files.find(f => f.width === 1080 && f.height === 1920) || v.video_files[0];
          if (vf) clips.push(vf.link);
        }
      }
    } catch (e) {}

    // Build Shotstack JSON
    const videoClips = [];
    const clipDuration = VIDEO_LENGTH / Math.max(clips.length, 1);

    if (clips.length > 0) {
      clips.forEach((src, i) => {
        videoClips.push({
          asset: { type: "video", src, volume: 0, fit: "crop" },
          start: i * clipDuration,
          length: clipDuration,
          transition: i > 0 ? { in: "crossfade" } : undefined,
        });
      });
    } else {
      videoClips.push({
        asset: { type: "html", html: `<div style="width:100%;height:100%;background:linear-gradient(135deg,#1e3a5f,#7c3aed);display:flex;align-items:center;justify-content:center"><p style="color:white;font-size:48px;font-weight:bold;text-align:center;padding:30px">${videoConcept.hook}</p></div>` },
        start: 0,
        length: VIDEO_LENGTH,
      });
    }

    // Hook overlay
    videoClips.push({
      asset: { type: "title", text: videoConcept.hook, style: "minimal", size: "large", background: "#00000099", position: "center" },
      start: 0,
      length: Math.min(VIDEO_LENGTH, 5),
      transition: { in: "fade" },
    });

    // Audio track
    const audioClips = [];
    if (audioUrl) {
      audioClips.push({
        asset: { type: "audio", src: audioUrl, volume: 1 },
        start: 0,
        length: VIDEO_LENGTH,
      });
    }

    const json = {
      timeline: {
        soundtrack: { src: FALLBACK_MUSIC, effect: "fadeInFadeOut", volume: audioUrl ? 0.2 : 0.6 },
        background: "#000000",
        tracks: [
          { clips: videoClips },
          { clips: audioClips },
        ],
      },
      output: { format: "mp4", resolution: "1080p", aspectRatio: "9:16" },
    };

    const sr = await fetch("https://api.shotstack.io/edit/stage/render", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": SHOTSTACK_KEY },
      body: JSON.stringify(json),
    });
    const sd = await sr.json();
    if (!sd.success) throw new Error(sd.message || "Shotstack failed");

    return res.status(200).json({ jobId: sd.response.id, quality: qc });
  } catch (e) {
    return res.status(500).json({ error: e.message, quality: qc });
  }
};

// ============ CHECK VIDEO ============
async function checkVideo(req, res) {
  const { jobId } = req.body;
  const r = await fetch(`https://api.shotstack.io/edit/stage/render/${jobId}`, {
    headers: { "x-api-key": SHOTSTACK_KEY },
  });
  const d = await r.json();
  return res.status(200).json({
    status: d.response?.status === "done" ? "done" : "processing",
    videoUrl: d.response?.url || null,
  });
}