/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Workflow Controller

Platform Workflow
Operating System

Responsible for

• Workflow State
• State Transitions
• Retry Control
• Approval Flow
• Escalation
• Routing

Constitution:
QA-001

========================================
*/

const crypto = require(
  "crypto"
);

/*
========================================
WORKFLOW STATES

========================================
*/

const STATE =

  Object.freeze({

    CREATED:

      "created",

    QUEUED:

      "queued",

    VALIDATING:

      "validating",

    REPAIRING:

      "repairing",

    RETRYING:

      "retrying",

    APPROVING:

      "approving",

    APPROVED:

      "approved",

    NEXT_STAGE:

      "next-stage",

    COMPLETED:

      "completed",

    FAILED:

      "failed",

    REJECTED:

      "rejected",

    ESCALATED:

      "escalated"

  });

/*
========================================
DEFAULT POLICY

========================================
*/

const DEFAULT_POLICY =

  Object.freeze({

    maxRetries:

      3,

    autoRepair:

      true,

    allowEscalation:

      true,

    approvalRequired:

      true,

    engineeringRequired:

      false,

    failFast:

      false

  });

/*
========================================
WORKFLOW CONTEXT

========================================
*/

function create({

  department,

  workflow,

  campaign,

  submission,

  session,

  policy = {}

} = {}) {

  const now =

    new Date()

      .toISOString();

  return {

    workflowId:

      crypto.randomUUID(),

    traceId:

      session?.traceId ||

      crypto.randomUUID(),

    session,

    department,

    workflow,

    campaign,

    submission,

    createdAt:

      now,

    updatedAt:

      now,

    state:

      STATE.CREATED,

    retries:

      0,

    approved:

      false,

    rejected:

      false,

    escalated:

      false,

    completed:

      false,

    currentStage:

      workflow?.stage ||

      null,

    nextStage:

      null,

    decision:

      null,

    policy:

      {

        ...DEFAULT_POLICY,

        ...policy

      },

    history: [],

    metadata: {},

    statistics: {}

  };

}

/*
========================================
TRANSITION

Internal helper.

========================================
*/

function transition({

  context,

  to,

  reason = ""

}) {

  const now =

    new Date()

      .toISOString();

  context.history.push({

    from:

      context.state,

    to,

    reason,

    timestamp:

      now

  });

  context.state =

    to;

  context.updatedAt =

    now;

  return context;

}

/*
========================================
TRANSITION GUARD

========================================
*/

function canTransition({

  context,

  to

}) {

  switch (

    context.state

  ) {

    case STATE.CREATED:

      return [

        STATE.QUEUED,

        STATE.VALIDATING

      ].includes(

        to

      );

    case STATE.VALIDATING:

      return [

        STATE.REPAIRING,

        STATE.APPROVING,

        STATE.REJECTED,

        STATE.ESCALATED,

        STATE.FAILED

      ].includes(

        to

      );

    case STATE.REPAIRING:

      return [

        STATE.RETRYING,

        STATE.APPROVING,

        STATE.ESCALATED,

        STATE.FAILED

      ].includes(

        to

      );

    case STATE.RETRYING:

      return [

        STATE.VALIDATING,

        STATE.ESCALATED,

        STATE.FAILED

      ].includes(

        to

      );

    case STATE.APPROVING:

      return [

        STATE.APPROVED,

        STATE.REJECTED

      ].includes(

        to

      );

    case STATE.APPROVED:

      return [

        STATE.NEXT_STAGE,

        STATE.COMPLETED

      ].includes(

        to

      );

    default:

      return false;

  }

}

/*
========================================
APPROVE

========================================
*/

function approve({

  context,

  report = {}

}) {

  if (

    !canTransition({

      context,

      to:

        STATE.APPROVING

    })

  ) {

    return context;

  }

  transition({

    context,

    to:

      STATE.APPROVING,

    reason:

      "Approval started."

  });

  context.approved =

    true;

  context.decision =

    "approved";

  transition({

    context,

    to:

      STATE.APPROVED,

    reason:

      "Workflow approved."

  });

  return {

    approved: true,

    report,

    workflow: context

  };

}

/*
========================================
REJECT

========================================
*/

function reject({

  context,

  reason =

    "Rejected"

}) {

  transition({

    context,

    to:

      STATE.REJECTED,

    reason

  });

  context.rejected =

    true;

  context.decision =

    "rejected";

  return context;

}

/*
========================================
REPAIR

========================================
*/

function repair({

  context,

  repair = {}

}) {

  transition({

    context,

    to:

      STATE.REPAIRING,

    reason:

      "Repair pipeline."

  });

  context.repair =

    repair;

  context.decision =

    "repair";

  return context;

}

/*
========================================
RETRY

========================================
*/

function retry(

  context

) {

  if (

    context.retries >=

    context.policy

      .maxRetries

  ) {

    return escalate({

      context,

      reason:

        "Retry limit exceeded."

    });

  }

  context.retries++;

  transition({

    context,

    to:

      STATE.RETRYING,

    reason:

      "Retry requested."

  });

  return context;

}

/*
========================================
ESCALATE

========================================
*/

function escalate({

  context,

  reason

}) {

  if (

    !context.policy

      .allowEscalation

  ) {

    return reject({

      context,

      reason

    });

  }

  transition({

    context,

    to:

      STATE.ESCALATED,

    reason

  });

  context.escalated =

    true;

  context.decision =

    "engineering";

  return context;

}

