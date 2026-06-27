/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Research Integration

Research QA Integration Runtime

Responsible for

• Research QA Integration
• Validation Routing
• Repair Routing
• Approval Routing
• Runtime Context
• Policy Injection

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
PIPELINE PHASES

========================================
*/

const PHASE = Object.freeze({

    VALIDATION:
        "validation",

    REPAIR:
        "repair",

    APPROVAL:
        "approval",

    METRICS:
        "metrics",

    HISTORIAN:
        "historian",

    PREDICTION:
        "prediction",

    LEARNING:
        "learning",

    EXECUTIVE:
        "executive"

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

    services:

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

    campaign,

    research,

    metadata = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        integrationId:

            crypto.randomUUID(),

        executionId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        workflowId:

            workflow?.workflowId ||

            null,

        campaignId:

            campaign?.campaignId ||

            campaign?.id ||

            null,

        researchId:

            research?.researchId ||

            research?.id ||

            crypto.randomUUID(),

        session,

        workflow,

        campaign,

        research,

        department:

            "research",

        qa: {

            validated:

                false,

            repaired:

                false,

            approved:

                false

        },

        governance: {

            constitutional:

                false,

            departmental:

                false,

            executive:

                false

        },

        quality: {

            score: 100,

            confidence: 100,

            readiness: 100

        },

        metrics: {},

        historian: {},

        prediction: {},

        learning: {},

        reports: {},

        metadata: {

            runtime:

                "research",

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
REGISTER QA SERVICE

========================================
*/

function registerService(

    name,

    service

) {

    if (

        typeof service !==

        "function"

    ) {

        throw new TypeError(

            "QA service must be a function."

        );

    }

    registry.services.set(

        name,

        service

    );

}

/*
========================================
REGISTER HOOK

========================================
*/

function use({

    name,

    phase =

        PHASE.EXECUTIVE,

    priority = 100,

    condition = () => true,

    handler

}) {

    if (

        typeof handler !==

        "function"

    ) {

        throw new TypeError(

            "Integration hook handler must be a function."

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

        !context.research

    ) {

        errors.push(

            "Research payload missing."

        );

    }

    if (

        !context.campaign

    ) {

        errors.push(

            "Campaign missing."

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

    const researchPolicy =

        registry.policies.get(

            "research"

        ) ||

        {};

    context.policy = {

        ...globalPolicy,

        ...researchPolicy

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

    context.metadata.integrationId =

        context.integrationId;

    context.metadata.executionId =

        context.executionId;

    context.metadata.traceId =

        context.traceId;

    context.metadata.workflowId =

        context.workflowId;

    context.metadata.campaignId =

        context.campaignId;

    context.metadata.researchId =

        context.researchId;

    context.metadata.department =

        context.department;

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

                    hook.phase === phase

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
EXECUTE QA SERVICE

========================================
*/

async function executeService(

    context,

    name,

    phase

) {

    const service =

        registry.services.get(

            name

        );

    if (

        !service

    ) {

        return;

    }

    const started =

        Date.now();

    try {

        const result =

            await service(

                context

            );

        context.qa[name] =

            result ?? true;

        context.events.push({

            type:

                "service.executed",

            service:

                name,

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

            service:

                name,

                phase,

                message:

                    error.message

        });

        context.events.push({

            type:

                "service.failed",

            service:

                name,

            phase,

            error:

                error.message,

            timestamp:

                new Date()

                    .toISOString()

        });

    }

}

/*
========================================
COLLECT METRICS

========================================
*/

function collectMetrics(

    context

) {

    context.metrics = {

        duration:

            Date.now() -

            Date.parse(

                context.startedAt

            ),

        validated:

            Boolean(

                context.qa.validated

            ),

        repaired:

            Boolean(

                context.qa.repaired

            ),

        approved:

            Boolean(

                context.qa.approved

            ),

        success:

            context.errors.length === 0

    };

    return context.metrics;

}

/*
========================================
RECORD HISTORIAN

========================================
*/

function recordHistorian(

    context

) {

    context.historian =

        Object.freeze(

            structuredClone({

                integrationId:

                    context.integrationId,

                executionId:

                    context.executionId,

                traceId:

                    context.traceId,

                workflowId:

                    context.workflowId,

                campaignId:

                    context.campaignId,

                researchId:

                    context.researchId,

                state:

                    "research",

                timestamp:

                    new Date()

                        .toISOString(),

                qa:

                    structuredClone(

                        context.qa

                    )

            })

        );

    return context.historian;

}

/*
========================================
UPDATE PREDICTION

========================================
*/

function updatePrediction(

    context

) {

    context.prediction = {

        validationProbability:

            context.qa.validated

                ? 100

                : 50,

        approvalProbability:

            context.qa.approved

                ? 100

                : 50,

        repairProbability:

            context.qa.repaired

                ? 100

                : 0

    };

    return context.prediction;

}

/*
========================================
UPDATE LEARNING

========================================
*/

function updateLearning(

    context

) {

    context.learning = {

        outcome:

            context.errors.length === 0

                ? "success"

                : "failure",

        validated:

            context.qa.validated,

        repaired:

            context.qa.repaired,

        approved:

            context.qa.approved,

        recommendation:

            context.errors.length === 0

                ? "retain-process"

                : "optimize-process"

    };

    return context.learning;

}

/*
========================================
EXECUTE

Universal Research Runtime

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

    emit(

        context,

        "research.started"

    );

    await executeService(

        context,

        "validation",

        PHASE.VALIDATION

    );

    await executeHooks(

        context,

        PHASE.VALIDATION

    );

    await executeService(

        context,

        "repair",

        PHASE.REPAIR

    );

    await executeHooks(

        context,

        PHASE.REPAIR

    );

    await executeService(

        context,

        "approval",

        PHASE.APPROVAL

    );

    await executeHooks(

        context,

        PHASE.APPROVAL

    );

    collectMetrics(

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

        PHASE.EXECUTIVE

    );

    registry.statistics.executions++;

    context.completedAt =

        new Date()

            .toISOString();

    emit(

        context,

        "research.completed"

    );

    return completionHandler(

        context

    );

}

/*
========================================
RESEARCH ANALYTICS

========================================
*/

function analytics() {

    return {

        totalHooks:

            registry.hooks.length,

        registeredPolicies:

            registry.policies.size,

        registeredServices:

            registry.services.size,

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
ASSESS RESEARCH QUALITY

========================================
*/

function assessQuality(

    context

) {

    let score =

        100;

    score -=

        context.errors.length * 15;

    score -=

        context.warnings.length * 5;

    if (

        !context.qa.validated

    ) {

        score -= 20;

    }

    if (

        !context.qa.approved

    ) {

        score -= 20;

    }

    if (

        !context.governance

            .constitutional

    ) {

        score -= 10;

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

    context.quality.readiness =

        score;

    return context.quality;

}

/*
========================================
RESEARCH INTELLIGENCE

========================================
*/

function researchIntelligence(

    context

) {

    return {

        validated:

            context.qa.validated,

        repaired:

            context.qa.repaired,

        approved:

            context.qa.approved,

        constitutional:

            context.governance

                .constitutional,

        departmental:

            context.governance

                .departmental,

        executive:

            context.governance

                .executive,

        quality:

            context.quality

                .score,

        readiness:

            context.quality

                .readiness

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
RESEARCH REPORT

========================================
*/

function report(

    context

) {

    assessQuality(

        context

    );

    return {

        integrationId:

            context.integrationId,

        executionId:

            context.executionId,

        workflowId:

            context.workflowId,

        campaignId:

            context.campaignId,

        researchId:

            context.researchId,

        department:

            context.department,

        qa:

            structuredClone(

                context.qa

            ),

        governance:

            structuredClone(

                context.governance

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

        intelligence:

            researchIntelligence(

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

        researchId:

            context.researchId,

        campaignId:

            context.campaignId,

        workflowId:

            context.workflowId,

        quality:

            context.quality

                .score,

        confidence:

            context.quality

                .confidence,

        readiness:

            context.quality

                .readiness,

        validated:

            context.qa

                .validated,

        repaired:

            context.qa

                .repaired,

        approved:

            context.qa

                .approved,

        recommendation:

            context.qa

                .approved

                ? "Continue Research Pipeline"

                : "Review Research Findings"

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

        services:

            stats.registeredServices,

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

            "Research Integration",

        runtime:

            "Research QA Integration Runtime",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        supports: [

            "validation-routing",

            "repair-routing",

            "approval-routing",

            "metrics",

            "historian",

            "prediction",

            "learning",

            "executive-reporting",

            "analytics",

            "health-monitoring"

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
BOOTSTRAP

Registers built-in services,
hooks and default policies.

========================================
*/

function bootstrap() {

    if (

        registry.bootstrapped

    ) {

        return;

    }

    registry.bootstrapped = true;

    /*
    ================================
    DEFAULT POLICIES
    ================================
    */

    registerPolicy(

        "default",

        {

            validation: true,

            repair: true,

            approval: true,

            metrics: true,

            historian: true,

            prediction: true,

            learning: true,

            executiveReporting: true

        }

    );

    registerPolicy(

        "research",

        {

            requireValidation: true,

            requireApproval: true,

            allowRepair: true,

            requireHistorian: true,

            requirePrediction: true,

            requireLearning: true,

            minimumQuality: 80

        }

    );

    /*
    ================================
    CORE HOOK

    Ensures metadata exists even if
    no external hooks are registered.

    ================================
    */

    use({

        name:

            "core-research-runtime",

        phase:

            PHASE.EXECUTIVE,

        priority:

            0,

        handler:

            async context => {

                context.metadata.runtimeReady =

                    true;

                context.metadata.runtimeVersion =

                    "3.0.0";

                context.metadata.initializedAt =

                    new Date()

                        .toISOString();

            }

    });

}

/*
========================================
RESET

Testing / Development

========================================
*/

function reset() {

    registry.hooks.length = 0;

    registry.services.clear();

    registry.policies.clear();

    registry.statistics.executions = 0;

    registry.statistics.failures = 0;

    registry.bootstrapped = false;

    bootstrap();

}

/*
========================================
CLONE

Native structuredClone

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

Deep immutable object

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

const ResearchIntegration =

    freeze({

        PHASE,

        createContext,

        registerService,

        use,

        registerPolicy,

        validateContext,

        injectPolicy,

        enrich,

        executeHooks,

        executeService,

        emit,

        collectMetrics,

        recordHistorian,

        updatePrediction,

        updateLearning,

        execute,

        analytics,

        assessQuality,

        researchIntelligence,

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

    ResearchIntegration;