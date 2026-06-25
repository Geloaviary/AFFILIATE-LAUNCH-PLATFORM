/*
========================================
QUALITY ASSURANCE DIRECTOR

Executive Summary

Executive Decision Engine

Single source of truth for
executive-level platform health.

Consumes

• Dashboard Snapshot
• Global Metrics
• Department Metrics
• Workflow Metrics
• Constitution Metrics
• Violation Metrics
• Repair Metrics
• Trend Metrics
• Prediction Engine
• Learning Engine
• Maintenance Forecast

Constitution QA-001

========================================
*/

const crypto = require(
  "crypto"
);

/*
========================================
CREATE
========================================
*/

function create({

  dashboard = {},

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

  const summary = {

    summaryId:

      crypto.randomUUID(),

    generatedAt:

      new Date()
        .toISOString(),

    generatedBy:

      "quality-assurance-director",

    version:

      "1.0",

    checksum:

      null,

    overview: {},

    platform: {},

    executiveKPIs: {},

    readiness: {},

    quality: {},

    departments: {},

    workflow: {},

    constitution: {},

    repairs: {},

    violations: {},

    trends: {},

    predictions: {},

    learning: {},

    maintenance: {},

    risks: {},

    opportunities: {},

    priorities: [],

    recommendations: [],

    decision: {},

    metadata: {}

  };

  buildOverview({

    summary,

    dashboard,

    globalMetrics

  });

  buildPlatform({

    summary,

    trendMetrics,

    prediction

  });

  buildExecutiveKPIs({

    summary,

    globalMetrics,

    repairMetrics,

    violationMetrics

  });

  buildReadiness({

    summary,

    dashboard,

    constitutionMetrics,

    prediction

  });

  return summary;

}

/*
========================================
OVERVIEW
========================================
*/

function buildOverview({

  summary,

  dashboard,

  globalMetrics

}) {

  summary.overview = {

    generatedAt:

      summary.generatedAt,

    platform:

      "Affiliate Launch Platform",

    subsystem:

      "Quality Assurance Director",

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

    dashboardHealth:

      dashboard.platform

        ?.health ||

      "unknown"

  };

}

/*
========================================
PLATFORM
========================================
*/

function buildPlatform({

  summary,

  trendMetrics,

  prediction

}) {

  summary.platform = {

    health:

      trendMetrics.platform

        ?.health ||

      "unknown",

    trend:

      trendMetrics.platform

        ?.trend ||

      "stable",

    confidence:

      trendMetrics.platform

        ?.confidence ||

      100,

    riskLevel:

      prediction.riskLevel ||

      "low",

    engineeringAttentionRequired:

      prediction.engineeringAttentionRequired ||

      false

  };

}

/*
========================================
EXECUTIVE KPIs
========================================
*/

function buildExecutiveKPIs({

  summary,

  globalMetrics,

  repairMetrics,

  violationMetrics

}) {

  summary.executiveKPIs = {

    averageQualityScore:

      globalMetrics.averageScore ||

      0,

    passRate:

      globalMetrics.passRate ||

      0,

    repairSuccessRate:

      repairMetrics.repairSuccessRate ||

      0,

    repairFailureRate:

      repairMetrics.repairFailureRate ||

      0,

    recurringViolations:

      violationMetrics.recurringViolations ||

      0,

    criticalViolations:

      violationMetrics.criticalViolations ||

      0

  };

}

/*
========================================
PLATFORM READINESS
========================================
*/

function buildReadiness({

  summary,

  dashboard,

  constitutionMetrics,

  prediction

}) {

  const quality =

    dashboard.quality

      ?.averageScore ||

    0;

  const compliance =

    constitutionMetrics

      .complianceRate ||

    100;

  const risk =

    prediction.riskLevel ||

    "low";

  let score =

    Math.round(

      (quality * 0.60) +

      (compliance * 0.40)

    );

  if (

    risk === "critical"

  ) {

    score -= 20;

  }

  else if (

    risk === "high"

  ) {

    score -= 10;

  }

  score = Math.max(

    0,

    Math.min(

      100,

      score

    )

  );

  summary.readiness = {

    score,

    status:

      score >= 90

        ? "ready"

        : score >= 75

        ? "ready-with-warnings"

        : score >= 60

        ? "hold"

        : "stop"

  };

}

/*
========================================
DEPARTMENT SUMMARY
========================================
*/

function buildDepartments({

  summary,

  departmentMetrics = {},

  prediction = {}

}) {

  const departments =

    Object.entries(

      departmentMetrics

    )

    .map(

      ([name, metrics]) => ({

        department:

          name,

        health:

          metrics.health ||

          "unknown",

        reputation:

          metrics.reputation ||

          100,

        averageScore:

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

    .sort(

      (a,b)=>

        b.averageScore -

        a.averageScore

    );

  summary.departments = {

    total:

      departments.length,

    strongest:

      prediction

        .strongestDepartment ||

      departments[0]

        ?.department ||

      null,

    weakest:

      prediction

        .weakestDepartment ||

      departments.at(-1)

        ?.department ||

      null,

    leaderboard:

      departments,

    atRisk:

      departments

        .filter(

          dept =>

            dept.health ===

            "poor"

        )

  };

}

/*
========================================
WORKFLOW SUMMARY
========================================
*/

function buildWorkflow({

  summary,

  workflowMetrics = {}

}) {

  summary.workflow = {

    completed:

      workflowMetrics.completed ||

      0,

    queued:

      workflowMetrics.queued ||

      0,

    failed:

      workflowMetrics.failed ||

      0,

    bottleneck:

      workflowMetrics.bottleneck ||

      null,

    busiestStage:

      workflowMetrics.busiestStage ||

      null,

    averageExecutionTime:

      workflowMetrics

        .averageExecutionTime ||

      0,

    workflowHealth:

      workflowMetrics.health ||

      "healthy",

    stages:

      workflowMetrics.stages ||

      {}

  };

}

/*
========================================
CONSTITUTION SUMMARY
========================================
*/

function buildConstitution({

  summary,

  constitutionMetrics = {}

}) {

  summary.constitution = {

    complianceRate:

      constitutionMetrics

        .complianceRate ||

      100,

    score:

      constitutionMetrics

        .score ||

      100,

    status:

      constitutionMetrics

        .status ||

      "healthy",

    totalViolations:

      constitutionMetrics

        .totalViolations ||

      0,

    criticalViolations:

      constitutionMetrics

        .criticalViolations ||

      0,

    warningViolations:

      constitutionMetrics

        .warningViolations ||

      0

  };

}

/*
========================================
REPAIR SUMMARY
========================================
*/

function buildRepairs({

  summary,

  repairMetrics = {}

}) {

  summary.repairs = {

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

    repairSuccessRate:

      repairMetrics

        .repairSuccessRate ||

      0,

    repairFailureRate:

      repairMetrics

        .repairFailureRate ||

      0,

    averageRepairTime:

      repairMetrics

        .averageRepairTime ||

      0,

    averageAttempts:

      repairMetrics

        .averageAttempts ||

      0,

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
VIOLATION SUMMARY
========================================
*/

function buildViolations({

  summary,

  violationMetrics = {}

}) {

  summary.violations = {

    total:

      violationMetrics

        .totalViolations ||

      0,

    unique:

      violationMetrics

        .uniqueViolations ||

      0,

    recurring:

      violationMetrics

        .recurringViolations ||

      0,

    critical:

      violationMetrics

        .criticalViolations ||

      0,

    warning:

      violationMetrics

        .warningViolations ||

      0,

    error:

      violationMetrics

        .errorViolations ||

      0,

    info:

      violationMetrics

        .infoViolations ||

      0,

    mostCommon:

      violationMetrics

        .mostCommonViolation ||

      null,

    mostAffectedDepartment:

      violationMetrics

        .mostAffectedDepartment ||

      null,

    highestSeverity:

      violationMetrics

        .highestSeverity ||

      null,

    intelligence:

      violationMetrics

        .intelligence ||

      {}

  };

}

/*
========================================
TREND SUMMARY
========================================
*/

function buildTrends({

  summary,

  trendMetrics = {}

}) {

  summary.trends = {

    platform:

      trendMetrics.platform ||

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

    forecast:

      trendMetrics.forecast ||

      {},

    intelligence:

      trendMetrics.intelligence ||

      {}

  };

}

/*
========================================
PREDICTION SUMMARY
========================================
*/

function buildPredictions({

  summary,

  prediction = {}

}) {

  summary.predictions = {

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
LEARNING SUMMARY
========================================
*/

function buildLearning({

  summary,

  learning = {}

}) {

  summary.learning = {

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
MAINTENANCE SUMMARY
========================================
*/

function buildMaintenance({

  summary,

  maintenanceForecast = {}

}) {

  summary.maintenance = {

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
RISK ASSESSMENT
========================================
*/

function buildRisks({

  summary

}) {

  summary.risks = {

    level:

      summary.predictions
        .riskLevel ||

      "unknown",

    engineeringAttentionRequired:

      summary.predictions
        .engineeringAttentionRequired ||

      false,

    criticalViolations:

      summary.constitution
        .criticalViolations ||

      0,

    recurringViolations:

      summary.violations
        .recurring ||

      0,

    repairFailures:

      summary.repairs
        .failed ||

      0,

    platformHealth:

      summary.platform
        .health ||

      "unknown"

  };

}

/*
========================================
OPPORTUNITIES
========================================
*/

function buildOpportunities({

  summary

}) {

  summary.opportunities = {

    strongestDepartment:

      summary.departments
        .strongest,

    highestQualityScore:

      summary.executiveKPIs
        .averageQualityScore ||

      0,

    automationCandidates:

      summary.learning
        .autoOptimizations ||

      [],

    successfulStrategies:

      summary.learning
        .successfulStrategies ||

      [],

    trendImprovements:

      summary.trends
        .intelligence
        ?.improving ||

      []

  };

}

/*
========================================
EXECUTIVE PRIORITIES
========================================
*/

function buildPriorities({

  summary

}) {

  summary.priorities = [];

  if (

    summary.constitution
      .criticalViolations >

    0

  ) {

    summary.priorities.push({

      priority: 1,

      type: "constitution",

      message:

        "Resolve critical constitutional violations immediately."

    });

  }

  if (

    summary.risks
      .engineeringAttentionRequired

  ) {

    summary.priorities.push({

      priority: 2,

      type: "engineering",

      message:

        "Engineering intervention required."

    });

  }

  if (

    summary.repairs
      .repairFailureRate >

    20

  ) {

    summary.priorities.push({

      priority: 3,

      type: "repairs",

      message:

        "Improve repair success rate."

    });

  }

  if (

    summary.workflow
      .bottleneck

  ) {

    summary.priorities.push({

      priority: 4,

      type: "workflow",

      message:

        `Remove bottleneck at ${summary.workflow.bottleneck}.`

    });

  }

}

/*
========================================
EXECUTIVE
RECOMMENDATIONS
========================================
*/

function buildRecommendations({

  summary

}) {

  summary.recommendations = [

    ...summary.learning
      .recommendations,

    ...summary.maintenance
      .recommendations

  ];

  summary.priorities.forEach(

    priority =>

      summary.recommendations.push(

        priority.message

      )

  );

}

/*
========================================
EXECUTIVE DECISION ENGINE

Final executive decision
for the entire platform.

GO
GO_WITH_WARNINGS
HOLD
STOP

========================================
*/

function buildDecision({

  summary

}) {

  const readiness =

    summary.readiness.score;

  const criticalViolations =

    summary.constitution
      .criticalViolations;

  const repairFailures =

    summary.repairs
      .repairFailureRate;

  const engineering =

    summary.risks
      .engineeringAttentionRequired;

  let decision =

    "GO";

  let reason =

    "Platform operating normally.";

  if (

    criticalViolations > 0

  ) {

    decision =

      "STOP";

    reason =

      "Critical constitutional violations detected.";

  }

  else if (

    engineering

  ) {

    decision =

      "HOLD";

    reason =

      "Engineering attention required.";

  }

  else if (

    repairFailures > 20 ||

    readiness < 75

  ) {

    decision =

      "GO_WITH_WARNINGS";

    reason =

      "Platform operational with elevated risk.";

  }

  summary.decision = {

    decision,

    reason,

    approved:

      decision === "GO",

    approvedWithWarnings:

      decision ===

      "GO_WITH_WARNINGS",

    generatedAt:

      new Date()
        .toISOString()

  };

}

/*
========================================
METADATA
========================================
*/

function buildMetadata({

  summary

}) {

  summary.metadata = {

    summaryId:

      summary.summaryId,

    version:

      summary.version,

    generatedBy:

      summary.generatedBy,

    generatedAt:

      summary.generatedAt,

    checksum:

      summary.checksum,

    schema:

      "executive-summary-v1",

    immutable:

      true

  };

}

/*
========================================
CHECKSUM
========================================
*/

function createChecksum(

  summary

) {

  return crypto

    .createHash(

      "sha256"

    )

    .update(

      JSON.stringify({

        overview:

          summary.overview,

        platform:

          summary.platform,

        executiveKPIs:

          summary.executiveKPIs,

        readiness:

          summary.readiness,

        departments:

          summary.departments,

        workflow:

          summary.workflow,

        constitution:

          summary.constitution,

        repairs:

          summary.repairs,

        violations:

          summary.violations,

        trends:

          summary.trends,

        predictions:

          summary.predictions,

        learning:

          summary.learning,

        maintenance:

          summary.maintenance,

        risks:

          summary.risks,

        opportunities:

          summary.opportunities,

        priorities:

          summary.priorities,

        recommendations:

          summary.recommendations,

        decision:

          summary.decision

      })

    )

    .digest(

      "hex"

    );

}

/*
========================================
FINALIZE

Called once before
returning summary.
========================================
*/

function finalize(

  summary

) {

  buildDecision({

    summary

  });

  buildMetadata({

    summary

  });

  summary.checksum =

    createChecksum(

      summary

    );

  summary.metadata.checksum =

    summary.checksum;

  return summary;

}

/*
========================================
VALIDATION
========================================
*/

function validate(

  summary = {}

) {

  const required = [

    "overview",

    "platform",

    "executiveKPIs",

    "readiness",

    "departments",

    "workflow",

    "constitution",

    "repairs",

    "violations",

    "trends",

    "predictions",

    "learning",

    "maintenance",

    "risks",

    "opportunities",

    "priorities",

    "recommendations",

    "decision",

    "metadata"

  ];

  const missing =

    required.filter(

      property =>

        summary[property] ===

        undefined

    );

  return {

    valid:

      missing.length === 0,

    missing,

    checksumValid:

      summary.checksum ===

      createChecksum(

        summary

      )

  };

}

/*
========================================
FREEZE
========================================
*/

function freeze(

  summary = {}

) {

  return Object.freeze(

    summary

  );

}

/*
========================================
CLONE
========================================
*/

function clone(

  summary = {}

) {

  return JSON.parse(

    JSON.stringify(

      summary

    )

  );

}

/*
========================================
JSON
========================================
*/

function toJSON(

  summary = {}

) {

  return JSON.stringify(

    summary,

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

  finalize,

  validate,

  freeze,

  clone,

  toJSON

};