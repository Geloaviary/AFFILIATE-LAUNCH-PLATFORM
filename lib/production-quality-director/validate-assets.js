function validateAssets(
  blueprint = {}
) {

  const scenes =
    blueprint?.timeline?.scenes || [];

  const violations = [];

  scenes.forEach(
    (scene, index) => {

      const hasAsset =

        !!scene.selectedAsset ||

        (
          Array.isArray(
            scene.assets
          ) &&
          scene.assets.length > 0
        );

      if (!hasAsset) {

        violations.push({

          code:
            "NO_ASSETS",

          scene:
            index + 1,

          message:
            `Scene ${index + 1} missing assets`

        });

      }

    }
  );

  return {

    passed:
      violations.length === 0,

    violations

  };

}

module.exports = {
  validateAssets
};