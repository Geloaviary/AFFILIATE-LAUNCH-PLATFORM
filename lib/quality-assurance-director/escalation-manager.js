const {

  ESCALATION_LEVEL,

  REPAIR_STATUS,

  AUDIT_ACTION,

  SEVERITY,

  WORKFLOW_STAGE

} = require(
  "./quality-types"
);

const {
  record
} = require(
  "./audit-manager"
);

const DEFAULT_LIMITS = {

  director: 3,

  executive: 5,

  system: 7

};

async function evaluate({

  submission = {},

  repairTicket = {},

  violations = [],

  limits = DEFAULT_LIMITS

} = {}) {

  const attempts =
    repairTicket.attempts || 0;

  let escalationLevel =
    ESCALATION_LEVEL.NONE;

  let escalationTarget =
    null;

  let recommendation =
    "Continue repair.";

  /*
  ==========================
  CRITICAL VIOLATIONS
  ==========================
  */

  const criticalCount =

    violations.filter(

      violation =>

        violation.severity ===
        SEVERITY.CRITICAL

    ).length;

  if (

    criticalCount > 0

  ) {

    escalationLevel =
      ESCALATION_LEVEL.DIRECTOR;

    escalationTarget =
      `${submission.department}-director`;

    recommendation =
      "Critical constitutional violations detected.";

  }

  /*
  ==========================
  ATTEMPTS
  ==========================
  */

  if (

    attempts >=
    limits.director

  ) {

    escalationLevel =
      ESCALATION_LEVEL.DIRECTOR;

    escalationTarget =
      `${submission.department}-director`;

    recommendation =
      "Department exceeded repair threshold.";

  }

  if (

    attempts >=
    limits.executive

  ) {

    escalationLevel =
      ESCALATION_LEVEL.EXECUTIVE;

    escalationTarget =
      "executive-director";

    recommendation =
      "Executive review required.";

  }

  if (

    attempts >=
    limits.system

  ) {

    escalationLevel =
      ESCALATION_LEVEL.SYSTEM;

    escalationTarget =
      "system";

    recommendation =
      "Workflow locked pending investigation.";

  }

  const escalated =

    escalationLevel !==
    ESCALATION_LEVEL.NONE;

  if (

    escalated

  ) {

    repairTicket.status =
      REPAIR_STATUS.ESCALATED;

  }

  await record({

    submissionId:
      submission.id,

    department:
      submission.department,

    action:

      escalated

        ? AUDIT_ACTION.ESCALATED

        : AUDIT_ACTION.REPAIRED,

    data: {

      workflowStage:

        submission.workflowStage ||

        WORKFLOW_STAGE.RESEARCH_QC,

      escalationLevel,

      escalationTarget,

      attempts,

      violationCount:
        violations.length,

      recommendation

    }

  });

  return {

    escalated,

    escalationLevel,

    escalationTarget,

    recommendation,

    repairTicket

  };

}

function requiresExecutive(

  escalation = {}

) {

  return (

    escalation.escalationLevel ===

    ESCALATION_LEVEL.EXECUTIVE

  );

}

function requiresSystemLock(

  escalation = {}

) {

  return (

    escalation.escalationLevel ===

    ESCALATION_LEVEL.SYSTEM

  );

}

function shouldContinueRepair(

  escalation = {}

) {

  return (

    !escalation.escalated ||

    escalation.escalationLevel ===

    ESCALATION_LEVEL.DIRECTOR

  );

}

module.exports = {

  evaluate,

  requiresExecutive,

  requiresSystemLock,

  shouldContinueRepair

};