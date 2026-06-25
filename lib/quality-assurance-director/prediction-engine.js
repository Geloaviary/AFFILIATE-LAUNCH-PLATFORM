/*
========================================
QUALITY ASSURANCE DIRECTOR

Prediction Engine

Predicts future quality outcomes,
department health,
engineering workload,
system stability,
maintenance needs,
and autonomous recommendations.

Author:
Affiliate Launch Platform V3

========================================
*/

function updatePredictions(
  metrics = {}
) {

  initializePredictionState(
    metrics
  );

  metrics.predictions.nextPassProbability =
    calculatePassProbability(
      metrics
    );

  metrics.predictions.nextRepairProbability =
    calculateRepairProbability(
      metrics
    );

  metrics.predictions.expectedRepairAttempts =
    calculateExpectedRepairs(
      metrics
    );

  metrics.predictions.mostCommonViolation =
    highestKey(
      metrics.violations
    );

  metrics.predictions.recurringViolation =
    highestKey(
      metrics.violations
    );

  metrics.predictions.strongestDepartment =
    highestDepartment(
      metrics.departments
    );

  metrics.predictions.weakestDepartment =
    lowestDepartment(
      metrics.departments
    );

  metrics.predictions.bottleneckDepartment =
    bottleneckDepartment(
      metrics.departments
    );

  metrics.predictions.riskLevel =
    calculateRisk(
      metrics
    );

  metrics.predictions.engineeringAttentionRequired =
    shouldNotifyEngineering(
      metrics
    );

  updateSystemStability(
    metrics
  );

  buildEngineeringQueue(
    metrics
  );

  buildExecutivePrediction(
    metrics
  );

  return metrics;

}

/*
========================================
INITIALIZATION
========================================
*/

function initializePredictionState(
  metrics
) {

  metrics.predictions =
    metrics.predictions || {};

  metrics.systemStability =
    metrics.systemStability || {};

  metrics.engineeringQueue =
    metrics.engineeringQueue || [];

}

/*
========================================
PASS PROBABILITY
========================================
*/

function calculatePassProbability(
  metrics
) {

  const pass =
    metrics.passRate || 0;

  const repair =
    metrics.repairRate || 0;

  const escalation =
    metrics.escalationRate || 0;

  let probability =

    pass

    -

    (repair * 0.25)

    -

    (escalation * 0.50);

  probability =
    Math.max(
      0,
      Math.min(
        100,
        probability
      )
    );

  return Math.round(
    probability
  );

}

/*
========================================
REPAIR PROBABILITY
========================================
*/

function calculateRepairProbability(
  metrics
) {

  let probability =

    metrics.repairRate ||

    0;

  if (

    metrics.predictions
      .riskLevel ===
      "critical"

  ) {

    probability += 15;

  }

  return Math.min(

    100,

    Math.round(
      probability
    )

  );

}

/*
========================================
EXPECTED REPAIR ATTEMPTS
========================================
*/

function calculateExpectedRepairs(
  metrics
) {

  return Number(

    (

      metrics.averageRepairAttempts ||

      0

    ).toFixed(2)

  );

}

/*
========================================
SYSTEM STABILITY
========================================
*/

function updateSystemStability(
  metrics
) {

  const stability =

    metrics.systemStability;

  stability.score =

    calculateSystemScore(
      metrics
    );

  stability.health =

    systemHealth(
      stability.score
    );

  stability.status =

    systemStatus(
      stability.score
    );

  stability.trend =

    metrics.qualityTrend
      ?.direction ||

    "stable";

  stability.failureForecast =

    metrics.predictions
      .riskLevel;

  stability.confidence =

    predictionConfidence(
      metrics
    );

  stability.strongestSubsystem =

    metrics.predictions
      .strongestDepartment;

  stability.weakestSubsystem =

    metrics.predictions
      .weakestDepartment;

  stability.technicalDebtScore =

    technicalDebtScore(
      metrics
    );

  stability.maintenanceRequired =

    stability.technicalDebtScore >

    25;

  stability.autoRecoveryPossible =

    stability.score >= 70;

  stability.lastEvaluation =

    new Date()
      .toISOString();

}

/*
========================================
ENGINEERING QUEUE
========================================
*/

