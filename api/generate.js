const cheerio = require("cheerio");
const fetch = require("node-fetch");
const { kv } = require("@vercel/kv");
const { enrichScenes } =
require("../lib/media/enrich-scenes");
const {
  inferNiche
} = require(
  "../lib/media/niche-inference"
);

const OPENAI_KEY = (process.env.OPENAI_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

// ============ INTELLIGENCE DATABASE ============
const KNOWN_PRODUCTS = {
  "nordvpn.com": { name: "NordVPN", niche: "Cybersecurity / VPN", desc: "World's leading VPN service for privacy and security" },
  "expressvpn.com": { name: "ExpressVPN", niche: "Cybersecurity / VPN", desc: "Premium VPN with blazing-fast speeds" },
  "hostgator.com": { name: "HostGator", niche: "Web Hosting", desc: "Affordable web hosting for businesses of all sizes" },
  "bluehost.com": { name: "Bluehost", niche: "Web Hosting", desc: "Official WordPress recommended hosting provider" },
  "siteground.com": { name: "SiteGround", niche: "Web Hosting", desc: "High-performance web hosting with top support" },
  "a2hosting.com": { name: "A2 Hosting", niche: "Web Hosting", desc: "Fast and reliable hosting solutions" },
  "wix.com": { name: "Wix", niche: "Website Builders", desc: "Drag-and-drop website builder for everyone" },
  "squarespace.com": { name: "Squarespace", niche: "Website Builders", desc: "Beautiful websites made simple" },
  "clickfunnels.com": { name: "ClickFunnels", niche: "Sales Funnels / SaaS", desc: "Build marketing funnels that convert" },
  "shopify.com": { name: "Shopify", niche: "E-commerce", desc: "All-in-one e-commerce platform" },
  "getresponse.com": { name: "GetResponse", niche: "Email Marketing", desc: "Email marketing and automation platform" },
  "convertkit.com": {
  name: "ConvertKit",
  niche: "Email Marketing",
  desc: "Email marketing for creators",
  keywords: [
    "email marketing",
    "newsletter",
    "creator business",
    "email automation"
  ]
},
};

const BLOCKED_PATTERNS = [
  "just a moment", "cloudflare", "attention required", "access denied",
  "captcha", "are you a robot", "please verify", "ddos protection", "blocked"
];

const NICHES = {
  "vpn": "Cybersecurity / VPN", "host": "Web Hosting", "builder": "Website Builders",
  "email": "Email Marketing", "security": "Cybersecurity", "ai": "AI Tools",
  "course": "Online Education", "fitness": "Health & Fitness", "finance": "Finance",
  "crypto": "Cryptocurrency", "shopify": "E-commerce", "funnel": "Sales Funnels / SaaS",
  "wordpress": "Web Hosting", "cloud": "Cloud Services", "seo": "SEO Tools"
};

// ============ MAIN HANDLER ============
exports.default = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  const { url, productName } = req.body;
  if (!url) return res.status(400).json({ error: "Missing product URL" });

  try {
    const productInfo = await smartScrape(url, productName);
    const launchPackage = await generatePackage(productInfo);
    const images = await generateImages(launchPackage.imagePrompts);
    launchPackage.images = images;
    return res.status(200).json(launchPackage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ============ 5-LAYER SMART SCRAPER ============
async function smartScrape(url, productName) {
  const domain = url.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
  const domainClean = domain.replace(/^www\./, "");

  // Layer 1: Known products database
  for (const [key, product] of Object.entries(KNOWN_PRODUCTS)) {
    if (domainClean.includes(key) || key.includes(domainClean)) {
      await kv.set(`product:${domainClean}`, { ...product, url, lastUsed: new Date().toISOString() });
      return {
        title: productName || product.name,
        description: product.desc,
        url,
        niche: product.niche,
        keywords: product.keywords || []
      };
    }
  }

  // Layer 2: KV memory cache
  try {
    const cached = await kv.get(`product:${domainClean}`);
    if (cached && cached.title && cached.title !== "Unknown Product") {
      return { title: productName || cached.title, description: cached.description || cached.desc, url, niche: cached.niche };
    }
  } catch (e) { /* KV might not be ready */ }

  // Layer 3: Web scraping
  let title = productName || "";
  let description = "";
  let niche = "";

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" },
    
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    title = title ||
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      "";

    description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    // Clean title
    title = title.replace(/\s*[-–|].*$/, "").replace(/\s*\|.*$/, "").trim();

    // Layer 4: Validation
    const isBlocked = BLOCKED_PATTERNS.some(p => title.toLowerCase().includes(p));
    if (isBlocked || !title || title.length < 2 || title === "Home") {
      throw new Error("Blocked or invalid");
    }

    // Detect niche from title
    niche = detectNiche(title);

  } catch (e) {
    // Layer 5: Ultimate fallback
    title = productName || domainClean.split(".")[0];
    title = title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, " ");
    description = `${title} is a leading platform in its industry.`;
    niche = detectNiche(title);
  }

  // Save to KV memory
  let keywords = [];

try {

  const inferred =
    await inferNiche({
      brand: title,
      url,
      title,
      description
    });

  keywords =
    inferred.keywords || [];

  if (
    inferred.niche &&
    niche === "Software & Tools"
  ) {
    niche =
      inferred.niche;
  }

} catch (e) {
  console.error(
    "Niche inference failed:",
    e.message
  );
}

const result = {
  title,
  description,
  url,
  niche,
  keywords
};
  try { await kv.set(`product:${domainClean}`, { ...result, lastUsed: new Date().toISOString() }); } catch (e) {}
  return result;
}

function detectNiche(productName) {
  const lower = productName.toLowerCase();
  for (const [key, niche] of Object.entries(NICHES)) {
    if (lower.includes(key)) return niche;
  }
  return "Software & Tools";
}

// ============ AI PACKAGE GENERATOR ============
async function generatePackage(productInfo) {
  console.log(
  "PRODUCT INFO:",
  JSON.stringify(productInfo, null, 2)
);
  console.log(
  "PRODUCT KEYWORDS:",
  productInfo.keywords
);
  const prompt = `You are an affiliate marketing strategist. Create a launch package for "${productInfo.title}". It is a ${productInfo.niche || 'software'} product. Description: ${productInfo.description}.

Return ONLY a JSON object:
{
  "niche": "${productInfo.niche || 'Technology'}",
  "targetAudience": { "demographics": "who buys ${productInfo.title}", "painPoints": ["pain1", "pain2"], "contentStyle": "style" },
  "platforms": {
    "facebook": { "handle": "@${productInfo.title.replace(/[^a-zA-Z0-9]/g,'')}FB", "profileName": "${productInfo.title} Tips", "bio": "Best ${productInfo.title} resources. #ad", "category": "Brand" },
    "tiktok": { "handle": "@${productInfo.title.replace(/[^a-zA-Z0-9]/g,'')}Tok", "profileName": "${productInfo.title}", "bio": "${productInfo.title} reviews & tips. #ad", "category": "Brand" },
    "instagram": { "handle": "@${productInfo.title.replace(/[^a-zA-Z0-9]/g,'')}IG", "profileName": "${productInfo.title} Daily", "bio": "Everything ${productInfo.title}. #ad", "category": "Brand" },
    "youtube": { "handle": "@${productInfo.title.replace(/[^a-zA-Z0-9]/g,'')}YT", "channelName": "${productInfo.title} Reviews", "bio": "In-depth ${productInfo.title} tutorials. #ad", "category": "How-to" }
  },
  "imagePrompts": { "profilePicture": "Modern logo for ${productInfo.title}", "banner": "Clean banner for ${productInfo.title} advertising" },
  "dailyVideoPack": [
  {
    "style": "Tutorial",
    "hook": "How to use ${productInfo.title} in 60 seconds",
    "script": [
      {
        "voice": "Need a website fast?",
        "keywords": ["website","business","laptop"]
      },
      {
        "voice": "${productInfo.title} makes setup simple.",
        "keywords": ["dashboard","software"]
      },
      {
        "voice": "You get powerful features and support included.",
        "keywords": ["support","technology"]
      },
      {
        "voice": "Start today using the link below.",
        "keywords": ["success","business"]
      }
    ],
    "cta": "Start today",
    "captions": "${productInfo.title} tutorial",
    "hashtags": "#${productInfo.title.replace(/[^a-zA-Z0-9]/g,'')} #tutorial #howto",
    "musicSuggestion": "upbeat",
    "duration": "30s"
  },
    {
  "style": "Review",
  "hook": "Is ${productInfo.title} worth it? Honest review",
  "script": [
    {
      "voice": "I tested ${productInfo.title} so you don't have to.",
      "keywords": ["review","software"]
    },
    {
      "voice": "Here's what impressed me most.",
      "keywords": ["features","technology"]
    },
    {
      "voice": "There are a few downsides too.",
      "keywords": ["comparison","review"]
    },
    {
      "voice": "Overall, it's worth considering.",
      "keywords": ["business","success"]
    }
  ],
  "cta": "Check it out today",
  "captions": "${productInfo.title} review",
  "hashtags": "#review #software #tech",
  "musicSuggestion": "chill",
  "duration": "30s"
}
    {
  "style": "Comparison",
  "hook": "${productInfo.title} vs competitors",
  "script": [
    {
      "voice": "Which option is actually better?",
      "keywords": ["comparison","business"]
    },
    {
      "voice": "${productInfo.title} stands out for ease of use.",
      "keywords": ["dashboard","software"]
    },
    {
      "voice": "Competitors may offer different features.",
      "keywords": ["technology","comparison"]
    },
    {
      "voice": "Choose what fits your needs best.",
      "keywords": ["business","success"]
    }
  ],
  "cta": "Compare before you buy",
  "captions": "${productInfo.title} comparison",
  "hashtags": "#comparison #vs #software",
  "musicSuggestion": "dramatic",
  "duration": "30s"
}
    {
  "style": "Promo",
  "hook": "Best ${productInfo.title} deal right now",
  "script": [
    {
      "voice": "Looking for the best deal?",
      "keywords": ["deal","discount"]
    },
    {
      "voice": "${productInfo.title} is currently offering great value.",
      "keywords": ["offer","technology"]
    },
    {
      "voice": "Don't miss out on this opportunity.",
      "keywords": ["success","business"]
    },
    {
      "voice": "Grab it before the offer ends.",
      "keywords": ["deal","call to action"]
    }
  ],
  "cta": "Claim your deal today",
  "captions": "${productInfo.title} deal",
  "hashtags": "#deal #discount #offer",
  "musicSuggestion": "happy",
  "duration": "15s"
}
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

  if (result.dailyVideoPack) {

  for (const video of result.dailyVideoPack) {

    try {
      video.script =
        await enrichScenes(
          video.script || []
        );
    } catch (e) {
      console.error(
        "Scene enrichment failed:",
        e.message
      );
    }

  }

}

  // Safety net: ensure dailyVideoPack
  if (!result.dailyVideoPack || result.dailyVideoPack.length === 0) {
result.dailyVideoPack = [
{
style: "Tutorial",
hook: `How to use ${productInfo.title}`,
script: [
{
voice: "Need a website fast?",
keywords: ["website", "business"]
},
{
voice: `${productInfo.title} makes setup easy.`,
keywords: ["technology", "dashboard"]
},
{
voice: "Get started in minutes.",
keywords: ["success"]
},
{
voice: "Click the link below.",
keywords: ["call to action"]
}
],
cta: "Start today",
captions: "Tutorial",
hashtags: "#tutorial",
musicSuggestion: "upbeat",
duration: "30s"
}
];
}

return result;
}


// ============ IMAGE GENERATOR ============
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