const cheerio = require("cheerio");
const fetch = require("node-fetch");

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

    const logos =
      websiteImages.filter(
        image =>
          /logo/i.test(
            image
          )
      );

    const screenshots =
      websiteImages.filter(
        image =>
          /dashboard|screen|app|ui/i
            .test(image)
      );

    const brandAssets = [

      ...logos,
      ...screenshots

    ];

    return {

      websiteImages:
        dedupe(
          websiteImages
        ),

      websiteVideos:
        dedupe(
          websiteVideos
        ),

      logos:
        dedupe(logos),

      screenshots:
        dedupe(
          screenshots
        ),

      brandAssets:
        dedupe(
          brandAssets
        ),

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