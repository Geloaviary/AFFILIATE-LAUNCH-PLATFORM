/*
========================================
QUALITY ASSURANCE DIRECTOR

Constitution Rule Engine

Constitution Execution Engine

Single Source of Truth
for constitutional execution.

Responsible for

• Rule Discovery
• Dependency Resolution
• Rule Execution
• Severity Assignment
• Violation Generation
• Repair Routing
• Engineering Routing
• Learning Feedback
• Prediction Feedback

Constitution QA-001

========================================
*/

const crypto = require(
  "crypto"
);

const {

  CONSTITUTION,

  getWorkflowRules

} = require(
  "./constitutional-rules"
);

const Severity = require(
  "./severity"
);

/*
========================================
CREATE EXECUTION CONTEXT
========================================
*/

function createContext({

  submission = {},

  constitutionVersion =

    CONSTITUTION.version

} = {}) {

  return {

    executionId:

      crypto.randomUUID(),

    traceId:

      submission.traceId ||

      crypto.randomUUID(),

    constitutionVersion,

    startedAt:

      new Date()
        .toISOString(),

    workflowStage:

      submission.workflowStage ||

      "unknown",

    department:

      submission.department ||

      "unknown",

    submission,

    rules: [],

    executionRecords: [],

    violations: [],

    recommendations: [],

    repairPlan: [],

    engineeringQueue: [],

    learning: [],

    prediction: [],

    statistics: {}

  };

}

/*
========================================
EXECUTE

Master Entry Point

========================================
*/

function execute({

  submission = {},

  constitutionVersion

} = {}) {

  const context =

    createContext({

      submission,

      constitutionVersion

    });

  context.rules =

    discoverRules({

      context

    });

  return context;

}

/*
========================================
RULE DISCOVERY

Automatically selects
rules for workflow.

========================================
*/

function discoverRules({

  context

}) {

  return getWorkflowRules(

    context.workflowStage

  )

  .filter(

    rule =>

      rule.active

  )

  .filter(

    rule =>

      rule.version <= 1

  );

}

/*
========================================
EXECUTION RECORD

Created for every rule.

========================================
*/

function createExecutionRecord({

  rule

}) {

  return {

    executionId:

      crypto.randomUUID(),

    ruleId:

      rule.id,

    title:

      rule.title,

    startedAt:

      new Date()

        .toISOString(),

    finishedAt:

      null,

    executionTime:

      0,

    passed:

      false,

    skipped:

      false,

    reason:

      null,

    severity:

      rule.severity,

    confidence:

      rule.confidence ||

      100,

    autoRepair:

      rule.autoRepair,

    repairModule:

      rule.repairModule,

    repairStrategy:

      rule.repairStrategy,

    engineeringOwner:

      rule.engineeringOwner,

    recommendations: []

  };

}

/*
========================================
DEPENDENCY RESOLUTION

Ensures dependent rules
exist and have passed.

========================================
*/

function resolveDependencies({

  context,

  rule

}) {

  const failed = [];

  (rule.dependencies || []).forEach(

    dependency => {

      const record =

        context.executionRecords.find(

          item =>

            item.ruleId ===

            dependency

        );

      if (

        !record ||

        !record.passed

      ) {

        failed.push(

          dependency

        );

      }

    }

  );

  return {

    passed:

      failed.length === 0,

    failed

  };

}

/*
========================================
PREREQUISITE VALIDATION

========================================
*/

function validatePrerequisites({

  context,

  rule

}) {

  const missing = [];

  (rule.prerequisites || []).forEach(

    prerequisite => {

      const record =

        context.executionRecords.find(

          item =>

            item.ruleId ===

            prerequisite

        );

      if (

        !record ||

        !record.passed

      ) {

        missing.push(

          prerequisite

        );

      }

    }

  );

  return {

    passed:

      missing.length === 0,

    missing

  };

}

/*
========================================
CONFLICT DETECTION

========================================
*/

function detectConflicts({

  context,

  rule

}) {

  const conflicts = [];

  (rule.conflictsWith || []).forEach(

    conflict => {

      const record =

        context.executionRecords.find(

          item =>

            item.ruleId ===

            conflict

        );

      if (

        record &&

        record.passed

      ) {

        conflicts.push(

          conflict

        );

      }

    }

  );

  return {

    passed:

      conflicts.length === 0,

    conflicts

  };

}

/*
========================================
RULE EXECUTION

Constitution Validator
will later inject the
actual validation
function.

========================================
*/

