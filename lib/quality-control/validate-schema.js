function validateSchema(
  research = {}
) {

  const errors = [];

  const required = [

    "winner",

    "assets",

    "plans",

    "revenueProjection",

    "campaignIntelligence",

    "productIntelligence"

  ];

  for (
    const field
    of required
  ) {

    if (
      research[field] ===
      undefined ||

      research[field] === null
    ) {

      errors.push(
        `Missing field: ${field}`
      );

    }

  }

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validateSchema
};