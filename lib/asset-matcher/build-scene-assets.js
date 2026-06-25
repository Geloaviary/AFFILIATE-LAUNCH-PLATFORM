const {
  selectBestAssets
} = require(
  "../asset-intelligence-director"
);

function buildSceneAssets(
  scenes = [],
  assets = {},
  stockAssets = {}
) {

  const renderableAssets =
  assets.renderableAssets || [];

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

      const candidateAssets = [

  ...renderableAssets,

  ...screenshots,

  ...logos

]
.filter(Boolean)
.filter(
  (asset, index, arr) =>
    index ===
    arr.findIndex(
      a =>
        a.url ===
        asset.url
    )
);

console.log(
  "CANDIDATE ASSETS",
  {
    renderable: renderableAssets.length,
    screenshots: screenshots.length,
    logos: logos.length,
    total: candidateAssets.length
  }
);

    const rankedAssets =
  selectBestAssets(
    scene,
    candidateAssets
  );

console.log(
  "CANDIDATE ASSETS",
  {
    scene: scene.id,
    renderable: renderableAssets.length,
    screenshots: screenshots.length,
    logos: logos.length,
    total: candidateAssets.length,
    sample: candidateAssets[0]
  }
);

console.log(
  "RANK RESULT",
  {
    scene: scene.id,
    candidates: candidateAssets.length,
    ranked: rankedAssets.ranked.length,
    selected: rankedAssets.selected
  }
);

const bestAsset =
  rankedAssets?.selected || null;

const alternativeAssets =
  rankedAssets?.alternatives || [];

      /*
 * INTELLIGENCE SELECTED ASSET
 */

if (
  bestAsset
) {

  selectedAsset = {

    assetId:
      `asset_${scene.id}`,

    assetSource:
      bestAsset.source ||
      "website",

    assetType:

       bestAsset.url?.includes(".mp4")

           ? "video"

           : "image",

    asset:
      bestAsset,

    keyword,

    assetRanking: {

      finalScore:
        bestAsset.finalScore || 0,

      relevanceScore:
        bestAsset.relevanceScore || 0,

      brandScore:
        bestAsset.brandScore || 0,

      qualityScore:
        bestAsset.qualityScore || 0,

      orientation:
        bestAsset.orientation ||
        "unknown"

    }

  };

}

      /*
       * PEXELS VIDEO
       */

      else if (
        pexelsVideos.length
      ) {

        const selectedVideo =
  pexelsVideos[
    sceneIndex %
    pexelsVideos.length
  ];

selectedAsset = {

  assetId:
    `pexels_${scene.id}`,

  assetSource:
    "pexels",

  assetType:
    "video",

  asset:
    selectedVideo,

  keyword,

  assetRanking: {

    finalScore: 50,

    relevanceScore: 0,

    brandScore: 0,

    qualityScore: 50,

    orientation:
      selectedVideo.orientation ||
      "unknown"

  }

};
        

      }

      /*
       * PIXABAY VIDEO
       */

      else if (
        pixabayVideos.length
      ) {

        const selectedVideo =
  pixabayVideos[
    sceneIndex %
    pixabayVideos.length
  ];

        selectedAsset = {

          assetId:
            `pixabay_${scene.id}`,

          assetSource:
            "pixabay",

          assetType:
            "video",

          asset:
             selectedVideo,

          keyword,

          assetRanking: {

            finalScore: 50,

            relevanceScore: 0,

            brandScore: 0,

            qualityScore: 50,

            orientation:
              selectedVideo.orientation ||
               "unknown"

           }

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

          keyword,

          assetRanking: {

            finalScore: 0,

            relevanceScore: 0,

            brandScore: 0,

            qualityScore: 0,

            orientation:
            "unknown"

           }

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

      keyword,

      assetRanking: {
         finalScore: 25
        }

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

       keyword,

       assetRanking: {
          finalScore: 25
         }

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

  keyword,

  assetRanking: {
   finalScore: 25
  }

});

return {

  ...scene,

  selectedAsset,

  alternativeAssets,

  fallbackAssets

};

    }
  );

}

module.exports = {
  buildSceneAssets
};