function executeRule({

  context,

  rule,

  validator

}) {

  const record =

    createExecutionRecord({

      rule

    });

  const dependency =

    resolveDependencies({

      context,

      rule

    });

  if (

    !dependency.passed

  ) {

    record.skipped = true;

    record.reason =

      "Dependency failed.";

    record.finishedAt =

      new Date()

        .toISOString();

    context.executionRecords.push(

      record

    );

    return record;

  }

  const prerequisite =

    validatePrerequisites({

      context,

      rule

    });

  if (

    !prerequisite.passed

  ) {

    record.skipped = true;

    record.reason =

      "Prerequisite missing.";

    record.finishedAt =

      new Date()

        .toISOString();

    context.executionRecords.push(

      record

    );

    return record;

  }

  const conflict =

    detectConflicts({

      context,

      rule

    });

  if (

    !conflict.passed

  ) {

    record.skipped = true;

    record.reason =

      "Conflicting rule detected.";

    record.finishedAt =

      new Date()

        .toISOString();

    context.executionRecords.push(

      record

    );

    return record;

  }

  const started =

    Date.now();

  let result = {

    passed: true,

    message: null

  };

  if (

    typeof validator ===

    "function"

  ) {

    result =

      validator({

        submission:

          context.submission,

        rule

      }) ||

      result;

  }

  record.executionTime =

    Date.now() -

    started;

  record.finishedAt =

    new Date()

      .toISOString();

  record.passed =

    !!result.passed;

  record.reason =

    result.message ||

    null;

  if (

    !record.passed

  ) {

    const violation =

      createViolation({

        rule,

        result

      });

    context.violations.push(

      violation

    );

    record.recommendations.push(

      `Apply ${rule.repairStrategy}`

    );

  }

  context.executionRecords.push(

    record

  );

  return record;

}

/*
========================================
VIOLATION BUILDER

========================================
*/

function createViolation({

  rule,

  result

}) {

  const severity =

    Severity.getSeverity(

      rule.severity

    );

  return {

    violationId:

      crypto.randomUUID(),

    ruleId:

      rule.id,

    title:

      rule.title,

    description:

      rule.description,

    severity:

      severity.id,

    severityProfile:

      severity,

    category:

      rule.category,

    department:

      rule.department,

    workflowStages:

      rule.workflowStages,

    message:

      result.message ||

      "Rule validation failed.",

    autoRepair:

      rule.autoRepair,

    repairModule:

      rule.repairModule,

    repairStrategy:

      rule.repairStrategy,

    engineeringOwner:

      rule.engineeringOwner,

    confidence:

      rule.confidence ||

      100,

    timestamp:

      new Date()

        .toISOString()

  };

}

/*
========================================
REPAIR PLAN

Automatically generated
from violations.

========================================
*/

function buildRepairPlan(

  context

) {

  context.repairPlan =

    context.violations

      .filter(

        violation =>

          violation.autoRepair

      )

      .map(

        violation => ({

          repairId:

            crypto.randomUUID(),

          violationId:

            violation.violationId,

          ruleId:

            violation.ruleId,

          severity:

            violation.severity,

          repairModule:

            violation.repairModule,

          repairStrategy:

            violation.repairStrategy,

          priority:

            violation.severityProfile
              ?.repairPriority ||

            5,

          engineeringOwner:

            violation.engineeringOwner,

          status:

            "pending"

        })

      );

}

/*
========================================
ENGINEERING QUEUE

========================================
*/

function buildEngineeringQueue(

  context

) {

  context.engineeringQueue =

    context.violations

      .filter(

        violation =>

          violation.severityProfile
            ?.requiresEngineering

      )

      .map(

        violation => ({

          ticketId:

            crypto.randomUUID(),

          violationId:

            violation.violationId,

          ruleId:

            violation.ruleId,

          severity:

            violation.severity,

          owner:

            violation.engineeringOwner ||

            "engineering-director",

          priority:

            violation.severityProfile
              ?.priority ||

            5,

          createdAt:

            new Date()

              .toISOString(),

          status:

            "open"

        })

      );

}

/*
========================================
LEARNING FEEDBACK

========================================
*/

function buildLearningFeedback(

  context

) {

  context.learning =

    context.executionRecords.map(

      record => ({

        ruleId:

          record.ruleId,

        passed:

          record.passed,

        skipped:

          record.skipped,

        confidence:

          record.confidence,

        executionTime:

          record.executionTime,

        recommendation:

          record.recommendations[0] ||

          null

      })

    );

}

/*
========================================
PREDICTION FEEDBACK

========================================
*/

function buildPredictionFeedback(

  context

) {

  context.prediction = {

    totalRules:

      context.rules.length,

    executedRules:

      context.executionRecords
        .filter(

          record =>

            !record.skipped

        ).length,

    failedRules:

      context.executionRecords
        .filter(

          record =>

            !record.passed &&

            !record.skipped

        ).length,

    predictedRepairProbability:

      Number(

        (

          context.violations.length

          /

          Math.max(

            context.rules.length,

            1

          )

        ).toFixed(

          2

        )

      )

  };

}

/*
========================================
RECOMMENDATIONS

========================================
*/

function buildRecommendations(

  context

) {

  context.recommendations = [];

  context.violations.forEach(

    violation => {

      context.recommendations.push({

        ruleId:

          violation.ruleId,

        severity:

          violation.severity,

        recommendation:

          violation.repairStrategy ||

          "Manual review required."

      });

    }

  );

}

/*
========================================
STATISTICS

========================================
*/

