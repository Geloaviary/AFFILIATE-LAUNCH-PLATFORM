const { getSceneAsset } =
require("./lib/media/scene-selector");

async function run() {

  const result =
    await getSceneAsset({
      voice: "Need a website fast?",
      keywords: [
        "website",
        "business",
        "laptop"
      ]
    });

  console.log(
    JSON.stringify(result, null, 2)
  );
}

run();