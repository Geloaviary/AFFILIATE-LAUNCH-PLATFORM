const {
  validateSchema
} = require("./validate-schema");

const {
  validateResearch
} = require("./validate-research");

const {
  validateAssets
} = require("./validate-assets");

const {
  validateVideoPlans
} = require("./validate-video-plans");

const {
  validateProductionReadiness
} = require(
  "./validate-production-readiness"
);

const {
  validatePlaceholders
} = require(
  "./validate-placeholders"
);

const {
  validateRevenue
} = require(
  "./validate-revenue"
);

async function qualityControl({

  department,

  output

} = {}) {

  const errors = [];

  const validators = [

    validateSchema,
    validateResearch,
    validateAssets,
    validateVideoPlans,
    validateRevenue,
    validatePlaceholders,
    validateProductionReadiness

  ];

  for (
    const validator
    of validators
  ) {

    const result =
      await validator(output);

    if (
      !result.approved
    ) {

      errors.push(
        ...result.errors
      );

    }

  }

  return {

    approved:
      errors.length === 0,

    department,

    errors

  };

}

module.exports = {
  qualityControl
};