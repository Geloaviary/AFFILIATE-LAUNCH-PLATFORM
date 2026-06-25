const Violation = require(
  "./models/violation"
);

const {
  DEPARTMENTS,
  SEVERITY,
  VIOLATION_TYPE
} = require(
  "./quality-types"
);

/*
========================================
DEPARTMENT VALIDATORS
========================================
*/

const researchValidator =
  require("./validators/research");

const strategyValidator =
  require("./validators/strategy");

const contentValidator =
  require("./validators/content");

const assetValidator =
  require(
    "./validators/asset-intelligence"
  );

const productionValidator =
  require(
    "./validators/production"
  );

const renderingValidator =
  require(
    "./validators/rendering"
  );

const workspaceValidator =
  require(
    "./validators/workspace"
  );

/*
========================================
VALIDATOR MAP
========================================
*/

const validators = {

  [DEPARTMENTS.RESEARCH]:
    researchValidator,

  [DEPARTMENTS.STRATEGY]:
    strategyValidator,

  [DEPARTMENTS.CONTENT]:
    contentValidator,

  [DEPARTMENTS.ASSET_INTELLIGENCE]:
    assetValidator,

  [DEPARTMENTS.PRODUCTION]:
    productionValidator,

  [DEPARTMENTS.RENDERING]:
    renderingValidator,

  [DEPARTMENTS.WORKSPACE]:
    workspaceValidator

};

/*
========================================
VALIDATE
========================================
*/

async function validate({

  submission

} = {}) {

  if (!submission) {

    return {

      approved: false,

      score: 0,

      violations: [

        new Violation({

          code:
            "NO_SUBMISSION",

          message:
            "Submission missing.",

          severity:
            SEVERITY.CRITICAL,

          type:
            VIOLATION_TYPE.DEPARTMENT,

          recommendation:
            "Create a submission."

        })

      ]

    };

  }

  const validator =

    validators[
      submission.department
    ];

  if (!validator) {

    return {

      approved: false,

      score: 0,

      violations: [

        new Violation({

          code:
            "UNKNOWN_DEPARTMENT",

          message:

            `No validator registered for ${submission.department}.`,

          severity:
            SEVERITY.CRITICAL,

          type:
            VIOLATION_TYPE.DEPARTMENT,

          recommendation:

            "Register the department validator."

        })

      ]

    };

  }

  /*
  ========================================
  EXECUTE VALIDATOR
  ========================================
  */

  return validator.validate({

    submission

  });

}

module.exports = {

  validate

};