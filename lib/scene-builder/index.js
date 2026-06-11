const {
  buildScenes
} = require(
  "./build-scenes"
);

const {
  buildAssets
} = require(
  "./build-assets"
);

const {
  buildSmartCaptions
} = require(
  "./build-smart-captions"
);

const {
  buildVoiceover
} = require(
  "./build-voiceover"
);

const {
  buildTimeline
} = require(
  "./build-timeline"
);

const {
  buildStockAssets
} = require(
  "../asset-sourcing"
);

const {
  buildSceneAssets
} = require(
  "../asset-matcher"
);

async function buildOracleBlueprint(
  videoPlan = {},
  options = {}
) {

  const assets =
    options.assets || {};

  let scenes =
    buildScenes(
      videoPlan
    );

  const stockAssets =
  await buildStockAssets(

    assets
      .fallbackKeywords ||

    []

  );

scenes =
  buildSceneAssets(

    scenes,

    assets,

    stockAssets

  );

  scenes =
  buildAssets(
    scenes
  );

  scenes =
    buildSmartCaptions(
      scenes,
      {
        platform:
          options.platform ||
          "shorts"
      }
    );

  scenes =
    buildVoiceover(
      scenes,
      {
        platform:
          options.platform ||
          "shorts",

        provider:
          options.provider ||
          "openai",

        voice:
          options.voice
      }
    );

  const timeline =
    buildTimeline(
      scenes
    );

  return {

    version:
      "1.0",

    blueprintType:
      "oracle",

    title:
      videoPlan.title ||

      "Untitled Video",

    videoType:
      videoPlan.videoType ||

      "short",

    platform:
      options.platform ||

      "shorts",

    timeline

  };

}

module.exports = {

  buildOracleBlueprint,

  buildScenes,

  buildAssets,

  buildSmartCaptions,

  buildVoiceover,

  buildTimeline

};