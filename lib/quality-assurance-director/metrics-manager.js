/*
========================================
QUALITY ASSURANCE DIRECTOR

Metrics Manager

Quality Intelligence
Orchestrator

Coordinates every quality
intelligence subsystem.

NO BUSINESS LOGIC

NO METRIC CALCULATIONS

Only orchestration.

Constitution QA-001

========================================
*/

const {

  createGlobalMetrics,

  updateGlobalMetrics

} = require(

  "./metrics/global/global-metrics"

);

const {

  createDepartmentMetrics,

  updateDepartmentMetrics

} = require(

  "./metrics/department/department-metrics"

);

const {

  createWorkflowMetrics,

  updateWorkflowMetrics

} = require(

  "./metrics/workflow/workflow-metrics"

);

const {

  createConstitutionMetrics,

  updateConstitutionMetrics

} = require(

  "./metrics/constitution/constitution-metrics"

);

const {

  createViolationMetrics,

  updateViolationMetrics

} = require(

  "./metrics/violations/violation-metrics"

);

const {

  createRepairMetrics,

  updateRepairMetrics

} = require(

  "./metrics/repairs/repair-metrics"

);

const {

  createTrendMetrics,

  updateTrendMetrics

} = require(

  "./metrics/trends/trend-metrics"

);

const PredictionEngine =

  require(

    "./prediction-engine"

  );

const LearningEngine =

  require(

    "./learning-engine"

  );

const MaintenanceForecast =

  require(

    "./maintenance-forecast"

  );

const DashboardSnapshot =

  require(

    "./metrics/dashboard/dashboard-snapshot"

  );

const ExecutiveSummary =

  require(

    "./metrics/executive/executive-summary"

  );

const Historian =

  require(

    "./quality-historian"

  );

/*
========================================
CREATE

Master Quality State

========================================
*/

function create() {

  return {

    createdAt:

      new Date()

        .toISOString(),

    version:

      "1.0",

    global:

      createGlobalMetrics(),

    departments:

      createDepartmentMetrics(),

    workflow:

      createWorkflowMetrics(),

    constitution:

      createConstitutionMetrics(),

    violations:

      createViolationMetrics(),

    repairs:

      createRepairMetrics(),

    trends:

      createTrendMetrics(),

    prediction: {},

    learning: {},

    maintenance: {},

    dashboard: {},

    executive: {},

    historian:

      Historian.create()

  };

}

/*
========================================
UPDATE

Master Pipeline

Every QC Result
flows through here.

========================================
*/

function update({

  metrics = create(),

  submission = {},

  qualityReport = {}

} = {}) {

  updateCore({

    metrics,

    submission,

    qualityReport

  });

  updateIntelligence({

    metrics,

    submission,

    qualityReport

  });

  finalize(

    metrics

  );

  return metrics;

}

/*
========================================
CORE PIPELINE

Execution order is important.

Each module owns
its own intelligence.

Metrics Manager only
coordinates execution.

========================================
*/

function updateCore({

  metrics,

  submission,

  qualityReport

}) {

  /*
  --------------------------------------
  GLOBAL
  --------------------------------------
  */

  metrics.global =

    updateGlobalMetrics({

      metrics:

        metrics.global,

      submission,

      qualityReport

    });

  /*
  --------------------------------------
  DEPARTMENTS
  --------------------------------------
  */

  metrics.departments =

    updateDepartmentMetrics({

      metrics:

        metrics.departments,

      submission,

      qualityReport

    });

  /*
  --------------------------------------
  WORKFLOW
  --------------------------------------
  */

  metrics.workflow =

    updateWorkflowMetrics({

      metrics:

        metrics.workflow,

      submission,

      qualityReport

    });

  /*
  --------------------------------------
  CONSTITUTION
  --------------------------------------
  */

  metrics.constitution =

    updateConstitutionMetrics({

      metrics:

        metrics.constitution,

      submission,

      qualityReport

    });

  /*
  --------------------------------------
  VIOLATIONS
  --------------------------------------
  */

  metrics.violations =

    updateViolationMetrics({

      metrics:

        metrics.violations,

      submission,

      qualityReport

    });

  /*
  --------------------------------------
  REPAIRS
  --------------------------------------
  */

  metrics.repairs =

    updateRepairMetrics({

      metrics:

        metrics.repairs,

      submission,

      qualityReport

    });

  /*
  --------------------------------------
  TRENDS

  Runs AFTER every metric
  has been updated.

  --------------------------------------
  */

  metrics.trends =

    updateTrendMetrics({

      metrics:

        metrics.trends,

      globalMetrics:

        metrics.global,

      departmentMetrics:

        metrics.departments,

      workflowMetrics:

        metrics.workflow,

      constitutionMetrics:

        metrics.constitution,

      violationMetrics:

        metrics.violations,

      repairMetrics:

        metrics.repairs

    });

}

/*
========================================
HISTORIAN

Every execution is recorded.

Nothing bypasses history.

========================================
*/

