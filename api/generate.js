const { Configuration, OpenAIApi } = require("openai");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing product URL" });

  try {
    const productInfo = await scrapeProduct(url);
    const launchPackage = await generateLaunchPackage(productInfo);
    const images = await generateImages(launchPackage.imagePrompts);
    launchPackage.images = images;
    return res.status(200).json(launchPackage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

async function scrapeProduct(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  const html = await response.text();
  const $ = cheerio.load(html);
  const title = $('meta[property="og:title"]').attr("content") || $("title").text() || "Unknown Product";
  const description = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content") || "No description";
  const price = $('[class*="price"]').first().text().trim() || "N/A";
  return { title, description, price, url };
}

async function generateLaunchPackage(productInfo) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);

  const prompt = `You are an affiliate marketing strategist. Create a launch package for this product:\nTitle: ${productInfo.title}\nDescription: ${productInfo.description}\nPrice: ${productInfo.price}\n\nReturn JSON with: niche, targetAudience {demographics, painPoints, contentStyle}, platforms {facebook, tiktok, instagram, youtube} each with handle, profileName, bio, category, imagePrompts {profilePicture, banner}, dailyVideoPack array of 4 objects with style, hook, script, visuals, captions, hashtags, musicSuggestion, duration.`;

  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = completion.data.choices[0].message.content;
  const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(jsonStr);
}

async function generateImages(imagePrompts) {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);
  try {
    const [profileRes, bannerRes] = await Promise.all([
      openai.createImage({ prompt: `${imagePrompts.profilePicture} – simple clean logo, no text`, n: 1, size: "1024x1024" }),
      openai.createImage({ prompt: `${imagePrompts.banner} – wide banner, modern`, n: 1, size: "1792x1024" }),
    ]);
    return { profilePicture: profileRes.data.data[0].url, banner: bannerRes.data.data[0].url };
  } catch (e) { return null; }
}