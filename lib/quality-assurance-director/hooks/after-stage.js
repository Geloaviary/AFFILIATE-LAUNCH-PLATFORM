/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

After Stage Hook

Stage Finalization Runtime

Responsible for

• Stage Finalization
• Completion Context
• Quality Assessment
• Hook Registration
• Validation
• Runtime Enrichment

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
HOOK PHASES

========================================
*/

const PHASE = Object.freeze({

    METRICS:
        "metrics",

    HISTORIAN:
        "historian",

    PREDICTION:
        "prediction",

    LEARNING:
        "learning",

    QUALITY:
        "quality",

    EXECUTIVE:
        "executive",

    EVENTS:
        "events"

});

/*
========================================
REGISTRY

========================================
*/

const registry = {

    hooks: [],

    policies:

        new Map(),

    statistics: {

        executions: 0,

        failures: 0

    },

    bootstrapped:

        false

};

/*
========================================
CREATE CONTEXT

========================================
*/

function createContext({

    session,

    workflow,

    stage,

    department,

    result = {},

    status = "completed",

    duration = 0,

    metadata = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        executionId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        workflowId:

            workflow?.workflowId ||

            null,

        sessionId:

            session?.sessionId ||

            null,

        stageId:

            stage?.stageId ||

            stage?.id ||

            null,

        stage,

        workflow,

        session,

        department,

        result,

        status,

        duration,

        startedAt:

            timestamp,

        completedAt:

            null,

        policy: {},

        metrics: {},

        historian: {},

        prediction: {},

        learning: {},

        quality: {

            score: 100,

            confidence: 100,

            health: "healthy"

        },

        metadata: {

            runtime:

                "after-stage",

            constitution:

                "QA-001",

            version:

                "3.0.0",

            createdAt:

                timestamp,

            ...metadata

        },

        events: [],

        warnings: [],

        errors: []

    };

}

/*
========================================
REGISTER HOOK

========================================
*/

