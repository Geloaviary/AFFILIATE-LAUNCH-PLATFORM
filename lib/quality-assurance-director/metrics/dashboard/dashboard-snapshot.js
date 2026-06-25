/*
========================================
QUALITY ASSURANCE DIRECTOR

Dashboard Snapshot

Single immutable snapshot
consumed by

• Dashboard UI
• Executive Director
• Engineering Director
• Platform Monitoring
• Analytics
• APIs

NO BUSINESS LOGIC

NO CALCULATIONS

Only aggregates intelligence
from all QA subsystems.

Constitution QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
CREATE SNAPSHOT
========================================
*/

function create({

  globalMetrics = {},

  departmentMetrics = {},

  workflowMetrics = {},

  constitutionMetrics = {},

  violationMetrics = {},

  repairMetrics = {},

  trendMetrics = {},

  prediction = {},

  learning = {},

  maintenanceForecast = {}

} = {}) {

  const snapshot = {

    snapshotId:

      crypto

        .randomUUID(),

    generatedAt:

      new Date()
        .toISOString(),

    generatedBy:

      "quality-assurance-director",

    version:

      "1.0",

    checksum:

      null,

    platform: {

      name:

        "Affiliate Launch Platform",

      subsystem:

        "Quality Assurance Director",

      health:

        "unknown",

      confidence:

        100,

      uptime:

        null

    },

    executive: {},

    overview: {},

    quality: {},

    departments: {},

    workflow: {},

    constitution: {},

    violations: {},

    repairs: {},

    trends: {},

    predictions: {},

    learning: {},

    maintenance: {},

    engineering: {},

    alerts: [],

    metadata: {}

  };

  buildOverview({

    snapshot,

    globalMetrics

  });

  buildExecutive({

    snapshot,

    globalMetrics,

    departmentMetrics,

    trendMetrics,

    prediction

  });

  buildQuality({

    snapshot,

    globalMetrics

  });

  buildDepartments({

    snapshot,

    departmentMetrics

  });

  buildWorkflow({

    snapshot,

    workflowMetrics

  });

  buildConstitution({

    snapshot,

    constitutionMetrics

  });

  buildViolations({

    snapshot,

    violationMetrics

  });

  buildRepairs({

    snapshot,

    repairMetrics

  });

  buildTrends({

    snapshot,

    trendMetrics

  });

  buildPredictions({

    snapshot,

    prediction

  });

  buildLearning({

    snapshot,

    learning

  });

  buildMaintenance({

    snapshot,

    maintenanceForecast

  });

  buildEngineering({

    snapshot,

    repairMetrics,

    violationMetrics,

    trendMetrics

  });

  buildAlerts({

    snapshot

  });

  buildMetadata({

    snapshot

  });

  snapshot.checksum =

    createChecksum(

      snapshot

    );

  return snapshot;

}

/*
========================================
OVERVIEW
========================================
*/

function buildOverview({

  snapshot,

  globalMetrics

}) {

  snapshot.overview = {

    generatedAt:

      snapshot.generatedAt,

    submissions:

      globalMetrics.submissions ||

      0,

    approved:

      globalMetrics.approved ||

      0,

    rejected:

      globalMetrics.rejected ||

      0,

    repaired:

      globalMetrics.repaired ||

      0,

    escalated:

      globalMetrics.escalated ||

      0,

    averageScore:

      globalMetrics.averageScore ||

      0,

    passRate:

      globalMetrics.passRate ||

      0,

    repairRate:

      globalMetrics.repairRate ||

      0,

    escalationRate:

      globalMetrics.escalationRate ||

      0

  };

}

/*
========================================
EXECUTIVE
========================================
*/

function buildExecutive({

  snapshot,

  globalMetrics,

  departmentMetrics,

  trendMetrics,

  prediction

}) {

  snapshot.executive = {

    platformHealth:

      trendMetrics

        ?.platform

        ?.health ||

      "unknown",

    confidence:

      trendMetrics

        ?.platform

        ?.confidence ||

      100,

    strongestDepartment:

      prediction

        ?.strongestDepartment ||

      null,

    weakestDepartment:

      prediction

        ?.weakestDepartment ||

      null,

    nextPassProbability:

      prediction

        ?.nextPassProbability ||

      0,

    engineeringAttentionRequired:

      prediction

        ?.engineeringAttentionRequired ||

      false,

    departments:

      Object.keys(

        departmentMetrics ||

        {}

      ).length

  };

}

