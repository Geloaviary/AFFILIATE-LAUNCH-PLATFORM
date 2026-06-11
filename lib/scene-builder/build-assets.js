function buildAssets(
  scenes = []
) {

  return scenes.map(
    scene => {

      const asset =

        scene.selectedAsset
          ?.asset ||

        null;

      return {

        ...scene,

        assets:
          asset
            ? [asset]
            : [],

        primaryAsset:
          asset

      };

    }
  );

}

module.exports = {
  buildAssets
};