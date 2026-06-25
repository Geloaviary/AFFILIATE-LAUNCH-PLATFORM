/*
========================================
QUALITY ASSURANCE DIRECTOR

Repair Metrics

Tracks every repair performed
throughout the platform.

Responsible for

• Repair Database
• Repair Tickets
• Repair History
• Department Repairs
• Repair Success
• SLA Tracking
• Auto Repair Statistics
• Repair Intelligence

Constitution QA-001
Universal Module Contract

========================================
*/

const {

  REPAIR_STATUS,

  DEPARTMENTS

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

    totalRepairs: 0,

    successfulRepairs: 0,

    failedRepairs: 0,

    autoRepairs: 0,

    manualRepairs: 0,

    averageRepairTime: 0,

    totalRepairTime: 0,

    averageAttempts: 0,

    repairSuccessRate: 100,

    repairFailureRate: 0,

    repairConfidence: 100,

    repairDatabase: {},

    tickets: {},

    departments: {},

    violations: {},

    history: [],

    timeline: [],

    automation: {

      attempted: 0,

      successful: 0,

      failed: 0,

      confidence: 100

    },

    sla: {

      totalBreaches: 0,

      averageCompletionTime: 0,

      longestRepair: 0,

      shortestRepair: 0

    },

    intelligence: {

      recurringRepairs: [],

      successfulPatterns: [],

      failedPatterns: [],

      bestRepairStrategy: null,

      recommendations: [],

      engineeringAttentionRequired: false,

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

  qualityReport = {},

  repairTicket = null

} = {}) {

  if (

    !repairTicket

  ) {

    return metrics;

  }

  updateRepairDatabase({

    metrics,

    submission,

    qualityReport,

    repairTicket

  });

  updateDepartmentDatabase({

    metrics,

    repairTicket

  });

  updateViolationDatabase({

    metrics,

    repairTicket

  });

  updateHistory({

    metrics,

    submission,

    repairTicket

  });

  updateAutomation({

    metrics,

    repairTicket

  });

  updateSLA({

    metrics,

    repairTicket

  });

  updateStatistics(

    metrics

  );

  return metrics;

}

/*
========================================
REPAIR DATABASE
========================================
*/

function updateRepairDatabase({

  metrics,

  submission,

  qualityReport,

  repairTicket

}) {

  const id =

    repairTicket.id;

  if (

    !metrics.repairDatabase[id]

  ) {

    metrics.repairDatabase[id] = {

      id,

      submissionId:

        submission.id ||

        null,

      violationCode:

        repairTicket.violationCode ||

        null,

      department:

        repairTicket.department ||

        submission.department ||

        "unknown",

      workflowStage:

        submission.workflowStage ||

        null,

      createdAt:

        repairTicket.createdAt ||

        new Date()
          .toISOString(),

      repairedAt:

        repairTicket.completedAt ||

        null,

      assignedTo:

        repairTicket.assignedTo ||

        null,

      status:

        repairTicket.status ||

        REPAIR_STATUS.OPEN,

      successful:

        false,

      attempts: 0,

      executionTime: 0,

      autoRepair: false,

      rootCause: null,

      fixApplied: null,

      verificationScore: 0,

      notes: [],

      timeline: []

    };

  }

  const repair =

    metrics.repairDatabase[id];

  repair.status =

    repairTicket.status;

  repair.successful =

    Boolean(

      repairTicket.successful

    );

  repair.repairedAt =

    repairTicket.completedAt ||

    repair.repairedAt;

  repair.executionTime =

    repairTicket.executionTime ||

    repair.executionTime;

  repair.autoRepair =

    Boolean(

      repairTicket.autoRepair

    );

  repair.rootCause =

    repairTicket.rootCause ||

    repair.rootCause;

  repair.fixApplied =

    repairTicket.fixApplied ||

    repair.fixApplied;

  repair.verificationScore =

    repairTicket.verificationScore ||

    repair.verificationScore;

  repair.attempts++;

  repair.timeline.push({

    timestamp:

      new Date()
        .toISOString(),

    status:

      repair.status

  });

}

/*
========================================
TICKET DATABASE
========================================
*/

function updateDepartmentDatabase({

  metrics,

  repairTicket

}) {

  const department =

    repairTicket.department ||

    "unknown";

  if (

    !metrics.departments[department]

  ) {

    metrics.departments[department] = {

      repairs: 0,

      successful: 0,

      failed: 0,

      averageRepairTime: 0,

      totalRepairTime: 0,

      autoRepairs: 0,

      manualRepairs: 0,

      confidence: 100

    };

  }

  const dept =

    metrics.departments[
      department
    ];

  dept.repairs++;

  if (

    repairTicket.successful

  ) {

    dept.successful++;

  }

  else {

    dept.failed++;

  }

  dept.totalRepairTime +=

    repairTicket.executionTime ||

    0;

  dept.averageRepairTime =

    Number(

      (

        dept.totalRepairTime /

        dept.repairs

      ).toFixed(2)

    );

  if (

    repairTicket.autoRepair

  ) {

    dept.autoRepairs++;

  }

  else {

    dept.manualRepairs++;

  }

}