/*
========================================
QUALITY
========================================
*/

function buildQuality({

  snapshot,

  globalMetrics

}) {

  snapshot.quality = {

    averageScore:

      globalMetrics.averageScore ||

      0,

    highestScore:

      globalMetrics.highestScore ||

      0,

    lowestScore:

      globalMetrics.lowestScore ||

      0,

    averageExecutionTime:

      globalMetrics.averageExecutionTime ||

      0,

    averageRepairAttempts:

      globalMetrics.averageRepairAttempts ||

      0

  };

}

/*
========================================
DEPARTMENTS
========================================
*/

function buildDepartments({

  snapshot,

  departmentMetrics

}) {

  snapshot.departments = {

    total:

      Object.keys(

        departmentMetrics ||

        {}

      ).length,

    leaderboard:

      Object.entries(

        departmentMetrics ||

        {}

      )

      .sort(

        (

          [, a],

          [, b]

        ) =>

          (

            b.averageScore ||

            0

          ) -

          (

            a.averageScore ||

            0

          )

      )

      .map(

        ([

          department,

          metrics

        ]) => ({

          department,

          health:

            metrics.health ||

            "unknown",

          reputation:

            metrics.reputation ||

            100,

          score:

            metrics.averageScore ||

            0,

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

          streak:

            metrics.streak ||

            0,

          bestStreak:

            metrics.bestStreak ||

            0,

          failuresInRow:

            metrics.failuresInRow ||

            0,

          averageExecutionTime:

            metrics.averageExecutionTime ||

            0

        })

      )

  };

}

/*
========================================
WORKFLOW
========================================
*/

function buildWorkflow({

  snapshot,

  workflowMetrics

}) {

  snapshot.workflow = {

    current:

      workflowMetrics.current ||

      {},

    completed:

      workflowMetrics.completed ||

      0,

    queued:

      workflowMetrics.queued ||

      0,

    failed:

      workflowMetrics.failed ||

      0,

    averageExecutionTime:

      workflowMetrics.averageExecutionTime ||

      0,

    bottleneck:

      workflowMetrics.bottleneck ||

      null,

    busiestStage:

      workflowMetrics.busiestStage ||

      null,

    stages:

      workflowMetrics.stages ||

      {}

  };

}

/*
========================================
CONSTITUTION
========================================
*/

function buildConstitution({

  snapshot,

  constitutionMetrics

}) {

  snapshot.constitution = {

    complianceRate:

      constitutionMetrics.complianceRate ||

      100,

    totalViolations:

      constitutionMetrics.totalViolations ||

      0,

    criticalViolations:

      constitutionMetrics.criticalViolations ||

      0,

    warningViolations:

      constitutionMetrics.warningViolations ||

      0,

    status:

      constitutionMetrics.status ||

      "healthy",

    score:

      constitutionMetrics.score ||

      100

  };

}

/*
========================================
VIOLATIONS
========================================
*/

function buildViolations({

  snapshot,

  violationMetrics

}) {

  snapshot.violations = {

    total:

      violationMetrics.totalViolations ||

      0,

    unique:

      violationMetrics.uniqueViolations ||

      0,

    recurring:

      violationMetrics.recurringViolations ||

      0,

    critical:

      violationMetrics.criticalViolations ||

      0,

    warning:

      violationMetrics.warningViolations ||

      0,

    error:

      violationMetrics.errorViolations ||

      0,

    info:

      violationMetrics.infoViolations ||

      0,

    mostCommon:

      violationMetrics.mostCommonViolation ||

      null,

    mostAffectedDepartment:

      violationMetrics.mostAffectedDepartment ||

      null,

    highestSeverity:

      violationMetrics.highestSeverity ||

      null,

    intelligence:

      violationMetrics.intelligence ||

      {}

  };

}

/*
========================================
REPAIRS
========================================
*/

