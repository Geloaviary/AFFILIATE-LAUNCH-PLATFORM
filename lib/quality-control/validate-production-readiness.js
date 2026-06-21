function validateProductionReadiness(
  research = {}
) {

  const errors = [];

  const assets =
    research.assets || {};

  const plans =
    research.plans || {};

  const hasAssets =

    (assets.websiteImages || [])
      .length ||

    (assets.screenshots || [])
      .length ||

    (assets.renderableAssets || [])
      .length ||

    (assets.logos || [])
      .length;

  if (!hasAssets) {

    errors.push(
      "Production cannot start: no assets"
    );

  }

  if (
    !plans.short
  ) {

    errors.push(
      "Production cannot start: missing short plan"
    );

  }

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validateProductionReadiness
};