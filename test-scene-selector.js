const {
  getSceneAsset
} = require("./lib/media/scene-selector");

(async () => {

  const asset =
    await getSceneAsset({
      voice:
        "Need a website fast?",
      keywords: [
        "website",
        "business",
        "laptop"
      ]
    });

  console.log(
    JSON.stringify(
      asset,
      null,
      2
    )
  );

})();