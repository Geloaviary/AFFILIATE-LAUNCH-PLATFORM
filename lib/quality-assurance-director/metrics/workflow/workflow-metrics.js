/*
========================================
QUALITY ASSURANCE DIRECTOR

Workflow Metrics

Responsible for monitoring
the entire QA workflow.

Owns

• Workflow stages
• Stage counters
• Queue statistics
• Throughput
• Bottlenecks
• Processing times

========================================
*/

function create() {

  return {

    generatedAt:
      new Date()
        .toISOString(),

    version:
      "1.0",

    totalTransitions: 0,

    completedWorkflows: 0,

    failedWorkflows: 0,

    repairedWorkflows: 0,

    escalatedWorkflows: 0,

    averageWorkflowTime: 0,

    totalWorkflowTime: 0,

    bottleneckStage: null,

    fastestStage: null,

    slowestStage: null,

    workflowHealth:
      "excellent",

    stages: {},

    queues: {},

    transitions: {},

    timeline: [],

    throughput: {

      completed: 0,

      failed: 0,

      repaired: 0,

      escalated: 0,

      successRate: 100

    }

  };

}

/*
========================================
UPDATE

Called by Metrics Manager
after every QC cycle.

========================================
*/

function update({

  metrics = create(),

  submission = {},

  qualityReport = {}

} = {}) {

  const stage =

    submission.workflowStage ||

    "unknown";

  if (

    !metrics.stages[stage]

  ) {

    metrics.stages[stage] =

      createStage(stage);

  }

  const workflowStage =

    metrics.stages[stage];

  workflowStage.entries++;

  workflowStage.lastUpdated =

    new Date()
      .toISOString();

  metrics.totalTransitions++;

  updateWorkflowStatus({

    metrics,

    workflowStage,

    qualityReport

  });

  updateExecutionTime({

    metrics,

    workflowStage,

    qualityReport

  });

  updateQueues({

    metrics,

    submission

  });

  updateTimeline({

    metrics,

    submission,

    qualityReport

  });

  updateBottlenecks(

  metrics

);

metrics.workflowHealth =

  calculateWorkflowHealth(

    metrics

  );

  return metrics;

}

/*
========================================
CREATE STAGE
========================================
*/

function createStage(

  name

) {

  return {

    id: name,

    entries: 0,

    completed: 0,

    failed: 0,

    repaired: 0,

    escalated: 0,

    averageExecutionTime: 0,

    totalExecutionTime: 0,

    queueLength: 0,

    bottleneckScore: 0,

    health: "excellent",

    lastUpdated: null

  };

}

/*
========================================
WORKFLOW STATUS
========================================
*/

function updateWorkflowStatus({

  metrics,

  workflowStage,

  qualityReport

}) {

  if (

    qualityReport.approved

  ) {

    workflowStage.completed++;

    metrics.completedWorkflows++;

    metrics.throughput.completed++;

  }

  else {

    workflowStage.failed++;

    metrics.failedWorkflows++;

    metrics.throughput.failed++;

  }

  if (

    qualityReport.repaired

  ) {

    workflowStage.repaired++;

    metrics.repairedWorkflows++;

    metrics.throughput.repaired++;

  }

  if (

    qualityReport.escalated

  ) {

    workflowStage.escalated++;

    metrics.escalatedWorkflows++;

    metrics.throughput.escalated++;

  }

  metrics.throughput.successRate =

    calculateSuccessRate(

      metrics

    );

}

/*
========================================
EXECUTION TIME
========================================
*/

function updateExecutionTime({

  metrics,

  workflowStage,

  qualityReport

}) {

  if (

    !qualityReport.executionTime

  ) {

    return;

  }

  workflowStage.totalExecutionTime +=

    qualityReport.executionTime;

  workflowStage.averageExecutionTime =

    Number(

      (

        workflowStage.totalExecutionTime /

        workflowStage.entries

      ).toFixed(2)

    );

  metrics.totalWorkflowTime +=

    qualityReport.executionTime;

  metrics.averageWorkflowTime =

    Number(

      (

        metrics.totalWorkflowTime /

        metrics.totalTransitions

      ).toFixed(2)

    );

}

/*
========================================
QUEUE METRICS
========================================
*/

function updateQueues({

  metrics,

  submission

}) {

  const stage =

    submission.workflowStage ||

    "unknown";

  if (

    !metrics.queues[stage]

  ) {

    metrics.queues[stage] = {

      queued: 0,

      processing: 0,

      completed: 0

    };

  }

  const queue =

    metrics.queues[stage];

  switch (

    submission.status

  ) {

    case "queued":

      queue.queued++;

      break;

    case "processing":

      queue.processing++;

      break;

    case "approved":

    case "completed":

      queue.completed++;

      break;

  }

  metrics.stages[stage].queueLength =

    queue.queued +

    queue.processing;

}

/*
========================================
WORKFLOW TIMELINE
========================================
*/

function updateTimeline({

  metrics,

  submission,

  qualityReport

}) {

  metrics.timeline.push({

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

      "unknown",

    status:

      qualityReport.approved

        ? "approved"

        : "failed",

    repaired:

      Boolean(

        qualityReport.repaired

      ),

    escalated:

      Boolean(

        qualityReport.escalated

      ),

    executionTime:

      qualityReport.executionTime ||

      0,

    score:

      qualityReport.score ||

      0

  });

  if (

    metrics.timeline.length >

    1000

  ) {

    metrics.timeline.shift();

  }

}

