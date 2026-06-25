/*
========================================
QUALITY ASSURANCE DIRECTOR

Trend Metrics

Tracks platform trends and
detects long-term movement.

Responsible for

• Quality Trends
• Repair Trends
• Violation Trends
• Workflow Trends
• Department Trends
• Constitution Trends
• Execution Trends

Constitution QA-001
Universal Module Contract

========================================
*/

function create() {

  return {

    generatedAt:
      new Date().toISOString(),

    version:
      "1.0",

    snapshots: [],

    quality: createTrend(),

    repairs: createTrend(),

    violations: createTrend(),

    workflow: createTrend(),

    constitution: createTrend(),

    execution: createTrend(),

    departments: {},

    platform: {

      health: "excellent",

      trend: "stable",

      direction: "stable",

      confidence: 100

    },

    forecast: {

      qualityScore: 100,

      repairRate: 0,

      violationRate: 0,

      risk: "low"

    },

    intelligence: {

      improving: [],

      declining: [],

      stable: [],

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

  globalMetrics = {},

  departmentMetrics = {},

  workflowMetrics = {},

  constitutionMetrics = {},

  violationMetrics = {},

  repairMetrics = {}

} = {}) {

  captureSnapshot({

    metrics,

    globalMetrics,

    workflowMetrics,

    constitutionMetrics,

    violationMetrics,

    repairMetrics

  });

  updateQualityTrend({

    metrics,

    globalMetrics

  });

  updateRepairTrend({

    metrics,

    repairMetrics

  });

  updateViolationTrend({

    metrics,

    violationMetrics

  });

  updateWorkflowTrend({

    metrics,

    workflowMetrics

  });

  updateConstitutionTrend({

    metrics,

    constitutionMetrics

  });

  updateExecutionTrend({

    metrics,

    globalMetrics

  });

  updateDepartmentTrend({

    metrics,

    departmentMetrics

  });

  return metrics;

}

/*
========================================
TREND MODEL
========================================
*/

function createTrend() {

  return {

    current: 0,

    previous: 0,

    direction: "stable",

    velocity: 0,

    acceleration: 0,

    regression: false,

    improving: false,

    confidence: 100,

    history: [],

    scoreHistory: [],

movingAverage: 0,

peak: 0,

lowest: 100,

volatility: 0,

stabilityIndex: 100,

predictionAccuracy: 100,

lastPrediction: null,

nextPrediction: null

  };

}

/*
========================================
SNAPSHOT
========================================
*/

function captureSnapshot({

  metrics,

  globalMetrics,

  workflowMetrics,

  constitutionMetrics,

  violationMetrics,

  repairMetrics

}) {

  metrics.snapshots.push({

    timestamp:

      new Date()
        .toISOString(),

    quality:

      globalMetrics.averageScore ||

      0,

    repairs:

      repairMetrics.totalRepairs ||

      0,

    violations:

      violationMetrics.totalViolations ||

      0,

    constitution:

      constitutionMetrics.complianceRate ||

      0,

    workflow:

      workflowMetrics.averageWorkflowTime ||

      0

  });

  if (

    metrics.snapshots.length >

    500

  ) {

    metrics.snapshots.shift();

  }

}

/*
========================================
QUALITY TREND
========================================
*/

function updateQualityTrend({

  metrics,

  globalMetrics

}) {

  updateTrend(

    metrics.quality,

    globalMetrics.averageScore ||

    0

  );

}

/*
========================================
REPAIR TREND
========================================
*/

function updateRepairTrend({

  metrics,

  repairMetrics

}) {

  updateTrend(

    metrics.repairs,

    repairMetrics.repairSuccessRate ||

    0

  );

}

/*
========================================
VIOLATION TREND
========================================
*/

function updateViolationTrend({

  metrics,

  violationMetrics

}) {

  updateTrend(

    metrics.violations,

    violationMetrics.totalViolations ||

    0

  );

}

/*
========================================
WORKFLOW TREND
========================================
*/

function updateWorkflowTrend({

  metrics,

  workflowMetrics

}) {

  updateTrend(

    metrics.workflow,

    workflowMetrics.averageWorkflowTime ||

    0

  );

}

/*
========================================
CONSTITUTION TREND
========================================
*/

function updateConstitutionTrend({

  metrics,

  constitutionMetrics

}) {

  updateTrend(

    metrics.constitution,

    constitutionMetrics.complianceRate ||

    0

  );

}

/*
========================================
EXECUTION TREND
========================================
*/

function updateExecutionTrend({

  metrics,

  globalMetrics

}) {

  updateTrend(

    metrics.execution,

    globalMetrics.averageExecutionTime ||

    0

  );

}

/*
========================================
DEPARTMENT TRENDS
========================================
*/

function updateDepartmentTrend({

  metrics,

  departmentMetrics

}) {

  Object.entries(

    departmentMetrics

  ).forEach(

    ([name, dept]) => {

      if (

        !metrics.departments[name]

      ) {

        metrics.departments[name] =

          createTrend();

      }

      updateTrend(

        metrics.departments[name],

        dept.averageScore ||

        0

      );

    }

  );

}

/*
========================================
GENERIC TREND ENGINE
========================================
*/

function updateTrend(

  trend,

  value

) {

  trend.previous =

    trend.current;

  trend.current =

    value;

  trend.velocity =

    Number(

      (

        trend.current -

        trend.previous

      ).toFixed(2)

    );

  trend.history.push({

    timestamp:

      new Date()
        .toISOString(),

    value

  });

  if (

    trend.history.length >

    200

  ) {

    trend.history.shift();

  }

  calculateAcceleration(

    trend

  );

  calculateDirection(

    trend

  );

}

/*
========================================
ACCELERATION
========================================
*/

function calculateAcceleration(

  trend

) {

  const lastVelocity =

    trend.acceleration ||

    0;

  trend.acceleration =

    Number(

      (

        trend.velocity -

        lastVelocity

      ).toFixed(2)

    );

}

/*
========================================
DIRECTION
========================================
*/

function calculateDirection(

  trend

) {

  if (

    trend.velocity > 0

  ) {

    trend.direction =

      "improving";

    trend.improving = true;

    trend.regression = false;

  }

  else if (

    trend.velocity < 0

  ) {

    trend.direction =

      "declining";

    trend.improving = false;

    trend.regression = true;

  }

  else {

    trend.direction =

      "stable";

    trend.improving = false;

    trend.regression = false;

  }

}

/*
========================================
VELOCITY ENGINE
========================================
*/

function calculateVelocity(

  metrics

) {

  [

    "quality",

    "repairs",

    "violations",

    "workflow",

    "constitution",

    "execution"

  ]

  .forEach(

    key => {

      metrics[key].velocity =

        Number(

          metrics[key].velocity
            .toFixed(2)

        );

    }

  );

}

/*
========================================
FORECAST ENGINE
========================================
*/

function updateForecast(

  metrics

) {

  metrics.forecast = {

    qualityScore:

      Number(

        (

          metrics.quality.current +

          metrics.quality.velocity

        ).toFixed(2)

      ),

    repairRate:

      Number(

        (

          metrics.repairs.current +

          metrics.repairs.velocity

        ).toFixed(2)

      ),

    violationRate:

      Number(

        (

          metrics.violations.current +

          metrics.violations.velocity

        ).toFixed(2)

      ),

    risk:

      calculateRisk(

        metrics

      )

  };

}

/*
========================================
PLATFORM HEALTH
========================================
*/

function updatePlatformHealth(

  metrics

) {

  metrics.platform.health =

    calculateHealth(

      metrics

    );

  metrics.platform.direction =

    metrics.quality.direction;

  metrics.platform.trend =

    metrics.quality.direction;

  metrics.platform.confidence =

    calculateConfidence(

      metrics

    );

}

/*
========================================
RISK ENGINE
========================================
*/

function calculateRisk(

  metrics

) {

  if (

    metrics.quality.direction ===

    "declining" &&

    metrics.repairs.direction ===

    "declining"

  ) {

    return "critical";

  }

  if (

    metrics.violations.direction ===

    "improving"

  ) {

    return "high";

  }

  if (

    metrics.constitution.direction ===

    "declining"

  ) {

    return "medium";

  }

  return "low";

}

/*
========================================
TREND INTELLIGENCE
========================================
*/

function updateTrendIntelligence(

  metrics

) {

  metrics.intelligence.improving = [];

  metrics.intelligence.declining = [];

  metrics.intelligence.stable = [];

  const groups = [

    "quality",

    "repairs",

    "violations",

    "workflow",

    "constitution",

    "execution"

  ];

  groups.forEach(

    group => {

      const trend =

        metrics[group];

      if (

        trend.direction ===

        "improving"

      ) {

        metrics.intelligence
          .improving.push(

            group

          );

      }

      else if (

        trend.direction ===

        "declining"

      ) {

        metrics.intelligence
          .declining.push(

            group

          );

      }

      else {

        metrics.intelligence
          .stable.push(

            group

          );

      }

    }

  );

  metrics.intelligence.recommendations =

    buildRecommendations(

      metrics

    );

  metrics.intelligence.engineeringAttentionRequired =

    metrics.intelligence
      .declining.length >

    2;

  metrics.intelligence.confidence =

    calculateConfidence(

      metrics

    );

}

/*
========================================
STATISTICS
========================================
*/

function updateStatistics(

  metrics

) {

  calculateVelocity(

    metrics

  );

  updateForecast(

    metrics

  );

  updatePlatformHealth(

    metrics

  );

  updateTrendIntelligence(

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

    platform:

      metrics.platform,

    forecast:

      metrics.forecast,

    quality:

      metrics.quality,

    repairs:

      metrics.repairs,

    violations:

      metrics.violations,

    workflow:

      metrics.workflow,

    constitution:

      metrics.constitution,

    execution:

      metrics.execution

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

    "quality",

    "repairs",

    "violations",

    "workflow",

    "constitution",

    "execution",

    "platform",

    "forecast",

    "intelligence"

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
HEALTH ENGINE
========================================
*/

function calculateHealth(

  metrics

) {

  const quality =

    metrics.quality.current;

  if (

    quality >= 95

  ) {

    return "excellent";

  }

  if (

    quality >= 85

  ) {

    return "good";

  }

  if (

    quality >= 70

  ) {

    return "fair";

  }

  return "poor";

}

/*
========================================
CONFIDENCE ENGINE
========================================
*/

function calculateConfidence(

  metrics

) {

  let confidence = 100;

  const declining =

    metrics.intelligence

      .declining.length;

  confidence -=

    declining * 10;

  confidence -=

    Math.abs(

      metrics.quality.velocity

    );

  confidence -=

    Math.abs(

      metrics.repairs.velocity

    );

  confidence -=

    Math.abs(

      metrics.workflow.velocity

    );

  return Math.max(

    0,

    Math.min(

      100,

      Math.round(

        confidence

      )

    )

  );

}

/*
========================================
RECOMMENDATIONS
========================================
*/

function buildRecommendations(

  metrics

) {

  const recommendations = [];

  if (

    metrics.quality.direction ===

    "declining"

  ) {

    recommendations.push(

      "Investigate declining quality score."

    );

  }

  if (

    metrics.repairs.direction ===

    "declining"

  ) {

    recommendations.push(

      "Improve repair success rate."

    );

  }

  if (

    metrics.violations.direction ===

    "improving"

  ) {

    recommendations.push(

      "Reduce recurring violations."

    );

  }

  if (

    metrics.constitution.direction ===

    "declining"

  ) {

    recommendations.push(

      "Review constitutional compliance."

    );

  }

  if (

    metrics.workflow.direction ===

    "declining"

  ) {

    recommendations.push(

      "Optimize workflow bottlenecks."

    );

  }

  if (

    metrics.execution.direction ===

    "declining"

  ) {

    recommendations.push(

      "Reduce execution time."

    );

  }

  if (

    recommendations.length ===

    0

  ) {

    recommendations.push(

      "Platform trends are healthy."

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

  clone

};