function buildRepairs({

  snapshot,

  repairMetrics

}) {

  snapshot.repairs = {

    total:

      repairMetrics.totalRepairs ||

      0,

    successful:

      repairMetrics.successfulRepairs ||

      0,

    failed:

      repairMetrics.failedRepairs ||

      0,

    autoRepairs:

      repairMetrics.autoRepairs ||

      0,

    manualRepairs:

      repairMetrics.manualRepairs ||

      0,

    averageRepairTime:

      repairMetrics.averageRepairTime ||

      0,

    averageAttempts:

      repairMetrics.averageAttempts ||

      0,

    repairSuccessRate:

      repairMetrics.repairSuccessRate ||

      0,

    repairFailureRate:

      repairMetrics.repairFailureRate ||

      0,

    confidence:

      repairMetrics.repairConfidence ||

      100,

    sla:

      repairMetrics.sla ||

      {},

    automation:

      repairMetrics.automation ||

      {},

    intelligence:

      repairMetrics.intelligence ||

      {}

  };

}

/*
========================================
TRENDS
========================================
*/

function buildTrends({

  snapshot,

  trendMetrics

}) {

  snapshot.trends = {

    platform:

      trendMetrics.platform ||

      {},

    forecast:

      trendMetrics.forecast ||

      {},

    quality:

      trendMetrics.quality ||

      {},

    repairs:

      trendMetrics.repairs ||

      {},

    violations:

      trendMetrics.violations ||

      {},

    workflow:

      trendMetrics.workflow ||

      {},

    constitution:

      trendMetrics.constitution ||

      {},

    execution:

      trendMetrics.execution ||

      {},

    departments:

      trendMetrics.departments ||

      {},

    intelligence:

      trendMetrics.intelligence ||

      {}

  };

}

/*
========================================
PREDICTIONS
========================================
*/

function buildPredictions({

  snapshot,

  prediction

}) {

  snapshot.predictions = {

    nextPassProbability:

      prediction.nextPassProbability ||

      0,

    nextRepairProbability:

      prediction.nextRepairProbability ||

      0,

    expectedRepairAttempts:

      prediction.expectedRepairAttempts ||

      0,

    strongestDepartment:

      prediction.strongestDepartment ||

      null,

    weakestDepartment:

      prediction.weakestDepartment ||

      null,

    bottleneckDepartment:

      prediction.bottleneckDepartment ||

      null,

    mostCommonViolation:

      prediction.mostCommonViolation ||

      null,

    recurringViolation:

      prediction.recurringViolation ||

      null,

    riskLevel:

      prediction.riskLevel ||

      "unknown",

    engineeringAttentionRequired:

      prediction.engineeringAttentionRequired ||

      false,

    systemStability:

      prediction.systemStability ||

      {}

  };

}

/*
========================================
LEARNING
========================================
*/

function buildLearning({

  snapshot,

  learning

}) {

  snapshot.learning = {

    discoveredPatterns:

      learning.discoveredPatterns ||

      [],

    recurringFailures:

      learning.recurringFailures ||

      [],

    successfulStrategies:

      learning.successfulStrategies ||

      [],

    recommendations:

      learning.recommendations ||

      [],

    autoOptimizations:

      learning.autoOptimizations ||

      [],

    confidenceScore:

      learning.confidenceScore ||

      100

  };

}

/*
========================================
MAINTENANCE
========================================
*/

function buildMaintenance({

  snapshot,

  maintenanceForecast

}) {

  snapshot.maintenance = {

    likelyFailureDepartment:

      maintenanceForecast

        .likelyFailureDepartment ||

      null,

    likelyRule:

      maintenanceForecast

        .likelyRule ||

      null,

    confidence:

      maintenanceForecast

        .confidence ||

      0,

    predictedRepairTickets:

      maintenanceForecast

        .predictedRepairTickets ||

      0,

    engineeringQueue:

      maintenanceForecast

        .engineeringQueue ||

      [],

    recommendations:

      maintenanceForecast

        .recommendations ||

      []

  };

}

/*
========================================
ENGINEERING
========================================
*/

function buildEngineering({

  snapshot,

  repairMetrics,

  violationMetrics,

  trendMetrics

}) {

  snapshot.engineering = {

    attentionRequired:

      trendMetrics

        ?.intelligence

        ?.engineeringAttentionRequired ||

      false,

    recurringViolations:

      violationMetrics

        ?.recurringViolations ||

      0,

    repairFailures:

      repairMetrics

        ?.failedRepairs ||

      0,

    slaBreaches:

      repairMetrics

        ?.sla

        ?.totalBreaches ||

      0,

    repairConfidence:

      repairMetrics

        ?.repairConfidence ||

      100,

    platformTrend:

      trendMetrics

        ?.platform

        ?.trend ||

      "stable",

    recommendations: [

      ...(trendMetrics
        ?.intelligence
        ?.recommendations ||

        []),

      ...(repairMetrics
        ?.intelligence
        ?.recommendations ||

        []),

      ...(violationMetrics
        ?.intelligence
        ?.recommendations ||

        [])

    ]

  };

}