function updateHistorian({

  metrics,

  submission,

  qualityReport

}) {

  metrics.historian =

    Historian.record({

      historian:

        metrics.historian,

      type:

        "validation",

      submission,

      payload: {

        qualityScore:

          qualityReport.score ||

          0,

        confidence:

          metrics.trends
            ?.platform
            ?.confidence ||

          100,

        trend:

          metrics.trends
            ?.platform
            ?.trend ||

          "stable",

        risk:

          metrics.prediction
            ?.riskLevel ||

          "low",

        repairProbability:

          metrics.prediction
            ?.nextRepairProbability ||

          0,

        predictionAccuracy:

          metrics.prediction
            ?.predictionAccuracy ||

          100,

        violations:

          qualityReport.violations ||

          [],

        reportVersion:

          1,

        departmentVersion:

          1,

        constitutionVersion:

          1,

        predictionVersion:

          1

      }

    });

}

/*
========================================
PIPELINE VALIDATION

Ensures every subsystem
exists before intelligence
is generated.

========================================
*/

function validatePipeline(

  metrics

) {

  const required = [

    "global",

    "departments",

    "workflow",

    "constitution",

    "violations",

    "repairs",

    "trends",

    "historian"

  ];

  const missing =

    required.filter(

      module =>

        !metrics[module]

    );

  if (

    missing.length

  ) {

    throw new Error(

      `Metrics pipeline incomplete: ${missing.join(", ")}`

    );

  }

}

/*
========================================
INTELLIGENCE PIPELINE

Runs AFTER every metrics
module has completed.

Generates platform intelligence.

========================================
*/

function updateIntelligence({

  metrics,

  submission,

  qualityReport

}) {

  /*
  --------------------------------------
  Validate pipeline first
  --------------------------------------
  */

  validatePipeline(

    metrics

  );

  /*
  --------------------------------------
  Prediction Engine
  --------------------------------------
  */

  metrics.prediction =

    PredictionEngine.update({

      globalMetrics:

        metrics.global,

      departmentMetrics:

        metrics.departments,

      workflowMetrics:

        metrics.workflow,

      constitutionMetrics:

        metrics.constitution,

      violationMetrics:

        metrics.violations,

      repairMetrics:

        metrics.repairs,

      trendMetrics:

        metrics.trends

    });

  /*
  --------------------------------------
  Learning Engine
  --------------------------------------
  */

  metrics.learning =

    LearningEngine.update({

      globalMetrics:

        metrics.global,

      departmentMetrics:

        metrics.departments,

      workflowMetrics:

        metrics.workflow,

      constitutionMetrics:

        metrics.constitution,

      violationMetrics:

        metrics.violations,

      repairMetrics:

        metrics.repairs,

      trendMetrics:

        metrics.trends,

      prediction:

        metrics.prediction

    });

  /*
  --------------------------------------
  Maintenance Forecast
  --------------------------------------
  */

  metrics.maintenance =

    MaintenanceForecast.update({

      globalMetrics:

        metrics.global,

      departmentMetrics:

        metrics.departments,

      workflowMetrics:

        metrics.workflow,

      constitutionMetrics:

        metrics.constitution,

      violationMetrics:

        metrics.violations,

      repairMetrics:

        metrics.repairs,

      trendMetrics:

        metrics.trends,

      prediction:

        metrics.prediction,

      learning:

        metrics.learning

    });

  /*
  --------------------------------------
  Historian

  Record complete intelligence
  after all engines have finished.

  --------------------------------------
  */

  updateHistorian({

    metrics,

    submission,

    qualityReport

  });

  /*
  --------------------------------------
  Dashboard Snapshot

  Read-only aggregation.

  --------------------------------------
  */

  metrics.dashboard =

    DashboardSnapshot.create({

      globalMetrics:

        metrics.global,

      departmentMetrics:

        metrics.departments,

      workflowMetrics:

        metrics.workflow,

      constitutionMetrics:

        metrics.constitution,

      violationMetrics:

        metrics.violations,

      repairMetrics:

        metrics.repairs,

      trendMetrics:

        metrics.trends,

      prediction:

        metrics.prediction,

      learning:

        metrics.learning,

      maintenanceForecast:

        metrics.maintenance

    });

  /*
  --------------------------------------
  Executive Summary

  Executive Decision Object

  --------------------------------------
  */

  metrics.executive =

    ExecutiveSummary.finalize(

      ExecutiveSummary.create({

        dashboard:

          metrics.dashboard,

        globalMetrics:

          metrics.global,

        departmentMetrics:

          metrics.departments,

        workflowMetrics:

          metrics.workflow,

        constitutionMetrics:

          metrics.constitution,

        violationMetrics:

          metrics.violations,

        repairMetrics:

          metrics.repairs,

        trendMetrics:

          metrics.trends,

        prediction:

          metrics.prediction,

        learning:

          metrics.learning,

        maintenanceForecast:

          metrics.maintenance

      })

    );

  /*
  --------------------------------------
  Synchronize platform state

  --------------------------------------
  */

  synchronizeState(

    metrics

  );

}

/*
========================================
STATE SYNCHRONIZATION

Keeps every subsystem
pointing to the same truth.

========================================
*/

