/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Approval Gate

Platform Decision Engine

Responsible for

• Approval Decisions
• Risk Evaluation
• Policy Enforcement
• Executive Overrides
• Workflow Authorization

Constitution:
QA-001

========================================
*/

const crypto = require(
  "crypto"
);

/*
========================================
DECISION TYPES

========================================
*/

const DECISION =

  Object.freeze({

    APPROVED:

      "approved",

    CONDITIONAL:

      "conditional",

    REPAIR:

      "repair",

    RETRY:

      "retry",

    ENGINEERING:

      "engineering",

    REJECTED:

      "rejected",

    BLOCKED:

      "blocked"

  });

/*
========================================
RISK LEVELS

========================================
*/

const RISK =

  Object.freeze({

    LOW:

      "low",

    MEDIUM:

      "medium",

    HIGH:

      "high",

    CRITICAL:

      "critical"

  });

/*
========================================
DEFAULT POLICY

========================================
*/

const DEFAULT_POLICY =

  Object.freeze({

    minimumScore:

      90,

    allowConditional:

      true,

    allowRepair:

      true,

    allowRetry:

      true,

    allowEngineering:

      true,

    executiveOverride:

      false,

    riskThreshold:

      RISK.HIGH,

    engineeringThreshold:

      60

  });

/*
========================================
DEFAULT WEIGHTS

Weighted Approval Matrix

========================================
*/

const DEFAULT_WEIGHTS =

  Object.freeze({

    constitution:

      40,

    department:

      20,

    repair:

      15,

    risk:

      15,

    workflow:

      10

  });

/*
========================================
RULE REGISTRY

Future Directors may
register approval rules.

========================================
*/

const registry = {

  rules:

    new Map(),

  policies:

    new Map(),

  history: []

};

/*
========================================
APPROVAL CONTEXT

========================================
*/

function create({

  session,

  validation,

  repair,

  workflow,

  policy = {},

  weights = {}

} = {}) {

  return {

    approvalId:

      crypto.randomUUID(),

    createdAt:

      new Date()

        .toISOString(),

    session,

    validation,

    repair,

    workflow,

    decision:

      null,

    approved:

      false,

    score:

      0,

    risk:

      RISK.LOW,

    reasons: [],

    policy: {

      ...DEFAULT_POLICY,

      ...policy

    },

    weights: {

      ...DEFAULT_WEIGHTS,

      ...weights

    },

    matrix: {},

    metadata: {},

    statistics: {},

    history: []

  };

}

/*
========================================
REGISTER RULE

========================================
*/

