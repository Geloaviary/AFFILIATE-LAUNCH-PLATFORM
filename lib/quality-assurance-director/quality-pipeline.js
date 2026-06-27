/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Quality Pipeline

Platform Quality Runtime

Responsible for

• Stage Execution
• Validation Pipeline
• Repair Pipeline
• Approval Pipeline
• Recovery
• Middleware
• Checkpoints

Constitution:
QA-001

========================================
*/

const crypto = require(
  "crypto"
);

/*
========================================
PIPELINE REGISTRY

========================================
*/

const registry = {

  stages:

    new Map(),

  middleware:

    [],

  hooks: {

    before: [],

    after: []

  }

};

/*
========================================
DEFAULT STAGES

Execution Order

========================================
*/

const DEFAULT_STAGES =

  Object.freeze([

    "constitution",

    "department",

    "cross-department",

    "risk",

    "decision",

    "repair",

    "revalidation",

    "approval",

    "finalize"

  ]);

/*
========================================
PIPELINE CONTEXT

========================================
*/

function create({

  session,

  department,

  workflow,

  submission,

  options = {}

} = {}) {

  return {

    pipelineId:

      crypto.randomUUID(),

    session,

    department,

    workflow,

    submission,

    options,

    createdAt:

      new Date()

        .toISOString(),

    currentStage:

      null,

    completed:

      false,

    aborted:

      false,

    stages: [],

    checkpoints: [],

    middleware: [],

    metadata: {},

    statistics: {}

  };

}

/*
========================================
REGISTER STAGE

========================================
*/

function register(

  name,

  handler

) {

  if (

    typeof handler !==

    "function"

  ) {

    throw new TypeError(

      `Pipeline stage '${name}' must be a function.`

    );

  }

  registry.stages.set(

    name,

    handler

  );

}

/*
========================================
GET STAGE

========================================
*/

function getStage(

  name

) {

  return registry.stages.get(

    name

  ) ||

  null;

}

/*
========================================
REGISTER MIDDLEWARE

========================================
*/

function use(

  middleware

) {

  if (

    typeof middleware ===

    "function"

  ) {

    registry.middleware.push(

      middleware

    );

  }

}

/*
========================================
REGISTER HOOK

========================================
*/

function hook(

  position,

  handler

) {

  if (

    !registry.hooks[

      position

    ]

  ) {

    throw new Error(

      `Unknown hook '${position}'.`

    );

  }

  registry.hooks[

    position

  ].push(

    handler

  );

}

/*
========================================
CHECKPOINT

========================================
*/

function checkpoint(

  context,

  stage,

  status,

  details = {}

) {

  context.checkpoints.push({

    stage,

    status,

    timestamp:

      new Date()

        .toISOString(),

    ...details

  });

}

/*
========================================
EXECUTE HOOKS

========================================
*/

async function executeHooks(

  position,

  context

) {

  const hooks =

    registry.hooks[

      position

    ] || [];

  for (

    const hook of hooks

  ) {

    await hook(

      context

    );

  }

}

/*
========================================
EXECUTE MIDDLEWARE

========================================
*/

async function executeMiddleware(

  context

) {

  for (

    const middleware of

    registry.middleware

  ) {

    await middleware(

      context

    );

  }

}

/*
========================================
EXECUTE STAGE

Universal wrapper for
every pipeline stage.

========================================
*/

async function executeStage({

  context,

  stage

}) {

  const handler =

    getStage(

      stage

    );

  if (

    !handler

  ) {

    checkpoint(

      context,

      stage,

      "skipped"

    );

    return;

  }

  const started =

    Date.now();

  context.currentStage =

    stage;

  checkpoint(

    context,

    stage,

    "started"

  );

  try {

    await executeHooks(

      "before",

      context

    );

    await executeMiddleware(

      context

    );

    await handler(

      context

    );

    await executeHooks(

      "after",

      context

    );

    checkpoint(

      context,

      stage,

      "completed",

      {

        duration:

          Date.now() -

          started

      }

    );

  }

  catch (

    error

  ) {

    checkpoint(

      context,

      stage,

      "failed",

      {

        duration:

          Date.now() -

          started,

        error:

          error.message

      }

    );

    context.aborted =

      true;

    context.error =

      error;

    throw error;

  }

}

/*
========================================
PIPELINE EXECUTION

========================================
*/

async function execute({

  context,

  stages =

    DEFAULT_STAGES

} = {}) {

  for (

    const stage of

    stages

  ) {

    if (

      context.aborted

    ) {

      break;

    }

    await executeStage({

      context,

      stage

    });

  }

  context.completed =

    !context.aborted;

  return context;

}

/*
========================================
VALIDATE

Constitution +
Department Validation

========================================
*/

async function validate({

  session,

  department,

  workflow,

  submission,

  options = {}

} = {}) {

  const context =

    create({

      session,

      department,

      workflow,

      submission,

      options

    });

  await execute({

    context,

    stages: [

      "constitution",

      "department",

      "cross-department",

      "risk"

    ]

  });

  return context;

}

/*
========================================
DECISION

========================================
*/

async function decision(

  context

) {

  await executeStage({

    context,

    stage:

      "decision"

  });

  return context;

}

