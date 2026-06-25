/*
========================================
QUALITY ASSURANCE DIRECTOR

Constitution Metrics

Responsible for measuring
constitutional compliance
across the entire platform.

Owns

• Compliance Rate
• Constitutional Violations
• Rule Statistics
• Critical Violations
• Warning Violations
• Rule History
• Department Compliance

========================================
*/

const {

  SEVERITY,

  VIOLATION_TYPE

} = require(
  "../../quality-types"
);

/*
========================================
CREATE
========================================
*/

function create() {

  return {

    generatedAt:
      new Date()
        .toISOString(),

    version:
      "1.0",

    complianceRate: 100,

    totalValidations: 0,

    totalViolations: 0,

    criticalViolations: 0,

    warningViolations: 0,

    errorViolations: 0,

    infoViolations: 0,

    constitutionalPasses: 0,

    constitutionalFailures: 0,

    departments: {},

    rules: {},

    history: [],

    recurringViolations: [],

    mostViolatedRule: null,

    strongestDepartment: null,

    weakestDepartment: null,

    constitutionHealth:
      "excellent"

  };

}

/*
========================================
UPDATE
========================================
*/

function update({

  metrics = create(),

  submission = {},

  qualityReport = {}

} = {}) {

  metrics.totalValidations++;

  updateViolationCounts({

    metrics,

    qualityReport

  });

  updateDepartmentCompliance({

    metrics,

    submission,

    qualityReport

  });

  updateRuleStatistics({

    metrics,

    submission,

    qualityReport

  });

  updateHistory({

    metrics,

    submission,

    qualityReport

  });

  updateComplianceRate(

    metrics

  );

  updateConstitutionHealth(

    metrics

  );

  return metrics;

}

/*
========================================
CREATE DEPARTMENT
========================================
*/

function createDepartment(

  name

) {

  return {

    id: name,

    validations: 0,

    passes: 0,

    failures: 0,

    complianceRate: 100,

    violations: {},

    criticalViolations: 0,

    warningViolations: 0,

    lastValidation: null

  };

}

/*
========================================
VIOLATION COUNTS
========================================
*/

function updateViolationCounts({

  metrics,

  qualityReport

}) {

  const violations =

    qualityReport.violations ||

    [];

  if (

    violations.length === 0

  ) {

    metrics.constitutionalPasses++;

    return;

  }

  metrics.constitutionalFailures++;

  metrics.totalViolations +=

    violations.length;

  violations.forEach(

    violation => {

      switch (

        violation.severity

      ) {

        case SEVERITY.INFO:

          metrics.infoViolations++;

          break;

        case SEVERITY.WARNING:

          metrics.warningViolations++;

          break;

        case SEVERITY.ERROR:

          metrics.errorViolations++;

          break;

        case SEVERITY.CRITICAL:

          metrics.criticalViolations++;

          break;

      }

    }

  );

}

/*
========================================
DEPARTMENT COMPLIANCE
========================================
*/

function updateDepartmentCompliance({

  metrics,

  submission,

  qualityReport

}) {

  const department =

    submission.department ||

    "unknown";

  if (

    !metrics.departments[department]

  ) {

    metrics.departments[department] =

      createDepartment(

        department

      );

  }

  const dept =

    metrics.departments[department];

  dept.validations++;

  dept.lastValidation =

    new Date()
      .toISOString();

  const violations =

    qualityReport.violations ||

    [];

  if (

    violations.length === 0

  ) {

    dept.passes++;

  }

  else {

    dept.failures++;

  }

  violations.forEach(

    violation => {

      const code =

        violation.code ||

        "UNKNOWN";

      dept.violations[code] =

        (

          dept.violations[code] ||

          0

        ) + 1;

      if (

        violation.severity ===

        SEVERITY.CRITICAL

      ) {

        dept.criticalViolations++;

      }

      if (

        violation.severity ===

        SEVERITY.WARNING

      ) {

        dept.warningViolations++;

      }

    }

  );

  dept.complianceRate =

    percentage(

      dept.passes,

      dept.validations

    );

}

/*
========================================
RULE STATISTICS
========================================
*/

function updateRuleStatistics({

  metrics,

  submission,

  qualityReport

}) {

  (

    qualityReport.violations ||

    []

  ).forEach(

    violation => {

      const rule =

        violation.rule ||

        violation.code ||

        "UNKNOWN";

      if (

        !metrics.rules[rule]

      ) {

        metrics.rules[rule] = {

          violations: 0,

          critical: 0,

          warning: 0,

          departments: {}

        };

      }

      const ruleMetrics =

        metrics.rules[rule];

      ruleMetrics.violations++;

      if (

        violation.severity ===

        SEVERITY.CRITICAL

      ) {

        ruleMetrics.critical++;

      }

      if (

        violation.severity ===

        SEVERITY.WARNING

      ) {

        ruleMetrics.warning++;

      }

      const department =

        submission.department ||

        "unknown";

      ruleMetrics.departments[department] =

        (

          ruleMetrics.departments[
            department
          ] ||

          0

        ) + 1;

    }

  );

  metrics.mostViolatedRule =

    Object.entries(

      metrics.rules

    )

    .sort(

      (a, b) =>

        b[1].violations -

        a[1].violations

    )[0]?.[0] ||

    null;

}

/*
========================================
CONSTITUTION HISTORY
========================================
*/

