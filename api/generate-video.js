const fetch = require("node-fetch");

const CREATOMATE_API_KEY = process.env.CREATOMATE_API_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const VOICE_ID = "pNInz6obpgDQGcFmaJgB";
const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech/" + VOICE_ID;
const FALLBACK_MUSIC = "https://cdn.pixabay.com/audio/2022/10/25/audio_946bc3c5c6.mp3";

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { videoConcept, platform, useTrending } = req.body;
  if (!videoConcept) return res.status(400).json({ error: "Missing videoConcept" });

  try {
    if (useTrending) {
      try {
        const tr = await fetch((process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : "") + "/api/get-trending", {
          method: "POST", body: JSON.stringify({ platform }), headers: { "Content-Type": "application/json" }
        });
        const td = await tr.json();
        if (td.sound) videoConcept.musicSuggestion = td.sound;
        if (td.hashtag) videoConcept.hashtags = (videoConcept.hashtags || "") + " " + td.hashtag;
      } catch {}
    }

    const audioUrl = await generateVoiceover(videoConcept.script);
    const clips = await getVideoClips(videoConcept);
    const bgMusic = await getBackgroundMusic(videoConcept);
    const creatomateJson = buildCreatomateEdit(videoConcept, audioUrl, clips, bgMusic);

    const cr = await fetch("https://api.creatomate.com/v1/renders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + CREATOMATE_API_KEY },
      body: JSON.stringify(creatomateJson),
    });
    const crData = await cr.json();
    if (!crData.id) throw new Error(crData.message || "Creatomate render failed");

    return res.status(200).json({ jobId: crData.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

async function generateVoiceover(script) {
  const r = await fetch(ELEVENLABS_URL, {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: script, model_id: "eleven_turbo_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75 } }),
  });
  if (!r.ok) throw new Error("TTS failed: " + r.status);
  const buf = await r.buffer();
  return "data:audio/mpeg;base64," + buf.toString("base64");
}

async function getBackgroundMusic(concept) {
  if (!PIXABAY_API_KEY) return FALLBACK_MUSIC;
  try {
    const q = (concept.hook + " " + concept.script).split(/\s+/).slice(0, 10).join(" ");
    const r = await fetch("https://pixabay.com/api/videos/?key=" + PIXABAY_API_KEY + "&q=" + encodeURIComponent(q) + "&category=music&per_page=5");
    const d = await r.json();
    if (d.hits) for (const h of d.hits) if (h.audio) return h.audio;
    return FALLBACK_MUSIC;
  } catch { return FALLBACK_MUSIC; }
}

async function searchPexelsVideos(query) {
  const r = await fetch("https://api.pexels.com/videos/search?query=" + encodeURIComponent(query) + "&per_page=5", {
    headers: { Authorization: PEXELS_API_KEY }
  });
  const d = await r.json();
  if (!d.videos?.length) return null;
  const clips = [];
  for (const v of d.videos) {
    const vf = v.video_files.find(f => f.width === 1080 && f.height === 1920) || v.video_files.find(f => f.quality === "hd") || v.video_files[0];
    if (vf) clips.push({ src: vf.link, duration: v.duration });
  }
  return clips.slice(0, 4);
}

async function getVideoClips(concept) {
  const query = (concept.hook + " " + concept.script.split("\n")[0]).slice(0, 100);
  const clips = await searchPexelsVideos(query);
  if (clips?.length) return clips;
  // Fallback DALL-E
  const { Configuration, OpenAIApi } = require("openai");
  const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));
  const img = await openai.createImage({ prompt: "Vertical phone wallpaper: " + concept.hook + ", modern style, no text", n: 1, size: "1024x1792" });
  return [{ src: img.data.data[0].url, duration: 8, isImage: true }];
}

function buildCreatomateEdit(concept, audioUrl, clips, bgMusic) {
  const totalDuration = Math.max(concept.script.split(/\s+/).length * 0.4, 8);
  const elements = [];
  const clipDuration = totalDuration / clips.length;
  let timeCursor = 0;

  clips.forEach(clip => {
    elements.push({
      type: clip.isImage ? "image" : "video",
      source: clip.src,
      fit: "crop",
      x: 0, y: 0, width: 100, height: 100,
      duration: clipDuration,
      time: timeCursor,
    });
    timeCursor += clipDuration;
  });

  elements.push({
    type: "text",
    text: concept.hook,
    x: 50, y: 50, width: 90, height: 20,
    duration: 3, time: 0,
    fontSize: 22, fontWeight: 700,
    fillColor: "#ffffff", backgroundColor: "rgba(0,0,0,0.6)",
    alignment: "center",
  });

  elements.push({
    type: "text",
    text: "Link in bio!",
    x: 50, y: 90, width: 80, height: 15,
    duration: 3, time: totalDuration - 3,
    fontSize: 20, fontWeight: 700,
    fillColor: "#ffffff", backgroundColor: "#2563eb",
    alignment: "center",
  });

  return {
    source: { output_format: "mp4", width: 1080, height: 1920, elements },
    options: { audio_track: { source: audioUrl, volume: 1 }, background_music: { source: bgMusic, volume: 0.25 } },
  };
}