/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Content Integration

Content QA Integration Runtime

Responsible for

• Content QA Integration
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

    content,

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

        contentId:

            content?.contentId ||

            content?.id ||

            crypto.randomUUID(),

        assetId:

            content?.assetId ||

            null,

        session,

        workflow,

        campaign,

        content,

        department:

            "content",

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

        intelligence: {

            brandConsistency:

                100,

            affiliateCompliance:

                100,

            readability:

                100,

            engagementScore:

                100,

            conversionReadiness:

                100,

            productionReadiness:

                100

        },

        quality: {

            score:

                100,

            confidence:

                100,

            readiness:

                100

        },

        metrics: {},

        historian: {},

        prediction: {},

        learning: {},

        reports: {},

        metadata: {

            runtime:

                "content",

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

        !context.content

    ) {

        errors.push(

            "Content payload missing."

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

    const contentPolicy =

        registry.policies.get(

            "content"

        ) ||

        {};

    context.policy = {

        ...globalPolicy,

        ...contentPolicy

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

    context.metadata.contentId =

        context.contentId;

    context.metadata.assetId =

        context.assetId;

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

    const duration =

        Date.now() -

        Date.parse(

            context.startedAt

        );

    context.metrics = {

        duration,

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

        brandConsistency:

            context.intelligence
                .brandConsistency,

        affiliateCompliance:

            context.intelligence
                .affiliateCompliance,

        readability:

            context.intelligence
                .readability,

        engagementScore:

            context.intelligence
                .engagementScore,

        conversionReadiness:

            context.intelligence
                .conversionReadiness,

        productionReadiness:

            context.intelligence
                .productionReadiness,

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

                contentId:

                    context.contentId,

                assetId:

                    context.assetId,

                state:

                    "content",

                timestamp:

                    new Date()

                        .toISOString(),

                qa:

                    structuredClone(

                        context.qa

                    ),

                governance:

                    structuredClone(

                        context.governance

                    ),

                intelligence:

                    structuredClone(

                        context.intelligence

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

        repairProbability:

            context.qa.repaired

                ? 100

                : 0,

        approvalProbability:

            context.qa.approved

                ? 100

                : 50,

        publishingProbability:

            Math.round(

                (

                    context.intelligence
                        .engagementScore +

                    context.intelligence
                        .conversionReadiness

                ) / 2

            ),

        engagementProbability:

            context.intelligence
                .engagementScore,

        conversionConfidence:

            context.intelligence
                .conversionReadiness

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

        brandConsistency:

            context.intelligence
                .brandConsistency,

        affiliateCompliance:

            context.intelligence
                .affiliateCompliance,

        recommendation:

            context.errors.length === 0

                ? "retain-content"

                : "optimize-content"

    };

    return context.learning;

}

/*
========================================
EXECUTE

Universal Content Runtime

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

        "content.started"

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

        "content.completed"

    );

    return completionHandler(

        context

    );

}

/*
========================================
CONTENT ANALYTICS

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
ASSESS CONTENT QUALITY

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

    score -=

        Math.floor(

            (

                100 -

                context.intelligence
                    .brandConsistency

            ) * 0.20

        );

    score -=

        Math.floor(

            (

                100 -

                context.intelligence
                    .affiliateCompliance

            ) * 0.20

        );

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

                (

                    score +

                    context.intelligence
                        .engagementScore

                ) / 2

            ).toFixed(

                2

            )

        );

    context.quality.readiness =

        Number(

            (

                (

                    score +

                    context.intelligence
                        .productionReadiness

                ) / 2

            ).toFixed(

                2

            )

        );

    return context.quality;

}

/*
========================================
CONTENT INTELLIGENCE

========================================
*/

function contentIntelligence(

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

        brandConsistency:

            context.intelligence
                .brandConsistency,

        affiliateCompliance:

            context.intelligence
                .affiliateCompliance,

        readability:

            context.intelligence
                .readability,

        engagementScore:

            context.intelligence
                .engagementScore,

        conversionReadiness:

            context.intelligence
                .conversionReadiness,

        productionReadiness:

            context.intelligence
                .productionReadiness,

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
CONTENT REPORT

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

        contentId:

            context.contentId,

        assetId:

            context.assetId,

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

        intelligence:

            structuredClone(

                context.intelligence

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

        analytics:

            contentIntelligence(

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

        contentId:

            context.contentId,

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

        brandConsistency:

            context.intelligence
                .brandConsistency,

        affiliateCompliance:

            context.intelligence
                .affiliateCompliance,

        engagementScore:

            context.intelligence
                .engagementScore,

        conversionReadiness:

            context.intelligence
                .conversionReadiness,

        productionReadiness:

            context.intelligence
                .productionReadiness,

        approved:

            context.qa
                .approved,

        recommendation:

            context.qa
                .approved

                ? "Proceed to Production"

                : "Revise Content"

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

            "Content Integration",

        runtime:

            "Content QA Integration Runtime",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        supports: [

            "validation-routing",

            "repair-routing",

            "approval-routing",

            "content-intelligence",

            "brand-consistency",

            "affiliate-compliance",

            "engagement-analysis",

            "production-readiness",

            "executive-reporting",

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

        "content",

        {

            requireValidation: true,

            requireApproval: true,

            allowRepair: true,

            requireHistorian: true,

            requirePrediction: true,

            requireLearning: true,

            requireBrandConsistency: true,

            requireAffiliateCompliance: true,

            minimumQuality: 85,

            minimumBrandConsistency: 90,

            minimumAffiliateCompliance: 100,

            minimumReadability: 80,

            minimumEngagementScore: 75,

            minimumConversionReadiness: 80,

            minimumProductionReadiness: 90

        }

    );

    /*
    ================================
    CORE RUNTIME HOOK

    Guarantees runtime metadata
    even without external hooks.

    ================================
    */

    use({

        name:

            "core-content-runtime",

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

Uses native structuredClone

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

const ContentIntegration =

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

        contentIntelligence,

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

    ContentIntegration;