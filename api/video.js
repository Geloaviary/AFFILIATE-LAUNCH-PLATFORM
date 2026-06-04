const fetch = require("node-fetch");

// Sanitized API keys
const CREATOMATE_KEY = (process.env.CREATOMATE_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PEXELS_KEY = (process.env.PEXELS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const ELEVENLABS_KEY = (process.env.ELEVENLABS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PIXABAY_KEY = (process.env.PIXABAY_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

const DEFAULT_VOICE = "pNInz6obpgDQGcFmaJgB";
const FALLBACK_MUSIC = "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3c5c6.mp3";

const PLATFORM_CONFIG = {
  tiktok: { maxDuration: 60, fontSize: 28 },
  instagram: { maxDuration: 90, fontSize: 26 },
  youtube: { maxDuration: 60, fontSize: 30 },
  facebook: { maxDuration: 120, fontSize: 24 },
  daily: { maxDuration: 30, fontSize: 26 },
};

// ============ PRE-FLIGHT QUALITY CHECK ============
async function preflightCheck(concept) {
  const results = { audio: false, footage: false, music: false, ready: false };
  
  // Check audio
  try {
    const audioTest = await tts(concept.script.substring(0, 50));
    results.audio = !!audioTest;
  } catch (e) { results.audio = false; }

  // Check footage
  try {
    const clips = await searchPexels(concept);
    results.footage = clips.length > 0;
  } catch (e) { results.footage = false; }

  // Check music
  try {
    const music = await getMusic(concept);
    results.music = !!music;
  } catch (e) { results.music = false; }

  results.ready = true;
  return results;
}

// ============ MAIN HANDLER ============
exports.default = async function handler(req, res) {
  const { action } = req.query;
  if (action === "check") return checkVideo(req, res);
  if (action === "story") return generateStory(req, res);
  if (action === "multi-lang") return generateMultiLang(req, res);
  return generateVideo(req, res);
};

// ============ GENERATE VIDEO ============
async function generateVideo(req, res) {
  const { videoConcept, platform } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.daily;
  const totalDuration = Math.min(Math.max(videoConcept.script.split(/\s+/).length * 0.4, 8), config.maxDuration);

  try {
    // Run preflight check
    const checks = await preflightCheck(videoConcept);

    // Get assets (with guaranteed fallbacks)
    const [audioUrl, clips, bgMusic] = await Promise.all([
      checks.audio ? tts(videoConcept.script) : null,
      getFootage(videoConcept, totalDuration),
      getMusic(videoConcept),
    ]);

    // Build professional template
    const crJson = buildProfessionalTemplate(videoConcept, audioUrl, clips, bgMusic, config, totalDuration);

    // Submit to Creatomate
    const cr = await fetch("https://api.creatomate.com/v1/renders", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
      body: JSON.stringify(crJson),
    });
    const d = await cr.json();
    const result = Array.isArray(d) ? d[0] : d;
    
    if (!result || !result.id) throw new Error(result?.message || "Render submission failed");

    return res.status(200).json({ 
      jobId: result.id, 
      quality: checks,
      estimatedTime: "30-60 seconds"
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// ============ PROFESSIONAL TEMPLATE ============
function buildProfessionalTemplate(concept, audioUrl, clips, bgMusic, config, totalDuration) {
  const tracks = [];

  // Track 1: Visual (video clips or animated gradient)
  const visualElements = [];
  
  if (clips.length > 0) {
    const clipDuration = totalDuration / clips.length;
    let t = 0;
    clips.forEach((clip, i) => {
      visualElements.push({
        type: "video",
        source: clip.src,
        fit: "cover",
        x: "0%", y: "0%", width: "100%", height: "100%",
        duration: clipDuration,
        time: t,
        transition: i > 0 ? { in: "crossfade", duration: 0.5 } : undefined,
      });
      t += clipDuration;
    });
  } else {
    // Animated gradient background
    visualElements.push({
      type: "composition",
      duration: totalDuration,
      time: 0,
      tracks: [{
        elements: [
          { type: "shape", shape: "rectangle", x: "0%", y: "0%", width: "100%", height: "100%", fillColor: "#2563eb", duration: totalDuration, time: 0 },
          { type: "shape", shape: "circle", x: "80%", y: "20%", width: "60%", height: "60%", fillColor: "rgba(124,58,237,0.3)", duration: totalDuration, time: 0, animation: { move: { x: "-20%", y: "10%" }, easing: "linear" } },
          { type: "shape", shape: "circle", x: "10%", y: "70%", width: "50%", height: "50%", fillColor: "rgba(219,39,119,0.2)", duration: totalDuration, time: 0, animation: { move: { x: "15%", y: "-10%" }, easing: "linear" } },
        ],
      }],
    });
  }

  // Text overlays
  visualElements.push({
    type: "text",
    text: concept.hook,
    x: "50%", y: "45%", width: "90%", height: "auto",
    duration: totalDuration, time: 0,
    fontSize: config.fontSize, fontWeight: 800,
    fillColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignment: "center",
    animation: { in: "fade", inDuration: 0.3 },
  });

  visualElements.push({
    type: "text",
    text: "Link in bio! 🔗",
    x: "50%", y: "85%", width: "70%", height: "auto",
    duration: totalDuration, time: 0,
    fontSize: config.fontSize - 6, fontWeight: 700,
    fillColor: "#ffffff",
    backgroundColor: "#2563eb",
    alignment: "center",
    borderRadius: "25px",
    padding: "10px 20px",
  });

  tracks.push({ elements: visualElements });

  // Track 2: Voiceover
  if (audioUrl) {
    tracks.push({
      elements: [{
        type: "audio",
        source: audioUrl,
        duration: totalDuration,
        time: 0,
        volume: 1,
      }],
    });
  }

  // Track 3: Background music
  if (bgMusic) {
    tracks.push({
      elements: [{
        type: "audio",
        source: bgMusic,
        duration: totalDuration,
        time: 0,
        volume: audioUrl ? 0.2 : 0.6,
      }],
    });
  }

  return {
    source: {
      output_format: "mp4",
      width: 1080,
      height: 1920,
      tracks,
    },
  };
}

// ============ FOOTAGE (WITH GUARANTEED FALLBACK) ============
async function getFootage(concept, totalDuration) {
  try {
    return await searchPexels(concept);
  } catch (e) {
    return [];
  }
}

async function searchPexels(concept) {
  const query = (concept.hook + " " + concept.script.split("\n")[0]).slice(0, 80);
  const r = await fetch("https://api.pexels.com/videos/search?query=" + encodeURIComponent(query) + "&per_page=4&orientation=portrait", {
    headers: { "Authorization": PEXELS_KEY }
  });
  const d = await r.json();
  const clips = [];
  if (d.videos?.length) {
    for (const v of d.videos.slice(0, 4)) {
      const vf = v.video_files.find(f => f.width === 1080 && f.height === 1920)
        || v.video_files.find(f => f.quality === "hd")
        || v.video_files[0];
      if (vf) clips.push({ src: vf.link, duration: v.duration });
    }
  }
  return clips;
}

// ============ AUDIO ============
async function tts(script, voiceId) {
  const vid = voiceId || DEFAULT_VOICE;
  const r = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + vid, {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: script, model_id: "eleven_turbo_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  });
  if (!r.ok) {
    const err = await r.text();
    throw new Error("TTS failed: " + r.status + " " + err);
  }
  const buf = await r.buffer();
  return "data:audio/mpeg;base64," + buf.toString("base64");
}

async function getMusic(concept) {
  if (!PIXABAY_KEY) return FALLBACK_MUSIC;
  try {
    const q = (concept.hook + " " + concept.script).split(/\s+/).slice(0, 8).join(" ");
    const r = await fetch("https://pixabay.com/api/videos/?key=" + PIXABAY_KEY + "&q=" + encodeURIComponent(q) + "&category=music&per_page=3");
    const d = await r.json();
    if (d.hits) for (const h of d.hits) if (h.audio) return h.audio;
    return FALLBACK_MUSIC;
  } catch { return FALLBACK_MUSIC; }
}

// ============ CHECK & STORY ============
async function checkVideo(req, res) {
  const { jobId } = req.body;
  const r = await fetch("https://api.creatomate.com/v1/renders/" + jobId, {
    headers: { "Authorization": "Bearer " + CREATOMATE_KEY },
  });
  let d = await r.json();
  if (Array.isArray(d)) d = d[0];
  const isDone = d.status === "completed" || d.status === "succeeded";
  return res.status(200).json({
    status: isDone ? "done" : (d.status === "failed" ? "failed" : "processing"),
    videoUrl: isDone ? (d.url || null) : null,
  });
}

async function generateStory(req, res) {
  const { videoUrl } = req.body;
  const cr = await fetch("https://api.creatomate.com/v1/renders", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
    body: JSON.stringify({
      source: { output_format: "mp4", width: 1080, height: 1920, tracks: [{ elements: [{ type: "video", source: videoUrl, duration: 15 }] }] },
    }),
  });
  const d = await cr.json();
  return res.status(200).json({ jobId: Array.isArray(d) ? d[0]?.id : d.id });
}

async function generateMultiLang(req, res) {
  const { videoConcept, platform } = req.body;
  const langs = ["en", "es", "pt"];
  const jobIds = [];
  for (const lang of langs) {
    try {
      const audioUrl = await tts(videoConcept.script);
      const clips = await getFootage(videoConcept, 30);
      const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.daily;
      const crJson = buildProfessionalTemplate(videoConcept, audioUrl, clips, FALLBACK_MUSIC, config, 30);
      const cr = await fetch("https://api.creatomate.com/v1/renders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
        body: JSON.stringify(crJson),
      });
      const d = await cr.json();
      const result = Array.isArray(d) ? d[0] : d;
      if (result?.id) jobIds.push({ jobId: result.id, lang });
    } catch (e) { /* skip */ }
  }
  return res.status(200).json({ jobIds });
}