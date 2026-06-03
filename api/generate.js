const cheerio = require("cheerio");
const fetch = require("node-fetch");

const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { url, productName } = req.body;
  if (!url) return res.status(400).json({ error: "Missing product URL" });

  try {
    const productInfo = await scrapeProduct(url, productName);
    const launchPackage = await generatePackage(productInfo);
    const images = await generateImages(launchPackage.imagePrompts);
    launchPackage.images = images;
    return res.status(200).json(launchPackage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

async function scrapeProduct(url, productName) {
  let title = productName || "";
  let description = "";

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    title = title || $('meta[property="og:title"]').attr("content") || $("title").text() || "";
    description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "";
  } catch (e) {
    // Scraping failed, use fallback
  }

  // Fallback: extract from URL
  if (!title || title === "Unknown Product") {
    const urlParts = url.replace(/https?:\/\//, "").replace(/www\./, "").split(".")[0];
    title = productName || (urlParts.charAt(0).toUpperCase() + urlParts.slice(1));
  }
  if (!description) {
    description = `${title} is a leading platform in its industry.`;
  }

  const price = "N/A";
  return { title, description, price, url };
}

async function generatePackage(productInfo) {
  const prompt = `You are an affiliate marketing strategist. Create a launch package for this specific product: "${productInfo.title}". Description: ${productInfo.description}.

The content MUST be about "${productInfo.title}" specifically — not general marketing advice.

Return ONLY a JSON object with this exact structure:
{
  "niche": "specific niche for ${productInfo.title}",
  "targetAudience": { "demographics": "who buys ${productInfo.title}", "painPoints": ["pain1", "pain2"], "contentStyle": "style" },
  "platforms": {
    "facebook": { "handle": "@${productInfo.title.replace(/\s/g,'')}FB", "profileName": "${productInfo.title} Tips", "bio": "Best ${productInfo.title} resources. #ad", "category": "Brand" },
    "tiktok": { "handle": "@${productInfo.title.replace(/\s/g,'')}Tok", "profileName": "${productInfo.title} Shorts", "bio": "${productInfo.title} hacks & reviews. #ad", "category": "Brand" },
    "instagram": { "handle": "@${productInfo.title.replace(/\s/g,'')}IG", "profileName": "${productInfo.title} Daily", "bio": "Everything ${productInfo.title}. #ad", "category": "Brand" },
    "youtube": { "handle": "@${productInfo.title.replace(/\s/g,'')}YT", "channelName": "${productInfo.title} Reviews", "bio": "In-depth ${productInfo.title} tutorials. #ad", "category": "How-to" }
  },
  "imagePrompts": { "profilePicture": "Modern logo for ${productInfo.title}", "banner": "Clean banner for ${productInfo.title}" },
  "dailyVideoPack": [
    { "style": "Tutorial", "hook": "How to use ${productInfo.title} in 60 seconds", "script": "Step by step ${productInfo.title} tutorial...", "visuals": "Screen recording of ${productInfo.title}", "captions": "${productInfo.title} tutorial", "hashtags": "#${productInfo.title.replace(/\s/g,'')} #tutorial", "musicSuggestion": "upbeat", "duration": "30s" },
    { "style": "Review", "hook": "Is ${productInfo.title} worth it? Honest review", "script": "My experience with ${productInfo.title}...", "visuals": "${productInfo.title} interface shots", "captions": "${productInfo.title} review", "hashtags": "#${productInfo.title.replace(/\s/g,'')} #review", "musicSuggestion": "chill", "duration": "30s" },
    { "style": "Comparison", "hook": "${productInfo.title} vs competitors - who wins?", "script": "Comparing ${productInfo.title} to alternatives...", "visuals": "Split screen comparison", "captions": "${productInfo.title} vs", "hashtags": "#${productInfo.title.replace(/\s/g,'')} #comparison", "musicSuggestion": "dramatic", "duration": "30s" },
    { "style": "Promo", "hook": "Best ${productInfo.title} deal right now!", "script": "Limited time ${productInfo.title} offer...", "visuals": "Text overlays, logo", "captions": "${productInfo.title} deal", "hashtags": "#${productInfo.title.replace(/\s/g,'')} #deal", "musicSuggestion": "happy", "duration": "15s" }
  ]
}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
    body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], temperature: 0.7 }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  
  const content = data.choices[0].message.content;
  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const result = JSON.parse(jsonStr);

  // Ensure dailyVideoPack exists
  if (!result.dailyVideoPack || !Array.isArray(result.dailyVideoPack) || result.dailyVideoPack.length === 0) {
    result.dailyVideoPack = [
      { style: "Tutorial", hook: `How to use ${productInfo.title}`, script: `Step by step guide...`, visuals: "Screen recording", captions: "Tutorial", hashtags: "#tutorial", musicSuggestion: "upbeat", duration: "30s" },
      { style: "Review", hook: `${productInfo.title} review`, script: `Honest review...`, visuals: "Product shots", captions: "Review", hashtags: "#review", musicSuggestion: "chill", duration: "30s" },
      { style: "Comparison", hook: `${productInfo.title} vs others`, script: "Comparison...", visuals: "Split screen", captions: "Comparison", hashtags: "#compare", musicSuggestion: "dramatic", duration: "30s" },
      { style: "Promo", hook: `${productInfo.title} deal!`, script: "Special offer...", visuals: "Text", captions: "Deal", hashtags: "#deal", musicSuggestion: "happy", duration: "15s" },
    ];
  }

  return result;
}

async function generateImages(imagePrompts) {
  try {
    const [profileRes, bannerRes] = await Promise.all([
      fetch("https://api.openai.com/v1/images/generations", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({ model: "dall-e-3", prompt: `${imagePrompts.profilePicture} – simple clean logo, no text`, n: 1, size: "1024x1024", quality: "standard" }),
      }).then(r => r.json()),
      fetch("https://api.openai.com/v1/images/generations", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + OPENAI_KEY },
        body: JSON.stringify({ model: "dall-e-3", prompt: `${imagePrompts.banner} – wide banner, modern`, n: 1, size: "1792x1024", quality: "standard" }),
      }).then(r => r.json()),
    ]);
    return { profilePicture: profileRes.data[0].url, banner: bannerRes.data[0].url };
  } catch (e) { return null; }
}