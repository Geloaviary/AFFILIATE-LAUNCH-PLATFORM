/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Stage Router

Workflow Navigation Engine

Responsible for

• Stage Routing
• Department Discovery
• Validator Resolution
• Repair Resolution
• Pipeline Resolution
• Workflow Navigation

Constitution:
QA-001

========================================
*/

const crypto = require(
  "crypto"
);

/*
========================================
ROUTE REGISTRY

========================================
*/

const registry = {

  routes:

    new Map(),

  aliases:

    new Map(),

  middleware:

    new Map()

};

/*
========================================
DEFAULT WORKFLOW

========================================
*/

const DEFAULT_WORKFLOW =

  Object.freeze([

    "research",

    "strategy",

    "content",

    "asset-intelligence",

    "production",

    "rendering"

  ]);

/*
========================================
ROUTING CONTEXT

========================================
*/

function create({

  department,

  workflow,

  session,

  metadata = {}

} = {}) {

  return {

    routingId:

      crypto.randomUUID(),

    session,

    department,

    workflow,

    createdAt:

      new Date()

        .toISOString(),

    current:

      department,

    previous:

      null,

    next:

      null,

    resolved:

      null,

    history: [],

    metadata

  };

}

/*
========================================
REGISTER

========================================
*/

function register(

  department,

  descriptor = {}

) {

  registry.routes.set(

    department,

    {

      department,

      validator:

        descriptor.validator ||

        null,

      repair:

        descriptor.repair ||

        null,

      pipeline:

        descriptor.pipeline ||

        null,

      workflowPolicy:

        descriptor.workflowPolicy ||

        null,

      approvalGate:

        descriptor.approvalGate ||

        null,

      retryPolicy:

        descriptor.retryPolicy ||

        null,

      middleware:

        descriptor.middleware ||

        [],

      capabilities:

        descriptor.capabilities ||

        [],

      previous:

        descriptor.previous ||

        [],

      next:

        descriptor.next ||

        []

    }

  );

}

/*
========================================
REGISTER ALIAS

========================================
*/

function alias(

  from,

  to

) {

  registry.aliases.set(

    from,

    to

  );

}

/*
========================================
REGISTER MIDDLEWARE

========================================
*/

function use(

  department,

  middleware

) {

  if (

    !registry.middleware.has(

      department

    )

  ) {

    registry.middleware.set(

      department,

      []

    );

  }

  registry.middleware

    .get(

      department

    )

    .push(

      middleware

    );

}

/*
========================================
DISCOVERY

========================================
*/

function exists(

  department

) {

  return registry.routes.has(

    department

  );

}

function get(

  department

) {

  const resolved =

    registry.aliases.get(

      department

    ) ||

    department;

  return registry.routes.get(

    resolved

  ) ||

  null;

}

/*
========================================
RESOLVE

========================================
*/

function resolve(

  department

) {

  const alias =

    registry.aliases.get(

      department

    );

  return get(

    alias ||

    department

  );

}

/*
========================================
VALIDATOR

========================================
*/

function validator(

  department

) {

  return resolve(

    department

  )?.validator ||

  null;

}

/*
========================================
REPAIR ENGINE

========================================
*/

function repair(

  department

) {

  return resolve(

    department

  )?.repair ||

  null;

}

/*
========================================
PIPELINE

========================================
*/

function pipeline(

  department

) {

  return resolve(

    department

  )?.pipeline ||

  null;

}

/*
========================================
WORKFLOW POLICY

========================================
*/

function workflowPolicy(

  department

) {

  return resolve(

    department

  )?.workflowPolicy ||

  null;

}

/*
========================================
APPROVAL GATE

========================================
*/

function approvalGate(

  department

) {

  return resolve(

    department

  )?.approvalGate ||

  null;

}

/*
========================================
RETRY POLICY

========================================
*/

function retryPolicy(

  department

) {

  return resolve(

    department

  )?.retryPolicy ||

  null;

}

/*
========================================
NEXT STAGE

========================================
*/

function next(

  department

) {

  const route =

    resolve(

      department

    );

  if (

    route?.next?.length

  ) {

    return route.next;

  }

  const index =

    DEFAULT_WORKFLOW.indexOf(

      department

    );

  if (

    index < 0 ||

    index ===

    DEFAULT_WORKFLOW.length - 1

  ) {

    return [];

  }

  return [

    DEFAULT_WORKFLOW[

      index + 1

    ]

  ];

}

/*
========================================
PREVIOUS STAGE

========================================
*/

function previous(

  department

) {

  const route =

    resolve(

      department

    );

  if (

    route?.previous?.length

  ) {

    return route.previous;

  }

  const index =

    DEFAULT_WORKFLOW.indexOf(

      department

    );

  if (

    index <= 0

  ) {

    return [];

  }

  return [

    DEFAULT_WORKFLOW[

      index - 1

    ]

  ];

}

/*
========================================
RESOLVE CONTEXT

========================================
*/

function route(

  context

) {

  const descriptor =

    resolve(

      context.current

    );

  if (

    !descriptor

  ) {

    throw new Error(

      `No route registered for '${context.current}'.`

    );

  }

  context.resolved =

    descriptor;

  context.previous =

    previous(

      context.current

    );

  context.next =

    next(

      context.current

    );

  context.history.push({

    department:

      context.current,

    timestamp:

      new Date()

        .toISOString()

  });

  return context;

}

