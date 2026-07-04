/*
========================================
QUALITY ASSURANCE DIRECTOR

Violation Metrics

Platform Memory of all
Quality Violations

Responsible for

• Violation Database
• Frequency
• Recurrence
• Rule Failures
• Department Failures
• Severity Statistics
• Historical Tracking

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

    totalViolations: 0,

    uniqueViolations: 0,

    recurringViolations: 0,

    criticalViolations: 0,

    warningViolations: 0,

    errorViolations: 0,

    infoViolations: 0,

    mostCommonViolation: null,

    mostAffectedDepartment: null,

    highestSeverity:

      SEVERITY.INFO,

    violations: {},

    departments: {},

    rules: {},

    categories: {},

    history: [],

    timeline: [],

    intelligence: {

      recurringPatterns: [],

      emergingProblems: [],

      resolvedProblems: [],

      recommendations: [],

      confidence: 100

    }

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

  const violations =

    qualityReport.violations ||

    [];

  if (

    violations.length === 0

  ) {

    return metrics;

  }

  updateViolationDatabase({

    metrics,

    submission,

    violations

  });

  updateDepartmentDatabase({

    metrics,

    submission,

    violations

  });

  updateRuleDatabase({

    metrics,

    violations

  });

  updateCategoryDatabase({

    metrics,

    violations

  });

  updateHistory({

    metrics,

    submission,

    qualityReport

  });

  updateStatistics(

    metrics

  );

  return metrics;

}

/*
========================================
VIOLATION DATABASE
========================================
*/

function updateViolationDatabase({

  metrics,

  submission,

  violations

}) {

  violations.forEach(

    violation => {

      const code =

        violation.code ||

        "UNKNOWN";

      if (

        !metrics.violations[code]

      ) {

        metrics.violations[code] = {

  code,

  title:

    violation.title ||

    code,

  description:

    violation.description ||

    "",

  severity:

    violation.severity ||

    SEVERITY.WARNING,

  type:

    violation.type ||

    VIOLATION_TYPE.DEPARTMENT,

  rule:

    violation.rule ||

    code,

  occurrences: 0,

  firstSeen:

    new Date()
      .toISOString(),

  lastSeen:

    null,

  firstRecurringAt:

    null,

  lastRecurringAt:

    null,

  longestStreak: 0,

  currentStreak: 0,

  resolved: false,

  resolvedAt: null,

  repairTickets: [],

  repairHistory: [],

  successfulFixes: [],

  failedFixes: [],

  bestKnownFix: null,

  rootCause: null,

  permanentFix: null,

  estimatedRepairTime: 0,

  averageRepairTime: 0,

  autoRepairPossible: false,

  repairConfidence: 0,

  departments: {},

  workflowStages: {},

  submissions: [],

  recommendations: [],

  engineeringNotes: [],

  confidence: 100,

  lastReviewed: null,

  repairPlaybook: {

    recommendedFix: null,

    recommendedDepartment: null,

    recommendedValidator: null,

    recommendedWorkflowStage: null,

    automationAvailable: false

  }

};

      }

      const item =

        metrics.violations[code];

      item.occurrences++;

item.lastSeen =

  new Date()
    .toISOString();

    if (

  item.occurrences === 2

) {

  item.firstRecurringAt =

    new Date()
      .toISOString();

}

if (

  item.occurrences > 1

) {

  item.lastRecurringAt =

    new Date()
      .toISOString();

  item.currentStreak++;

  item.longestStreak =

    Math.max(

      item.longestStreak,

      item.currentStreak

    );

}

metrics.totalViolations++;

if (

  item.occurrences === 2

) {

  item.firstRecurringAt =

    new Date()
      .toISOString();

}

if (

  item.occurrences > 1

) {

  metrics.recurringViolations++;

  item.lastRecurringAt =

    new Date()
      .toISOString();

  item.currentStreak++;

  item.longestStreak =

    Math.max(

      item.longestStreak,

      item.currentStreak

    );

}
      item.departments[

        submission.department ||

        "unknown"

      ] =

        (

          item.departments[

            submission.department ||

            "unknown"

          ] ||

          0

        ) + 1;

        item.workflowStages[

  submission.workflowStage ||

  "unknown"

] =

(

  item.workflowStages[

    submission.workflowStage ||

    "unknown"

  ] ||

  0

) + 1;

item.submissions.push({

  submissionId:

    submission.id ||

    null,

  timestamp:

    new Date()
      .toISOString(),

  score:

    qualityReport?.score ||

    0

});

if (

  item.submissions.length >

  100

) {

  item.submissions.shift();

}

    }

  );

}