/*
========================================
VIOLATION DATABASE
========================================
*/

function updateViolationDatabase({

  metrics,

  repairTicket

}) {

  const code =

    repairTicket.violationCode ||

    "UNKNOWN";

  if (

    !metrics.violations[code]

  ) {

    metrics.violations[code] = {

      repairs: 0,

      successful: 0,

      failed: 0,

      averageRepairTime: 0,

      totalRepairTime: 0,

      bestFix: null,

      lastFix: null,

      confidence: 100

    };

  }

  const violation =

    metrics.violations[code];

  violation.repairs++;

  if (

    repairTicket.successful

  ) {

    violation.successful++;

  }

  else {

    violation.failed++;

  }

  violation.totalRepairTime +=

    repairTicket.executionTime ||

    0;

  violation.averageRepairTime =

    Number(

      (

        violation.totalRepairTime /

        violation.repairs

      ).toFixed(2)

    );

  violation.lastFix =

    repairTicket.fixApplied ||

    null;

  if (

    repairTicket.successful

  ) {

    violation.bestFix =

      repairTicket.fixApplied ||

      violation.bestFix;

  }

}

/*
========================================
HISTORY
========================================
*/

function updateHistory({

  metrics,

  submission,

  repairTicket

}) {

  const record = {

    timestamp:

      new Date()
        .toISOString(),

    repairTicketId:

      repairTicket.id,

    submissionId:

      submission.id ||

      null,

    department:

      repairTicket.department ||

      submission.department ||

      "unknown",

    violationCode:

      repairTicket.violationCode ||

      null,

    successful:

      Boolean(

        repairTicket.successful

      ),

    autoRepair:

      Boolean(

        repairTicket.autoRepair

      ),

    executionTime:

      repairTicket.executionTime ||

      0,

    verificationScore:

      repairTicket.verificationScore ||

      0

  };

  metrics.history.push(

    record

  );

  metrics.timeline.push({

    timestamp:

      record.timestamp,

    department:

      record.department,

    successful:

      record.successful

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
AUTOMATION
========================================
*/

function updateAutomation({

  metrics,

  repairTicket

}) {

  if (

    repairTicket.autoRepair

  ) {

    metrics.autoRepairs++;

    metrics.automation.attempted++;

    if (

      repairTicket.successful

    ) {

      metrics.automation.successful++;

    }

    else {

      metrics.automation.failed++;

    }

  }

  else {

    metrics.manualRepairs++;

  }

  metrics.automation.confidence =

    percentage(

      metrics.automation.successful,

      metrics.automation.attempted

    );

}

/*
========================================
SLA
========================================
*/

function updateSLA({

  metrics,

  repairTicket

}) {

  const duration =

    repairTicket.executionTime ||

    0;

  metrics.totalRepairTime +=

    duration;

  metrics.averageRepairTime =

    Number(

      (

        metrics.totalRepairTime /

        (

          metrics.totalRepairs +

          1

        )

      ).toFixed(2)

    );

  if (

    metrics.sla.shortestRepair === 0 ||

    duration <

    metrics.sla.shortestRepair

  ) {

    metrics.sla.shortestRepair =

      duration;

  }

  metrics.sla.longestRepair =

    Math.max(

      metrics.sla.longestRepair,

      duration

    );

  metrics.sla.averageCompletionTime =

    metrics.averageRepairTime;

  if (

    duration >

    300

  ) {

    metrics.sla.totalBreaches++;

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

  metrics.totalRepairs =

    Object.keys(

      metrics.repairDatabase

    ).length;

  metrics.successfulRepairs =

    Object.values(

      metrics.repairDatabase

    ).filter(

      repair =>

        repair.successful

    ).length;

  metrics.failedRepairs =

    metrics.totalRepairs -

    metrics.successfulRepairs;

  metrics.repairSuccessRate =

    percentage(

      metrics.successfulRepairs,

      metrics.totalRepairs

    );

  metrics.repairFailureRate =

    percentage(

      metrics.failedRepairs,

      metrics.totalRepairs

    );

  metrics.averageAttempts =

    averageAttempts(

      metrics

    );

  metrics.repairConfidence =

    calculateConfidence(

      metrics

    );

}

/*
========================================
SUMMARY

Used by Dashboard Builder
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

    totalRepairs:

      metrics.totalRepairs,

    successfulRepairs:

      metrics.successfulRepairs,

    failedRepairs:

      metrics.failedRepairs,

    autoRepairs:

      metrics.autoRepairs,

    manualRepairs:

      metrics.manualRepairs,

    repairSuccessRate:

      metrics.repairSuccessRate,

    repairFailureRate:

      metrics.repairFailureRate,

    averageRepairTime:

      metrics.averageRepairTime,

    averageAttempts:

      metrics.averageAttempts,

    repairConfidence:

      metrics.repairConfidence,

    sla:

      metrics.sla

  };

}

/*
========================================
INTELLIGENCE

Consumed by

• Dashboard
• Executive Director
• Learning Engine
• Prediction Engine
• Engineering Director

========================================
*/

function intelligence(

  metrics = {}

) {

  const recurringRepairs =

    Object.entries(

      metrics.violations

    )

    .filter(

      ([, violation]) =>

        violation.repairs >= 3

    )

    .sort(

      (a, b) =>

        b[1].repairs -

        a[1].repairs

    )

    .map(

      ([code]) =>

        code

    );

  const successfulPatterns =

    Object.entries(

      metrics.violations

    )

    .filter(

      ([, violation]) =>

        violation.successful >

        violation.failed

    )

    .map(

      ([code]) =>

        code

    );

  const failedPatterns =

    Object.entries(

      metrics.violations

    )

    .filter(

      ([, violation]) =>

        violation.failed >=

        violation.successful

    )

    .map(

      ([code]) =>

        code

    );

  metrics.intelligence.recurringRepairs =

    recurringRepairs;

  metrics.intelligence.successfulPatterns =

    successfulPatterns;

  metrics.intelligence.failedPatterns =

    failedPatterns;

  metrics.intelligence.bestRepairStrategy =

    determineBestStrategy(

      metrics

    );

  metrics.intelligence.recommendations =

    buildRecommendations(

      metrics

    );

  metrics.intelligence.engineeringAttentionRequired =

    metrics.repairFailureRate >

    20 ||

    recurringRepairs.length >

    0;

  metrics.intelligence.confidence =

    calculateConfidence(

      metrics

    );

  return metrics.intelligence;

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

    "repairDatabase",

    "departments",

    "violations",

    "history",

    "timeline",

    "automation",

    "sla"

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

function percentage(

  value,

  total

) {

  if (

    total === 0

  ) {

    return 0;

  }

  return Number(

    (

      (

        value /

        total

      ) *

      100

    ).toFixed(2)

  );

}

function averageAttempts(

  metrics

) {

  const repairs =

    Object.values(

      metrics.repairDatabase

    );

  if (

    repairs.length === 0

  ) {

    return 0;

  }

  const total =

    repairs.reduce(

      (

        sum,

        repair

      ) =>

        sum +

        repair.attempts,

      0

    );

  return Number(

    (

      total /

      repairs.length

    ).toFixed(2)

  );

}

function calculateConfidence(

  metrics

) {

  let confidence = 100;

  confidence -=

    metrics.failedRepairs * 2;

  confidence -=

    metrics.sla.totalBreaches;

  confidence +=

    metrics.automation.successful;

  return Math.max(

    0,

    Math.min(

      100,

      confidence

    )

  );

}

function determineBestStrategy(

  metrics

) {

  const violations =

    Object.values(

      metrics.violations

    )

    .filter(

      violation =>

        violation.bestFix

    );

  if (

    !violations.length

  ) {

    return null;

  }

  return violations

    .sort(

      (a, b) =>

        b.successful -

        a.successful

    )[0]

    .bestFix;

}

function buildRecommendations(

  metrics

) {

  const recommendations = [];

  if (

    metrics.repairFailureRate >

    20

  ) {

    recommendations.push(

      "Improve repair validation before resubmission."

    );

  }

  if (

    metrics.sla.totalBreaches >

    0

  ) {

    recommendations.push(

      "Investigate repair SLA breaches."

    );

  }

  if (

    metrics.automation.confidence >

    90

  ) {

    recommendations.push(

      "Increase automatic repair coverage."

    );

  }

  if (

    metrics.averageAttempts >

    2

  ) {

    recommendations.push(

      "Reduce repeated repair attempts."

    );

  }

  return recommendations;

}

/*
========================================
EXPORTS

Universal Module Contract

QA-001
========================================
*/

module.exports = {

  create,

  update,

  summary,

  intelligence,

  validate,

  reset,

  clone,

  percentage,

  averageAttempts,

  calculateConfidence,

  determineBestStrategy,

  buildRecommendations

};