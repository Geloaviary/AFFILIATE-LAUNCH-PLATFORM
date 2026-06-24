const {
  scoreSceneAssets
} = require(
  "./score-scene-assets"
);

function selectBestAssets(

  scene = {},

  assets = []

) {

  const ranked =
    scoreSceneAssets(
      scene,
      assets
    );

  return {

    selected:
      ranked[0] || null,

    alternatives:
      ranked.slice(
        1,
        5
      ),

    ranked

  };

}

module.exports = {
  selectBestAssets
};