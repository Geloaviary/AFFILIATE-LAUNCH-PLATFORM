/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Approval Middleware

Platform Approval Intelligence
Middleware

Responsible for

• Approval Context
• Policy Injection
• Risk Injection
• Prediction Injection
• Confidence Preparation
• Decision Trace
• Approval Middleware

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
REGISTRY

========================================
*/

const registry = {

    middleware: [],

    policies: new Map(),

    statistics: {

        executions: 0,

        failures: 0,

        approvals: 0,

        rejections: 0

    },

    bootstrapped: false

};

/*
========================================
CREATE CONTEXT

========================================
*/

function createContext({

    session,

    workflow,

    department,

    validation = {},

    repair = {},

    prediction = {},

    policy = {},

    options = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        approvalId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        session,

        workflow,

        department,

        validation,

        repair,

        prediction,

        options,

        startedAt:

            timestamp,

        completedAt:

            null,

        decision:

            null,

        confidence:

            0,

        score:

            0,

        risk:

            {},

        policy: {},

        metadata: {},

        statistics: {},

        events: [],

        warnings: [],

        errors: [],

        audit: [],

        policyOverrides:

            policy

    };

}

/*
========================================
REGISTER MIDDLEWARE

Priority + Condition

========================================
*/

function use({

    name,

    priority = 100,

    condition = () => true,

    handler

}) {

    if (

        typeof handler !==

        "function"

    ) {

        throw new TypeError(

            "Approval middleware handler must be a function."

        );

    }

    registry.middleware.push({

        name,

        priority,

        condition,

        handler

    });

    registry.middleware.sort(

        (

            a,

            b

        ) =>

            a.priority -

            b.priority

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

        Object.freeze({

            ...policy

        })

    );

}

/*
========================================
POLICY INJECTION

========================================
*/

function injectPolicy(

    context

) {

    const globalPolicy =

        registry.policies.get(

            "default"

        ) ||

        {};

    context.policy = {

        ...globalPolicy,

        ...context.policyOverrides

    };

    return context.policy;

}

/*
========================================
RISK INJECTION

========================================
*/

function injectRisk(

    context

) {

    context.risk = {

        validation:

            context.validation

                ?.risk ||

            0,

        repair:

            context.repair

                ?.confidence ||

            0,

        prediction:

            context.prediction

                ?.risk ||

            0,

        workflow:

            context.workflow

                ?.risk ||

            0

    };

    context.risk.total =

        (

            context.risk.validation +

            context.risk.repair +

            context.risk.prediction +

            context.risk.workflow

        ) / 4;

    return context.risk;

}

/*
========================================
ENRICH CONTEXT

========================================
*/

function enrich(

    context

) {

    context.metadata.runtime =

        "approval";

    context.metadata.version =

        "3.0.0";

    context.metadata.constitution =

        "QA-001";

    context.metadata.traceId =

        context.traceId;

    context.metadata.approvalId =

        context.approvalId;

    context.metadata.department =

        context.department;

    return context;

}

/*
========================================
CALCULATE CONFIDENCE

========================================
*/

function calculateConfidence(

    context

) {

    const validation =

        context.validation

            ?.score ??

        100;

    const repair =

        context.repair

            ?.confidence ??

        100;

    const prediction =

        100 -

        (

            context.prediction

                ?.risk ??

            0

        );

    const workflow =

        100 -

        (

            context.risk

                ?.workflow ??

            0

        );

    context.confidence =

        Number(

            (

                (

                    validation +

                    repair +

                    prediction +

                    workflow

                ) / 4

            ).toFixed(

                2

            )

        );

    return context.confidence;

}

/*
========================================
MIDDLEWARE PHASES

========================================
*/

const PHASE = Object.freeze({

    PRE_POLICY:
        "pre-policy",

    POLICY:
        "policy",

    PRE_APPROVAL:
        "pre-approval",

    APPROVAL:
        "approval",

    POST_APPROVAL:
        "post-approval",

    AUDIT:
        "audit"

});

/*
========================================
EXECUTE MIDDLEWARE

Priority + Phase

========================================
*/