/*
========================================
ALERTS

Unified platform alerts
========================================
*/

function buildAlerts({

  snapshot

}) {

  snapshot.alerts = [];

  if (

    snapshot.engineering
      .attentionRequired

  ) {

    snapshot.alerts.push({

      severity:

        "critical",

      source:

        "engineering",

      message:

        "Engineering attention required."

    });

  }

  if (

    snapshot.constitution
      .criticalViolations >

    0

  ) {

    snapshot.alerts.push({

      severity:

        "critical",

      source:

        "constitution",

      message:

        "Critical constitutional violations detected."

    });

  }

  if (

    snapshot.repairs
      .repairFailureRate >

    20

  ) {

    snapshot.alerts.push({

      severity:

        "warning",

      source:

        "repairs",

      message:

        "Repair failure rate exceeds threshold."

    });

  }

  if (

    snapshot.predictions
      .riskLevel ===

    "critical"

  ) {

    snapshot.alerts.push({

      severity:

        "critical",

      source:

        "prediction",

      message:

        "Prediction engine indicates critical platform risk."

    });

  }

}

/*
========================================
METADATA
========================================
*/

function buildMetadata({

  snapshot

}) {

  snapshot.metadata = {

    snapshotId:

      snapshot.snapshotId,

    version:

      snapshot.version,

    generatedBy:

      snapshot.generatedBy,

    generatedAt:

      snapshot.generatedAt,

    checksum:

      snapshot.checksum,

    immutable: true,

    schema:

      "dashboard-snapshot-v1",

    platform:

      snapshot.platform.name,

    subsystem:

      snapshot.platform.subsystem

  };

}

/*
========================================
CHECKSUM

Detects snapshot changes.

========================================
*/

function createChecksum(

  snapshot

) {

  return crypto

    .createHash(

      "sha256"

    )

    .update(

      JSON.stringify({

        overview:

          snapshot.overview,

        executive:

          snapshot.executive,

        quality:

          snapshot.quality,

        departments:

          snapshot.departments,

        workflow:

          snapshot.workflow,

        constitution:

          snapshot.constitution,

        violations:

          snapshot.violations,

        repairs:

          snapshot.repairs,

        trends:

          snapshot.trends,

        predictions:

          snapshot.predictions,

        learning:

          snapshot.learning,

        maintenance:

          snapshot.maintenance,

        engineering:

          snapshot.engineering,

        alerts:

          snapshot.alerts

      })

    )

    .digest(

      "hex"

    );

}

/*
========================================
VALIDATION

Verifies dashboard integrity.

========================================
*/

function validate(

  snapshot = {}

) {

  const required = [

    "snapshotId",

    "generatedAt",

    "overview",

    "executive",

    "quality",

    "departments",

    "workflow",

    "constitution",

    "violations",

    "repairs",

    "trends",

    "predictions",

    "learning",

    "maintenance",

    "engineering",

    "alerts",

    "metadata"

  ];

  const missing =

    required.filter(

      property =>

        snapshot[property] ===

        undefined

    );

  return {

    valid:

      missing.length === 0,

    missing,

    checksumValid:

      snapshot.checksum ===

      createChecksum(

        snapshot

      )

  };

}

/*
========================================
FREEZE

Returns immutable snapshot.

========================================
*/

function freeze(

  snapshot = {}

) {

  return Object.freeze(

    snapshot

  );

}

/*
========================================
CLONE

========================================
*/

function clone(

  snapshot = {}

) {

  return JSON.parse(

    JSON.stringify(

      snapshot

    )

  );

}

/*
========================================
JSON EXPORT

========================================
*/

function toJSON(

  snapshot = {}

) {

  return JSON.stringify(

    snapshot,

    null,

    2

  );

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

  validate,

  freeze,

  clone,

  toJSON

};