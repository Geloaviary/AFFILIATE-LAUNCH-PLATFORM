function buildSceneAssets(
  scenes = [],
  assets = {},
  stockAssets = {}
) {

  const websiteImages =
    assets.websiteImages || [];

  const screenshots =
    assets.screenshots || [];

  const logos =
    assets.logos || [];

  const stockResults =
  Array.isArray(stockAssets)
    ? stockAssets
    : [];

const pexelsVideos =
  stockResults.flatMap(
    item =>
      item.pexelsVideos || []
  );

const pixabayVideos =
  stockResults.flatMap(
    item =>
      item.pixabayVideos || []
  );

      return scenes.map(
        (
          scene,
           sceneIndex
        ) => {

      const keyword =
 
        scene.searchKeyword ||

        scene.keyword ||

        scene.intent ||

        scene.title ||

        "";

      let selectedAsset =
        null;

      /*
       * WEBSITE SCREENSHOT
       */

      if (
        scene.visualType ===
          "dashboard" &&

        screenshots.length
      ) {

        selectedAsset = {

          assetId:
            `screenshot_${scene.id}`,

          assetSource:
            "website",

          assetType:
            "image",

          asset:
            screenshots[
              sceneIndex %
              screenshots.length
            ],

          keyword

        };

      }

      /*
       * WEBSITE IMAGE
       */

      else if (
        websiteImages.length
      ) {

        selectedAsset = {

          assetId:
             `website_${scene.id}`,

          assetSource:
             "website",

          assetType:
            "image",

          asset:
            websiteImages[
              sceneIndex %
              websiteImages.length],

          keyword

        };

      }

      /*
       * LOGO
       */

      else if (
        logos.length
      ) {

        selectedAsset = {

          assetId:
            `logo_${scene.id}`,

          assetSource:
            "logo",

          assetType:
            "image",

          asset:
            logos[
              sceneIndex %
              logos.length],

          keyword

        };

      }

      /*
       * PEXELS VIDEO
       */

      else if (
        pexelsVideos.length
      ) {

        selectedAsset = {

          assetId:
            `pexels_${scene.id}`,

          assetSource:
            "pexels",

          assetType:
            "video",

          asset:
            pexelsVideos[
              sceneIndex %
              pexelsVideos.length],

          keyword

        };

      }

      /*
       * PIXABAY VIDEO
       */

      else if (
        pixabayVideos.length
      ) {

        selectedAsset = {

          assetId:
            `pixabay_${scene.id}`,

          assetSource:
            "pixabay",

          assetType:
            "video",

          asset:
            pixabayVideos[
              sceneIndex %
              pixabayVideos.length],

          keyword

        };

      }

      /*
       * AI FALLBACK
       */

      else {

        selectedAsset = {

          assetId:
            `ai_${scene.id}`,

          assetSource:
            "ai",

          assetType:
            "video",

          asset:
            null,

          prompt:
            keyword,

          keyword

        };

      }

      const fallbackAssets = [];

if (
  selectedAsset?.assetSource !==
  "pexels"
) {

  if (
    pexelsVideos.length
  ) {

    fallbackAssets.push({

      assetId:
        `pexels_fallback_${scene.id}`,

      assetSource:
        "pexels",

      assetType:
        "video",

      asset:
        pexelsVideos[
          sceneIndex %
          pexelsVideos.length
        ],

      keyword

    });

  }

}

if (
  selectedAsset?.assetSource !==
  "pixabay"
) {

  if (
    pixabayVideos.length
  ) {

    fallbackAssets.push({

      assetId:
        `pixabay_fallback_${scene.id}`,

      assetSource:
        "pixabay",

      assetType:
        "video",

      asset:
        pixabayVideos[
          sceneIndex %
          pixabayVideos.length
        ],

       keyword

    });

  }

}

fallbackAssets.push({

  assetId:
    `ai_fallback_${scene.id}`,

  assetSource:
    "ai",

  assetType:
    "video",

  asset:
    null,

  prompt:
    keyword,

  keyword

});

return {

  ...scene,

  selectedAsset,

  fallbackAssets

};

    }
  );

}

module.exports = {
  buildSceneAssets
};