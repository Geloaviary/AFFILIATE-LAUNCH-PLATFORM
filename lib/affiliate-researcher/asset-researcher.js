const cheerio = require("cheerio");
const fetch = require("node-fetch");

function classifyAssets(
  urls = []
) {

  const screenshots = [];

  const logos = [];

  const icons = [];

  const renderableAssets = [];

  for (
    const url of urls
  ) {

    const lower =
      String(url)
        .toLowerCase();

    const isSvg =
      lower.endsWith(".svg");

    const isRenderable =
      /\.(png|jpg|jpeg|webp)$/i
        .test(lower);

    if (
      lower.includes("logo")
    ) {

      logos.push(url);

      continue;

    }

    if (
      isSvg
    ) {

      icons.push(url);

      continue;

    }

    if (
      isRenderable
    ) {

      screenshots.push(url);

      renderableAssets.push(
        url
      );

    }

  }

  return {

    screenshots,

    logos,

    icons,

    renderableAssets

  };

}

async function researchAssets(
  product = {}
) {

  const url =
    product.productUrl;

  if (!url) {

  return {

    websiteImages: [],
    websiteVideos: [],

    logos: [],
    screenshots: [],

    brandAssets: [],

    themeColor: null,

    ogTitle: null,

    ogDescription: null,

    fallbackKeywords: []

  };

}

  try {

    const response =
      await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0"
        }
      });

    const html =
      await response.text();

    const $ =
      cheerio.load(html);

    const themeColor =
      $('meta[name="theme-color"]')
         .attr("content");

    const ogTitle =
      $('meta[property="og:title"]')
          .attr("content");

    const ogDescription =
      $('meta[property="og:description"]')
          .attr("content");

    const websiteImages = [];

    $("img").each(
      (_, el) => {

        const src =
          $(el).attr("src");

        if (
          src &&
          src.length > 10
        ) {

          websiteImages.push(
            normalizeUrl(
              src,
              url
            )
          );

        }

      }
    );

    const ogImage =
  $('meta[property="og:image"]')
    .attr("content");

if (ogImage) {

  websiteImages.push(
    normalizeUrl(
      ogImage,
      url
    )
  );

}

    const websiteVideos = [];

    $("video source").each(
      (_, el) => {

        const src =
          $(el).attr("src");

        if (src) {

          websiteVideos.push(
            normalizeUrl(
              src,
              url
            )
          );

        }

      }
    );

    const classified =
  classifyAssets(
    websiteImages
  );

const logos =
  classified.logos;

const screenshots =
  classified.screenshots;

const icons =
  classified.icons;

const renderableAssets =
  classified.renderableAssets;

const brandAssets = [

  ...logos,
  ...screenshots

];

    return {

  websiteImages:
    dedupe(
      websiteImages
    ).slice(0, 50),

  websiteVideos:
    dedupe(
      websiteVideos
    ).slice(0, 20),

  logos:
    dedupe(
      logos
    ).slice(0, 10),

  screenshots:
    dedupe(
      screenshots
    ).slice(0, 20),

    icons:
    dedupe(
      icons
    ).slice(0, 20),

  renderableAssets:
    dedupe(
      renderableAssets
    ).slice(0, 50),

  brandAssets:
    dedupe(
      brandAssets
    ).slice(0, 30),

  themeColor:
    themeColor || null,

  ogTitle:
    ogTitle || null,

  ogDescription:
    ogDescription || null,

  fallbackKeywords: [
    product.name,
    product.businessType,
    "software",
    "dashboard"
  ].filter(Boolean)

};

  } catch (e) {

    console.error(
      "Asset Researcher failed:",
      e.message
    );

    return {
      websiteImages: [],
      websiteVideos: [],
      logos: [],
      screenshots: [],
      brandAssets: [],
      themeColor: null,
      ogTitle: null,
      ogDescription: null,
      fallbackKeywords: [
        product.name
      ].filter(Boolean)
    };

  }

}

function normalizeUrl(
  assetUrl,
  baseUrl
) {

  try {

    return new URL(
      assetUrl,
      baseUrl
    ).href;

  } catch {

    return assetUrl;

  }

}

function dedupe(
  arr = []
) {

  return [
    ...new Set(arr)
  ];

}

module.exports = {
  researchAssets
};