async function executeMiddleware(

    context,

    phase

) {

    const middleware =

        registry.middleware

            .filter(

                item =>

                    (

                        item.phase ||

                        PHASE.APPROVAL

                    ) === phase

            )

            .sort(

                (

                    a,

                    b

                ) =>

                    a.priority -

                    b.priority

            );

    for (

        const item of middleware

    ) {

        if (

            !item.condition(

                context

            )

        ) {

            continue;

        }

        await item.handler(

            context

        );

    }

}

/*
========================================
EVENT EMITTER

========================================
*/

function emit(

    context,

    type,

    payload = {}

) {

    context.events.push({

        type,

        payload,

        timestamp:

            new Date()

                .toISOString()

    });

}

/*
========================================
DECISION TRACE

========================================
*/

function trace(

    context,

    stage,

    value

) {

    context.audit.push({

        stage,

        value,

        timestamp:

            new Date()

                .toISOString()

    });

}

/*
========================================
VERIFY DECISION

========================================
*/

function verify(

    context

) {

    context.verified =

        context.decision !==

        null;

    return context.verified;

}

/*
========================================
EXECUTE APPROVAL

Universal Wrapper

========================================
*/

async function execute(

    context,

    approvalGate

) {

    if (

        typeof approvalGate !==

        "function"

    ) {

        throw new TypeError(

            "Approval Gate must be a function."

        );

    }

    enrich(

        context

    );

    injectPolicy(

        context

    );

    injectRisk(

        context

    );

    calculateConfidence(

        context

    );

    emit(

        context,

        "approval.started"

    );

    const started =

        Date.now();

    try {

        await executeMiddleware(

            context,

            PHASE.PRE_POLICY

        );

        await executeMiddleware(

            context,

            PHASE.POLICY

        );

        await executeMiddleware(

            context,

            PHASE.PRE_APPROVAL

        );

        trace(

            context,

            "confidence",

            context.confidence

        );

        trace(

            context,

            "risk",

            context.risk

        );

        const decision =

            await approvalGate(

                context

            );

        context.decision =

            decision;

        await executeMiddleware(

            context,

            PHASE.APPROVAL

        );

        verify(

            context

        );

        trace(

            context,

            "decision",

            decision

        );

        await executeMiddleware(

            context,

            PHASE.POST_APPROVAL

        );

        context.completedAt =

            new Date()

                .toISOString();

        context.statistics.duration =

            Date.now() -

            started;

        context.statistics.success =

            true;

        registry.statistics.executions++;

        if (

            decision ===

            "approved"

        ) {

            registry.statistics.approvals++;

        }

        else {

            registry.statistics.rejections++;

        }

        emit(

            context,

            "approval.completed",

            {

                decision,

                duration:

                    context.statistics.duration,

                confidence:

                    context.confidence

            }

        );

        await executeMiddleware(

            context,

            PHASE.AUDIT

        );

        return decision;

    }

    catch (

        error

    ) {

        registry.statistics.failures++;

        context.statistics.success =

            false;

        context.statistics.duration =

            Date.now() -

            started;

        context.errors.push(

            error.message

        );

        emit(

            context,

            "approval.failed",

            {

                error:

                    error.message

            }

        );

        trace(

            context,

            "failure",

            error.message

        );

        throw error;

    }

}

/*
========================================
PREDICTION INTEGRATION

========================================
*/

async function prediction(

    context,

    engine

) {

    if (

        !engine ||

        typeof engine.predict !==

        "function"

    ) {

        return null;

    }

    const prediction =

        await engine.predict(

            context

        );

    context.prediction =

        prediction;

    emit(

        context,

        "approval.prediction"

    );

    return prediction;

}/*
========================================
AUDIT RECORD

========================================
*/

function audit(

    context,

    action,

    details = {}

) {

    const record = {

        approvalId:

            context.approvalId,

        traceId:

            context.traceId,

        action,

        timestamp:

            new Date()

                .toISOString(),

        details

    };

    context.audit.push(

        record

    );

    return record;

}

/*
========================================
CONFIDENCE BAND

========================================
*/

function confidenceBand(

    context

) {

    const score =

        context.confidence;

    if (

        score >= 90

    ) {

        return "very-high";

    }

    if (

        score >= 75

    ) {

        return "high";

    }

    if (

        score >= 60

    ) {

        return "medium";

    }

    if (

        score >= 40

    ) {

        return "low";

    }

    return "very-low";

}

/*
========================================
APPROVAL EFFICIENCY

========================================
*/