function use({

    name,

    phase =

        PHASE.EVENTS,

    priority = 100,

    condition = () => true,

    handler

}) {

    if (

        typeof handler !==

        "function"

    ) {

        throw new TypeError(

            "After-stage hook handler must be a function."

        );

    }

    registry.hooks.push({

        name,

        phase,

        priority,

        condition,

        handler

    });

    registry.hooks.sort(

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
VALIDATE CONTEXT

========================================
*/

function validateContext(

    context

) {

    const errors = [];

    if (

        !context.stage

    ) {

        errors.push(

            "Stage missing."

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

        !context.workflow

    ) {

        errors.push(

            "Workflow missing."

        );

    }

    if (

        !context.status

    ) {

        errors.push(

            "Stage status missing."

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
INJECT POLICY

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

    const departmentPolicy =

        registry.policies.get(

            context.department

        ) ||

        {};

    context.policy = {

        ...globalPolicy,

        ...departmentPolicy

    };

    return context.policy;

}

/*
========================================
ENRICH CONTEXT

========================================
*/

function enrich(

    context

) {

    context.metadata.executionId =

        context.executionId;

    context.metadata.traceId =

        context.traceId;

    context.metadata.workflowId =

        context.workflowId;

    context.metadata.stageId =

        context.stageId;

    context.metadata.department =

        context.department;

    context.metadata.status =

        context.status;

    context.metadata.duration =

        context.duration;

    return context;

}

/*
========================================
EXECUTE HOOKS

Priority + Phase

========================================
*/

async function executeHooks(

    context,

    phase

) {

    const hooks =

        registry.hooks

            .filter(

                hook =>

                    hook.phase ===

                    phase

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

        const hook of hooks

    ) {

        if (

            !hook.condition(

                context

            )

        ) {

            continue;

        }

        const started =

            Date.now();

        try {

            await hook.handler(

                context

            );

            context.events.push({

                type:

                    "hook.executed",

                hook:

                    hook.name,

                phase,

                duration:

                    Date.now() -

                    started,

                timestamp:

                    new Date()

                        .toISOString()

            });

        }

        catch (

            error

        ) {

            registry.statistics.failures++;

            context.errors.push({

                hook:

                    hook.name,

                phase,

                message:

                    error.message

            });

            context.events.push({

                type:

                    "hook.failed",

                hook:

                    hook.name,

                phase,

                error:

                    error.message,

                timestamp:

                    new Date()

                        .toISOString()

            });

        }

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
FINALIZE METRICS

========================================
*/

function finalizeMetrics(

    context

) {

    context.metrics = {

        duration:

            context.duration,

        completed:

            true,

        latency:

            context.duration,

        throughput:

            1,

        success:

            context.errors.length ===

            0,

        failures:

            context.errors.length,

        retries:

            context.retry ??

            0

    };

    return context.metrics;

}

/*
========================================
HISTORIAN RECORD

========================================
*/

function recordHistorian(

    context

) {

    context.historian =

        Object.freeze(

            structuredClone({

                executionId:

                    context.executionId,

                traceId:

                    context.traceId,

                workflowId:

                    context.workflowId,

                stageId:

                    context.stageId,

                status:

                    context.status,

                duration:

                    context.duration,

                timestamp:

                    new Date()

                        .toISOString(),

                state:

                    "after-stage"

            })

        );

    return context.historian;

}

/*
========================================
PREDICTION FEEDBACK

========================================
*/

function updatePrediction(

    context

) {

    context.prediction = {

        expected:

            context.prediction

                ?.expectedRisk ??

            null,

        actual:

            context.result,

        accuracy:

            context.result?.success ===

            true

                ? 100

                : 75

    };

    return context.prediction;

}

/*
========================================
LEARNING FEEDBACK

========================================
*/

function updateLearning(

    context

) {

    context.learning = {

        outcome:

            context.result,

        confidence:

            context.quality

                ?.confidence ??

            100,

        recommendation:

            context.errors.length ===

            0

                ? "retain"

                : "improve"

    };

    return context.learning;

}

/*
========================================
EXECUTE

Universal After Stage Wrapper

========================================
*/

async function execute(

    context,

    completionHandler

) {

    if (

        typeof completionHandler !==

        "function"

    ) {

        throw new TypeError(

            "Completion handler must be a function."

        );

    }

    enrich(

        context

    );

    const validation =

        validateContext(

            context

        );

    if (

        !validation.valid

    ) {

        throw new Error(

            validation.errors.join(

                ", "

            )

        );

    }

    injectPolicy(

        context

    );

    finalizeMetrics(

        context

    );

    recordHistorian(

        context

    );

    updatePrediction(

        context

    );

    updateLearning(

        context

    );

    emit(

        context,

        "after-stage.started"

    );

    await executeHooks(

        context,

        PHASE.METRICS

    );

    await executeHooks(

        context,

        PHASE.HISTORIAN

    );

    await executeHooks(

        context,

        PHASE.PREDICTION

    );

    await executeHooks(

        context,

        PHASE.LEARNING

    );

    await executeHooks(

        context,

        PHASE.QUALITY

    );

    await executeHooks(

        context,

        PHASE.EXECUTIVE

    );

    await executeHooks(

        context,

        PHASE.EVENTS

    );

    registry.statistics.executions++;

    context.completedAt =

        new Date()

            .toISOString();

    emit(

        context,

        "after-stage.completed"

    );

    return completionHandler(

        context

    );

}

/*
========================================
COMPLETION ANALYTICS

========================================
*/

function analytics() {

    return {

        totalHooks:

            registry.hooks.length,

        registeredPolicies:

            registry.policies.size,

        executions:

            registry.statistics.executions,

        failures:

            registry.statistics.failures,

        successRate:

            registry.statistics.executions === 0

                ? 100

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

                )

    };

}

/*
========================================
QUALITY ASSESSMENT

========================================
*/

function assessQuality(

    context

) {

    let score = 100;

    score -=

        context.errors.length * 15;

    score -=

        context.warnings.length * 5;

    if (

        context.status !==

        "completed"

    ) {

        score -= 20;

    }

    if (

        context.metrics

            ?.success === false

    ) {

        score -= 15;

    }

    score =

        Math.max(

            0,

            score

        );

    context.quality.score =

        score;

    context.quality.confidence =

        Number(

            (

                score *

                0.95

            ).toFixed(

                2

            )

        );

    context.quality.health =

        score >= 95

            ? "excellent"

            : score >= 85

                ? "good"

                : score >= 70

                    ? "fair"

                    : "poor";

    return context.quality;

}

/*
========================================
HOOK PERFORMANCE

========================================
*/

function hookPerformance(

    context

) {

    const executed =

        context.events.filter(

            event =>

                event.type ===

                "hook.executed"

        );

    const failed =

        context.events.filter(

            event =>

                event.type ===

                "hook.failed"

        );

    const totalDuration =

        executed.reduce(

            (

                total,

                event

            ) =>

                total +

                event.duration,

            0

        );

    return {

        executed:

            executed.length,

        failed:

            failed.length,

        averageDuration:

            executed.length === 0

                ? 0

                : Number(

                    (

                        totalDuration /

                        executed.length

                    ).toFixed(

                        2

                    )

                ),

        totalDuration

    };

}

/*
========================================
COMPLETION REPORT

========================================
*/

function report(

    context

) {

    assessQuality(

        context

    );

    return {

        executionId:

            context.executionId,

        traceId:

            context.traceId,

        workflowId:

            context.workflowId,

        stageId:

            context.stageId,

        department:

            context.department,

        status:

            context.status,

        duration:

            context.duration,

        quality:

            structuredClone(

                context.quality

            ),

        metrics:

            structuredClone(

                context.metrics

            ),

        prediction:

            structuredClone(

                context.prediction

            ),

        learning:

            structuredClone(

                context.learning

            ),

        historian:

            structuredClone(

                context.historian

            ),

        performance:

            hookPerformance(

                context

            ),

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
EXECUTIVE SUMMARY

========================================
*/

function executiveSummary(

    context

) {

    assessQuality(

        context

    );

    return {

        workflow:

            context.workflowId,

        stage:

            context.stageId,

        department:

            context.department,

        quality:

            context.quality.score,

        confidence:

            context.quality.confidence,

        health:

            context.quality.health,

        duration:

            context.duration,

        errors:

            context.errors.length,

        warnings:

            context.warnings.length,

        recommendation:

            context.quality.score >= 90

                ? "Stage Completed Successfully"

                : context.quality.score >= 75

                    ? "Monitor Future Executions"

                    : "Engineering Review Recommended"

    };

}

/*
========================================
HEALTH

========================================
*/

function health() {

    const stats =

        analytics();

    return {

        healthy:

            stats.failures <=

            stats.executions,

        executions:

            stats.executions,

        failures:

            stats.failures,

        hooks:

            stats.totalHooks,

        policies:

            stats.registeredPolicies,

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

    return validateContext(

        context

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

            "After Stage Hook",

        runtime:

            "Stage Finalization Runtime",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        supports: [

            "priority-hooks",

            "phase-execution",

            "metrics-finalization",

            "historian-recording",

            "prediction-feedback",

            "learning-feedback",

            "quality-assessment",

            "completion-report",

            "executive-summary",

            "analytics"

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
BOOTSTRAP

Registers built-in hooks
and default policy.

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

            finalizeMetrics: true,

            recordHistorian: true,

            updatePrediction: true,

            updateLearning: true,

            assessQuality: true,

            emitEvents: true

        }

    );

    use({

        name:

            "core-after-stage",

        phase:

            PHASE.METRICS,

        priority:

            0,

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

    registry.hooks.length = 0;

    registry.policies.clear();

    registry.statistics.executions = 0;

    registry.statistics.failures = 0;

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
BOOTSTRAP

========================================
*/

bootstrap();

/*
========================================
PUBLIC API

========================================
*/

const AfterStage =

    freeze({

        PHASE,

        createContext,

        use,

        registerPolicy,

        validateContext,

        injectPolicy,

        enrich,

        executeHooks,

        emit,

        finalizeMetrics,

        recordHistorian,

        updatePrediction,

        updateLearning,

        execute,

        analytics,

        assessQuality,

        hookPerformance,

        report,

        executiveSummary,

        health,

        validate,

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

    AfterStage;