/*
========================================
DEPARTMENT DATABASE
========================================
*/

function updateDepartmentDatabase({

  metrics,

  submission,

  violations

}) {

  const department =

    submission.department ||

    "unknown";

  if (

    !metrics.departments[department]

  ) {

    metrics.departments[department] = {

      violations: 0,

      critical: 0,

      warning: 0,

      error: 0,

      info: 0,

      recurring: 0,

      rules: {}

    };

  }

  const dept =

    metrics.departments[
      department
    ];

  violations.forEach(

    violation => {

      dept.violations++;

      switch (

        violation.severity

      ) {

        case SEVERITY.CRITICAL:

          dept.critical++;

          break;

        case SEVERITY.ERROR:

          dept.error++;

          break;

        case SEVERITY.WARNING:

          dept.warning++;

          break;

        case SEVERITY.INFO:

          dept.info++;

          break;

      }

      const rule =

        violation.rule ||

        violation.code ||

        "UNKNOWN";

      dept.rules[rule] =

        (

          dept.rules[rule] ||

          0

        ) + 1;

    }

  );

}

/*
========================================
RULE DATABASE
========================================
*/

function updateRuleDatabase({

  metrics,

  violations

}) {

  violations.forEach(

    violation => {

      const rule =

        violation.rule ||

        violation.code ||

        "UNKNOWN";

      if (

        !metrics.rules[rule]

      ) {

        metrics.rules[rule] = {

          occurrences: 0,

          critical: 0,

          warning: 0,

          error: 0,

          info: 0

        };

      }

      const ruleMetrics =

        metrics.rules[rule];

      ruleMetrics.occurrences++;

      switch (

        violation.severity

      ) {

        case SEVERITY.CRITICAL:

          ruleMetrics.critical++;

          break;

        case SEVERITY.ERROR:

          ruleMetrics.error++;

          break;

        case SEVERITY.WARNING:

          ruleMetrics.warning++;

          break;

        case SEVERITY.INFO:

          ruleMetrics.info++;

          break;

      }

    }

  );

}

/*
========================================
CATEGORY DATABASE
========================================
*/

function updateCategoryDatabase({

  metrics,

  violations

}) {

  violations.forEach(

    violation => {

      const category =

        violation.type ||

        VIOLATION_TYPE.DEPARTMENT;

      if (

        !metrics.categories[category]

      ) {

        metrics.categories[category] = {

          occurrences: 0

        };

      }

      metrics.categories[
        category
      ].occurrences++;

    }

  );

}

/*
========================================
HISTORY
========================================
*/

function updateHistory({

  metrics,

  submission,

  qualityReport

}) {

  const record = {

    timestamp:

      new Date()
        .toISOString(),

    submissionId:

      submission.id ||

      null,

    department:

      submission.department ||

      "unknown",

    workflowStage:

      submission.workflowStage ||

      "unknown",

    score:

      qualityReport.score ||

      0,

    violations:

      qualityReport.violations ||

      []

  };

  metrics.history.push(

    record

  );

  metrics.timeline.push({

    timestamp:

      record.timestamp,

    department:

      record.department,

    violationCount:

      record.violations.length

  });

  if (

    metrics.history.length >

    1000

  ) {

    metrics.history.shift();

  }

  if (

    metrics.timeline.length >

    1000

  ) {

    metrics.timeline.shift();

  }

}

/*
========================================
STATISTICS
========================================
*/

function updateStatistics(

  metrics

) {

  metrics.uniqueViolations =

    Object.keys(

      metrics.violations

    ).length;

  const sorted =

    Object.entries(

      metrics.violations

    )

    .sort(

      (a,b)=>

        b[1].occurrences -

        a[1].occurrences

    );

  metrics.mostCommonViolation =

    sorted[0]?.[0] ||

    null;

  if (

    sorted.length

  ) {

    metrics.highestSeverity =

      sorted[0][1].severity;

  }

}

/*
========================================
RECORD REPAIR

Stores repair knowledge
for future learning.
========================================
*/

