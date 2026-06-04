const fetch = require("node-fetch");
const { kv } = require("@vercel/kv");

const CREATOMATE_KEY = (process.env.CREATOMATE_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PEXELS_KEY = (process.env.PEXELS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const ELEVENLABS_KEY = (process.env.ELEVENLABS_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const PIXABAY_KEY = (process.env.PIXABAY_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();
const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

const DEFAULT_VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const CUSTOM_VOICE_ID = process.env.CUSTOM_VOICE_ID || DEFAULT_VOICE_ID;
const FALLBACK_MUSIC = "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3c5c6.mp3";

// Language + Voice mapping
const LANGUAGES = {
  en: { name: "English", voice: CUSTOM_VOICE_ID },
  es: { name: "Spanish", voice: "pNInz6obpgDQGcFmaJgB" },
  pt: { name: "Portuguese", voice: "pNInz6obpgDQGcFmaJgB" },
  fr: { name: "French", voice: "pNInz6obpgDQGcFmaJgB" },
  de: { name: "German", voice: "pNInz6obpgDQGcFmaJgB" },
};

const PLATFORM_CONFIG = {
  tiktok: { maxDuration: 60, fontSize: 26, hashtags: "#fyp #viral" },
  instagram: { maxDuration: 90, fontSize: 24, hashtags: "#reels #explore" },
  youtube: { maxDuration: 60, fontSize: 28, hashtags: "#shorts" },
  facebook: { maxDuration: 120, fontSize: 22, hashtags: "#viral" },
  daily: { maxDuration: 30, fontSize: 24, hashtags: "#viral" },
};

exports.default = async function handler(req, res) {
  const { action } = req.query;
  if (action === "check") return checkVideo(req, res);
  if (action === "story") return generateStory(req, res);
  if (action === "multi-lang") return generateMultiLang(req, res);
  if (action === "schedule") return scheduleVideo(req, res);
  return generateVideo(req, res);
};

// ============ GENERATE VIDEO ============
async function generateVideo(req, res) {
  const { videoConcept, platform, useTrending, lang } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  const language = LANGUAGES[lang] || LANGUAGES.en;
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.daily;

  try {
    if (useTrending) {
      try {
        const tr = await fetch((process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "") + "/api/utils?action=trending", {
          method: "POST", body: JSON.stringify({ platform }), headers: { "Content-Type": "application/json" }
        });
        const td = await tr.json();
        if (td.sound) videoConcept.musicSuggestion = td.sound;
        if (td.hashtag) videoConcept.hashtags = (videoConcept.hashtags || "") + " " + td.hashtag;
      } catch {}
    }

    videoConcept.hashtags = (videoConcept.hashtags || "") + " " + config.hashtags;

    const audioUrl = await tts(videoConcept.script, language.voice);
    const clips = await getClips(videoConcept);
    const bgMusic = await getMusic(videoConcept);
    const crJson = buildEdit(videoConcept, audioUrl, clips, bgMusic, config);

    const cr = await fetch("https://api.creatomate.com/v1/renders", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
  body: JSON.stringify(crJson),
});
   let d = await cr.json();
console.error("CREATOMATE RESPONSE:", JSON.stringify(d));
// Handle array response
if (Array.isArray(d)) d = d[0];
if (!d.id) throw new Error(d.message || JSON.stringify(d) || "Render failed");
    return res.status(200).json({ jobId: d.id, lang: lang || "en" });
  } catch (e) {
  console.error("VIDEO ERROR:", e.message, e.stack);
  return res.status(500).json({ error: e.message, stack: e.stack });
}
}

// ============ MULTI-LANGUAGE GENERATOR ============
async function generateMultiLang(req, res) {
  const { videoConcept, platform } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  const jobIds = [];
  const langs = ["en", "es", "pt", "fr"];

  for (const lang of langs) {
    try {
      const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.daily;
      const language = LANGUAGES[lang];
      const audioUrl = await tts(videoConcept.script, language.voice);
      const clips = await getClips(videoConcept);
      const bgMusic = await getMusic(videoConcept);
      const crJson = buildEdit(videoConcept, audioUrl, clips, bgMusic, config);

      const cr = await fetch("https://api.creatomate.com/v1/renders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
        body: JSON.stringify(crJson),
      });
      const d = await cr.json();
      if (d.id) jobIds.push({ jobId: d.id, lang });
    } catch (e) { /* skip failed language */ }
  }

  return res.status(200).json({ jobIds });
}

// ============ SCHEDULE VIDEO ============
async function scheduleVideo(req, res) {
  const { jobId, scheduleDate } = req.body;
  await kv.set(`scheduled:${jobId}`, { scheduleDate, createdAt: new Date().toISOString() });
  return res.status(200).json({ success: true, scheduled: scheduleDate });
}

// ============ CHECK + STORY ============
async function checkVideo(req, res) {
  const { jobId } = req.body;
  const r = await fetch("https://api.creatomate.com/v1/renders/" + jobId, {
    headers: { "Authorization": "Bearer " + CREATOMATE_KEY },
  });
  let d = await r.json();
  if (Array.isArray(d)) d = d[0];
  // Only return URL when fully completed
  const isDone = d.status === "completed" || d.status === "succeeded";
  return res.status(200).json({ 
    status: isDone ? "done" : (d.status === "failed" ? "failed" : "processing"), 
    videoUrl: isDone ? (d.url || null) : null 
  });
}

async function generateStory(req, res) {
  const { videoUrl } = req.body;
  const cr = await fetch("https://api.creatomate.com/v1/renders", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + CREATOMATE_KEY },
    body: JSON.stringify({ source: { output_format: "mp4", width: 1080, height: 1920, elements: [{ type: "video", source: videoUrl, duration: 15 }] } }),
  });
  const d = await cr.json();
  return res.status(200).json({ jobId: d.id });
}

