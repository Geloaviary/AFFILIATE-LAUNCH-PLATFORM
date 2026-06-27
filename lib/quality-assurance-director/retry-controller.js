/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Retry Controller

Platform Recovery Engine

Responsible for

• Failure Recovery
• Retry Strategies
• Backoff Policies
• Checkpoint Recovery
• Pipeline Resume
• Escalation

Constitution:
QA-001

========================================
*/

const crypto = require(
  "crypto"
);

/*
========================================
RETRY STRATEGIES

========================================
*/

const STRATEGY =

  Object.freeze({

    IMMEDIATE:

      "immediate",

    FIXED:

      "fixed",

    LINEAR:

      "linear",

    EXPONENTIAL:

      "exponential",

    ADAPTIVE:

      "adaptive",

    MANUAL:

      "manual",

    ENGINEERING:

      "engineering"

  });

/*
========================================
FAILURE TYPES

========================================
*/

const FAILURE =

  Object.freeze({

    VALIDATION:

      "validation",

    REPAIRABLE:

      "repairable",

    TRANSIENT:

      "transient",

    INFRASTRUCTURE:

      "infrastructure",

    TIMEOUT:

      "timeout",

    DEPENDENCY:

      "dependency",

    CRITICAL:

      "critical",

    UNKNOWN:

      "unknown"

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

    strategy:

      STRATEGY.EXPONENTIAL,

    baseDelay:

      1000,

    maxDelay:

      30000,

    multiplier:

      2,

    resumeFromCheckpoint:

      true,

    repairBeforeRetry:

      true,

    engineeringThreshold:

      3,

    failFast:

      false

  });

/*
========================================
REGISTRY

========================================
*/

const registry = {

  policies:

    new Map(),

  strategies:

    new Map(),

  history: []

};

/*
========================================
RETRY CONTEXT

========================================
*/

