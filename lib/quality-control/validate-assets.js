function validateAssets(
  research = {}
) {

  const errors = [];

  const assets =
    research.assets || {};

  const websiteImages =
    assets.websiteImages || [];

  const screenshots =
    assets.screenshots || [];

  const logos =
    assets.logos || [];

  const renderableAssets =
    assets.renderableAssets || [];

  const totalAssets =

    websiteImages.length +

    screenshots.length +

    logos.length +

    renderableAssets.length;

  if (
    totalAssets === 0
  ) {

    errors.push(
      "No usable assets found"
    );

  }

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validateAssets
};