function updateHistory({

  metrics,

  submission,

  qualityReport

}) {

  metrics.history.push({

    timestamp:

      new Date()
        .toISOString(),

    submissionId:

      submission.id ||

      null,

    department:

      submission.department ||

      null,

    workflowStage:

      submission.workflowStage ||

      null,

    violations:

      (

        qualityReport.violations ||

        []

      ).length,

    score:

      qualityReport.score ||

      0,

    approved:

      Boolean(

        qualityReport.approved

      )

  });

  if (

    metrics.history.length >

    1000

  ) {

    metrics.history.shift();

  }

}

/*
========================================
COMPLIANCE RATE
========================================
*/

function updateComplianceRate(

  metrics

) {

  metrics.complianceRate =

    percentage(

      metrics.constitutionalPasses,

      metrics.totalValidations

    );

}

/*
========================================
CONSTITUTION HEALTH
========================================
*/

function updateConstitutionHealth(

  metrics

) {

  if (

    metrics.complianceRate >= 98 &&

    metrics.criticalViolations === 0

  ) {

    metrics.constitutionHealth =

      "excellent";

  }

  else if (

    metrics.complianceRate >= 90

  ) {

    metrics.constitutionHealth =

      "good";

  }

  else if (

    metrics.complianceRate >= 75

  ) {

    metrics.constitutionHealth =

      "fair";

  }

  else {

    metrics.constitutionHealth =

      "poor";

  }

}

/*
========================================
SUMMARY
========================================
*/

function summary(

  metrics = {}

) {

  return {

    generatedAt:

      new Date()
        .toISOString(),

    complianceRate:

      metrics.complianceRate,

    constitutionHealth:

      metrics.constitutionHealth,

    totalValidations:

      metrics.totalValidations,

    constitutionalPasses:

      metrics.constitutionalPasses,

    constitutionalFailures:

      metrics.constitutionalFailures,

    totalViolations:

      metrics.totalViolations,

    criticalViolations:

      metrics.criticalViolations,

    warningViolations:

      metrics.warningViolations,

    errorViolations:

      metrics.errorViolations,

    infoViolations:

      metrics.infoViolations,

    mostViolatedRule:

      metrics.mostViolatedRule

  };

}

/*
========================================
INTELLIGENCE
========================================
*/

function intelligence(

  metrics = {}

) {

  const strongestDepartment =

    Object.values(

      metrics.departments

    )

    .sort(

      (a,b)=>

        b.complianceRate -

        a.complianceRate

    )[0];

  const weakestDepartment =

    Object.values(

      metrics.departments

    )

    .sort(

      (a,b)=>

        a.complianceRate -

        b.complianceRate

    )[0];

  metrics.strongestDepartment =

    strongestDepartment?.id ||

    null;

  metrics.weakestDepartment =

    weakestDepartment?.id ||

    null;

  metrics.recurringViolations =

    Object.entries(

      metrics.rules

    )

    .filter(

      ([,rule]) =>

        rule.violations >= 3

    )

    .map(

      ([name]) =>

        name

    );

  return {

    generatedAt:

      new Date()
        .toISOString(),

    constitutionHealth:

      metrics.constitutionHealth,

    complianceRate:

      metrics.complianceRate,

    strongestDepartment:

      metrics.strongestDepartment,

    weakestDepartment:

      metrics.weakestDepartment,

    mostViolatedRule:

      metrics.mostViolatedRule,

    recurringViolations:

      metrics.recurringViolations,

    engineeringAttentionRequired:

      metrics.criticalViolations > 0 ||

      metrics.complianceRate < 90,

    recommendations:

      buildRecommendations(

        metrics

      ),

    confidence:

      calculateConfidence(

        metrics

      )

  };

}

/*
========================================
VALIDATION
========================================
*/

function validate(

  metrics = {}

) {

  const missing = [];

  [

    "complianceRate",

    "totalValidations",

    "totalViolations",

    "rules",

    "departments"

  ]

  .forEach(

    property => {

      if (

        metrics[property] ===

        undefined

      ) {

        missing.push(

          property

        );

      }

    }

  );

  return {

    valid:

      missing.length === 0,

    missing

  };

}

/*
========================================
RESET
========================================
*/

function reset() {

  return create();

}

/*
========================================
CLONE
========================================
*/

function clone(

  metrics = {}

) {

  return JSON.parse(

    JSON.stringify(

      metrics

    )

  );

}

/*
========================================
HELPERS
========================================
*/

function percentage(

  value,

  total

) {

  if (

    total === 0

  ) {

    return 100;

  }

  return Number(

    (

      (

        value /

        total

      ) *

      100

    )

    .toFixed(2)

  );

}

function buildRecommendations(

  metrics

) {

  const recommendations = [];

  if (

    metrics.criticalViolations >

    0

  ) {

    recommendations.push(

      "Resolve all critical constitutional violations immediately."

    );

  }

  if (

    metrics.complianceRate <

    90

  ) {

    recommendations.push(

      "Improve department self-validation before QA submission."

    );

  }

  if (

    metrics.mostViolatedRule

  ) {

    recommendations.push(

      `Strengthen enforcement of rule: ${metrics.mostViolatedRule}`

    );

  }

  return recommendations;

}

function calculateConfidence(

  metrics

) {

  let confidence = 100;

  confidence -=

    metrics.criticalViolations * 5;

  confidence -=

    metrics.warningViolations;

  return Math.max(

    0,

    confidence

  );

}

/*
========================================
EXPORTS

Universal Module Contract

Constitution QA-001
========================================
*/

module.exports = {

  create,

  update,

  summary,

  intelligence,

  validate,

  reset,

  clone

};