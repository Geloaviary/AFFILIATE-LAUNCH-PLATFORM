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

  if (
    validator.name ===
    "validatePlaceholders"
  ) {

    const json =
      JSON.stringify(
        output,
        null,
        2
      );

    ["todo", "tbd"].forEach(
      word => {

        if (
          json
            .toLowerCase()
            .includes(word)
        ) {

          console.log(
            "\nFOUND PLACEHOLDER:",
            word
          );

          json
            .split("\n")
            .forEach(line => {

              if (
                line
                  .toLowerCase()
                  .includes(word)
              ) {

                console.log(
                  "MATCH:",
                  line
                );

              }

            });

        }

      }
    );

  }

  const result =
    await validator(output);

  if (
    !result.approved
  ) {

    console.log(
      "QC FAILED:",
      validator.name,
      result.errors
    );

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