function buildStatistics(

  context

) {

  const executed =

    context.executionRecords.filter(

      record =>

        !record.skipped

    );

  const passed =

    executed.filter(

      record =>

        record.passed

    );

  const failed =

    executed.filter(

      record =>

      !record.passed

    );

  const skipped =

    context.executionRecords.filter(

      record =>

        record.skipped

    );

  const averageExecutionTime =

    executed.length

      ?

      Number(

        (

          executed.reduce(

            (

              total,

              record

            ) =>

              total +

              record.executionTime,

            0

          )

          /

          executed.length

        ).toFixed(

          2

        )

      )

      :

      0;

  context.statistics = {

    totalRules:

      context.rules.length,

    executedRules:

      executed.length,

    passedRules:

      passed.length,

    failedRules:

      failed.length,

    skippedRules:

      skipped.length,

    totalViolations:

      context.violations.length,

    repairTickets:

      context.repairPlan.length,

    engineeringTickets:

      context.engineeringQueue.length,

    averageExecutionTime,

    successRate:

      executed.length

        ?

        Number(

          (

            (

              passed.length /

              executed.length

            ) * 100

          ).toFixed(

            2

          )

        )

        :

        100

  };

}

/*
========================================
FINAL REPORT

========================================
*/

function buildReport(

  context

) {

  buildRepairPlan(

    context

  );

  buildEngineeringQueue(

    context

  );

  buildLearningFeedback(

    context

  );

  buildPredictionFeedback(

    context

  );

  buildRecommendations(

    context

  );

  buildStatistics(

    context

  );

  return {

    executionId:

      context.executionId,

    traceId:

      context.traceId,

    constitutionVersion:

      context.constitutionVersion,

    passed:

      context.violations.length === 0,

    score:

      Math.max(

        0,

        100 -

        (

          context.violations.length * 10

        )

      ),

    confidence:

      context.executionRecords.length

        ?

        Number(

          (

            context.executionRecords.reduce(

              (

                total,

                record

              ) =>

                total +

                record.confidence,

              0

            )

            /

            context.executionRecords.length

          ).toFixed(

            2

          )

        )

        :

        100,

    executionRecords:

      context.executionRecords,

    violations:

      context.violations,

    repairPlan:

      context.repairPlan,

    engineeringQueue:

      context.engineeringQueue,

    recommendations:

      context.recommendations,

    learning:

      context.learning,

    prediction:

      context.prediction,

    statistics:

      context.statistics,

    completedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
FINAL EXECUTION

Executes all discovered
rules and returns the
final validation report.

========================================
*/

function finalize(

  context,

  validator

) {

  for (

    const rule of context.rules

  ) {

    executeRule({

      context,

      rule,

      validator

    });

  }

  context.finishedAt =

    new Date()

      .toISOString();

  return buildReport(

    context

  );

}

/*
========================================
VALIDATION

Engine integrity.

========================================
*/

function validate() {

  return {

    valid:

      true,

    constitution:

      CONSTITUTION.id,

    version:

      CONSTITUTION.version,

    engine:

      "Constitution Rule Engine"

  };

}

/*
========================================
METADATA

========================================
*/

function metadata() {

  return {

    engine:

      "Constitution Rule Engine",

    constitution:

      CONSTITUTION.title,

    version:

      CONSTITUTION.version,

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
CHECKSUM

Execution checksum.

========================================
*/

function checksum(

  report = {}

) {

  return crypto

    .createHash(

      "sha256"

    )

    .update(

      JSON.stringify({

        executionId:

          report.executionId,

        traceId:

          report.traceId,

        score:

          report.score,

        passed:

          report.passed,

        violations:

          report.violations,

        statistics:

          report.statistics

      })

    )

    .digest(

      "hex"

    );

}

/*
========================================
VERIFY REPORT

========================================
*/

function verify(

  report = {}

) {

  return {

    valid:

      typeof report ===

      "object"

      &&

      Array.isArray(

        report.executionRecords

      )

      &&

      Array.isArray(

        report.violations

      )

      &&

      report.statistics

      !==

      undefined,

    checksum:

      checksum(

        report

      )

  };

}

/*
========================================
RESET

========================================
*/

function reset(

  submission = {}

) {

  return createContext({

    submission

  });

}

/*
========================================
CLONE

========================================
*/

function clone(

  object

) {

  return JSON.parse(

    JSON.stringify(

      object

    )

  );

}

/*
========================================
FREEZE

Deep immutable object.

========================================
*/

function freeze(

  object

) {

  function deepFreeze(

    value

  ) {

    if (

      !value ||

      typeof value !==

      "object"

    ) {

      return value;

    }

    Object.keys(

      value

    ).forEach(

      key =>

        deepFreeze(

          value[key]

        )

    );

    return Object.freeze(

      value

    );

  }

  return deepFreeze(

    object

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

  createContext,

  execute,

  finalize,

  discoverRules,

  executeRule,

  createExecutionRecord,

  createViolation,

  resolveDependencies,

  validatePrerequisites,

  detectConflicts,

  buildRepairPlan,

  buildEngineeringQueue,

  buildLearningFeedback,

  buildPredictionFeedback,

  buildRecommendations,

  buildStatistics,

  buildReport,

  validate,

  metadata,

  checksum,

  verify,

  reset,

  clone,

  freeze

};