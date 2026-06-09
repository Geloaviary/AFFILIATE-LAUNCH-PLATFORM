const {
  buildQueries
} = require("./query-builder");

const {
  searchPexelsVideo,
  searchPixabayVideo
} = require("./providers");

async function getSceneAsset(
  scene,
  usedAssetIds
) {
  const queries =
  buildQueries(scene);

for (const query of queries) {

  let asset =
  await searchPexelsVideo(
    query,
    usedAssetIds
  );

  if (asset) return asset;

  asset =
    await searchPixabayVideo(query);

  if (asset) return asset;

}

  return {
  provider: "dalle",
  type: "image",
  prompt: `
Professional commercial marketing image.

Scene narration:
${scene.voice}

Keywords:
${(scene.keywords || []).join(" ")}

Style:
Ultra realistic.
Vertical 9:16.
Social media advertisement.
Professional lighting.
No text.
High quality.
`
};
}

module.exports = {
  getSceneAsset
};