/*
========================================
CONTINUE

========================================
*/

function continueWorkflow({

  context,

  nextStage = null

}) {

  transition({

    context,

    to:

      STATE.NEXT_STAGE,

    reason:

      "Next workflow stage."

  });

  context.nextStage =

    nextStage;

  context.decision =

    "continue";

  return context;

}

/*
========================================
WORKFLOW HISTORY

========================================
*/

function history(

  context

) {

  return [

    ...context.history

  ];

}

/*
========================================
LAST TRANSITION

========================================
*/

function lastTransition(

  context

) {

  return context.history.length

    ? context.history[

        context.history.length - 1

      ]

    : null;

}

/*
========================================
STATISTICS

========================================
*/

function statistics(

  context

) {

  return {

    workflowId:

      context.workflowId,

    state:

      context.state,

    retries:

      context.retries,

    approved:

      context.approved,

    rejected:

      context.rejected,

    escalated:

      context.escalated,

    completed:

      context.completed,

    transitions:

      context.history.length,

    currentStage:

      context.currentStage,

    nextStage:

      context.nextStage,

    duration:

      context.updatedAt

        ?

        new Date(

            context.updatedAt

          ).getTime()

          -

          new Date(

            context.createdAt

          ).getTime()

        : 0

  };

}

/*
========================================
SUMMARY

========================================
*/

function summary(

  context

) {

  return {

    workflowId:

      context.workflowId,

    department:

      context.department,

    state:

      context.state,

    decision:

      context.decision,

    retries:

      context.retries,

    approved:

      context.approved,

    rejected:

      context.rejected,

    escalated:

      context.escalated,

    completed:

      context.completed,

    currentStage:

      context.currentStage,

    nextStage:

      context.nextStage

  };

}

/*
========================================
HEALTH

========================================
*/

function health(

  context

) {

  return {

    healthy:

      !context.rejected,

    state:

      context.state,

    retries:

      context.retries,

    timestamp:

      new Date()

        .toISOString()

  };

}

/*
========================================
VALIDATE

Workflow integrity.

========================================
*/

function validate(

  context

) {

  const errors = [];

  if (

    !context

  ) {

    errors.push(

      "Workflow context missing."

    );

  }

  else {

    if (

      !context.workflowId

    ) {

      errors.push(

        "Workflow ID missing."

      );

    }

    if (

      !context.department

    ) {

      errors.push(

        "Department missing."

      );

    }

    if (

      !context.state

    ) {

      errors.push(

        "Workflow state missing."

      );

    }

  }

  return {

    valid:

      errors.length === 0,

    errors

  };

}

/*
========================================
METADATA

========================================
*/

function metadata() {

  return {

    module:

      "Workflow Controller",

    version:

      "3.0.0",

    constitution:

      "QA-001",

    supports: [

      "approval",

      "repair",

      "retry",

      "escalation",

      "workflow",

      "state-machine"

    ],

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
RUNTIME REPORT

========================================
*/

function report(

  context

) {

  return {

    summary:

      summary(

        context

      ),

    statistics:

      statistics(

        context

      ),

    health:

      health(

        context

      ),

    validation:

      validate(

        context

      ),

    history:

      history(

        context

      )

  };

}

/*
========================================
RESET

Resets workflow runtime while
preserving identity.

========================================
*/

function reset(

  context

) {

  context.state =

    STATE.CREATED;

  context.retries =

    0;

  context.approved =

    false;

  context.rejected =

    false;

  context.escalated =

    false;

  context.completed =

    false;

  context.decision =

    null;

  context.nextStage =

    null;

  context.history = [];

  context.metadata = {};

  context.statistics = {};

  context.updatedAt =

    new Date()

      .toISOString();

  return context;

}

/*
========================================
COMPLETE

Marks workflow complete.

========================================
*/

function complete(

  context

) {

  transition({

    context,

    to:

      STATE.COMPLETED,

    reason:

      "Workflow completed."

  });

  context.completed =

    true;

  return context;

}

/*
========================================
CLONE

========================================
*/

function clone(

  context

) {

  return JSON.parse(

    JSON.stringify(

      context

    )

  );

}

/*
========================================
FREEZE

Deep immutable workflow.

========================================
*/

function freeze(

  context

) {

  function deepFreeze(

    value

  ) {

    if (

      value &&

      typeof value ===

      "object" &&

      !Object.isFrozen(

        value

      )

    ) {

      Object.keys(

        value

      ).forEach(

        key =>

          deepFreeze(

            value[key]

          )

      );

      Object.freeze(

        value

      );

    }

    return value;

  }

  return deepFreeze(

    context

  );

}

/*
========================================
CREATE DEFAULT

Creates a standalone
workflow context.

========================================
*/

function createDefault() {

  return create({

    department:

      "system",

    workflow: {

      id:

        "default",

      stage:

        "initial"

    },

    campaign: {},

    submission: {},

    session: null

  });

}

/*
========================================
PUBLIC API

========================================
*/

const WorkflowController =

  Object.freeze({

    STATE,

    DEFAULT_POLICY,

    create,

    createDefault,

    transition,

    canTransition,

    approve,

    reject,

    repair,

    retry,

    escalate,

    continueWorkflow,

    complete,

    history,

    lastTransition,

    statistics,

    summary,

    report,

    health,

    validate,

    metadata,

    reset,

    clone,

    freeze

  });

/*
========================================
EXPORTS

Universal Module Contract

QA-001

========================================
*/

module.exports =

  WorkflowController;