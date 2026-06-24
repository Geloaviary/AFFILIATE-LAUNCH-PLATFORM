function validateAssets(
  blueprint = {}
) {

  const scenes =
    blueprint?.timeline?.scenes || [];

  const violations = [];

  scenes.forEach(
    (scene, index) => {

      if (
        !scene.assets ||
        !scene.assets.length
      ) {

        violations.push(
          `Scene ${index + 1} missing assets`
        );

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