/*
========================================
WORKFLOW GRAPH

========================================
*/

function graph() {

  const nodes = {};

  registry.routes.forEach(

    (

      value,

      key

    ) => {

      nodes[key] = {

        previous:

          previous(

            key

          ),

        next:

          next(

            key

          )

      };

    }

  );

  return nodes;

}

/*
========================================
VALIDATE ROUTE

========================================
*/

function validateRoute(

  department

) {

  const descriptor =

    resolve(

      department

    );

  if (

    !descriptor

  ) {

    return {

      valid: false,

      errors: [

        `Route '${department}' not found.`

      ]

    };

  }

  return {

    valid: true,

    errors: []

  };

}

/*
========================================
CAPABILITIES

========================================
*/

function capabilities(

  department

) {

  return resolve(

    department

  )?.capabilities ||

  [];

}

/*
========================================
REGISTERED ROUTES

========================================
*/

function routes() {

  return Array.from(

    registry.routes.keys()

  );

}

/*
========================================
ALIASES

========================================
*/

function aliases() {

  return Array.from(

    registry.aliases.entries()

  ).map(

    ([

      from,

      to

    ]) => ({

      from,

      to

    })

  );

}

/*
========================================
MIDDLEWARE

========================================
*/

function middleware(

  department = null

) {

  if (

    department

  ) {

    return

      registry.middleware.get(

        department

      ) ||

      [];

  }

  return Array.from(

    registry.middleware.entries()

  ).map(

    ([

      department,

      handlers

    ]) => ({

      department,

      count:

        handlers.length

    })

  );

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

  return {

    routes:

      registry.routes.size,

    aliases:

      registry.aliases.size,

    middleware:

      registry.middleware.size,

    workflowStages:

      DEFAULT_WORKFLOW.length

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

    registeredRoutes:

      registry.routes.size,

    registeredAliases:

      registry.aliases.size,

    registeredMiddleware:

      registry.middleware.size,

    timestamp:

      new Date()

        .toISOString()

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

      "Stage Router",

    version:

      "3.0.0",

    constitution:

      "QA-001",

    runtime:

      "Workflow Navigation Engine",

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
DISCOVERY REPORT

========================================
*/

function report() {

  return {

    workflow:

      DEFAULT_WORKFLOW,

    graph:

      graph(),

    statistics:

      statistics(),

    health:

      health(),

    routes:

      routes(),

    aliases:

      aliases()

  };

}

/*
========================================
LOOKUP

Complete descriptor.

========================================
*/

function lookup(

  department

) {

  const descriptor =

    resolve(

      department

    );

  if (

    !descriptor

  ) {

    return null;

  }

  return {

    department,

    validator:

      descriptor.validator,

    repair:

      descriptor.repair,

    pipeline:

      descriptor.pipeline,

    workflowPolicy:

      descriptor.workflowPolicy,

    approvalGate:

      descriptor.approvalGate,

    retryPolicy:

      descriptor.retryPolicy,

    capabilities:

      descriptor.capabilities,

    middleware:

      middleware(

        department

      )

  };

}

/*
========================================
VALIDATION

========================================
*/

function validate() {

  const errors = [];

  if (

    !(registry.routes instanceof Map)

  ) {

    errors.push(

      "Route registry is invalid."

    );

  }

  if (

    !(registry.aliases instanceof Map)

  ) {

    errors.push(

      "Alias registry is invalid."

    );

  }

  if (

    !(registry.middleware instanceof Map)

  ) {

    errors.push(

      "Middleware registry is invalid."

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
RESET

Development / Testing

========================================
*/

function reset() {

  registry.routes.clear();

  registry.aliases.clear();

  registry.middleware.clear();

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

    object

  );

}

/*
========================================
CREATE DEFAULT ROUTES

Platform Bootstrap

========================================
*/

function registerDefaults() {

  DEFAULT_WORKFLOW.forEach(

    (

      department,

      index

    ) => {

      if (

        registry.routes.has(

          department

        )

      ) {

        return;

      }

      register(

        department,

        {

          previous:

            index > 0

              ? [

                  DEFAULT_WORKFLOW[

                    index - 1

                  ]

                ]

              : [],

          next:

            index <

            DEFAULT_WORKFLOW.length - 1

              ? [

                  DEFAULT_WORKFLOW[

                    index + 1

                  ]

                ]

              : [],

          capabilities: [

            "validation",

            "repair",

            "pipeline",

            "routing"

          ]

        }

      );

    }

  );

}

/*
========================================
BOOTSTRAP

========================================
*/

registerDefaults();

/*
========================================
PUBLIC API

========================================
*/

const StageRouter =

  Object.freeze({

    DEFAULT_WORKFLOW,

    create,

    register,

    registerDefaults,

    alias,

    use,

    exists,

    get,

    resolve,

    validator,

    repair,

    pipeline,

    workflowPolicy,

    approvalGate,

    retryPolicy,

    next,

    previous,

    route,

    graph,

    validateRoute,

    capabilities,

    lookup,

    routes,

    aliases,

    middleware,

    statistics,

    health,

    metadata,

    report,

    validate,

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

  StageRouter;