// ============ HELPERS ============
async function tts(script, voiceId) {
  const vid = voiceId || CUSTOM_VOICE_ID;
  const r = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + vid, {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: script, model_id: "eleven_turbo_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  });
  if (!r.ok) throw new Error("TTS failed: " + r.status);
  const buf = await r.buffer();
  return "data:audio/mpeg;base64," + buf.toString("base64");
}

async function getMusic(concept) {
  if (!PIXABAY_KEY) return FALLBACK_MUSIC;
  try {
    const q = (concept.hook + " " + concept.script).split(/\s+/).slice(0, 10).join(" ");
    const r = await fetch("https://pixabay.com/api/videos/?key=" + PIXABAY_KEY + "&q=" + encodeURIComponent(q) + "&category=music&per_page=5");
    const d = await r.json();
    if (d.hits) for (const h of d.hits) if (h.audio) return h.audio;
    return FALLBACK_MUSIC;
  } catch { return FALLBACK_MUSIC; }
}

async function getClips(concept) {
  const query = (concept.hook + " " + concept.script.split("\n")[0]).slice(0, 100);
  const r = await fetch("https://api.pexels.com/videos/search?query=" + encodeURIComponent(query) + "&per_page=5", {
    headers: { "Authorization": PEXELS_KEY }
  });
  const d = await r.json();
  if (d.videos?.length) {
    const clips = [];
    for (const v of d.videos) {
      const vf = v.video_files.find(f => f.width === 1080 && f.height === 1920) || v.video_files.find(f => f.quality === "hd") || v.video_files[0];
      if (vf) clips.push({ src: vf.link, duration: v.duration });
    }
    return clips.slice(0, 4);
  }
  const imgR = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
    body: JSON.stringify({ model: "dall-e-3", prompt: "Vertical phone wallpaper: " + concept.hook + ", modern, no text", n: 1, size: "1024x1792" }),
  }).then(r => r.json());
  return [{ src: imgR.data?.[0]?.url || "", duration: 8, isImage: true }];
}

function buildEdit(concept, audioUrl, clips, bgMusic, config) {
  const totalDuration = Math.min(Math.max(concept.script.split(/\s+/).length * 0.4, 8), config.maxDuration);
  const elements = [];
  const clipDuration = totalDuration / clips.length;
  let t = 0;

  clips.forEach(c => {
    elements.push({
      type: c.isImage ? "image" : "video",
      source: c.src,
      fit: "cover",
      x: "0%",
      y: "0%",
      width: "100%",
      height: "100%",
      duration: clipDuration,
      time: t,
    });
    t += clipDuration;
  });

  // Hook text overlay
  elements.push({
    type: "text",
    text: concept.hook,
    x: "50%",
    y: "40%",
    width: "90%",
    height: "auto",
    duration: totalDuration,
    time: 0,
    fontSize: config.fontSize,
    fontWeight: 700,
    fillColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    alignment: "center",
    animation: {
      in: "fade",
      out: "fade",
      duration: 0.5,
    },
  });

  // CTA
  elements.push({
    type: "text",
    text: "Link in bio!",
    x: "50%",
    y: "85%",
    width: "80%",
    height: "auto",
    duration: totalDuration,
    time: 0,
    fontSize: config.fontSize - 4,
    fontWeight: 700,
    fillColor: "#ffffff",
    backgroundColor: "#2563eb",
    alignment: "center",
  });

  // Build track with audio
  const tracks = [{ elements }];
  
  // Add audio track if available
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

  // Add background music
  if (bgMusic) {
    tracks.push({
      elements: [{
        type: "audio",
        source: bgMusic,
        duration: totalDuration,
        time: 0,
        volume: 0.4,
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