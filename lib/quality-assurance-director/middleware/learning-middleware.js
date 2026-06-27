/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Learning Middleware

Platform Continuous
Learning Engine

Responsible for

• Multi-Learner Runtime
• Knowledge Store
• Feature Extraction
• Pattern Foundation
• Knowledge Cache
• Runtime Intelligence

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
LEARNER TYPES

========================================
*/

const LEARNER = Object.freeze({

    QUALITY:
        "quality",

    REPAIR:
        "repair",

    APPROVAL:
        "approval",

    WORKFLOW:
        "workflow",

    PREDICTION:
        "prediction",

    REVENUE:
        "revenue",

    CUSTOM:
        "custom"

});

/*
========================================
REGISTRY

========================================
*/

const registry = {

    middleware: [],

    learners:

        new Map(),

    knowledge:

        new Map(),

    patterns: [],

    cache:

        new Map(),

    statistics: {

        learningCycles: 0,

        cacheHits: 0,

        patternsDiscovered: 0,

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

    department,

    validation = {},

    repair = {},

    approval = {},

    metrics = {},

    prediction = {},

    history = {},

    options = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        learningId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        session,

        workflow,

        department,

        validation,

        repair,

        approval,

        metrics,

        prediction,

        history,

        options,

        startedAt:

            timestamp,

        features: {},

        knowledge: null,

        recommendation: null,

        confidence: 0,

        cacheKey: null,

        metadata: {

            runtime:

                "learning",

            version:

                "3.0.0",

            constitution:

                "QA-001",

            createdAt:

                timestamp

        },

        statistics: {},

        events: [],

        warnings: [],

        errors: []

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

            "Learning middleware handler must be a function."

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
REGISTER LEARNER

========================================
*/

function registerLearner({

    name,

    type = LEARNER.CUSTOM,

    handler,

    metadata = {}

}) {

    if (

        typeof handler !==

        "function"

    ) {

        throw new TypeError(

            "Learning handler must be a function."

        );

    }

    registry.learners.set(

        name,

        Object.freeze({

            name,

            type,

            handler,

            metadata:

                Object.freeze({

                    ...metadata

                })

        })

    );

}

/*
========================================
FEATURE EXTRACTION

========================================
*/

function extractFeatures(

    context

) {

    context.features = {

        validationScore:

            context.validation

                ?.score ??

            100,

        repairConfidence:

            context.repair

                ?.confidence ??

            100,

        approvalConfidence:

            context.approval

                ?.confidence ??

            100,

        predictionConfidence:

            context.prediction

                ?.confidence ??

            100,

        successRate:

            context.metrics

                ?.successRate ??

            100,

        averageLatency:

            context.metrics

                ?.averageLatency ??

            0,

        historicalEvents:

            context.history

                ?.events ??

            0,

        workflowRisk:

            context.workflow

                ?.risk ??

            0

    };

    return context.features;

}

/*
========================================
KNOWLEDGE CACHE

========================================
*/

function cacheKey(

    context

) {

    const key =

        JSON.stringify({

            department:

                context.department,

            features:

                context.features

        });

    context.cacheKey =

        key;

    return key;

}

function readCache(

    context

) {

    return registry.cache.get(

        context.cacheKey

    ) ||

    null;

}

function writeCache(

    context,

    knowledge

) {

    registry.cache.set(

        context.cacheKey,

        Object.freeze(

            structuredClone(

                knowledge

            )

        )

    );

}

/*
========================================
KNOWLEDGE STORE

========================================
*/

function storeKnowledge(

    key,

    knowledge

) {

    registry.knowledge.set(

        key,

        Object.freeze(

            structuredClone(

                knowledge

            )

        )

    );

    return registry.knowledge.get(

        key

    );

}

/*
========================================
ENRICH CONTEXT

========================================
*/

function enrich(

    context

) {

    context.metadata.learningId =

        context.learningId;

    context.metadata.traceId =

        context.traceId;

    context.metadata.department =

        context.department;

    context.metadata.learnerCount =

        registry.learners.size;

    context.metadata.knowledgeEntries =

        registry.knowledge.size;

    return context;

}

/*
========================================
EXECUTE MIDDLEWARE

Priority + Condition

========================================
*/

async function executeMiddleware(

    context

) {

    for (

        const middleware of

        registry.middleware

    ) {

        if (

            !middleware.condition(

                context

            )

        ) {

            continue;

        }

        await middleware.handler(

            context

        );

    }

    return context;

}

/*
========================================
EVENTS

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
LEARNER SELECTION

========================================
*/

function selectLearner(

    type = LEARNER.CUSTOM

) {

    for (

        const learner of

        registry.learners.values()

    ) {

        if (

            learner.type === type

        ) {

            return learner;

        }

    }

    return null;

}

/*
========================================
PATTERN DISCOVERY

========================================
*/

function discoverPatterns(

    context

) {

    const pattern = {

        id:

            crypto.randomUUID(),

        traceId:

            context.traceId,

        department:

            context.department,

        timestamp:

            new Date()

                .toISOString(),

        features:

            structuredClone(

                context.features

            )

    };

    registry.patterns.push(

        Object.freeze(

            pattern

        )

    );

    registry.statistics

        .patternsDiscovered++;

    return pattern;

}

/*
========================================
CONFIDENCE ENGINE

========================================
*/

function calculateConfidence(

    context,

    knowledge

) {

    const learnerConfidence =

        knowledge?.confidence ??

        50;

    const validationScore =

        context.features

            .validationScore;

    const predictionConfidence =

        context.features

            .predictionConfidence;

    context.confidence =

        Number(

            (

                (

                    learnerConfidence +

                    validationScore +

                    predictionConfidence

                ) / 3

            ).toFixed(

                2

            )

        );

    return context.confidence;

}

/*
========================================
RECOMMENDATION ENGINE

========================================
*/

function recommend(

    context

) {

    if (

        context.confidence >=

        90

    ) {

        context.recommendation = {

            action:

                "retain",

            priority:

                "low",

            confidence:

                context.confidence,

            reason:

                "Knowledge validated."

        };

    }

    else if (

        context.confidence >=

        70

    ) {

        context.recommendation = {

            action:

                "monitor",

            priority:

                "medium",

            confidence:

                context.confidence,

            reason:

                "Continue observing."

        };

    }

    else {

        context.recommendation = {

            action:

                "retrain",

            priority:

                "high",

            confidence:

                context.confidence,

            reason:

                "Learning confidence below acceptable threshold."

        };

    }

    return context.recommendation;

}

/*
========================================
KNOWLEDGE EVOLUTION

========================================
*/

function evolveKnowledge(

    context,

    knowledge

) {

    const evolved =

        Object.freeze({

            ...structuredClone(

                knowledge

            ),

            confidence:

                context.confidence,

            recommendation:

                structuredClone(

                    context.recommendation

                ),

            evolvedAt:

                new Date()

                    .toISOString()

        });

    storeKnowledge(

        context.learningId,

        evolved

    );

    return evolved;

}

/*
========================================
EXECUTE LEARNING

Universal Wrapper

========================================
*/

async function execute(

    context,

    {

        learnerType =

            LEARNER.CUSTOM

    } = {}

) {

    enrich(

        context

    );

    extractFeatures(

        context

    );

    cacheKey(

        context

    );

    emit(

        context,

        "learning.started"

    );

    const cached =

        readCache(

            context

        );

    if (

        cached

    ) {

        registry.statistics

            .cacheHits++;

        context.knowledge =

            structuredClone(

                cached

            );

        context.confidence =

            cached.confidence;

        emit(

            context,

            "learning.cached"

        );

        return context.knowledge;

    }

    await executeMiddleware(

        context

    );

    const learner =

        selectLearner(

            learnerType

        );

    if (

        !learner

    ) {

        throw new Error(

            `Learning model '${learnerType}' not registered.`

        );

    }

    emit(

        context,

        "learning.features",

        context.features

    );

    const started =

        Date.now();

    try {

        const knowledge =

            await learner.handler(

                context

            );

        context.statistics.duration =

            Date.now() -

            started;

        context.knowledge =

            knowledge;

        const pattern =

            discoverPatterns(

                context

            );

        emit(

            context,

            "learning.pattern",

            pattern

        );

        calculateConfidence(

            context,

            knowledge

        );

        recommend(

            context

        );

        const evolved =

            evolveKnowledge(

                context,

                knowledge

            );

        writeCache(

            context,

            evolved

        );

        registry.statistics

            .learningCycles++;

        emit(

            context,

            "learning.completed",

            {

                confidence:

                    context.confidence,

                duration:

                    context.statistics.duration

            }

        );

        return evolved;

    }

    catch (

        error

    ) {

        registry.statistics

            .failures++;

        context.errors.push(

            error.message

        );

        emit(

            context,

            "learning.failed",

            {

                error:

                    error.message

            }

        );

        throw error;

    }

}

/*
========================================
KNOWLEDGE ANALYTICS

========================================
*/

function analytics() {

    const learners = [];

    for (

        const learner of

        registry.learners.values()

    ) {

        learners.push({

            name:

                learner.name,

            type:

                learner.type,

            metadata:

                structuredClone(

                    learner.metadata

                )

        });

    }

    return {

        registeredLearners:

            learners,

        totalLearners:

            learners.length,

        knowledgeEntries:

            registry.knowledge.size,

        patterns:

            registry.patterns.length,

        cacheEntries:

            registry.cache.size,

        learningCycles:

            registry.statistics.learningCycles

    };

}

/*
========================================
PATTERN ANALYTICS

========================================
*/

function patternAnalytics() {

    const departments = {};

    const frequencies = {};

    for (

        const pattern of

        registry.patterns

    ) {

        departments[

            pattern.department

        ] ??= 0;

        departments[

            pattern.department

        ]++;

        const signature =

            JSON.stringify(

                pattern.features

            );

        frequencies[

            signature

        ] ??= 0;

        frequencies[

            signature

        ]++;

    }

    return {

        totalPatterns:

            registry.patterns.length,

        departments,

        recurringPatterns:

            Object.values(

                frequencies

            ).filter(

                count =>

                    count > 1

            ).length

    };

}

/*
========================================
KNOWLEDGE GROWTH

========================================
*/

function knowledgeGrowth() {

    const cycles =

        registry.statistics

            .learningCycles;

    const entries =

        registry.knowledge

            .size;

    return {

        totalKnowledge:

            entries,

        growthRate:

            cycles === 0

                ? 0

                : Number(

                    (

                        entries /

                        cycles *

                        100

                    ).toFixed(

                        2

                    )

                )

    };

}

/*
========================================
LEARNING EFFECTIVENESS

========================================
*/

function effectiveness() {

    const cycles =

        registry.statistics

            .learningCycles;

    const failures =

        registry.statistics

            .failures;

    const cacheHits =

        registry.statistics

            .cacheHits;

    const success =

        Math.max(

            cycles -

            failures,

            0

        );

    return {

        successRate:

            cycles === 0

                ? 0

                : Number(

                    (

                        success /

                        cycles *

                        100

                    ).toFixed(

                        2

                    )

                ),

        cacheEfficiency:

            cycles === 0

                ? 0

                : Number(

                    (

                        cacheHits /

                        cycles *

                        100

                    ).toFixed(

                        2

                    )

                )

    };

}

/*
========================================
EXECUTIVE INTELLIGENCE

========================================
*/

function executiveIntelligence() {

    const growth =

        knowledgeGrowth();

    const performance =

        effectiveness();

    return {

        platformLearning:

            performance.successRate >= 95

                ? "Excellent"

                : performance.successRate >= 80

                    ? "Healthy"

                    : performance.successRate >= 60

                        ? "Improving"

                        : "Needs Attention",

        knowledgeGrowth:

            growth.growthRate,

        totalKnowledge:

            growth.totalKnowledge,

        learningRate:

            performance.successRate,

        cacheEfficiency:

            performance.cacheEfficiency

    };

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

    const performance =

        effectiveness();

    return {

        learningCycles:

            registry.statistics.learningCycles,

        cacheHits:

            registry.statistics.cacheHits,

        failures:

            registry.statistics.failures,

        patternsDiscovered:

            registry.statistics.patternsDiscovered,

        registeredLearners:

            registry.learners.size,

        knowledgeEntries:

            registry.knowledge.size,

        cacheEntries:

            registry.cache.size,

        middleware:

            registry.middleware.length,

        successRate:

            performance.successRate,

        cacheEfficiency:

            performance.cacheEfficiency

    };

}

/*
========================================
REPORT

========================================
*/

function report() {

    return {

        generatedAt:

            new Date()

                .toISOString(),

        statistics:

            statistics(),

        analytics:

            analytics(),

        patterns:

            patternAnalytics(),

        executive:

            executiveIntelligence()

    };

}

/*
========================================
HEALTH

========================================
*/

function health() {

    const stats =

        statistics();

    return {

        healthy:

            stats.failures <=

            stats.learningCycles,

        learningCycles:

            stats.learningCycles,

        knowledgeEntries:

            stats.knowledgeEntries,

        patterns:

            stats.patternsDiscovered,

        learners:

            stats.registeredLearners,

        middleware:

            stats.middleware,

        timestamp:

            new Date()

                .toISOString()

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

            "Learning context missing."

        );

    }

    else {

        if (

            !context.learningId

        ) {

            errors.push(

                "Learning ID missing."

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

            !context.features

        ) {

            errors.push(

                "Learning features missing."

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

            "Learning Middleware",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        runtime:

            "Continuous Learning Engine",

        supports: [

            "multi-learner",

            "knowledge-store",

            "pattern-discovery",

            "knowledge-evolution",

            "recommendations",

            "analytics",

            "executive-intelligence",

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
and default learner.

========================================
*/

function bootstrap() {

    if (

        registry.bootstrapped

    ) {

        return;

    }

    registry.bootstrapped = true;

    use({

        name:

            "core-learning",

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

    registerLearner({

        name:

            "default-quality-learner",

        type:

            LEARNER.QUALITY,

        metadata: {

            builtin: true

        },

        handler:

            async context => ({

                knowledgeType:

                    "quality",

                confidence:

                    context.features

                        .validationScore,

                outcome:

                    "knowledge-retained",

                learnedAt:

                    new Date()

                        .toISOString()

            })

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

    registry.learners.clear();

    registry.knowledge.clear();

    registry.patterns.length = 0;

    registry.cache.clear();

    registry.statistics.learningCycles = 0;

    registry.statistics.cacheHits = 0;

    registry.statistics.patternsDiscovered = 0;

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

const LearningMiddleware =

    freeze({

        LEARNER,

        createContext,

        use,

        registerLearner,

        extractFeatures,

        cacheKey,

        readCache,

        writeCache,

        storeKnowledge,

        enrich,

        executeMiddleware,

        emit,

        selectLearner,

        discoverPatterns,

        calculateConfidence,

        recommend,

        evolveKnowledge,

        execute,

        analytics,

        patternAnalytics,

        knowledgeGrowth,

        effectiveness,

        executiveIntelligence,

        statistics,

        report,

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

    LearningMiddleware;