function buildEngineeringQueue(
  metrics
) {

  if (
    !metrics.predictions
      .engineeringAttentionRequired
  ) {

    return;

  }

  const issue =

    metrics.predictions
      .mostCommonViolation;

  metrics.engineeringQueue.push({

    id:
      `eng_${Date.now()}`,

    createdAt:
      new Date()
        .toISOString(),

    priority:
      engineeringPriority(
        metrics
      ),

    department:

      metrics.predictions
        .weakestDepartment,

    subsystem:

      metrics.predictions
        .bottleneckDepartment,

    issue,

    occurrences:

      metrics.violations[
        issue
      ] || 0,

    confidence:

      predictionConfidence(
        metrics
      ),

    recommendation:

      buildRecommendation(
        metrics
      ),

    status:
      "open"

  });

}

/*
========================================
EXECUTIVE SUMMARY
========================================
*/

function buildExecutivePrediction(
  metrics
) {

  metrics.executiveSummary = {

    generatedAt:
      new Date()
        .toISOString(),

    platformHealth:

      metrics.systemStability
        .health,

    platformScore:

      metrics.systemStability
        .score,

    overallTrend:

      metrics.systemStability
        .trend,

    strongestDepartment:

      metrics.predictions
        .strongestDepartment,

    weakestDepartment:

      metrics.predictions
        .weakestDepartment,

    bottleneckDepartment:

      metrics.predictions
        .bottleneckDepartment,

    repairBacklog:

      Math.max(

        0,

        metrics.repaired -

        metrics.approved

      ),

    engineeringQueue:

      metrics.engineeringQueue
        .length,

    nextPassProbability:

      metrics.predictions
        .nextPassProbability,

    nextRepairProbability:

      metrics.predictions
        .nextRepairProbability,

    riskLevel:

      metrics.predictions
        .riskLevel

  };

}

/*
========================================
SYSTEM SCORE
========================================
*/

function calculateSystemScore(
  metrics
) {

  const values = [

    metrics.passRate || 0,

    100 -

    (metrics.repairRate || 0),

    100 -

    (metrics.escalationRate || 0)

  ];

  const total =

    values.reduce(

      (sum, value) =>

        sum + value,

      0

    );

  return Math.round(

    total /

    values.length

  );

}

/*
========================================
TECHNICAL DEBT
========================================
*/

function technicalDebtScore(
  metrics
) {

  return Math.round(

    (

      (metrics.repairRate || 0)

      +

      (metrics.escalationRate || 0)

    )

    /

    2

  );

}

/*
========================================
CONFIDENCE
========================================
*/

function predictionConfidence(
  metrics
) {

  return Math.max(

    40,

    Math.min(

      100,

      Math.round(

        (

          (metrics.passRate || 0)

          +

          (100 -

            (metrics.repairRate || 0))

        )

        /

        2

      )

    )

  );

}

/*
========================================
ENGINEERING PRIORITY
========================================
*/

function engineeringPriority(
  metrics
) {

  const risk =

    metrics.predictions
      .riskLevel;

  if (

    risk ===
    "critical"

  ) {

    return "critical";

  }

  if (

    risk ===
    "high"

  ) {

    return "high";

  }

  if (

    risk ===
    "medium"

  ) {

    return "medium";

  }

  return "low";

}

/*
========================================
RECOMMENDATION
========================================
*/

function buildRecommendation(
  metrics
) {

  return [

    `Investigate recurring ${

      metrics.predictions
        .mostCommonViolation

    } failures.`,

    `Review ${

      metrics.predictions
        .weakestDepartment

    } department validator.`,

    `Consider strengthening self-validation before QC.`,

    `Monitor repair loop effectiveness.`

  ];

}

/*
========================================
SYSTEM HEALTH
========================================
*/

function systemHealth(
  score
) {

  if (
    score >= 95
  ) {

    return "excellent";

  }

  if (
    score >= 85
  ) {

    return "good";

  }

  if (
    score >= 70
  ) {

    return "fair";

  }

  return "poor";

}

/*
========================================
SYSTEM STATUS
========================================
*/

function systemStatus(
  score
) {

  if (
    score >= 90
  ) {

    return "stable";

  }

  if (
    score >= 70
  ) {

    return "degrading";

  }

  return "critical";

}

/*
========================================
RISK ENGINE
========================================
*/

