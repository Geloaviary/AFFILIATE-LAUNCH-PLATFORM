/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Event Bus

Platform Communication Backbone

Responsible for

• Publish
• Subscribe
• Middleware
• Event History
• Tracing
• Replay
• Metrics

Constitution:
QA-001

========================================
*/

const crypto = require(
  "crypto"
);

const EventEmitter = require(
  "events"
);

/*
========================================
PRIORITIES

========================================
*/

const PRIORITY =

  Object.freeze({

    CRITICAL: 1,

    HIGH: 2,

    NORMAL: 3,

    LOW: 4

  });

/*
========================================
BUS

========================================
*/

const emitter =

  new EventEmitter();

/*
========================================
REGISTRY

========================================
*/

const registry = {

  subscribers:

    new Map(),

  middleware:

    [],

  history:

    [],

  deadLetters:

    [],

  metrics: {

    published: 0,

    delivered: 0,

    failed: 0

  }

};

/*
========================================
EVENT

Standard event envelope.

========================================
*/

function createEvent({

  name,

  payload = {},

  traceId = null,

  sessionId = null,

  department = null,

  workflow = null,

  source =

    "quality-assurance",

  priority =

    PRIORITY.NORMAL

} = {}) {

  return {

    eventId:

      crypto.randomUUID(),

    name,

    timestamp:

      new Date()

        .toISOString(),

    traceId:

      traceId ||

      crypto.randomUUID(),

    sessionId,

    department,

    workflow,

    source,

    priority,

    payload

  };

}

/*
========================================
SUBSCRIBE

========================================
*/

function subscribe(

  event,

  handler

) {

  if (

    !registry.subscribers.has(

      event

    )

  ) {

    registry.subscribers.set(

      event,

      []

    );

  }

  registry.subscribers

    .get(

      event

    )

    .push(

      handler

    );

  emitter.on(

    event,

    handler

  );

  return handler;

}

/*
========================================
ONCE

========================================
*/

function once(

  event,

  handler

) {

  emitter.once(

    event,

    handler

  );

  return handler;

}

/*
========================================
UNSUBSCRIBE

========================================
*/

function unsubscribe(

  event,

  handler

) {

  emitter.off(

    event,

    handler

  );

  if (

    registry.subscribers.has(

      event

    )

  ) {

    registry.subscribers.set(

      event,

      registry

        .subscribers

        .get(

          event

        )

        .filter(

          fn =>

            fn !== handler

        )

    );

  }

}

/*
========================================
MIDDLEWARE

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
RUN MIDDLEWARE

========================================
*/

async function executeMiddleware(

  event

) {

  for (

    const middleware of

    registry.middleware

  ) {

    await middleware(

      event

    );

  }

}

/*
========================================
WILDCARD MATCH

Supports

quality.*

repair.*

research.*

========================================
*/

function matches(

  pattern,

  event

) {

  if (

    pattern === "*"

  ) {

    return true;

  }

  if (

    pattern.endsWith(

      ".*"

    )

  ) {

    return event.startsWith(

      pattern.slice(

        0,

        -1

      )

    );

  }

  return pattern === event;

}

/*
========================================
DELIVER

========================================
*/

function deliver(

  event

) {

  for (

    const [

      pattern,

      handlers

    ] of

    registry.subscribers

  ) {

    if (

      !matches(

        pattern,

        event.name

      )

    ) {

      continue;

    }

    for (

      const handler of

      handlers

    ) {

      try {

        handler(

          event

        );

        registry.metrics

          .delivered++;

      }

      catch (

        error

      ) {

        registry.metrics

          .failed++;

        registry.deadLetters

          .push({

            event,

            error:

              error.message,

            timestamp:

              new Date()

                .toISOString()

          });

      }

    }

  }

}

/*
========================================
EMIT

Synchronous

========================================
*/

function emit(

  name,

  payload = {},

  options = {}

) {

  const event =

    createEvent({

      name,

      payload,

      ...options

    });

  registry.metrics

    .published++;

  executeMiddleware(

    event

  );

  deliver(

    event

  );

  registry.history.push(

    event

  );

  emitter.emit(

    name,

    event

  );

  return event;

}

/*
========================================
EMIT ASYNC

========================================
*/

async function emitAsync(

  name,

  payload = {},

  options = {}

) {

  const event =

    createEvent({

      name,

      payload,

      ...options

    });

  registry.metrics

    .published++;

  await executeMiddleware(

    event

  );

  deliver(

    event

  );

  registry.history.push(

    event

  );

  emitter.emit(

    name,

    event

  );

  return event;

}

/*
========================================
PRIORITY

========================================
*/

function publish(

  name,

  payload = {},

  options = {}

) {

  const priority =

    options.priority ??

    PRIORITY.NORMAL;

  return emit(

    name,

    payload,

    {

      ...options,

      priority

    }

  );

}