function recordRepair({

  violation,

  repairTicket

}) {

  if (

    !violation ||

    !repairTicket

  ) {

    return;

  }

  violation.repairTickets.push(

    repairTicket.id

  );

  violation.repairHistory.push({

    repairTicketId:

      repairTicket.id,

    repairedBy:

      repairTicket.assignedTo ||

      "unknown",

    repairedAt:

      new Date()
        .toISOString(),

    repairDuration:

      repairTicket.executionTime ||

      0,

    rootCause:

      repairTicket.rootCause ||

      null,

    fixApplied:

      repairTicket.fixApplied ||

      null,

    successful:

      repairTicket.successful ||

      false,

    verificationScore:

      repairTicket.verificationScore ||

      0,

    notes:

      repairTicket.notes ||

      ""

  });

  if (

    repairTicket.successful

  ) {

    violation.successfulFixes.push(

      repairTicket.fixApplied

    );

  }

  else {

    violation.failedFixes.push(

      repairTicket.fixApplied

    );

  }

  violation.lastReviewed =

    new Date()
      .toISOString();

}

/*
========================================
SUMMARY

Consumed by Dashboard
and Executive Summary.
========================================
*/

function summary(

  metrics = {}

) {

  return {

    generatedAt:

      new Date()
        .toISOString(),

    totalViolations:

      metrics.totalViolations,

    uniqueViolations:

      metrics.uniqueViolations,

    recurringViolations:

      metrics.recurringViolations,

    criticalViolations:

      metrics.criticalViolations,

    warningViolations:

      metrics.warningViolations,

    errorViolations:

      metrics.errorViolations,

    infoViolations:

      metrics.infoViolations,

    mostCommonViolation:

      metrics.mostCommonViolation,

    mostAffectedDepartment:

      metrics.mostAffectedDepartment,

    highestSeverity:

      metrics.highestSeverity

  };

}

/*
========================================
INTELLIGENCE

Used by

• Prediction Engine

• Learning Engine

• Executive Director

• Engineering Director

========================================
*/

function intelligence(

  metrics = {}

) {

  const recurringPatterns =

    Object.values(

      metrics.violations

    )

    .filter(

      violation =>

        violation.occurrences >= 3

    )

    .sort(

      (a,b)=>

        b.occurrences -

        a.occurrences

    );

  const emergingProblems =

    recurringPatterns.filter(

      violation =>

        violation.currentStreak >= 3

    );

  const unresolvedProblems =

    recurringPatterns.filter(

      violation =>

        !violation.resolved

    );

  metrics.intelligence.recurringPatterns =

    recurringPatterns.map(

      violation =>

        violation.code

    );

  metrics.intelligence.emergingProblems =

    emergingProblems.map(

      violation =>

        violation.code

    );

  metrics.intelligence.resolvedProblems =

    Object.values(

      metrics.violations

    )

    .filter(

      violation =>

        violation.resolved

    )

    .map(

      violation =>

        violation.code

    );

  metrics.intelligence.recommendations =

    buildRecommendations(

      metrics

    );

  metrics.intelligence.confidence =

    calculateConfidence(

      metrics

    );

  return {

    generatedAt:

      new Date()
        .toISOString(),

    recurringPatterns:

      metrics.intelligence
        .recurringPatterns,

    emergingProblems:

      metrics.intelligence
        .emergingProblems,

    resolvedProblems:

      metrics.intelligence
        .resolvedProblems,

    recommendations:

      metrics.intelligence
        .recommendations,

    confidence:

      metrics.intelligence
        .confidence,

    engineeringAttentionRequired:

      unresolvedProblems.length >

      0

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

  const required = [

    "violations",

    "rules",

    "departments",

    "categories",

    "history"

  ];

  const missing =

    required.filter(

      property =>

        metrics[property] ===

        undefined

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

function buildRecommendations(

  metrics

) {

  const recommendations = [];

  Object.values(

    metrics.violations

  )

  .filter(

    violation =>

      violation.currentStreak >= 3

  )

  .forEach(

    violation => {

      recommendations.push(

        `Investigate recurring violation: ${violation.code}`

      );

    }

  );

  if (

    metrics.criticalViolations >

    0

  ) {

    recommendations.push(

      "Immediate engineering review required for critical violations."

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

    metrics.recurringViolations;

  confidence -=

    metrics.errorViolations;

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

  recordRepair,

  markResolved,

  calculateBestKnownFix,

  calculateRepairConfidence,

  summary,

  intelligence,

  validate,

  reset,

  clone

};

