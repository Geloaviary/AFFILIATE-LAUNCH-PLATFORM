/*
========================================
QUALITY ASSURANCE DIRECTOR

Global Metrics

Responsible for platform-wide
quality statistics.

Owns:

• Submission counts
• Approval counts
• Repair counts
• Escalation counts
• Average scores
• Pass rates
• Execution time
• Platform Health

========================================
*/

const {

  QUALITY_SCORE

} = require(
  "../../quality-types"
);

/*
========================================
CREATE
========================================
*/

function createGlobalMetrics() {

  return {

    generatedAt:
      new Date()
        .toISOString(),

    version:
      "1.0",

    submissions: 0,

    approved: 0,

    rejected: 0,

    repaired: 0,

    escalated: 0,

    averageScore: 0,

    highestScore: 0,

    lowestScore: 100,

    passRate: 0,

    repairRate: 0,

    escalationRate: 0,

    totalExecutionTime: 0,

    averageExecutionTime: 0,

    averageRepairAttempts: 0,

    health:
      "excellent"

  };

}

/*
========================================
UPDATE
========================================
*/

function updateGlobalMetrics({

  metrics = createGlobalMetrics(),

  qualityReport = {}

} = {}) {

  metrics.submissions++;

  const score =

    qualityReport.score || 0;

  metrics.averageScore =

    (

      (

        metrics.averageScore *

        (metrics.submissions - 1)

      )

      +

      score

    )

    /

    metrics.submissions;

  metrics.highestScore =

    Math.max(

      metrics.highestScore,

      score

    );

  metrics.lowestScore =

    Math.min(

      metrics.lowestScore,

      score

    );

  if (

    qualityReport.approved

  ) {

    metrics.approved++;

  }

  else {

    metrics.rejected++;

  }

  if (

    qualityReport.repaired

  ) {

    metrics.repaired++;

  }

  if (

    qualityReport.escalated

  ) {

    metrics.escalated++;

  }

  if (

    qualityReport.executionTime

  ) {

    metrics.totalExecutionTime +=

      qualityReport.executionTime;

    metrics.averageExecutionTime =

      Number(

        (

          metrics.totalExecutionTime /

          metrics.submissions

        ).toFixed(2)

      );

  }

  if (

    qualityReport.repairAttempts

  ) {

    metrics.averageRepairAttempts =

      (

        (

          metrics.averageRepairAttempts *

          (metrics.repaired - 1)

        )

        +

        qualityReport.repairAttempts

      )

      /

      metrics.repaired;

  }

  metrics.passRate =

    percentage(

      metrics.approved,

      metrics.submissions

    );

  metrics.repairRate =

    percentage(

      metrics.repaired,

      metrics.submissions

    );

  metrics.escalationRate =

    percentage(

      metrics.escalated,

      metrics.submissions

    );

  metrics.health =

    calculateHealth(
      metrics
    );

  metrics.lastUpdated =

    new Date()
      .toISOString();

  return metrics;

}

/*
========================================
HEALTH CALCULATION
========================================
*/

function calculateHealth(

  metrics = {}

) {

  const score =

    metrics.averageScore || 0;

  const passRate =

    metrics.passRate || 0;

  const escalationRate =

    metrics.escalationRate || 0;

  if (

    score >= QUALITY_SCORE.PASSING &&

    passRate >= 95 &&

    escalationRate === 0

  ) {

    return "excellent";

  }

  if (

    score >= QUALITY_SCORE.WARNING &&

    passRate >= 85

  ) {

    return "good";

  }

  if (

    score >= QUALITY_SCORE.MINIMUM

  ) {

    return "fair";

  }

  return "poor";

}

/*
========================================
PERCENTAGE
========================================
*/

function percentage(

  value = 0,

  total = 0

) {

  if (

    total <= 0

  ) {

    return 0;

  }

  return Number(

    (

      (

        value /

        total

      ) * 100

    ).toFixed(2)

  );

}

/*
========================================
GLOBAL SUMMARY

Used by Executive Summary
and Dashboard Builder.
========================================
*/

function buildGlobalSummary(

  metrics = {}

) {

  return {

    generatedAt:

      new Date()
        .toISOString(),

    health:

      metrics.health ||

      "unknown",

    submissions:

      metrics.submissions ||

      0,

    approved:

      metrics.approved ||

      0,

    rejected:

      metrics.rejected ||

      0,

    repaired:

      metrics.repaired ||

      0,

    escalated:

      metrics.escalated ||

      0,

    averageScore:

      Number(

        (

          metrics.averageScore ||

          0

        ).toFixed(2)

      ),

    highestScore:

      metrics.highestScore ||

      0,

    lowestScore:

      metrics.lowestScore ||

      0,

    passRate:

      metrics.passRate ||

      0,

    repairRate:

      metrics.repairRate ||

      0,

    escalationRate:

      metrics.escalationRate ||

      0,

    averageExecutionTime:

      metrics.averageExecutionTime ||

      0,

    averageRepairAttempts:

      Number(

        (

          metrics.averageRepairAttempts ||

          0

        ).toFixed(2)

      ),

    lastUpdated:

      metrics.lastUpdated ||

      null

  };

}

/*
========================================
RESET

Useful for testing
or platform reset.
========================================
*/

function resetGlobalMetrics() {

  return createGlobalMetrics();

}

/*
========================================
CLONE

Returns a deep copy.

Prevents accidental mutation.
========================================
*/

function cloneGlobalMetrics(

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
VALIDATE

Ensures required
properties exist.

Used by Engineering
Director later.
========================================
*/

function validateGlobalMetrics(

  metrics = {}

) {

  const required = [

    "submissions",

    "approved",

    "rejected",

    "averageScore",

    "passRate",

    "repairRate",

    "escalationRate"

  ];

  const missing =

    required.filter(

      key =>

        metrics[key] ===

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
EXPORTS
========================================
*/

module.exports = {

  createGlobalMetrics,

  updateGlobalMetrics,

  buildGlobalSummary,

  calculateHealth,

  percentage,

  resetGlobalMetrics,

  cloneGlobalMetrics,

  validateGlobalMetrics

};