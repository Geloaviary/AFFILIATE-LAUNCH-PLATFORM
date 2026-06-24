const cheerio = require("cheerio");
const fetch = require("node-fetch");

function classifyAssets(
  assets = []
) {

  const screenshots = [];

  const logos = [];

  const icons = [];

  const renderableAssets = [];

  for (
    const asset of assets
  ) {

    const lower =
      String(asset.url)
        .toLowerCase();

    const isSvg =
      lower.endsWith(".svg");

    const isRenderable =

  /\.(png|jpg|jpeg|webp)(\?|$)/i
    .test(lower)

  ||

  /\.(png|jpg|jpeg|webp)/i
    .test(lower)

  ||

  lower.includes(
    "/_next/image/"
  );

    if (
      lower.includes("logo")
    ) {

      logos.push(asset);

      continue;

    }

    if (
      isSvg
    ) {

      icons.push(asset);

      continue;

    }

    if (
  isRenderable
) {

  if (
  asset.width > 0 &&
  asset.height > 0
) {

  asset.orientation =

    asset.height >
    asset.width

      ? "vertical"

      : "horizontal";

} else {

  asset.orientation =
    "unknown";

}

  asset.aspectRatio =

    asset.width &&
    asset.height

      ? `${asset.width}:${asset.height}`

      : "unknown";

  asset.qualityScore =

  asset.width >= 1920
    ? 100

  : asset.width >= 1080
    ? 90

  : asset.width >= 720
    ? 75

  : 50;

  screenshots.push(
    asset
  );

  renderableAssets.push(
    asset
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

    assetSchemaVersion: 2,

    websiteImages: [],
    websiteVideos: [],

    logos: [],
    screenshots: [],

    brandAssets: [],

    themeColor: null,

    ogTitle: null,

    ogDescription: null,

    fallbackKeywords: [],

    icons: [],

    renderableAssets: []

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

          websiteImages.push({

  url:
    normalizeUrl(
      src,
      url
    ),

  alt:
    $(el).attr("alt") || "",

  title:
    $(el).attr("title") || "",

  width:
    Number(
      $(el).attr("width")
    ) || 0,

  height:
    Number(
      $(el).attr("height")
    ) || 0,

  source:
    "website"

});

        }

      }
    );

    const ogImage =
  $('meta[property="og:image"]')
    .attr("content");

if (ogImage) {

  websiteImages.push({

  url:
    normalizeUrl(
      ogImage,
      url
    ),

  alt:
    "og-image",

  title:
    ogTitle || "",

  width: 0,

  height: 0,

  source:
    "og-image"

});

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

const brandAssets =
  dedupe([

    ...logos,

    ...screenshots

  ]);

    return {

  assetSchemaVersion: 2,

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
      assetSchemaVersion: 2,
      websiteImages: [],
      websiteVideos: [],
      logos: [],
      screenshots: [],
      brandAssets: [],
      themeColor: null,
      ogTitle: null,
      ogDescription: null,
      icons: [],
      renderableAssets: [],
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

  const map =
    new Map();

  arr.forEach(
    item => {

      const key =

        typeof item === "string"

          ? item

          : item.url;

      map.set(
        key,
        item
      );

    }
  );

  return [
    ...map.values()
  ];

}

module.exports = {
  researchAssets
};