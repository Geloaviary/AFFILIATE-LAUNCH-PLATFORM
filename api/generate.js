const cheerio = require("cheerio");
const fetch = require("node-fetch");

const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing product URL" });

  try {
    const productInfo = await scrapeProduct(url);
    const launchPackage = await generatePackage(productInfo);
    const images = await generateImages(launchPackage.imagePrompts);
    launchPackage.images = images;
    return res.status(200).json(launchPackage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

async function scrapeProduct(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $('meta[property="og:title"]').attr("content") || $("title").text() || "Unknown Product";
  const description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "No description";
  const price = $('[class*="price"]').first().text().trim() || "N/A";
  return { title, description, price, url };
}

async function generatePackage(productInfo) {
  const prompt = `You are an affiliate marketing strategist. Create a launch package for: ${productInfo.title}. Description: ${productInfo.description}. Price: ${productInfo.price}.

Return ONLY a JSON object (no markdown, no backticks) with this exact structure:
{
  "niche": "string",
  "targetAudience": {
    "demographics": "string",
    "painPoints": ["string", "string"],
    "contentStyle": "string"
  },
  "platforms": {
    "facebook": { "handle": "string", "profileName": "string", "bio": "string", "category": "string" },
    "tiktok": { "handle": "string", "profileName": "string", "bio": "string", "category": "string" },
    "instagram": { "handle": "string", "profileName": "string", "bio": "string", "category": "string" },
    "youtube": { "handle": "string", "channelName": "string", "bio": "string", "category": "string" }
  },
  "imagePrompts": {
    "profilePicture": "DALL-E prompt for logo",
    "banner": "DALL-E prompt for banner"
  },
  "dailyVideoPack": [
    { "style": "Tutorial", "hook": "string", "script": "string", "visuals": "string", "captions": "string", "hashtags": "string", "musicSuggestion": "string", "duration": "string" },
    { "style": "Review", "hook": "string", "script": "string", "visuals": "string", "captions": "string", "hashtags": "string", "musicSuggestion": "string", "duration": "string" },
    { "style": "Comparison", "hook": "string", "script": "string", "visuals": "string", "captions": "string", "hashtags": "string", "musicSuggestion": "string", "duration": "string" },
    { "style": "Promotional", "hook": "string", "script": "string", "visuals": "string", "captions": "string", "hashtags": "string", "musicSuggestion": "string", "duration": "string" }
  ]
}

dailyVideoPack MUST contain exactly 4 videos. Do not skip it.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + OPENAI_KEY,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  const content = data.choices[0].message.content;
  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const result = JSON.parse(jsonStr);

  // Fallback if dailyVideoPack is missing
  if (!result.dailyVideoPack || !Array.isArray(result.dailyVideoPack) || result.dailyVideoPack.length === 0) {
    result.dailyVideoPack = [
      { style: "Tutorial", hook: `How to use ${productInfo.title}`, script: `Step by step guide to ${productInfo.title}...`, visuals: "Screen recording", captions: "Easy tutorial", hashtags: "#tutorial #howto", musicSuggestion: "upbeat", duration: "30s" },
      { style: "Review", hook: `Is ${productInfo.title} worth it?`, script: `Honest review of ${productInfo.title}...`, visuals: "Product shots", captions: "Full review", hashtags: "#review #honest", musicSuggestion: "chill", duration: "30s" },
      { style: "Comparison", hook: `${productInfo.title} vs competitors`, script: "See the difference...", visuals: "Split screen", captions: "Comparison", hashtags: "#compare #best", musicSuggestion: "dramatic", duration: "30s" },
      { style: "Promo", hook: `Exclusive ${productInfo.title} deal!`, script: "Limited time offer...", visuals: "Text overlays", captions: "Special offer", hashtags: "#deal #discount", musicSuggestion: "happy", duration: "15s" },
    ];
  }

  return result;
}

async function generateImages(imagePrompts) {
  try {
    const [profileRes, bannerRes] = await Promise.all([
      fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({ model: "dall-e-3", prompt: `${imagePrompts.profilePicture} – simple clean logo, no text`, n: 1, size: "1024x1024", quality: "standard" }),
      }).then(r => r.json()),
      fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({ model: "dall-e-3", prompt: `${imagePrompts.banner} – wide banner, modern`, n: 1, size: "1792x1024", quality: "standard" }),
      }).then(r => r.json()),
    ]);
    return { profilePicture: profileRes.data[0].url, banner: bannerRes.data[0].url };
  } catch (e) { return null; }
}