function efficiency(

    context

) {

    const duration =

        context.statistics

            .duration ||

        0;

    const confidence =

        context.confidence;

    if (

        duration <= 0

    ) {

        return confidence;

    }

    return Number(

        (

            confidence /

            Math.max(

                duration /

                1000,

                1

            )

        ).toFixed(

            2

        )

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

    context.statistics.auditRecords =

        context.audit.length;

    context.statistics.events =

        context.events.length;

    context.statistics.errors =

        context.errors.length;

    context.statistics.warnings =

        context.warnings.length;

    context.statistics.confidence =

        context.confidence;

    context.statistics.confidenceBand =

        confidenceBand(

            context

        );

    context.statistics.efficiency =

        efficiency(

            context

        );

    context.statistics.executionCount =

        registry.statistics.executions;

    context.statistics.approvals =

        registry.statistics.approvals;

    context.statistics.rejections =

        registry.statistics.rejections;

    context.statistics.failures =

        registry.statistics.failures;

    context.statistics.successRate =

        registry.statistics.executions === 0

            ? 0

            : Number(

                (

                    (

                        registry.statistics.executions -

                        registry.statistics.failures

                    ) /

                    registry.statistics.executions *

                    100

                ).toFixed(

                    2

                )

            );

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

        confidence:

            context.confidence,

        confidenceBand:

            confidenceBand(

                context

            ),

        risk:

            context.risk,

        duration:

            context.statistics

                .duration ||

            0,

        verified:

            context.verified

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

        audit:

            [

                ...context.audit

            ],

        events:

            [

                ...context.events

            ],

        metadata:

            {

                ...context.metadata

            },

        policy:

            {

                ...context.policy

            },

        risk:

            {

                ...context.risk

            }

    };

}

/*
========================================
VALIDATE

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

            !context.traceId

        ) {

            errors.push(

                "Trace ID missing."

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

            !context.metadata

        ) {

            errors.push(

                "Metadata missing."

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

        executions:

            registry.statistics.executions,

        approvals:

            registry.statistics.approvals,

        rejections:

            registry.statistics.rejections,

        failures:

            registry.statistics.failures,

        registeredMiddleware:

            registry.middleware.length,

        registeredPolicies:

            registry.policies.size,

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

            "Approval Middleware",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        runtime:

            "Approval Intelligence Engine",

        supports: [

            "priority-middleware",

            "multi-phase-pipeline",

            "policy-injection",

            "risk-injection",

            "prediction",

            "confidence-engine",

            "decision-trace",

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
BOOTSTRAP

Registers built-in middleware
and default approval policy.

========================================
*/

function bootstrap() {

    if (

        registry.bootstrapped

    ) {

        return;

    }

    registry.bootstrapped = true;

    registerPolicy(

        "default",

        {

            minimumScore: 90,

            allowConditional: true,

            allowRepair: true,

            allowRetry: true,

            allowEngineering: true,

            executiveOverride: false

        }

    );

    use({

        name:

            "core-approval",

        priority:

            0,

        phase:

            PHASE.PRE_POLICY,

        handler:

            async context => {

                context.metadata.core = {

                    initialized: true,

                    version: "3.0.0",

                    timestamp:

                        new Date()

                            .toISOString()

                };

            }

    });

}

/*
========================================
RESET

Development / Testing

========================================
*/

function reset() {

    registry.middleware.length = 0;

    registry.policies.clear();

    registry.statistics.executions = 0;

    registry.statistics.failures = 0;

    registry.statistics.approvals = 0;

    registry.statistics.rejections = 0;

    registry.bootstrapped = false;

    bootstrap();

}

/*
========================================
CLONE

Uses native structuredClone.

========================================
*/

function clone(

    value

) {

    return structuredClone(

        value

    );

}

/*
========================================
FREEZE

Deep immutable object.

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

            Reflect.ownKeys(

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
PUBLIC API

========================================
*/

const ApprovalMiddleware =

    freeze({

        PHASE,

        createContext,

        use,

        registerPolicy,

        injectPolicy,

        injectRisk,

        enrich,

        calculateConfidence,

        executeMiddleware,

        execute,

        prediction,

        emit,

        trace,

        verify,

        audit,

        confidenceBand,

        efficiency,

        statistics,

        summary,

        report,

        validate,

        health,

        metadata,

        bootstrap,

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

    ApprovalMiddleware;