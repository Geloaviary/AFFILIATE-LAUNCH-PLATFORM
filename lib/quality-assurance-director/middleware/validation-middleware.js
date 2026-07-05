/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Validation Middleware

Platform Validation
Execution Wrapper

Responsible for

• Context Normalization
• Runtime Enrichment
• Snapshot Creation
• Event Preparation
• Validation Middleware

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

const registry = {

    middleware: [],

    snapshots: [],

    statistics: {

        executions: 0,

        failures: 0

    }

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

    submission,

    options = {}

} = {}) {

    return {

        middlewareId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        session,

        workflow,

        department,

        submission,

        options,

        startedAt:

            new Date()

                .toISOString(),

        normalized:

            false,

        snapshot:

            null,

        metadata: {},

        statistics: {},

        events: [],

        warnings: [],

        errors: []

    };

}

/*
========================================
REGISTER

========================================
*/

function use(

    middleware

) {

    if (

        typeof middleware !==

        "function"

    ) {

        throw new TypeError(

            "Validation middleware must be a function."

        );

    }

    registry.middleware.push(

        middleware

    );

}

/*
========================================
NORMALIZE

========================================
*/

function normalize(

    context

) {

    context.department ??=

        "unknown";

    context.workflow ??=

        {};

    context.submission ??=

        {};

    context.options ??=

        {};

    context.normalized =

        true;

    return context;

}

/*
========================================
SNAPSHOT

========================================
*/

function snapshot(

    context

) {

    context.snapshot =

        JSON.parse(

            JSON.stringify(

                context.submission

            )

        );

    registry.snapshots.push({

        traceId:

            context.traceId,

        timestamp:

            new Date()

                .toISOString(),

        snapshot:

            context.snapshot

    });

    return context.snapshot;

}

/*
========================================
ENRICH

========================================
*/

function enrich(

    context

) {

    context.metadata.runtime =

        "validation";

    context.metadata.version =

        "3.0.0";

    context.metadata.constitution =

        "QA-001";

    context.metadata.middlewareId =

        context.middlewareId;

    return context;

}

/*
========================================
EXECUTE MIDDLEWARE

========================================
*/

async function executeMiddleware(

    context

) {

    for (

        const middleware of

        registry.middleware

    ) {

        await middleware(

            context

        );

    }

    return context;

}

/*
========================================
EMIT EVENT

========================================
*/

function emit(

    context,

    type,

    payload = {}

) {

    context.events.push({

        type,

        timestamp:

            new Date()

                .toISOString(),

        payload

    });

}

/*
========================================
EXECUTE VALIDATOR

Universal Validation Wrapper

========================================
*/

async function execute(

    context,

    validator

) {

    if (

        typeof validator !==

        "function"

    ) {

        throw new TypeError(

            "Validator must be a function."

        );

    }

    normalize(

        context

    );

    snapshot(

        context

    );

    enrich(

        context

    );

    emit(

        context,

        "validation.started"

    );

    const started =

        Date.now();

    try {

        await executeMiddleware(

            context

        );

        const result =

            await validator(

                context

            );

        context.statistics.duration =

            Date.now() -

            started;

        context.statistics.success =

            true;

        registry.statistics.executions++;

        emit(

            context,

            "validation.completed",

            {

                duration:

                    context.statistics.duration

            }

        );

        return result;

    }

    catch (

        error

    ) {

        registry.statistics.failures++;

        context.statistics.duration =

            Date.now() -

            started;

        context.statistics.success =

            false;

        context.errors.push(

            error.message

        );

        emit(

            context,

            "validation.failed",

            {

                error:

                    error.message,

                duration:

                    context.statistics.duration

            }

        );

        throw error;

    }

}

/*
========================================
PREDICTION HOOK

========================================
*/

async function prediction(

    context,

    engine = null

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

    context.metadata.prediction =

        prediction;

    return prediction;

}

/*
========================================
LEARNING HOOK

========================================
*/

async function learning(

    context,

    engine = null

) {

    if (

        !engine ||

        typeof engine.learn !==

        "function"

    ) {

        return;

    }

    await engine.learn(

        context

    );

    context.metadata.learning =

        true;

}

/*
========================================
METRICS

========================================
*/

function metrics(

    context

) {

    context.statistics.timestamp =

        new Date()

            .toISOString();

    context.statistics.traceId =

        context.traceId;

    context.statistics.department =

        context.department;

    return context.statistics;

}

/*
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

        traceId:

            context.traceId,

        action,

        timestamp:

            new Date()

                .toISOString(),

        details

    };

    context.metadata.audit ??= [];

    context.metadata.audit.push(

        record

    );

    return record;

}

/*
========================================
HISTORY

========================================
*/

function history(

    context

) {

    return [

        ...(context.metadata.audit || [])

    ];

}

/*
========================================
STATISTICS

========================================
*/

function statistics(

    context

) {

    const auditCount =

        (

            context.metadata.audit ||

            []

        ).length;

    context.statistics.auditRecords =

        auditCount;

    context.statistics.events =

        context.events.length;

    context.statistics.errors =

        context.errors.length;

    context.statistics.warnings =

        context.warnings.length;

    context.statistics.snapshots =

        context.snapshot

            ? 1

            : 0;

    context.statistics.executionCount =

        registry.statistics.executions;

    context.statistics.failureCount =

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

        traceId:

            context.traceId,

        department:

            context.department,

        normalized:

            context.normalized,

        success:

            context.statistics.success ||

            false,

        duration:

            context.statistics.duration ||

            0,

        errors:

            context.errors.length,

        warnings:

            context.warnings.length

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

        metadata:

            {

                ...context.metadata

            },

        history:

            history(

                context

            ),

        events:

            [

                ...context.events

            ],

        snapshot:

            context.snapshot

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

                ),

        registeredMiddleware:

            registry.middleware.length,

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

            "Validation context missing."

        );

    }

    else {

        if (

            !context.traceId

        ) {

            errors.push(

                "Trace ID missing."

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
METADATA

========================================
*/

function metadata() {

    return {

        module:

            "Validation Middleware",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        runtime:

            "Validation Execution Wrapper",

        supports: [

            "normalization",

            "snapshots",

            "middleware",

            "audit",

            "metrics",

            "prediction",

            "learning",

            "reporting"

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
RESET

Development / Testing

========================================
*/

function reset() {

    registry.middleware.length = 0;

    registry.snapshots.length = 0;

    registry.statistics.executions = 0;

    registry.statistics.failures = 0;

}

/*
========================================
CLONE

========================================
*/

function clone(

    value

) {

    return JSON.parse(

        JSON.stringify(

            value

        )

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

            Object.keys(

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

    use(

        async context => {

            context.metadata.middleware ??= [];

            context.metadata.middleware.push(

                {

                    name:

                        "core-validation",

                    timestamp:

                        new Date()

                            .toISOString()

                }

            );

        }

    );

}

/*
========================================
PUBLIC API

========================================
*/

const ValidationMiddleware =

    Object.freeze({

        createContext,

        use,

        normalize,

        snapshot,

        enrich,

        executeMiddleware,

        execute,

        emit,

        prediction,

        learning,

        metrics,

        audit,

        history,

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

    ValidationMiddleware;