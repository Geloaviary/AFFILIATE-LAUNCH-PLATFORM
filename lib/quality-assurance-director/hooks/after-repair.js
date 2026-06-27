/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

After Repair Hook

Repair Completion Runtime

Responsible for

• Repair Completion
• Repair Verification
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
REPAIR COMPLETION PHASES

========================================
*/

const PHASE = Object.freeze({

    VERIFICATION:
        "verification",

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

    repair = {},

    validation = {},

    department,

    retry = 0,

    duration = 0,

    metadata = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        repairId:

            repair?.repairId ||

            crypto.randomUUID(),

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

        workflow,

        stage,

        session,

        department,

        retry,

        duration,

        repair,

        validation,

        verification: {

            repairedRules:

                structuredClone(

                    repair?.repairedRules ??

                    []

                ),

            remainingRules:

                structuredClone(

                    repair?.remainingRules ??

                    []

                ),

            success:

                repair?.success ??

                false,

            constitutionalCompliance:

                false

        },

        metrics: {},

        historian: {},

        prediction: {},

        learning: {},

        quality: {

            score: 100,

            confidence: 100,

            recoveryScore: 100,

            health: "healthy"

        },

        metadata: {

            runtime:

                "after-repair",

            constitution:

                "QA-001",

            version:

                "3.0.0",

            createdAt:

                timestamp,

            ...metadata

        },

        startedAt:

            timestamp,

        completedAt:

            null,

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

            "After-repair hook handler must be a function."

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

        !context.workflow

    ) {

        errors.push(

            "Workflow missing."

        );

    }

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

        !context.repair

    ) {

        errors.push(

            "Repair result missing."

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

    const repairPolicy =

        registry.policies.get(

            "repair"

        ) ||

        {};

    context.policy = {

        ...globalPolicy,

        ...departmentPolicy,

        ...repairPolicy

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

    context.metadata.repairId =

        context.repairId;

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

    context.metadata.retry =

        context.retry;

    context.metadata.duration =

        context.duration;

    context.metadata.repairedRules =

        context.verification

            .repairedRules

            .length;

    context.metadata.remainingRules =

        context.verification

            .remainingRules

            .length;

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
REPAIR VERIFICATION

========================================
*/

function verifyRepair(

    context

) {

    const remaining =

        context.verification

            .remainingRules.length;

    context.verification.success =

        remaining === 0;

    context.verification.constitutionalCompliance =

        remaining === 0;

    context.verification.recoveryRate =

        context.verification

            .repairedRules.length +

        remaining === 0

            ? 100

            : Number(

                (

                    context.verification.repairedRules.length /

                    (

                        context.verification.repairedRules.length +

                        remaining

                    ) *

                    100

                ).toFixed(

                    2

                )

            );

    return context.verification;

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

        repairEfficiency:

            context.verification

                .recoveryRate,

        retryCount:

            context.retry,

        repairedRules:

            context.verification

                .repairedRules.length,

        remainingRules:

            context.verification

                .remainingRules.length,

        success:

            context.verification

                .success

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

                repairId:

                    context.repairId,

                executionId:

                    context.executionId,

                traceId:

                    context.traceId,

                workflowId:

                    context.workflowId,

                stageId:

                    context.stageId,

                state:

                    "after-repair",

                timestamp:

                    new Date()

                        .toISOString(),

                verification:

                    structuredClone(

                        context.verification

                    )

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

        predictedSuccess:

            context.repair

                ?.predictedSuccess ??

            null,

        actualSuccess:

            context.verification

                .success,

        accuracy:

            context.verification

                .success

                ? 100

                : 75

    };

    return context.prediction;

}

/*
========================================
LEARNING UPDATE

========================================
*/

function updateLearning(

    context

) {

    context.learning = {

        strategy:

            context.repair

                ?.strategy ??

            "unknown",

        outcome:

            context.verification

                .success

                ? "successful"

                : "partial",

        confidence:

            context.quality

                .confidence,

        recommendation:

            context.verification

                .success

                ? "retain-strategy"

                : "improve-strategy"

    };

    return context.learning;

}

/*
========================================
EXECUTE

Universal Repair Completion Wrapper

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

    verifyRepair(

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

        "after-repair.started"

    );

    await executeHooks(

        context,

        PHASE.VERIFICATION

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

        "after-repair.completed"

    );

    return completionHandler(

        context

    );

}

/*
========================================
REPAIR ANALYTICS

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
REPAIR QUALITY

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

    score -=

        context.retry * 5;

    score -=

        context.verification
            .remainingRules.length * 10;

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

                score * 0.95

            ).toFixed(

                2

            )

        );

    context.quality.recoveryScore =

        context.verification
            .recoveryRate;

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
RECOVERY EFFECTIVENESS

========================================
*/

function recoveryEffectiveness(

    context

) {

    return {

        repairedRules:

            context.verification
                .repairedRules.length,

        remainingRules:

            context.verification
                .remainingRules.length,

        recoveryRate:

            context.verification
                .recoveryRate,

        escalationRequired:

            !context.verification
                .success,

        retryCount:

            context.retry

    };

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
REPAIR REPORT

========================================
*/

function report(

    context

) {

    assessQuality(

        context

    );

    return {

        repairId:

            context.repairId,

        executionId:

            context.executionId,

        workflowId:

            context.workflowId,

        stageId:

            context.stageId,

        department:

            context.department,

        verification:

            structuredClone(

                context.verification

            ),

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

        recovery:

            recoveryEffectiveness(

                context

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

        repairId:

            context.repairId,

        department:

            context.department,

        recoveryScore:

            context.quality
                .recoveryScore,

        quality:

            context.quality
                .score,

        confidence:

            context.quality
                .confidence,

        repairedRules:

            context.verification
                .repairedRules.length,

        remainingRules:

            context.verification
                .remainingRules.length,

        health:

            context.quality
                .health,

        recommendation:

            context.verification
                .success

                ? "Resume Workflow"

                : "Escalate Repair"

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

            "After Repair Hook",

        runtime:

            "Repair Completion Runtime",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        supports: [

            "priority-hooks",

            "phase-execution",

            "repair-verification",

            "metrics-finalization",

            "historian-recording",

            "prediction-feedback",

            "learning-update",

            "repair-quality",

            "recovery-analytics",

            "executive-summary"

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
and default repair completion policies.

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

            verifyRepair: true,

            finalizeMetrics: true,

            recordHistorian: true,

            updatePrediction: true,

            updateLearning: true,

            assessQuality: true,

            emitEvents: true

        }

    );

    registerPolicy(

        "repair",

        {

            requireVerification: true,

            requireHistorianRecord: true,

            requirePredictionFeedback: true,

            requireLearningUpdate: true,

            requireQualityAssessment: true,

            allowWorkflowResume: true

        }

    );

    use({

        name:

            "core-after-repair",

        phase:

            PHASE.VERIFICATION,

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

const AfterRepair =

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

        verifyRepair,

        finalizeMetrics,

        recordHistorian,

        updatePrediction,

        updateLearning,

        execute,

        analytics,

        assessQuality,

        recoveryEffectiveness,

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

    AfterRepair;