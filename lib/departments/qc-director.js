function validateBlueprint(
  blueprint
) {

  const scenes =
    blueprint?.timeline?.scenes || [];

  if (
    scenes.length < 5
  ) {
    throw new Error(
      "QC FAILED: too few scenes"
    );
  }

  return true;
}

module.exports = {
  validateBlueprint
};