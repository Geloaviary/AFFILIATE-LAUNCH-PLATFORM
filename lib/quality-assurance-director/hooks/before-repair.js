/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Before Repair Hook

Repair Preparation Runtime

Responsible for

• Repair Preparation
• Failure Analysis
• Strategy Preparation
• Policy Injection
• Hook Registration
• Runtime Enrichment

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
REPAIR PHASES

========================================
*/

const PHASE = Object.freeze({

    ANALYSIS:
        "analysis",

    POLICY:
        "policy",

    STRATEGY:
        "strategy",

    HISTORIAN:
        "historian",

    PREDICTION:
        "prediction",

    LEARNING:
        "learning",

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

    validation = {},

    department,

    retry = 0,

    metadata = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        repairId:

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

        validation,

        strategy: {},

        prediction: {},

        learning: {},

        historian: {},

        analysis: {

            severity:

                validation?.severity ??

                "unknown",

            category:

                validation?.category ??

                "general",

            failedRules:

                structuredClone(

                    validation?.failedRules ??

                    []

                ),

            repeatedFailure:

                false

        },

        quality: {

            readiness: 100,

            complexity: 0,

            confidence: 100,

            escalationScore: 0

        },

        metadata: {

            runtime:

                "before-repair",

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

            "Before-repair hook handler must be a function."

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

        !context.validation

    ) {

        errors.push(

            "Validation result missing."

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

    context.metadata.failedRuleCount =

        context.analysis.failedRules.length;

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
FAILURE ANALYSIS

========================================
*/

function analyzeFailure(

    context

) {

    const failedRules =

        context.analysis

            .failedRules;

    context.analysis.repeatedFailure =

        context.retry > 0;

    context.analysis.ruleCount =

        failedRules.length;

    context.analysis.complexity =

        failedRules.length >= 10

            ? "critical"

            : failedRules.length >= 5

                ? "high"

                : failedRules.length >= 2

                    ? "medium"

                    : "low";

    return context.analysis;

}

/*
========================================
REPAIR STRATEGY

========================================
*/

function selectStrategy(

    context

) {

    const severity =

        context.analysis

            .severity;

    let strategy =

        "minor-repair";

    if (

        severity ===

        "critical"

    ) {

        strategy =

            "escalation";

    }

    else if (

        severity ===

        "high"

    ) {

        strategy =

            "structural-repair";

    }

    else if (

        severity ===

        "medium"

    ) {

        strategy =

            "major-repair";

    }

    context.strategy = {

        strategy,

        confidence:

            100 -

            context.retry *

            5,

        escalation:

            strategy ===

            "escalation"

    };

    return context.strategy;

}

/*
========================================
HISTORIAN SNAPSHOT

========================================
*/

function initializeHistorian(

    context

) {

    context.historian =

        Object.freeze(

            structuredClone({

                repairId:

                    context.repairId,

                traceId:

                    context.traceId,

                workflowId:

                    context.workflowId,

                stageId:

                    context.stageId,

                timestamp:

                    new Date()

                        .toISOString(),

                state:

                    "before-repair"

            })

        );

    return context.historian;

}

/*
========================================
PREDICTION WARMUP

========================================
*/

function warmPrediction(

    context

) {

    context.prediction = {

        repairSuccess:

            100 -

            context.retry *

            10,

        escalationProbability:

            context.strategy

                .escalation

                ? 100

                : 0,

        estimatedDuration:

            context.analysis

                .complexity ===

            "critical"

                ? 30000

                : 5000

    };

    return context.prediction;

}

/*
========================================
LEARNING CONTEXT

========================================
*/

function loadLearning(

    context

) {

    context.learning = {

        previousRepairs:

            0,

        similarFailures:

            0,

        recommendations: [],

        confidence:

            100

    };

    return context.learning;

}

/*
========================================
EXECUTE

Universal Repair Preparation

========================================
*/

async function execute(

    context,

    repairHandler

) {

    if (

        typeof repairHandler !==

        "function"

    ) {

        throw new TypeError(

            "Repair handler must be a function."

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

    analyzeFailure(

        context

    );

    selectStrategy(

        context

    );

    initializeHistorian(

        context

    );

    warmPrediction(

        context

    );

    loadLearning(

        context

    );

    emit(

        context,

        "before-repair.started"

    );

    await executeHooks(

        context,

        PHASE.ANALYSIS

    );

    await executeHooks(

        context,

        PHASE.POLICY

    );

    await executeHooks(

        context,

        PHASE.STRATEGY

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

        PHASE.EVENTS

    );

    registry.statistics.executions++;

    context.completedAt =

        new Date()

            .toISOString();

    emit(

        context,

        "before-repair.completed"

    );

    return repairHandler(

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
REPAIR READINESS

========================================
*/

function readinessScore(

    context

) {

    let score =

        100;

    score -=

        context.errors.length * 15;

    score -=

        context.warnings.length * 5;

    score -=

        context.retry * 5;

    if (

        context.analysis

            .complexity ===

        "critical"

    ) {

        score -= 25;

    }

    else if (

        context.analysis

            .complexity ===

        "high"

    ) {

        score -= 15;

    }

    else if (

        context.analysis

            .complexity ===

        "medium"

    ) {

        score -= 5;

    }

    score =

        Math.max(

            0,

            score

        );

    context.quality.readiness =

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

    context.quality.escalationScore =

        context.strategy

            .escalation

            ? 100

            : Math.max(

                0,

                100 -

                score

            );

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
REPAIR REPORT

========================================
*/

function report(

    context

) {

    readinessScore(

        context

    );

    return {

        repairId:

            context.repairId,

        traceId:

            context.traceId,

        workflowId:

            context.workflowId,

        stageId:

            context.stageId,

        department:

            context.department,

        readiness:

            structuredClone(

                context.quality

            ),

        analysis:

            structuredClone(

                context.analysis

            ),

        strategy:

            structuredClone(

                context.strategy

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

    readinessScore(

        context

    );

    return {

        repairId:

            context.repairId,

        department:

            context.department,

        severity:

            context.analysis

                .severity,

        complexity:

            context.analysis

                .complexity,

        strategy:

            context.strategy

                .strategy,

        readiness:

            context.quality

                .readiness,

        confidence:

            context.quality

                .confidence,

        escalation:

            context.strategy

                .escalation,

        recommendation:

            context.quality

                .readiness >= 90

                ? "Proceed With Repair"

                : context.quality

                    .readiness >= 75

                    ? "Proceed With Monitoring"

                    : "Escalation Recommended"

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

            "Before Repair Hook",

        runtime:

            "Repair Preparation Runtime",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        supports: [

            "priority-hooks",

            "phase-execution",

            "failure-analysis",

            "repair-strategy",

            "historian-snapshot",

            "prediction-warmup",

            "learning-context",

            "repair-readiness",

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

Registers built-in hooks
and default repair policies.

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

            analyzeFailures: true,

            enableRepairStrategy: true,

            enablePrediction: true,

            enableLearning: true,

            enableHistorian: true,

            emitEvents: true

        }

    );

    registerPolicy(

        "repair",

        {

            maxRetries: 3,

            escalationThreshold: "high",

            allowStructuralRepair: true,

            requireHistorianSnapshot: true,

            requirePrediction: true

        }

    );

    use({

        name:

            "core-before-repair",

        phase:

            PHASE.ANALYSIS,

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
PUBLIC API

========================================
*/

const BeforeRepair =

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

        analyzeFailure,

        selectStrategy,

        initializeHistorian,

        warmPrediction,

        loadLearning,

        execute,

        analytics,

        readinessScore,

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

    BeforeRepair;