/*
========================================
REPAIR

========================================
*/

async function repair(

  context

) {

  await executeStage({

    context,

    stage:

      "repair"

  });

  return context;

}

/*
========================================
APPROVAL

========================================
*/

async function approval(

  context

) {

  await executeStage({

    context,

    stage:

      "approval"

  });

  return context;

}

/*
========================================
RECOVERY

Resume from failed stage.

========================================
*/

async function recover({

  context,

  fromStage =

    context.currentStage

} = {}) {

  const index =

    DEFAULT_STAGES.indexOf(

      fromStage

    );

  if (

    index < 0

  ) {

    throw new Error(

      `Unknown recovery stage '${fromStage}'.`

    );

  }

  context.aborted =

    false;

  context.error =

    null;

  return execute({

    context,

    stages:

      DEFAULT_STAGES.slice(

        index

      )

  });

}

/*
========================================
PIPELINE STATISTICS

========================================
*/

function statistics(

  context

) {

  const completed =

    context.checkpoints.filter(

      checkpoint =>

        checkpoint.status ===

        "completed"

    );

  const failed =

    context.checkpoints.filter(

      checkpoint =>

        checkpoint.status ===

        "failed"

    );

  const duration =

    completed.reduce(

      (

        total,

        checkpoint

      ) =>

        total +

        (

          checkpoint.duration ||

          0

        ),

      0

    );

  context.statistics = {

    pipelineId:

      context.pipelineId,

    stages:

      context.checkpoints.length,

    completed:

      completed.length,

    failed:

      failed.length,

    aborted:

      context.aborted,

    duration,

    currentStage:

      context.currentStage

  };

  return context.statistics;

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

    pipelineId:

      context.pipelineId,

    department:

      context.department,

    workflow:

      context.workflow,

    completed:

      context.completed,

    aborted:

      context.aborted,

    currentStage:

      context.currentStage,

    checkpoints:

      context.checkpoints.length,

    duration:

      statistics(

        context

      ).duration

  };

}

/*
========================================
REPORT

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

    checkpoints:

      [

        ...context.checkpoints

      ],

    metadata:

      {

        ...context.metadata

      },

    error:

      context.error ||

      null

  };

}

/*
========================================
METADATA

========================================
*/

function setMetadata(

  context,

  key,

  value

) {

  context.metadata[

    key

  ] = value;

  return context;

}

function getMetadata(

  context,

  key,

  defaultValue =

    null

) {

  return context.metadata[

    key

  ] ??

  defaultValue;

}

/*
========================================
DISCOVERY

========================================
*/

function stages() {

  return [

    ...registry.stages.keys()

  ];

}

function middleware() {

  return [

    ...registry.middleware

  ];

}

function hooks() {

  return {

    before:

      [

        ...registry.hooks.before

      ],

    after:

      [

        ...registry.hooks.after

      ]

  };

}

/*
========================================
VALIDATION

Pipeline integrity.

========================================
*/

function validate() {

  const errors = [];

  if (

    !(registry.stages instanceof Map)

  ) {

    errors.push(

      "Stage registry is invalid."

    );

  }

  if (

    !Array.isArray(

      registry.middleware

    )

  ) {

    errors.push(

      "Middleware registry is invalid."

    );

  }

  if (

    !registry.hooks ||

    !Array.isArray(

      registry.hooks.before

    ) ||

    !Array.isArray(

      registry.hooks.after

    )

  ) {

    errors.push(

      "Hook registry is invalid."

    );

  }

  return {

    valid:

      errors.length === 0,

    errors

  };

}

/*
========================================
HEALTH

========================================
*/

function health() {

  return {

    healthy:

      true,

    stages:

      registry.stages.size,

    middleware:

      registry.middleware.length,

    beforeHooks:

      registry.hooks.before.length,

    afterHooks:

      registry.hooks.after.length,

    timestamp:

      new Date()

        .toISOString()

  };

}

/*
========================================
RESET

Development / Testing

========================================
*/

function reset() {

  registry.stages.clear();

  registry.middleware.length = 0;

  registry.hooks.before.length = 0;

  registry.hooks.after.length = 0;

}

/*
========================================
CLONE

========================================
*/

function clone(

  value

) {

  return JSON.parse(

    JSON.stringify(

      value

    )

  );

}

/*
========================================
FREEZE

========================================
*/

function freeze(

  value

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

  return deepFreeze(

    value

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

      "Quality Pipeline",

    version:

      "3.0.0",

    constitution:

      "QA-001",

    runtime:

      "Stage Execution Engine",

    supports: [

      "dynamic-stages",

      "middleware",

      "hooks",

      "checkpointing",

      "recovery",

      "statistics",

      "reporting"

    ],

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
PUBLIC API

========================================
*/

const QualityPipeline =

  Object.freeze({

    DEFAULT_STAGES,

    create,

    register,

    getStage,

    stages,

    use,

    middleware,

    hook,

    hooks,

    checkpoint,

    execute,

    executeStage,

    validate,

    decision,

    repair,

    approval,

    recover,

    statistics,

    summary,

    report,

    setMetadata,

    getMetadata,

    validate,

    health,

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

  QualityPipeline;