/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Validation Session

Quality Execution Context

Responsible for

• Session Lifecycle
• Runtime Context
• Traceability
• Audit Context
• Timing
• Statistics
• Shared State

Constitution:
QA-001

========================================
*/

const crypto = require(
  "crypto"
);

/*
========================================
SESSION BUILDER

========================================
*/

function create({

  department,

  workflow,

  submission = {},

  campaign = {},

  traceId = null,

  options = {}

} = {}) {

  const now =

    new Date()

      .toISOString();

  return {

    /*
    ----------------------------------
    IDENTIFIERS
    ----------------------------------
    */

    sessionId:

      crypto.randomUUID(),

    traceId:

      traceId ||

      submission.traceId ||

      crypto.randomUUID(),

    parentSessionId:

      null,

    campaignId:

      campaign.id ||

      null,

    workflowId:

      workflow?.id ||

      workflow ||

      null,

    /*
    ----------------------------------
    CONTEXT
    ----------------------------------
    */

    department,

    workflow,

    campaign,

    submission,

    options,

    /*
    ----------------------------------
    LIFECYCLE
    ----------------------------------
    */

    createdAt:

      now,

    startedAt:

      null,

    finishedAt:

      null,

    duration:

      0,

    state:

      "created",

    /*
    ----------------------------------
    PIPELINE
    ----------------------------------
    */

    validation:

      null,

    repair:

      null,

    approval:

      null,

    metrics:

      null,

    history:

      null,

    learning:

      null,

    prediction:

      null,

    dashboard:

      null,

    executive:

      null,

    engineering:

      null,

    /*
    ----------------------------------
    AUDIT
    ----------------------------------
    */

    logs: [],

    events: [],

    warnings: [],

    errors: [],

    /*
    ----------------------------------
    RUNTIME
    ----------------------------------
    */

    metadata: {},

    statistics: {},

    attributes: {},

    tags: [],

    completed:

      false,

    frozen:

      false

  };

}

/*
========================================
SESSION FACTORY

========================================
*/

function createChild({

  parent,

  department,

  workflow,

  submission,

  campaign,

  options

}) {

  const child =

    create({

      department,

      workflow,

      submission,

      campaign,

      traceId:

        parent.traceId,

      options

    });

  child.parentSessionId =

    parent.sessionId;

  return child;

}

/*
========================================
LIFECYCLE

State Management

========================================
*/

function start(

  session

) {

  session.startedAt =

    new Date()

      .toISOString();

  session.state =

    "started";

  log(

    session,

    "Session started."

  );

  return session;

}

function setState(

  session,

  state

) {

  session.state =

    state;

  log(

    session,

    `State changed to ${state}.`

  );

  return session;

}

function complete(

  session

) {

  session.finishedAt =

    new Date()

      .toISOString();

  session.duration =

    new Date(

      session.finishedAt

    ).getTime()

    -

    new Date(

      session.startedAt ||

      session.createdAt

    ).getTime();

  session.completed =

    true;

  session.state =

    "completed";

  log(

    session,

    "Session completed."

  );

  return session;

}

function fail(

  session,

  error

) {

  session.finishedAt =

    new Date()

      .toISOString();

  session.duration =

    new Date(

      session.finishedAt

    ).getTime()

    -

    new Date(

      session.startedAt ||

      session.createdAt

    ).getTime();

  session.state =

    "failed";

  session.completed =

    true;

  addError(

    session,

    error

  );

  log(

    session,

    "Session failed."

  );

  return session;

}

function escalate(

  session,

  reason

) {

  session.state =

    "escalated";

  log(

    session,

    `Escalated: ${reason}`

  );

  return session;

}

/*
========================================
AUDIT LOG

========================================
*/

function log(

  session,

  message,

  level =

    "INFO"

) {

  session.logs.push({

    timestamp:

      new Date()

        .toISOString(),

    level,

    message

  });

}

/*
========================================
EVENTS

========================================
*/

function addEvent(

  session,

  event,

  payload = {}

) {

  session.events.push({

    timestamp:

      new Date()

        .toISOString(),

    event,

    payload

  });

}

/*
========================================
WARNINGS

========================================
*/

function addWarning(

  session,

  warning

) {

  session.warnings.push({

    timestamp:

      new Date()

        .toISOString(),

    warning

  });

}

/*
========================================
ERRORS

========================================
*/

function addError(

  session,

  error

) {

  session.errors.push({

    timestamp:

      new Date()

        .toISOString(),

    error:

      error instanceof Error

        ? error.message

        : error

  });

}

/*
========================================
TIMING

========================================
*/

function checkpoint(

  session,

  name

) {

  if (

    !session.statistics

      .checkpoints

  ) {

    session.statistics

      .checkpoints = [];

  }

  session.statistics

    .checkpoints

    .push({

      name,

      timestamp:

        new Date()

          .toISOString()

    });

}

/*
========================================
PIPELINE RESULTS

Standardized setters.

========================================
*/

function setValidation(

  session,

  validation

) {

  session.validation =

    validation;

  addEvent(

    session,

    "validation.completed"

  );

  return session;

}

function setRepair(

  session,

  repair

) {

  session.repair =

    repair;

  addEvent(

    session,

    "repair.completed"

  );

  return session;

}

function setApproval(

  session,

  approval

) {

  session.approval =

    approval;

  addEvent(

    session,

    "approval.completed"

  );

  return session;

}

function setMetrics(

  session,

  metrics

) {

  session.metrics =

    metrics;

  return session;

}

function setHistory(

  session,

  history

) {

  session.history =

    history;

  return session;

}

