const { getSceneAsset } =
require("./scene-selector");

async function enrichScenes(scenes) {

  const result = [];

  for (const scene of scenes) {

    const asset =
      await getSceneAsset(scene);

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