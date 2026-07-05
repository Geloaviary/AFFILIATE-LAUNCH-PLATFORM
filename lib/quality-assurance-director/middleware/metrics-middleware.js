/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Metrics Middleware

Platform Telemetry Engine

Responsible for

• Runtime Telemetry
• KPI Collection
• Performance Metrics
• Workflow Metrics
• Department Metrics
• Platform Metrics
• Sliding Window Metrics

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

const { performance } = require("perf_hooks");

/*
========================================
METRIC TYPES

========================================
*/

const METRIC = Object.freeze({

    VALIDATION:
        "validation",

    REPAIR:
        "repair",

    APPROVAL:
        "approval",

    RETRY:
        "retry",

    WORKFLOW:
        "workflow",

    PIPELINE:
        "pipeline",

    DEPARTMENT:
        "department",

    PLATFORM:
        "platform"

});

/*
========================================
METRIC CATEGORIES

========================================
*/

const CATEGORY = Object.freeze({

    PERFORMANCE:
        "performance",

    RELIABILITY:
        "reliability",

    QUALITY:
        "quality",

    WORKFLOW:
        "workflow",

    APPROVAL:
        "approval",

    REPAIR:
        "repair",

    PREDICTION:
        "prediction",

    LEARNING:
        "learning"

});

/*
========================================
REGISTRY

========================================
*/

