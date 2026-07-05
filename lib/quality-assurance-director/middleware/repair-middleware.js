/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Repair Middleware

Platform Repair Transaction
Middleware

Responsible for

• Repair Transactions
• Priority Middleware
• Conditional Middleware
• Snapshot Engine
• Diff Engine
• Rollback Preparation
• Runtime Enrichment

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

    snapshots: [],

    transactions: [],

    statistics: {

        executions: 0,

        rollbacks: 0,

        failures: 0

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

    submission,

    repair = {},

    options = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        repairId:

            crypto.randomUUID(),

        transactionId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        session,

        workflow,

        department,

        submission,

        repair,

        options,

        startedAt:

            timestamp,

        completedAt:

            null,

        verified:

            false,

        committed:

            false,

        rolledBack:

            false,

        confidence:

            0,

        before:

            null,

        after:

            null,

        diff:

            {},

        metadata: {},

        statistics: {},

        events: [],

        warnings: [],

        errors: []

    };

}

/*
========================================
REGISTER MIDDLEWARE

Priority + Conditional

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

            "Repair middleware handler must be a function."

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
BEGIN TRANSACTION

========================================
*/

function beginTransaction(

    context

) {

    registry.transactions.push({

        transactionId:

            context.transactionId,

        traceId:

            context.traceId,

        startedAt:

            context.startedAt,

        department:

            context.department

    });

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

    context.before =

        structuredClone(

            context.submission

        );

    registry.snapshots.push({

        transactionId:

            context.transactionId,

        traceId:

            context.traceId,

        timestamp:

            new Date()

                .toISOString(),

        snapshot:

            context.before

    });

    return context.before;

}

/*
========================================
DIFF ENGINE

========================================
*/

function createDiff(

    before,

    after

) {

    const diff = {};

    const keys = new Set([

        ...Object.keys(

            before || {}

        ),

        ...Object.keys(

            after || {}

        )

    ]);

    for (

        const key of keys

    ) {

        const previous =

            before?.[key];

        const current =

            after?.[key];

        if (

            JSON.stringify(

                previous

            ) !==

            JSON.stringify(

                current

            )

        ) {

            diff[key] = {

                before:

                    previous,

                after:

                    current

            };

        }

    }

    return diff;

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

        "repair";

    context.metadata.version =

        "3.0.0";

    context.metadata.constitution =

        "QA-001";

    context.metadata.middleware =

        "repair";

    context.metadata.transactionId =

        context.transactionId;

    context.metadata.traceId =

        context.traceId;

    return context;

}

/*
========================================
EXECUTE MIDDLEWARE

Priority Driven

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
VERIFY REPAIR

========================================
*/

function verify(

    context

) {

    const changes =

        Object.keys(

            context.diff

        ).length;

    context.verified =

        changes > 0;

    context.confidence =

        Math.min(

            100,

            50 +

            (changes * 10)

        );

    return context.verified;

}

/*
========================================
COMMIT

========================================
*/

function commit(

    context

) {

    context.committed =

        true;

    context.completedAt =

        new Date()

            .toISOString();

    emit(

        context,

        "repair.committed"

    );

    return context;

}

/*
========================================
ROLLBACK

========================================
*/

function rollback(

    context

) {

    context.submission =

        structuredClone(

            context.before

        );

    context.after =

        structuredClone(

            context.before

        );

    context.diff = {};

    context.rolledBack =

        true;

    registry.statistics.rollbacks++;

    emit(

        context,

        "repair.rollback"

    );

    return context;

}

/*
========================================
EXECUTE REPAIR

Universal Wrapper

========================================
*/

async function execute(

    context,

    repairEngine,

    retryController = null

) {

    if (

        typeof repairEngine !==

        "function"

    ) {

        throw new TypeError(

            "Repair engine must be a function."

        );

    }

    beginTransaction(

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

        "repair.started"

    );

    const started =

        Date.now();

    try {

        await executeMiddleware(

            context

        );

        await repairEngine(

            context

        );

        context.after =

            structuredClone(

                context.submission

            );

        context.diff =

            createDiff(

                context.before,

                context.after

            );

        verify(

            context

        );

        if (

            !context.verified

        ) {

            rollback(

                context

            );

            throw new Error(

                "Repair verification failed."

            );

        }

        commit(

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

            "repair.completed",

            {

                confidence:

                    context.confidence,

                duration:

                    context.statistics.duration

            }

        );

        return context;

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

            "repair.failed",

            {

                error:

                    error.message

            }

        );

        if (

            retryController &&

            typeof retryController.retry ===

            "function"

        ) {

            await retryController.retry(

                {

                    workflow:

                        context.workflow,

                    repair:

                        context,

                    error

                },

                async () =>

                    repairEngine(

                        context

                    )

            );

        }

        throw error;

    }

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

        repairId:

            context.repairId,

        transactionId:

            context.transactionId,

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
TRANSACTION HISTORY

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
REPAIR EFFICIENCY

========================================
*/

function efficiency(

    context

) {

    const diffCount =

        Object.keys(

            context.diff || {}

        ).length;

    const confidence =

        context.confidence || 0;

    return Number(

        (

            (

                confidence *

                Math.max(

                    diffCount,

                    1

                )

            ) /

            100

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

    const auditRecords =

        (

            context.metadata.audit ||

            []

        ).length;

    context.statistics.auditRecords =

        auditRecords;

    context.statistics.events =

        context.events.length;

    context.statistics.errors =

        context.errors.length;

    context.statistics.warnings =

        context.warnings.length;

    context.statistics.rollback =

        context.rolledBack;

    context.statistics.committed =

        context.committed;

    context.statistics.confidence =

        context.confidence;

    context.statistics.efficiency =

        efficiency(

            context

        );

    context.statistics.executionCount =

        registry.statistics.executions;

    context.statistics.rollbackCount =

        registry.statistics.rollbacks;

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

        repairId:

            context.repairId,

        transactionId:

            context.transactionId,

        department:

            context.department,

        verified:

            context.verified,

        committed:

            context.committed,

        rolledBack:

            context.rolledBack,

        confidence:

            context.confidence,

        efficiency:

            efficiency(

                context

            ),

        duration:

            context.statistics.duration ||

            0

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

            history(

                context

            ),

        diff:

            context.diff,

        before:

            context.before,

        after:

            context.after,

        events:

            [

                ...context.events

            ],

        metadata:

            {

                ...context.metadata

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

            "Repair context missing."

        );

    }

    else {

        if (

            !context.repairId

        ) {

            errors.push(

                "Repair ID missing."

            );

        }

        if (

            !context.transactionId

        ) {

            errors.push(

                "Transaction ID missing."

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

        rollbacks:

            registry.statistics.rollbacks,

        failures:

            registry.statistics.failures,

        registeredMiddleware:

            registry.middleware.length,

        activeTransactions:

            registry.transactions.length,

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

            "Repair Middleware",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        runtime:

            "Repair Transaction Engine",

        supports: [

            "priority-middleware",

            "conditional-middleware",

            "transactions",

            "rollback",

            "verification",

            "confidence",

            "diff-engine",

            "audit",

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

            "core-repair",

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

    registry.snapshots.length = 0;

    registry.transactions.length = 0;

    registry.statistics.executions = 0;

    registry.statistics.rollbacks = 0;

    registry.statistics.failures = 0;

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

const RepairMiddleware =

    freeze({

        createContext,

        use,

        beginTransaction,

        snapshot,

        createDiff,

        enrich,

        executeMiddleware,

        execute,

        verify,

        commit,

        rollback,

        emit,

        audit,

        history,

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

    RepairMiddleware;