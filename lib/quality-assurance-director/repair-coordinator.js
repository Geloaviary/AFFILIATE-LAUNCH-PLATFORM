const { randomUUID } = require("crypto");

const {
  REPAIR_STATUS,
  SEVERITY,
  AUDIT_ACTION,
  WORKFLOW_STAGE
} = require("./quality-types");

const {
  createRepairTicket
} = require("./models/repair-ticket");

const {
  record
} = require("./audit-manager");

const MAX_REPAIR_ATTEMPTS = 5;

async function createRepair({

  submission = {},

  violations = [],

  report = {}

} = {}) {

  const repairPlan =
    buildRepairPlan(
      violations
    );

  const ticket =
    createRepairTicket({

      id:
        randomUUID(),

      submissionId:
        submission.id,

      department:
        submission.department,

      workflowStage:
        submission.workflowStage ||

        WORKFLOW_STAGE.RESEARCH_QC,

      status:
        REPAIR_STATUS.OPEN,

      priority:
        calculatePriority(
          violations
        ),

      attempts: 0,

      maxAttempts:
        MAX_REPAIR_ATTEMPTS,

      violations,

      repairPlan,

      createdAt:
        new Date()
          .toISOString(),

      updatedAt:
        new Date()
          .toISOString()

    });

  await record({

    submissionId:
      submission.id,

    department:
      submission.department,

    action:
      AUDIT_ACTION.REPAIR_CREATED,

    data: {

      repairTicketId:
        ticket.id,

      workflowStage:
        submission.workflowStage,

      violationCount:
        violations.length

    }

  });

  return ticket;

}

async function startRepair(

  ticket = {}

) {

  ticket.status =
    REPAIR_STATUS.IN_PROGRESS;

  ticket.updatedAt =
    new Date()
      .toISOString();

  return ticket;

}

async function completeRepair(

  ticket = {}

) {

  ticket.status =
    REPAIR_STATUS.RESUBMITTED;

  ticket.updatedAt =
    new Date()
      .toISOString();

  return ticket;

}

async function failRepair(

  ticket = {}

) {

  ticket.attempts++;

  ticket.updatedAt =
    new Date()
      .toISOString();

  if (

    ticket.attempts >=
    ticket.maxAttempts

  ) {

    ticket.status =
      REPAIR_STATUS.ESCALATED;

  }

  else {

    ticket.status =
      REPAIR_STATUS.OPEN;

  }

  return ticket;

}

function requiresEscalation(

  ticket = {}

) {

  return (

    ticket.attempts >=
    ticket.maxAttempts ||

    ticket.status ===
    REPAIR_STATUS.ESCALATED

  );

}

function calculatePriority(

  violations = []

) {

  if (

    violations.some(

      v =>

        v.severity ===
        SEVERITY.CRITICAL

    )

  ) {

    return "critical";

  }

  if (

    violations.some(

      v =>

        v.severity ===
        SEVERITY.HIGH

    )

  ) {

    return "high";

  }

  return "normal";

}

function buildRepairPlan(

  violations = []

) {

  return violations.map(

    violation => ({

      code:
        violation.code,

      owner:
        violation.owner ||

        "department",

      recommendation:

        violation.recommendation ||

        "Repair and resubmit.",

      constitutionalRule:

        violation.constitutionalRule ||

        null,

      repairSteps:

        violation.repairSteps ||

        []

    })

  );

}

module.exports = {

  createRepair,

  startRepair,

  completeRepair,

  failRepair,

  requiresEscalation,

  buildRepairPlan

};