function register(

  name,

  evaluator

) {

  if (

    typeof evaluator !==

    "function"

  ) {

    throw new TypeError(

      `Approval rule '${name}' must be a function.`

    );

  }

  registry.rules.set(

    name,

    evaluator

  );

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
WEIGHTED SCORE

========================================
*/

function calculateScore(

  context

) {

  const validation =

    context.validation || {};

  const repair =

    context.repair || {};

  const workflow =

    context.workflow || {};

  const constitutionScore =

    validation.constitutionScore ??

    (validation.passed ? 100 : 0);

  const departmentScore =

    validation.departmentScore ??

    (validation.score ?? 100);

  const repairScore =

    repair.confidence ??

    (repair.repaired ? 100 : 0);

  const workflowScore =

    workflow.healthScore ??

    100;

  let riskScore = 100;

  switch (

    context.risk

  ) {

    case RISK.CRITICAL:

      riskScore = 0;

      break;

    case RISK.HIGH:

      riskScore = 40;

      break;

    case RISK.MEDIUM:

      riskScore = 70;

      break;

    default:

      riskScore = 100;

  }

  context.matrix = {

    constitution:

      constitutionScore,

    department:

      departmentScore,

    repair:

      repairScore,

    risk:

      riskScore,

    workflow:

      workflowScore

  };

  context.score =

    (

      constitutionScore *

      context.weights.constitution +

      departmentScore *

      context.weights.department +

      repairScore *

      context.weights.repair +

      riskScore *

      context.weights.risk +

      workflowScore *

      context.weights.workflow

    ) /

    100;

  return context.score;

}

/*
========================================
RISK EVALUATION

========================================
*/

function evaluateRisk(

  context

) {

  const validation =

    context.validation || {};

  const violations =

    validation.violations

      ?.length ||

    0;

  const severity =

    validation.highestSeverity ||

    "LOW";

  if (

    severity ===

    "CRITICAL"

  ) {

    context.risk =

      RISK.CRITICAL;

  }

  else if (

    severity ===

    "HIGH" ||

    violations >= 10

  ) {

    context.risk =

      RISK.HIGH;

  }

  else if (

    severity ===

    "MEDIUM" ||

    violations >= 5

  ) {

    context.risk =

      RISK.MEDIUM;

  }

  else {

    context.risk =

      RISK.LOW;

  }

  return context.risk;

}

/*
========================================
RULE ENGINE

========================================
*/

function evaluateRules(

  context

) {

  for (

    const [

      name,

      evaluator

    ] of

    registry.rules

  ) {

    const result =

      evaluator(

        context

      );

    if (

      result

    ) {

      context.reasons.push({

        rule:

          name,

        result

      });

    }

  }

}

/*
========================================
APPROVE

========================================
*/

function approve(

  context

) {

  context.decision =

    DECISION.APPROVED;

  context.approved =

    true;

  context.history.push({

    decision:

      DECISION.APPROVED,

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
CONDITIONAL

========================================
*/

function conditional(

  context,

  reason

) {

  context.decision =

    DECISION.CONDITIONAL;

  context.reasons.push(

    reason

  );

  context.history.push({

    decision:

      DECISION.CONDITIONAL,

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
REPAIR

========================================
*/

function repair(

  context,

  reason

) {

  context.decision =

    DECISION.REPAIR;

  context.reasons.push(

    reason

  );

  context.history.push({

    decision:

      DECISION.REPAIR,

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
RETRY

========================================
*/

function retry(

  context,

  reason

) {

  context.decision =

    DECISION.RETRY;

  context.reasons.push(

    reason

  );

  context.history.push({

    decision:

      DECISION.RETRY,

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
ENGINEERING

========================================
*/

function engineering(

  context,

  reason

) {

  context.decision =

    DECISION.ENGINEERING;

  context.reasons.push(

    reason

  );

  context.history.push({

    decision:

      DECISION.ENGINEERING,

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
REJECT

========================================
*/

function reject(

  context,

  reason

) {

  context.decision =

    DECISION.REJECTED;

  context.reasons.push(

    reason

  );

  context.history.push({

    decision:

      DECISION.REJECTED,

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
BLOCK

========================================
*/

function block(

  context,

  reason

) {

  context.decision =

    DECISION.BLOCKED;

  context.reasons.push(

    reason

  );

  context.history.push({

    decision:

      DECISION.BLOCKED,

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
MASTER EVALUATION

========================================
*/

function evaluate(

  context

) {

  evaluateRisk(

    context

  );

  calculateScore(

    context

  );

  evaluateRules(

    context

  );

  const {

    minimumScore,

    allowConditional,

    allowRepair,

    allowRetry,

    allowEngineering,

    executiveOverride,

    engineeringThreshold

  } = context.policy;

  if (

    executiveOverride

  ) {

    return approve(

      context

    );

  }

  if (

    context.score >=

    minimumScore

  ) {

    return approve(

      context

    );

  }

  if (

    allowConditional &&

    context.score >=

    minimumScore - 5

  ) {

    return conditional(

      context,

      "Conditional approval."

    );

  }

  if (

    allowRepair &&

    context.repair?.repairable

  ) {

    return repair(

      context,

      "Repair required."

    );

  }

  if (

    allowRetry &&

    context.repair?.retryable

  ) {

    return retry(

      context,

      "Retry permitted."

    );

  }

  if (

    allowEngineering &&

    context.score >=

    engineeringThreshold

  ) {

    return engineering(

      context,

      "Engineering review required."

    );

  }

  return reject(

    context,

    "Approval requirements not met."

  );

}

/*
========================================
EXECUTIVE OVERRIDE

========================================
*/

function override(

  context,

  approver,

  reason

) {

  context.policy.executiveOverride =

    true;

  context.metadata.executive = {

    approver,

    reason,

    timestamp:

      new Date()

        .toISOString()

  };

  return approve(

    context

  );

}

/*
========================================
STATISTICS

========================================
*/

function statistics(

  context

) {

  context.statistics = {

    score:

      context.score,

    risk:

      context.risk,

    approved:

      context.approved,

    decision:

      context.decision,

    ruleEvaluations:

      context.reasons.length,

    history:

      context.history.length

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

    approvalId:

      context.approvalId,

    decision:

      context.decision,

    approved:

      context.approved,

    score:

      Number(

        context.score.toFixed(

          2

        )

      ),

    risk:

      context.risk,

    reasons:

      [

        ...context.reasons

      ]

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

    matrix:

      {

        ...context.matrix

      },

    metadata:

      {

        ...context.metadata

      },

    history:

      [

        ...context.history

      ]

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

    registeredRules:

      registry.rules.size,

    registeredPolicies:

      registry.policies.size,

    decisions:

      registry.history.length,

    timestamp:

      new Date()

        .toISOString()

  };

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

      "Approval context missing."

    );

  }

  else {

    if (

      !context.approvalId

    ) {

      errors.push(

        "Approval ID missing."

      );

    }

    if (

      !context.policy

    ) {

      errors.push(

        "Approval policy missing."

      );

    }

    if (

      !context.weights

    ) {

      errors.push(

        "Approval weights missing."

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

      "Approval Gate",

    version:

      "3.0.0",

    constitution:

      "QA-001",

    runtime:

      "Decision Engine",

    supports: [

      "weighted-scoring",

      "risk-analysis",

      "executive-override",

      "conditional-approval",

      "engineering-review",

      "reporting"

    ],

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
REGISTRY

========================================
*/

function rules() {

  return Array.from(

    registry.rules.keys()

  );

}

function policies() {

  return Array.from(

    registry.policies.keys()

  );

}

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
RESET

Development / Testing

========================================
*/

function reset() {

  registry.rules.clear();

  registry.policies.clear();

  registry.history.length = 0;

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

========================================
*/

registerPolicy(

  "default",

  DEFAULT_POLICY

);

/*
========================================
PUBLIC API

========================================
*/

const ApprovalGate =

  Object.freeze({

    DECISION,

    RISK,

    DEFAULT_POLICY,

    DEFAULT_WEIGHTS,

    create,

    register,

    registerPolicy,

    getPolicy,

    calculateScore,

    evaluateRisk,

    evaluateRules,

    evaluate,

    approve,

    conditional,

    repair,

    retry,

    engineering,

    reject,

    block,

    override,

    statistics,

    summary,

    report,

    rules,

    policies,

    history,

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

  ApprovalGate;