function create({

  session,

  workflow,

  pipeline,

  checkpoint = null,

  failure = FAILURE.UNKNOWN,

  error = null,

  policy = {}

} = {}) {

  return {

    retryId:

      crypto.randomUUID(),

    createdAt:

      new Date()

        .toISOString(),

    session,

    workflow,

    pipeline,

    checkpoint,

    failure,

    error,

    attempt:

      0,

    strategy:

      policy.strategy ||

      DEFAULT_POLICY.strategy,

    delay:

      0,

    completed:

      false,

    successful:

      false,

    policy: {

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
REGISTER POLICY

========================================
*/

function registerPolicy(

  name,

  policy

) {

  registry.policies.set(

    name,

    {

      ...DEFAULT_POLICY,

      ...policy

    }

  );

}

/*
========================================
REGISTER STRATEGY

========================================
*/

function registerStrategy(

  name,

  resolver

) {

  if (

    typeof resolver !==

    "function"

  ) {

    throw new TypeError(

      `Retry strategy '${name}' must be a function.`

    );

  }

  registry.strategies.set(

    name,

    resolver

  );

}

/*
========================================
GET POLICY

========================================
*/

function getPolicy(

  name

) {

  return registry.policies.get(

    name

  ) ||

  DEFAULT_POLICY;

}

/*
========================================
BACKOFF ENGINE

========================================
*/

function calculateDelay(

  context

) {

  const {

    strategy,

    baseDelay,

    multiplier,

    maxDelay

  } = context.policy;

  let delay = baseDelay;

  switch (

    strategy

  ) {

    case STRATEGY.IMMEDIATE:

      delay = 0;

      break;

    case STRATEGY.FIXED:

      delay = baseDelay;

      break;

    case STRATEGY.LINEAR:

      delay =

        baseDelay *

        Math.max(

          context.attempt,

          1

        );

      break;

    case STRATEGY.EXPONENTIAL:

      delay =

        baseDelay *

        Math.pow(

          multiplier,

          Math.max(

            context.attempt - 1,

            0

          )

        );

      break;

    case STRATEGY.ADAPTIVE: {

      const resolver =

        registry.strategies.get(

          STRATEGY.ADAPTIVE

        );

      if (

        resolver

      ) {

        delay = resolver(

          context

        );

      }

      else {

        delay =

          baseDelay *

          Math.pow(

            multiplier,

            Math.max(

              context.attempt - 1,

              0

            )

          );

      }

      break;
    }

    case STRATEGY.MANUAL:

      delay =

        baseDelay;

      break;

    case STRATEGY.ENGINEERING:

      delay =

        maxDelay;

      break;

    default:

      delay =

        baseDelay;

  }

  context.delay =

    Math.min(

      delay,

      maxDelay

    );

  return context.delay;

}

/*
========================================
FAILURE ANALYSIS

========================================
*/

function analyzeFailure(

  context

) {

  const error =

    context.error;

  if (

    !error

  ) {

    context.failure =

      FAILURE.UNKNOWN;

    return context.failure;

  }

  if (

    error.timeout === true ||

    error.code === "ETIMEDOUT"

  ) {

    context.failure =

      FAILURE.TIMEOUT;

  }

  else if (

    error.validation === true

  ) {

    context.failure =

      FAILURE.VALIDATION;

  }

  else if (

    error.repairable === true

  ) {

    context.failure =

      FAILURE.REPAIRABLE;

  }

  else if (

    error.infrastructure === true

  ) {

    context.failure =

      FAILURE.INFRASTRUCTURE;

  }

  else if (

    error.dependency === true

  ) {

    context.failure =

      FAILURE.DEPENDENCY;

  }

  else if (

    error.critical === true

  ) {

    context.failure =

      FAILURE.CRITICAL;

  }

  else {

    context.failure =

      FAILURE.UNKNOWN;

  }

  return context.failure;

}

/*
========================================
STRATEGY RESOLUTION

========================================
*/

function resolveStrategy(

  context

) {

  switch (

    context.failure

  ) {

    case FAILURE.TIMEOUT:

    case FAILURE.TRANSIENT:

      context.strategy =

        STRATEGY.EXPONENTIAL;

      break;

    case FAILURE.REPAIRABLE:

      context.strategy =

        STRATEGY.LINEAR;

      break;

    case FAILURE.VALIDATION:

      context.strategy =

        STRATEGY.IMMEDIATE;

      break;

    case FAILURE.INFRASTRUCTURE:

      context.strategy =

        STRATEGY.ADAPTIVE;

      break;

    case FAILURE.CRITICAL:

      context.strategy =

        STRATEGY.ENGINEERING;

      break;

    default:

      context.strategy =

        context.policy.strategy;

  }

  return context.strategy;

}

/*
========================================
WAIT

========================================
*/

async function wait(

  milliseconds

) {

  if (

    milliseconds <= 0

  ) {

    return;

  }

  return new Promise(

    resolve =>

      setTimeout(

        resolve,

        milliseconds

      )

  );

}

/*
========================================
CHECKPOINT RECOVERY

========================================
*/

async function resumeCheckpoint(

  context

) {

  if (

    !context.policy

      .resumeFromCheckpoint

  ) {

    return false;

  }

  if (

    !context.pipeline ||

    typeof context.pipeline

      .recover !==

      "function"

  ) {

    return false;

  }

  await context.pipeline.recover({

    context:

      context.pipeline,

    fromStage:

      context.checkpoint

  });

  return true;

}

/*
========================================
RETRY EXECUTION

========================================
*/

async function retry(

  context,

  executor

) {

  analyzeFailure(

    context

  );

  resolveStrategy(

    context

  );

  while (

    context.attempt <

    context.policy.maxRetries

  ) {

    context.attempt++;

    calculateDelay(

      context

    );

    await wait(

      context.delay

    );

    const started =

      Date.now();

    try {

      const result =

        await executor(

          context

        );

      context.completed =

        true;

      context.successful =

        true;

      context.history.push({

        attempt:

          context.attempt,

        strategy:

          context.strategy,

        delay:

          context.delay,

        result:

          "success",

        duration:

          Date.now() -

          started,

        timestamp:

          new Date()

            .toISOString()

      });

      registry.history.push(

        context

      );

      return result;

    }

    catch (

      error

    ) {

      context.error =

        error;

      analyzeFailure(

        context

      );

      context.history.push({

        attempt:

          context.attempt,

        strategy:

          context.strategy,

        delay:

          context.delay,

        result:

          "failed",

        error:

          error.message,

        duration:

          Date.now() -

          started,

        timestamp:

          new Date()

            .toISOString()

      });

      if (

        context.policy

          .repairBeforeRetry &&

        context.failure ===

        FAILURE.REPAIRABLE

      ) {

        await resumeCheckpoint(

          context

        );

      }

      if (

        context.policy

          .failFast

      ) {

        break;

      }

    }

  }

  context.completed =

    true;

  context.successful =

    false;

  return null;

}

/*
========================================
ENGINEERING ESCALATION

========================================
*/

function escalate(

  context

) {

  context.strategy =

    STRATEGY.ENGINEERING;

  context.completed =

    true;

  context.successful =

    false;

  context.history.push({

    attempt:

      context.attempt,

    strategy:

      STRATEGY.ENGINEERING,

    result:

      "engineering",

    timestamp:

      new Date()

        .toISOString()

  });

  registry.history.push(

    context

  );

  return context;

}

/*
========================================
STATISTICS

========================================
*/

function statistics(

  context

) {

  const successful =

    context.history.filter(

      entry =>

        entry.result ===

        "success"

    ).length;

  const failed =

    context.history.filter(

      entry =>

        entry.result ===

        "failed"

    ).length;

  const duration =

    context.history.reduce(

      (

        total,

        entry

      ) =>

        total +

        (

          entry.duration ||

          0

        ),

      0

    );

  const successRate =

    context.history.length

      ?

      successful /

      context.history.length

      :

      0;

  context.statistics = {

    retryId:

      context.retryId,

    attempts:

      context.attempt,

    successful,

    failed,

    completed:

      context.completed,

    successRate,

    duration,

    averageDuration:

      context.history.length

        ?

        duration /

        context.history.length

        :

        0,

    recoveryScore:

      Number(

        (

          successRate *

          100

        ).toFixed(

          2

        )

      )

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

    retryId:

      context.retryId,

    failure:

      context.failure,

    strategy:

      context.strategy,

    attempts:

      context.attempt,

    completed:

      context.completed,

    successful:

      context.successful,

    checkpoint:

      context.checkpoint,

    delay:

      context.delay

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

    history:

      [

        ...context.history

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
HISTORY

========================================
*/

function history({

  limit = null

} = {}) {

  if (

    !limit

  ) {

    return [

      ...registry.history

    ];

  }

  return registry.history.slice(

    -limit

  );

}

/*
========================================
VALIDATION

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

      "Retry context missing."

    );

  }

  else {

    if (

      !context.retryId

    ) {

      errors.push(

        "Retry ID missing."

      );

    }

    if (

      !context.policy

    ) {

      errors.push(

        "Retry policy missing."

      );

    }

    if (

      !context.strategy

    ) {

      errors.push(

        "Retry strategy missing."

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
HEALTH

========================================
*/

function health() {

  return {

    healthy:

      true,

    registeredPolicies:

      registry.policies.size,

    registeredStrategies:

      registry.strategies.size,

    recoveries:

      registry.history.length,

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

      "Retry Controller",

    version:

      "3.0.0",

    constitution:

      "QA-001",

    runtime:

      "Recovery Engine",

    supports: [

      "checkpoint-recovery",

      "adaptive-retry",

      "backoff",

      "engineering-escalation",

      "analytics",

      "reporting"

    ],

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
POLICY REGISTRY

========================================
*/

function policies() {

  return Array.from(

    registry.policies.keys()

  );

}

/*
========================================
STRATEGY REGISTRY

========================================
*/

function strategies() {

  return Array.from(

    registry.strategies.keys()

  );

}

/*
========================================
RESET

Development / Testing

========================================
*/

function reset() {

  registry.policies.clear();

  registry.strategies.clear();

  registry.history.length = 0;

  bootstrap();

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
BOOTSTRAP

Registers built-in policies
and strategies.

========================================
*/

function bootstrap() {

  registerPolicy(

    "default",

    DEFAULT_POLICY

  );

  registerStrategy(

    STRATEGY.ADAPTIVE,

    context => {

      const successRate =

        context.statistics

          ?.successRate ??

        0.5;

      const multiplier =

        successRate >= 0.8

          ? 1

          : successRate >= 0.5

          ? 2

          : 3;

      return Math.min(

        context.policy.baseDelay *

          multiplier *

          Math.max(

            context.attempt,

            1

          ),

        context.policy.maxDelay

      );

    }

  );

}

/*
========================================
BOOTSTRAP

========================================
*/

bootstrap();

/*
========================================
PUBLIC API

========================================
*/

const RetryController =

  Object.freeze({

    STRATEGY,

    FAILURE,

    DEFAULT_POLICY,

    create,

    registerPolicy,

    registerStrategy,

    getPolicy,

    calculateDelay,

    analyzeFailure,

    resolveStrategy,

    retry,

    resumeCheckpoint,

    escalate,

    statistics,

    summary,

    report,

    history,

    policies,

    strategies,

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

  RetryController;