function calculateRisk(
  metrics = {}
) {

  const passRate =
    metrics.passRate || 0;

  const repairRate =
    metrics.repairRate || 0;

  const escalationRate =
    metrics.escalationRate || 0;

  const technicalDebt =
    metrics.systemStability
      ?.technicalDebtScore || 0;

  if (

    escalationRate >= 25 ||

    technicalDebt >= 50 ||

    passRate < 60

  ) {

    return "critical";

  }

  if (

    repairRate >= 40 ||

    passRate < 75

  ) {

    return "high";

  }

  if (

    repairRate >= 20 ||

    passRate < 90

  ) {

    return "medium";

  }

  return "low";

}

/*
========================================
ENGINEERING NOTIFICATION
========================================
*/

function shouldNotifyEngineering(
  metrics = {}
) {

  const violation =

    metrics.predictions
      ?.mostCommonViolation;

  if (

    !violation

  ) {

    return false;

  }

  if (

    metrics.predictions
      ?.riskLevel ===
      "critical"

  ) {

    return true;

  }

  return (

    metrics.violations[
      violation
    ] || 0

  ) >= 5;

}

/*
========================================
DEPARTMENT RANKING
========================================
*/

function highestDepartment(
  departments = {}
) {

  let best = null;

  let score = -1;

  Object.entries(
    departments
  )

  .forEach(

    ([name, dept]) => {

      if (

        (dept.averageScore || 0)

        >

        score

      ) {

        score =

          dept.averageScore || 0;

        best =

          name;

      }

    }

  );

  return best;

}

function lowestDepartment(
  departments = {}
) {

  let worst = null;

  let score = 101;

  Object.entries(
    departments
  )

  .forEach(

    ([name, dept]) => {

      if (

        (dept.averageScore || 0)

        <

        score

      ) {

        score =

          dept.averageScore || 0;

        worst =

          name;

      }

    }

  );

  return worst;

}

/*
========================================
BOTTLENECK DETECTION
========================================
*/

function bottleneckDepartment(
  departments = {}
) {

  let bottleneck = null;

  let repairs = -1;

  Object.entries(
    departments
  )

  .forEach(

    ([name, dept]) => {

      const repairCount =

        dept.repaired || 0;

      if (

        repairCount >

        repairs

      ) {

        repairs =

          repairCount;

        bottleneck =

          name;

      }

    }

  );

  return bottleneck;

}

/*
========================================
VIOLATION ANALYSIS
========================================
*/

function highestKey(
  object = {}
) {

  const keys =
    Object.keys(object);

  if (

    !keys.length

  ) {

    return null;

  }

  return keys.sort(

    (a, b) =>

      object[b] -

      object[a]

  )[0];

}

/*
========================================
FAILURE FORECAST
========================================
*/

function failureForecast(
  metrics = {}
) {

  const risk =

    metrics.predictions
      ?.riskLevel;

  switch (

    risk

  ) {

    case "critical":

      return "Immediate intervention required.";

    case "high":

      return "Likely repeated repair cycle.";

    case "medium":

      return "Monitor department quality.";

    default:

      return "Platform operating normally.";

  }

}

/*
========================================
ENGINEERING SUMMARY
========================================
*/

function engineeringSummary(
  metrics = {}
) {

  return {

    generatedAt:

      new Date()
        .toISOString(),

    attentionRequired:

      metrics.predictions
        ?.engineeringAttentionRequired ||

      false,

    riskLevel:

      metrics.predictions
        ?.riskLevel ||

      "low",

    weakestDepartment:

      metrics.predictions
        ?.weakestDepartment ||

      null,

    strongestDepartment:

      metrics.predictions
        ?.strongestDepartment ||

      null,

    bottleneckDepartment:

      metrics.predictions
        ?.bottleneckDepartment ||

      null,

    mostCommonViolation:

      metrics.predictions
        ?.mostCommonViolation ||

      null,

    recurringViolation:

      metrics.predictions
        ?.recurringViolation ||

      null,

    failureForecast:

      failureForecast(
        metrics
      )

  };

}

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  updatePredictions,

  calculatePassProbability,

  calculateRepairProbability,

  calculateExpectedRepairs,

  calculateRisk,

  shouldNotifyEngineering,

  predictionConfidence,

  engineeringPriority,

  buildRecommendation,

  buildEngineeringQueue,

  buildExecutivePrediction,

  updateSystemStability,

  calculateSystemScore,

  technicalDebtScore,

  highestDepartment,

  lowestDepartment,

  bottleneckDepartment,

  highestKey,

  engineeringSummary,

  failureForecast

};