function validateResearch(
  research = {}
) {

  const errors = [];

  const winner =
    research.winner || {};

  const requiredFields = [

    "name",
    "brandName",

    "productUrl",
    "affiliateUrl",

    "description",
    "category",

    "validation",
    "longtermScore",

    "socialAccounts",
    "publishingProfile",

    "audience",

    "keywords",
    "hashtags",

    "contentAngles",
    "hooks",

    "brandKit"

  ];

  for (
    const field
    of requiredFields
  ) {

    if (

      winner[field] ===
      undefined ||

      winner[field] === null

    ) {

      errors.push(
        `winner.${field} missing`
      );

    }

  }

  /*
   * SOCIAL ACCOUNTS
   */

  if (
    !winner.socialAccounts ||
    typeof winner.socialAccounts !==
      "object"
  ) {

    errors.push(
      "winner.socialAccounts invalid"
    );

  }

  /*
   * PUBLISHING PROFILE
   */

  const profile =
    winner.publishingProfile || {};

  [
    "brandName",
    "username",
    "bio",
    "tagline"
  ].forEach(field => {

    if (!profile[field]) {

      errors.push(
        `publishingProfile.${field} missing`
      );

    }

  });

  /*
   * BRAND KIT
   */

  const brandKit =
    winner.brandKit || {};

  [
    "logoPrompt",
    "bannerPrompt",
    "profileImagePrompt",
    "channelTheme",
    "toneOfVoice"
  ].forEach(field => {

    if (!brandKit[field]) {

      errors.push(
        `brandKit.${field} missing`
      );

    }

  });

  /*
   * AUDIENCE
   */

  const audience =
    winner.audience || {};

  [
    "primaryAudience",
    "painPoints",
    "motivations"
  ].forEach(field => {

    if (
      audience[field] ===
      undefined
    ) {

      errors.push(
        `audience.${field} missing`
      );

    }

  });

  /*
   * ARRAYS
   */

  [
    "keywords",
    "hashtags",
    "contentAngles",
    "hooks"
  ].forEach(field => {

    if (

      !Array.isArray(
        winner[field]
      ) ||

      winner[field].length < 3

    ) {

      errors.push(
        `winner.${field} insufficient`
      );

    }

  });

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validateResearch
};