/*
========================================
PUBLISH ASYNC

========================================
*/

async function publishAsync(

  name,

  payload = {},

  options = {}

) {

  const priority =

    options.priority ??

    PRIORITY.NORMAL;

  return emitAsync(

    name,

    payload,

    {

      ...options,

      priority

    }

  );

}

/*
========================================
EVENT HISTORY

========================================
*/

function history({

  event = null,

  traceId = null,

  sessionId = null,

  limit = null

} = {}) {

  let records =

    [...registry.history];

  if (

    event

  ) {

    records = records.filter(

      record =>

        record.name === event

    );

  }

  if (

    traceId

  ) {

    records = records.filter(

      record =>

        record.traceId ===

        traceId

    );

  }

  if (

    sessionId

  ) {

    records = records.filter(

      record =>

        record.sessionId ===

        sessionId

    );

  }

  if (

    limit

  ) {

    records =

      records.slice(

        -limit

      );

  }

  return records;

}

/*
========================================
REPLAY

========================================
*/

async function replay({

  event,

  traceId,

  sessionId

} = {}) {

  const events =

    history({

      event,

      traceId,

      sessionId

    });

  for (

    const record of

    events

  ) {

    await emitAsync(

      record.name,

      record.payload,

      {

        traceId:

          record.traceId,

        sessionId:

          record.sessionId,

        department:

          record.department,

        workflow:

          record.workflow,

        priority:

          record.priority,

        source:

          "event-replay"

      }

    );

  }

  return events.length;

}

/*
========================================
TRACE

========================================
*/

function trace(

  traceId

) {

  return history({

    traceId

  });

}

/*
========================================
SESSION EVENTS

========================================
*/

function session(

  sessionId

) {

  return history({

    sessionId

  });

}

/*
========================================
DEAD LETTERS

========================================
*/

function deadLetters() {

  return [

    ...registry.deadLetters

  ];

}

function clearDeadLetters() {

  registry.deadLetters = [];

}

/*
========================================
METRICS

========================================
*/

function metrics() {

  return {

    published:

      registry.metrics

        .published,

    delivered:

      registry.metrics

        .delivered,

    failed:

      registry.metrics

        .failed,

    subscribers:

      registry.subscribers

        .size,

    middleware:

      registry.middleware

        .length,

    history:

      registry.history

        .length,

    deadLetters:

      registry.deadLetters

        .length

  };

}

/*
========================================
REGISTRY

========================================
*/

function subscribers() {

  return Array.from(

    registry.subscribers

      .keys()

  );

}

function middleware() {

  return [

    ...registry.middleware

  ];

}

/*
========================================
NAMESPACES

========================================
*/

function namespaces() {

  const namespaces =

    new Set();

  registry.subscribers.forEach(

    (

      value,

      key

    ) => {

      const parts =

        key.split(

          "."

        );

      if (

        parts.length

      ) {

        namespaces.add(

          parts[0]

        );

      }

    }

  );

  return Array.from(

    namespaces

  );

}

/*
========================================
VALIDATION

========================================
*/

function validate() {

  return {

    valid:

      true,

    subscribers:

      registry.subscribers.size,

    middleware:

      registry.middleware.length,

    history:

      registry.history.length,

    deadLetters:

      registry.deadLetters.length

  };

}

/*
========================================
HEALTH

========================================
*/

function health() {

  const stats =

    metrics();

  return {

    healthy:

      true,

    published:

      stats.published,

    delivered:

      stats.delivered,

    failed:

      stats.failed,

    successRate:

      stats.published

        ? Number(

            (

              stats.delivered /

              stats.published *

              100

            ).toFixed(

              2

            )

          )

        : 100,

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

  registry.subscribers.clear();

  registry.middleware.length = 0;

  registry.history.length = 0;

  registry.deadLetters.length = 0;

  registry.metrics = {

    published: 0,

    delivered: 0,

    failed: 0

  };

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
METADATA

========================================
*/

function metadata() {

  return {

    module:

      "Event Bus",

    version:

      "3.0.0",

    constitution:

      "QA-001",

    supports: [

      "publish",

      "publishAsync",

      "subscribe",

      "unsubscribe",

      "once",

      "middleware",

      "wildcards",

      "history",

      "replay",

      "deadLetters",

      "metrics",

      "tracing"

    ],

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

  return metrics();

}

/*
========================================
PUBLIC API

========================================
*/

const EventBus =

  Object.freeze({

    PRIORITY,

    createEvent,

    subscribe,

    once,

    unsubscribe,

    emit,

    emitAsync,

    publish,

    publishAsync,

    use,

    history,

    replay,

    trace,

    session,

    deadLetters,

    clearDeadLetters,

    subscribers,

    middleware,

    namespaces,

    metrics,

    statistics,

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

  EventBus;