const registry = {

    middleware: [],

    metrics: [],

    windows: {

        minute: [],

        fiveMinutes: [],

        fifteenMinutes: [],

        hour: [],

        session: [],

        lifetime: []

    },

    platform: {

        executions: 0,

        failures: 0

    },

    departments:

        new Map(),

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

    operation,

    category = CATEGORY.PERFORMANCE,

    type = METRIC.PLATFORM,

    metadata = {}

} = {}) {

    return {

        metricId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        session,

        workflow,

        department,

        operation,

        category,

        type,

        metadata,

        startedAt:

            new Date()

                .toISOString(),

        startTime:

            performance.now(),

        endTime:

            null,

        duration:

            0,

        memory: {},

        cpu: {},

        latency:

            0,

        values: {},

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

            "Metrics middleware handler must be a function."

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
HIGH RESOLUTION TIMER

========================================
*/

function startTimer(

    context

) {

    context.startTime =

        performance.now();

    context.startedAt =

        new Date()

            .toISOString();

    return context;

}

function stopTimer(

    context

) {

    context.endTime =

        performance.now();

    context.duration =

        Number(

            (

                context.endTime -

                context.startTime

            ).toFixed(

                3

            )

        );

    context.latency =

        context.duration;

    return context.duration;

}

/*
========================================
CAPTURE RUNTIME

========================================
*/

function captureRuntime(

    context

) {

    const memory =

        process.memoryUsage();

    context.memory = {

        rss:

            memory.rss,

        heapTotal:

            memory.heapTotal,

        heapUsed:

            memory.heapUsed,

        external:

            memory.external

    };

    context.cpu =

        process.cpuUsage();

    return context;

}

/*
========================================
CAPTURE METRIC

========================================
*/

function capture(

    context

) {

    registry.metrics.push(

        context

    );

    registry.windows.minute.push(

        context

    );

    registry.windows.fiveMinutes.push(

        context

    );

    registry.windows.fifteenMinutes.push(

        context

    );

    registry.windows.hour.push(

        context

    );

    registry.windows.session.push(

        context

    );

    registry.windows.lifetime.push(

        context

    );

    registry.platform.executions++;

    if (

        context.department

    ) {

        if (

            !registry.departments.has(

                context.department

            )

        ) {

            registry.departments.set(

                context.department,

                {

                    executions: 0,

                    failures: 0

                }

            );

        }

        registry.departments.get(

            context.department

        ).executions++;

    }

    return context;

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

        "metrics";

    context.metadata.version =

        "3.0.0";

    context.metadata.constitution =

        "QA-001";

    context.metadata.metricId =

        context.metricId;

    context.metadata.traceId =

        context.traceId;

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
SLIDING WINDOW MAINTENANCE

========================================
*/

function pruneWindows(

    maxEntries = 5000

) {

    Object.values(

        registry.windows

    ).forEach(

        window => {

            while (

                window.length >

                maxEntries

            ) {

                window.shift();

            }

        }

    );

}

/*
========================================
LATENCY PERCENTILES

========================================
*/

function percentile(

    values,

    p

) {

    if (

        values.length === 0

    ) {

        return 0;

    }

    const sorted =

        [...values]

        .sort(

            (

                a,

                b

            ) =>

                a - b

        );

    const index =

        Math.ceil(

            (

                p /

                100

            ) *

            sorted.length

        ) - 1;

    return Number(

        sorted[

            Math.max(

                index,

                0

            )

        ].toFixed(

            3

        )

    );

}

/*
========================================
KPI ENGINE

========================================
*/

function calculateKPIs() {

    const metrics =

        registry.windows.session;

    const durations =

        metrics.map(

            metric =>

                metric.duration

        );

    const successful =

        registry.platform.executions -

        registry.platform.failures;

    return {

        throughput:

            registry.platform.executions,

        successRate:

            registry.platform.executions === 0

                ? 0

                : Number(

                    (

                        successful /

                        registry.platform.executions *

                        100

                    ).toFixed(

                        2

                    )

                ),

        failureRate:

            registry.platform.executions === 0

                ? 0

                : Number(

                    (

                        registry.platform.failures /

                        registry.platform.executions *

                        100

                    ).toFixed(

                        2

                    )

                ),

        averageLatency:

            durations.length === 0

                ? 0

                : Number(

                    (

                        durations.reduce(

                            (

                                total,

                                value

                            ) =>

                                total +

                                value,

                            0

                        ) /

                        durations.length

                    ).toFixed(

                        3

                    )

                ),

        p95Latency:

            percentile(

                durations,

                95

            ),

        p99Latency:

            percentile(

                durations,

                99

            )

    };

}

/*
========================================
DEPARTMENT METRICS

========================================
*/

function departmentMetrics(

    department

) {

    return (

        registry.departments.get(

            department

        ) ||

        null

    );

}

/*
========================================
PLATFORM METRICS

========================================
*/

function platformMetrics() {

    return {

        ...registry.platform,

        kpis:

            calculateKPIs()

    };

}

/*
========================================
PUBLISH

========================================
*/

function publish(

    context

) {

    capture(

        context

    );

    pruneWindows();

    context.values.kpis =

        calculateKPIs();

    return context;

}

/*
========================================
EXECUTE

Universal Metrics Wrapper

========================================
*/

async function execute(

    context,

    operation

) {

    if (

        typeof operation !==

        "function"

    ) {

        throw new TypeError(

            "Metrics operation must be a function."

        );

    }

    enrich(

        context

    );

    startTimer(

        context

    );

    captureRuntime(

        context

    );

    try {

        await executeMiddleware(

            context

        );

        const result =

            await operation(

                context

            );

        stopTimer(

            context

        );

        publish(

            context

        );

        return result;

    }

    catch (

        error

    ) {

        registry.platform.failures++;

        if (

            context.department &&

            registry.departments.has(

                context.department

            )

        ) {

            registry.departments.get(

                context.department

            ).failures++;

        }

        context.errors.push(

            error.message

        );

        stopTimer(

            context

        );

        publish(

            context

        );

        throw error;

    }

}

/*
========================================
METRIC ANALYTICS

========================================
*/

function analytics() {

    const kpis =

        calculateKPIs();

    const departments =

        Array.from(

            registry.departments.entries()

        ).map(

            ([

                name,

                stats

            ]) => ({

                department:

                    name,

                ...stats

            })

        );

    return {

        platform:

            platformMetrics(),

        departments,

        kpis

    };

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

    return {

        executions:

            registry.platform.executions,

        failures:

            registry.platform.failures,

        successRate:

            calculateKPIs()

                .successRate,

        registeredDepartments:

            registry.departments.size,

        registeredMiddleware:

            registry.middleware.length,

        totalMetrics:

            registry.metrics.length,

        windows: {

            minute:

                registry.windows

                    .minute.length,

            fiveMinutes:

                registry.windows

                    .fiveMinutes.length,

            fifteenMinutes:

                registry.windows

                    .fifteenMinutes.length,

            hour:

                registry.windows

                    .hour.length,

            session:

                registry.windows

                    .session.length,

            lifetime:

                registry.windows

                    .lifetime.length

        }

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

        platform:

            platformMetrics()

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

            stats.executions,

        executions:

            stats.executions,

        failures:

            stats.failures,

        middleware:

            stats.registeredMiddleware,

        departments:

            stats.registeredDepartments,

        memory:

            process.memoryUsage(),

        uptime:

            process.uptime(),

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

            "Metrics context missing."

        );

    }

    else {

        if (

            !context.metricId

        ) {

            errors.push(

                "Metric ID missing."

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

            !context.type

        ) {

            errors.push(

                "Metric type missing."

            );

        }

        if (

            !context.category

        ) {

            errors.push(

                "Metric category missing."

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

            "Metrics Middleware",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        runtime:

            "Platform Telemetry Engine",

        supports: [

            "streaming-metrics",

            "department-metrics",

            "platform-metrics",

            "kpi-engine",

            "sliding-windows",

            "analytics",

            "reporting",

            "telemetry"

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
TREND ANALYSIS

========================================
*/

function trends() {

    const metrics =

        registry.windows.session;

    if (

        metrics.length < 2

    ) {

        return {

            latency:

                "stable",

            throughput:

                "stable"

        };

    }

    const first =

        metrics[0];

    const last =

        metrics[

            metrics.length - 1

        ];

    return {

        latency:

            last.duration >

            first.duration

                ? "increasing"

                : "decreasing",

        throughput:

            registry.platform.executions >

            metrics.length / 2

                ? "high"

                : "normal"

    };

}

/*
========================================
EXECUTIVE SUMMARY

========================================
*/

function executiveSummary() {

    const kpis =

        calculateKPIs();

    return {

        overallHealth:

            health()

                .healthy

                ? "Healthy"

                : "Attention Required",

        throughput:

            kpis.throughput,

        successRate:

            kpis.successRate,

        averageLatency:

            kpis.averageLatency,

        p95Latency:

            kpis.p95Latency,

        p99Latency:

            kpis.p99Latency,

        trends:

            trends()

    };

}

/*
========================================
BOOTSTRAP

Registers built-in middleware.

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

            "core-metrics",

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

    registry.middleware.length = 0;

    registry.metrics.length = 0;

    registry.windows.minute.length = 0;

    registry.windows.fiveMinutes.length = 0;

    registry.windows.fifteenMinutes.length = 0;

    registry.windows.hour.length = 0;

    registry.windows.session.length = 0;

    registry.windows.lifetime.length = 0;

    registry.platform.executions = 0;

    registry.platform.failures = 0;

    registry.departments.clear();

    registry.bootstrapped = false;

    bootstrap();

}

/*
========================================
CLONE

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

const MetricsMiddleware =

    freeze({

        METRIC,

        CATEGORY,

        createContext,

        use,

        startTimer,

        stopTimer,

        captureRuntime,

        capture,

        enrich,

        executeMiddleware,

        execute,

        pruneWindows,

        percentile,

        calculateKPIs,

        departmentMetrics,

        platformMetrics,

        publish,

        analytics,

        statistics,

        report,

        health,

        validate,

        metadata,

        trends,

        executiveSummary,

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

    MetricsMiddleware;