/*
========================================
BOTTLENECK ANALYSIS
========================================
*/

function updateBottlenecks(

  metrics

) {

  const stages =

    Object.values(

      metrics.stages

    );

  if (

    !stages.length

  ) {

    return;

  }

  stages.forEach(

    stage => {

      stage.bottleneckScore =

        stage.queueLength +

        stage.failed +

        stage.repaired;

    }

  );

  const sorted =

    [...stages]

    .sort(

      (a, b) =>

        b.bottleneckScore -

        a.bottleneckScore

    );

  metrics.bottleneckStage =

    sorted[0]?.id ||

    null;

  metrics.fastestStage =

    [...stages]

      .sort(

        (a, b) =>

          a.averageExecutionTime -

          b.averageExecutionTime

      )[0]?.id ||

    null;

  metrics.slowestStage =

    [...stages]

      .sort(

        (a, b) =>

          b.averageExecutionTime -

          a.averageExecutionTime

      )[0]?.id ||

    null;

}

/*
========================================
WORKFLOW HEALTH
========================================
*/

function calculateWorkflowHealth(

  metrics

) {

  if (

    metrics.throughput.successRate >= 95

  ) {

    return "excellent";

  }

  if (

    metrics.throughput.successRate >= 85

  ) {

    return "good";

  }

  if (

    metrics.throughput.successRate >= 70

  ) {

    return "fair";

  }

  return "poor";

}

/*
========================================
SUCCESS RATE
========================================
*/

function calculateSuccessRate(

  metrics

) {

  if (

    metrics.totalTransitions === 0

  ) {

    return 100;

  }

  return Number(

    (

      (

        metrics.completedWorkflows /

        metrics.totalTransitions

      ) * 100

    ).toFixed(2)

  );

}

/*
========================================
WORKFLOW SUMMARY

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

    totalTransitions:

      metrics.totalTransitions,

    completedWorkflows:

      metrics.completedWorkflows,

    failedWorkflows:

      metrics.failedWorkflows,

    repairedWorkflows:

      metrics.repairedWorkflows,

    escalatedWorkflows:

      metrics.escalatedWorkflows,

    averageWorkflowTime:

      metrics.averageWorkflowTime,

    workflowHealth:

      metrics.workflowHealth,

    bottleneckStage:

      metrics.bottleneckStage,

    fastestStage:

      metrics.fastestStage,

    slowestStage:

      metrics.slowestStage,

    throughput:

      metrics.throughput

  };

}

/*
========================================
WORKFLOW INTELLIGENCE

Consumed by

• Executive Director

• Engineering Director

• Dashboard

========================================
*/

function intelligence(

  metrics = {}

) {

  const overloadedStages =

    Object.values(

      metrics.stages

    )

    .filter(

      stage =>

        stage.queueLength >= 10 ||

        stage.bottleneckScore >= 20

    )

    .map(

      stage => stage.id

    );

  return {

    generatedAt:

      new Date()
        .toISOString(),

    workflowHealth:

      metrics.workflowHealth,

    bottleneckStage:

      metrics.bottleneckStage,

    overloadedStages,

    recommendations:

      buildRecommendations(

        metrics,

        overloadedStages

      ),

    engineeringAttentionRequired:

      overloadedStages.length > 0 ||

      metrics.workflowHealth ===

      "poor",

    confidence:

      calculateConfidence(

        metrics

      )

  };

}

/*
========================================
WORKFLOW VALIDATION
========================================
*/

function validate(

  metrics = {}

) {

  const missing = [];

  [

    "totalTransitions",

    "completedWorkflows",

    "failedWorkflows",

    "workflowHealth",

    "throughput",

    "stages"

  ].forEach(

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
RECOMMENDATIONS
========================================
*/

function buildRecommendations(

  metrics,

  overloadedStages

) {

  const recommendations = [];

  if (

    metrics.workflowHealth ===

    "poor"

  ) {

    recommendations.push(

      "Overall workflow health requires immediate engineering review."

    );

  }

  if (

    overloadedStages.length

  ) {

    recommendations.push(

      `Reduce queue length for: ${overloadedStages.join(", ")}`

    );

  }

  if (

    metrics.averageWorkflowTime >

    30

  ) {

    recommendations.push(

      "Average workflow execution time exceeds acceptable limits."

    );

  }

  if (

    metrics.throughput.successRate <

    80

  ) {

    recommendations.push(

      "Increase workflow success rate by reducing repair loops."

    );

  }

  return recommendations;

}

/*
========================================
CONFIDENCE SCORE
========================================
*/

function calculateConfidence(

  metrics

) {

  let confidence = 100;

  confidence -=

    metrics.failedWorkflows;

  confidence -=

    metrics.escalatedWorkflows * 2;

  confidence -=

    Object.keys(

      metrics.stages

    ).length === 0

      ? 25

      : 0;

  return Math.max(

    0,

    confidence

  );

}

/*
========================================
EXPORTS

Universal Module Contract
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