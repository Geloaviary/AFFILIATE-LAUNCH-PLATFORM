const {
  scoreAsset
} = require(
  "./score-asset"
);

function scoreSceneAssets(

  scene = {},

  assets = []

) {

  return assets

    .map(
      asset =>
        scoreAsset(
          asset,
          scene
        )
    )

    .sort(
      (a, b) =>

        b.finalScore -

        a.finalScore
    );

}

module.exports = {
  scoreSceneAssets
};