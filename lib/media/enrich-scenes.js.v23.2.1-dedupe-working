const { getSceneAsset } =
require("./scene-selector");

async function enrichScenes(scenes) {

  const result = [];

  const usedAssetIds =
    new Set();

  for (const scene of scenes) {

    const asset =
  await getSceneAsset(
    scene,
    usedAssetIds
  );

    result.push({
      ...scene,
      asset
    });

  }

  return result;
}

module.exports = {
  enrichScenes
};