function setLearning(

  session,

  learning

) {

  session.learning =

    learning;

  return session;

}

function setPrediction(

  session,

  prediction

) {

  session.prediction =

    prediction;

  return session;

}

function setDashboard(

  session,

  dashboard

) {

  session.dashboard =

    dashboard;

  return session;

}

function setExecutive(

  session,

  executive

) {

  session.executive =

    executive;

  return session;

}

function setEngineering(

  session,

  engineering

) {

  session.engineering =

    engineering;

  return session;

}

/*
========================================
METADATA

========================================
*/

function setMetadata(

  session,

  key,

  value

) {

  session.metadata[

    key

  ] = value;

  return session;

}

function getMetadata(

  session,

  key,

  defaultValue =

    null

) {

  return session.metadata[

    key

  ] ??

  defaultValue;

}

/*
========================================
ATTRIBUTES

========================================
*/

function setAttribute(

  session,

  key,

  value

) {

  session.attributes[

    key

  ] = value;

  return session;

}

function getAttribute(

  session,

  key,

  defaultValue =

    null

) {

  return session.attributes[

    key

  ] ??

  defaultValue;

}

/*
========================================
TAGS

========================================
*/

function addTag(

  session,

  tag

) {

  if (

    !session.tags.includes(

      tag

    )

  ) {

    session.tags.push(

      tag

    );

  }

  return session;

}

function removeTag(

  session,

  tag

) {

  session.tags =

    session.tags.filter(

      value =>

        value !== tag

    );

  return session;

}

function hasTag(

  session,

  tag

) {

  return session.tags.includes(

    tag

  );

}

/*
========================================
STATISTICS

========================================
*/

function updateStatistics(

  session,

  values = {}

) {

  Object.assign(

    session.statistics,

    values

  );

  return session.statistics;

}

/*
========================================
SUMMARY

========================================
*/

function summary(

  session

) {

  return {

    sessionId:

      session.sessionId,

    traceId:

      session.traceId,

    department:

      session.department,

    workflow:

      session.workflow,

    state:

      session.state,

    completed:

      session.completed,

    duration:

      session.duration,

    warnings:

      session.warnings.length,

    errors:

      session.errors.length,

    events:

      session.events.length,

    repaired:

      session.repair

        ?.repaired ||

      false,

    approved:

      session.approval

        ?.approved ||

      false,

    validationPassed:

      session.validation

        ?.passed ||

      false

  };

}

/*
========================================
SNAPSHOT

Immutable runtime view.

========================================
*/

function snapshot(

  session

) {

  return JSON.parse(

    JSON.stringify(

      session

    )

  );

}

/*
========================================
VALIDATION

Session integrity check.

========================================
*/

function validate(

  session

) {

  const errors = [];

  if (!session) {

    errors.push(

      "Session is required."

    );

  }

  else {

    if (

      !session.sessionId

    ) {

      errors.push(

        "Session ID missing."

      );

    }

    if (

      !session.traceId

    ) {

      errors.push(

        "Trace ID missing."

      );

    }

    if (

      !session.department

    ) {

      errors.push(

        "Department missing."

      );

    }

    if (

      !session.createdAt

    ) {

      errors.push(

        "Creation timestamp missing."

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
RESET

========================================
*/

function reset(

  session

) {

  session.validation =

    null;

  session.repair =

    null;

  session.approval =

    null;

  session.metrics =

    null;

  session.history =

    null;

  session.learning =

    null;

  session.prediction =

    null;

  session.dashboard =

    null;

  session.executive =

    null;

  session.engineering =

    null;

  session.logs = [];

  session.events = [];

  session.warnings = [];

  session.errors = [];

  session.statistics = {};

  session.metadata = {};

  session.attributes = {};

  session.tags = [];

  session.completed =

    false;

  session.frozen =

    false;

  session.state =

    "created";

  session.startedAt =

    null;

  session.finishedAt =

    null;

  session.duration =

    0;

  return session;

}

/*
========================================
CLONE

========================================
*/

function clone(

  session

) {

  return JSON.parse(

    JSON.stringify(

      session

    )

  );

}

/*
========================================
FREEZE

========================================
*/

function freeze(

  session

) {

  function deepFreeze(

    object

  ) {

    if (

      object &&

      typeof object ===

      "object" &&

      !Object.isFrozen(

        object

      )

    ) {

      Object.keys(

        object

      ).forEach(

        key =>

          deepFreeze(

            object[key]

          )

      );

      Object.freeze(

        object

      );

    }

    return object;

  }

  session.frozen =

    true;

  return deepFreeze(

    session

  );

}

/*
========================================
METADATA

========================================
*/

function metadata() {

  return {

    module:

      "Validation Session",

    version:

      "3.0.0",

    constitution:

      "QA-001",

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
FACTORY

========================================
*/

const ValidationSession =

  Object.freeze({

    create,

    createChild,

    start,

    setState,

    complete,

    fail,

    escalate,

    log,

    addEvent,

    addWarning,

    addError,

    checkpoint,

    setValidation,

    setRepair,

    setApproval,

    setMetrics,

    setHistory,

    setLearning,

    setPrediction,

    setDashboard,

    setExecutive,

    setEngineering,

    setMetadata,

    getMetadata,

    setAttribute,

    getAttribute,

    addTag,

    removeTag,

    hasTag,

    updateStatistics,

    summary,

    snapshot,

    validate,

    reset,

    clone,

    freeze,

    metadata

  });

/*
========================================
EXPORTS

Universal Module Contract

QA-001

========================================
*/

module.exports =

  ValidationSession;