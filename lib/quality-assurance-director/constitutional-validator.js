const Violation = require(
  "./models/violation"
);

const {
  SEVERITY,
  VIOLATION_TYPE
} = require(
  "./quality-types"
);

const {
  evaluateRules
} = require(
  "./constitution/rule-engine"
);

/*
========================================
CONSTITUTIONAL VALIDATOR

Runs ALL platform-wide constitutional
rules against a submitted report.

No department-specific validation here.

========================================
*/

async function validate({

  submission

} = {}) {

  const violations = [];

  if (
    !submission
  ) {

    violations.push(

      new Violation({

        code:
          "NO_SUBMISSION",

        message:
          "Submission missing.",

        severity:
          SEVERITY.CRITICAL,

        type:
          VIOLATION_TYPE.CONSTITUTION,

        rule:
          "Submission Required",

        recommendation:
          "Create a valid submission."

      })

    );

    return {

      approved: false,

      score: 0,

      violations

    };

  }

  /*
  ================================
  RUN CONSTITUTION RULE ENGINE
  ================================
  */

  const results =
    await evaluateRules({

      submission

    });

  if (
    Array.isArray(results)
  ) {

    violations.push(
      ...results
    );

  }

  /*
  ================================
  SCORE
  ================================
  */

  const score =
    Math.max(

      0,

      100 -

      (violations.length * 10)

    );

  return {

    approved:
      violations.length === 0,

    score,

    violations

  };

}

module.exports = {

  validate

};