function synchronizeState(

  metrics

) {

  metrics.lastUpdated =

    new Date()

      .toISOString();

  metrics.platform = {

    health:

      metrics.executive
        ?.platform
        ?.health ||

      "unknown",

    readiness:

      metrics.executive
        ?.readiness
        ?.status ||

      "unknown",

    decision:

      metrics.executive
        ?.decision
        ?.decision ||

      "UNKNOWN",

    confidence:

      metrics.prediction
        ?.systemStability
        ?.confidence ||

      100

  };

}

/*
========================================
CONSISTENCY CHECK

Ensures all intelligence
objects are available.

========================================
*/

function validateIntelligence(

  metrics

) {

  const required = [

    "prediction",

    "learning",

    "maintenance",

    "dashboard",

    "executive"

  ];

  const missing =

    required.filter(

      key =>

        !metrics[key]

    );

  if (

    missing.length

  ) {

    throw new Error(

      `Missing intelligence modules: ${missing.join(", ")}`

    );

  }

}

/*
========================================
FINALIZE

Finalize the complete
Quality Intelligence state.

========================================
*/

function finalize(

  metrics

) {

  validatePipeline(

    metrics

  );

  validateIntelligence(

    metrics

  );

  metrics.historian =

    Historian.finalize(

      metrics.historian

    );

  metrics.health =

    calculatePlatformHealth(

      metrics

    );

  metrics.statistics =

    buildStatistics(

      metrics

    );

  metrics.lastUpdated =

    new Date()
      .toISOString();

  return metrics;

}

/*
========================================
PLATFORM HEALTH
========================================
*/

function calculatePlatformHealth(

  metrics

) {

  return {

    overall:

      metrics.executive
        ?.platform
        ?.health ||

      "unknown",

    readiness:

      metrics.executive
        ?.readiness
        ?.status ||

      "unknown",

    decision:

      metrics.executive
        ?.decision
        ?.decision ||

      "UNKNOWN",

    confidence:

      metrics.platform
        ?.confidence ||

      100,

    riskLevel:

      metrics.prediction
        ?.riskLevel ||

      "unknown",

    engineeringAttentionRequired:

      metrics.prediction
        ?.engineeringAttentionRequired ||

      false

  };

}

/*
========================================
PLATFORM STATISTICS
========================================
*/

function buildStatistics(

  metrics

) {

  return {

    generatedAt:

      new Date()
        .toISOString(),

    totalSubmissions:

      metrics.global
        ?.submissions ||

      0,

    totalDepartments:

      Object.keys(

        metrics.departments ||

        {}

      ).length,

    totalViolations:

      metrics.violations
        ?.totalViolations ||

      0,

    totalRepairs:

      metrics.repairs
        ?.totalRepairs ||

      0,

    totalWorkflowStages:

      Object.keys(

        metrics.workflow
          ?.stages ||

        {}

      ).length,

    historianEvents:

      metrics.historian
        ?.events
        ?.length ||

      0,

    dashboardSnapshots:

      Object.keys(

        metrics.historian
          ?.snapshots ||

        {}

      ).length

  };

}

/*
========================================
ACCESSORS
========================================
*/

function getDashboard(

  metrics

) {

  return metrics.dashboard;

}

function getExecutiveSummary(

  metrics

) {

  return metrics.executive;

}

function getPrediction(

  metrics

) {

  return metrics.prediction;

}

function getLearning(

  metrics

) {

  return metrics.learning;

}

function getMaintenanceForecast(

  metrics

) {

  return metrics.maintenance;

}

function getHistorian(

  metrics

) {

  return metrics.historian;

}

function getState(

  metrics

) {

  return metrics;

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

  metrics

) {

  return JSON.parse(

    JSON.stringify(

      metrics

    )

  );

}

/*
========================================
FREEZE

Deep immutable
metrics state.

========================================
*/

function freeze(

  metrics

) {

  function deepFreeze(

    object

  ) {

    if (

      !object ||

      typeof object !==

      "object"

    ) {

      return object;

    }

    Object.keys(

      object

    ).forEach(

      key =>

        deepFreeze(

          object[key]

        )

    );

    return Object.freeze(

      object

    );

  }

  return deepFreeze(

    metrics

  );

}

/*
========================================
VALIDATE

Complete manager validation.

========================================
*/

function validate(

  metrics

) {

  validatePipeline(

    metrics

  );

  validateIntelligence(

    metrics

  );

  return {

    valid: true,

    modules: {

      global:

        !!metrics.global,

      departments:

        !!metrics.departments,

      workflow:

        !!metrics.workflow,

      constitution:

        !!metrics.constitution,

      violations:

        !!metrics.violations,

      repairs:

        !!metrics.repairs,

      trends:

        !!metrics.trends,

      prediction:

        !!metrics.prediction,

      learning:

        !!metrics.learning,

      maintenance:

        !!metrics.maintenance,

      dashboard:

        !!metrics.dashboard,

      executive:

        !!metrics.executive,

      historian:

        !!metrics.historian

    }

  };

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

  finalize,

  validate,

  reset,

  clone,

  freeze,

  getState,

  getDashboard,

  getExecutiveSummary,

  getPrediction,

  getLearning,

  getMaintenanceForecast,

  getHistorian

};