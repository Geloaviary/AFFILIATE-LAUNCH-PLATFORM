/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Historian Middleware

Platform History Engine

Responsible for

• Immutable Event Store
• Timeline Engine
• Snapshot Versioning
• Correlation Engine
• Historical Recording
• Replay Foundation

Constitution:
QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
RECORD TYPES

========================================
*/

const RECORD = Object.freeze({

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

    EVENT:
        "event"

});

/*
========================================
REGISTRY

========================================
*/

const registry = {

    middleware: [],

    timeline: [],

    records: [],

    snapshots: [],

    indexes: {

        trace:

            new Map(),

        session:

            new Map(),

        workflow:

            new Map(),

        department:

            new Map(),

        type:

            new Map()

    },

    statistics: {

        recorded: 0,

        compressed: 0

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

    type = RECORD.EVENT,

    before = null,

    after = null,

    metadata = {}

} = {}) {

    const timestamp =

        new Date()

            .toISOString();

    return {

        recordId:

            crypto.randomUUID(),

        traceId:

            session?.traceId ||

            crypto.randomUUID(),

        sessionId:

            session?.sessionId ||

            null,

        workflowId:

            workflow?.workflowId ||

            null,

        department,

        type,

        version: 1,

        timestamp,

        before,

        after,

        snapshot: null,

        timelinePosition: -1,

        metadata: {

            ...metadata,

            runtime:

                "historian",

            constitution:

                "QA-001",

            createdAt:

                timestamp

        },

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

            "Historian middleware handler must be a function."

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
CREATE SNAPSHOT

Versioned

========================================
*/

function createSnapshot(

    context

) {

    const snapshot =

        structuredClone({

            version:

                context.version,

            before:

                context.before,

            after:

                context.after,

            metadata:

                context.metadata

        });

    context.snapshot =

        snapshot;

    registry.snapshots.push(

        snapshot

    );

    return snapshot;

}

/*
========================================
TIMELINE ENGINE

========================================
*/

function appendTimeline(

    context

) {

    context.timelinePosition =

        registry.timeline.length;

    registry.timeline.push({

        recordId:

            context.recordId,

        traceId:

            context.traceId,

        workflowId:

            context.workflowId,

        timestamp:

            context.timestamp,

        type:

            context.type,

        department:

            context.department

    });

    return context.timelinePosition;

}

/*
========================================
CORRELATION ENGINE

========================================
*/

function correlate(

    map,

    key,

    recordId

) {

    if (

        !key

    ) {

        return;

    }

    if (

        !map.has(

            key

        )

    ) {

        map.set(

            key,

            []

        );

    }

    map.get(

        key

    ).push(

        recordId

    );

}

function buildIndexes(

    context

) {

    correlate(

        registry.indexes.trace,

        context.traceId,

        context.recordId

    );

    correlate(

        registry.indexes.session,

        context.sessionId,

        context.recordId

    );

    correlate(

        registry.indexes.workflow,

        context.workflowId,

        context.recordId

    );

    correlate(

        registry.indexes.department,

        context.department,

        context.recordId

    );

    correlate(

        registry.indexes.type,

        context.type,

        context.recordId

    );

}

/*
========================================
IMMUTABLE RECORD

========================================
*/

function record(

    context

) {

    createSnapshot(

        context

    );

    appendTimeline(

        context

    );

    buildIndexes(

        context

    );

    const immutable =

        Object.freeze(

            structuredClone(

                context

            )

        );

    registry.records.push(

        immutable

    );

    registry.statistics.recorded++;

    return immutable;

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
RECORD EXECUTION

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

            "Historian operation must be a function."

        );

    }

    emit(

        context,

        "history.started"

    );

    await executeMiddleware(

        context

    );

    await operation(

        context

    );

    const immutable =

        record(

            context

        );

    emit(

        context,

        "history.recorded",

        {

            recordId:

                immutable.recordId

        }

    );

    return immutable;

}

/*
========================================
REPLAY ENGINE

========================================
*/

function replay({

    traceId,

    workflowId,

    sessionId

} = {}) {

    return registry.records.filter(

        record =>

            (

                !traceId ||

                record.traceId ===

                traceId

            ) &&

            (

                !workflowId ||

                record.workflowId ===

                workflowId

            ) &&

            (

                !sessionId ||

                record.sessionId ===

                sessionId

            )

    );

}

/*
========================================
QUERY ENGINE

========================================
*/

function query({

    traceId,

    workflowId,

    sessionId,

    department,

    type

} = {}) {

    return registry.records.filter(

        record =>

            (

                !traceId ||

                record.traceId ===

                traceId

            ) &&

            (

                !workflowId ||

                record.workflowId ===

                workflowId

            ) &&

            (

                !sessionId ||

                record.sessionId ===

                sessionId

            ) &&

            (

                !department ||

                record.department ===

                department

            ) &&

            (

                !type ||

                record.type ===

                type

            )

    );

}

/*
========================================
QUERY BY INDEX

========================================
*/

function queryIndex(

    index,

    value

) {

    const ids =

        registry.indexes[index]

            ?.get(

                value

            ) ||

        [];

    const lookup =

        new Set(

            ids

        );

    return registry.records.filter(

        record =>

            lookup.has(

                record.recordId

            )

    );

}

/*
========================================
TIMELINE

========================================
*/

function timeline({

    workflowId,

    traceId

} = {}) {

    return registry.timeline.filter(

        entry =>

            (

                !workflowId ||

                entry.workflowId ===

                workflowId

            ) &&

            (

                !traceId ||

                entry.traceId ===

                traceId

            )

    );

}

/*
========================================
ARCHIVE

Automatic Compression

========================================
*/

function archive(

    limit = 10000

) {

    if (

        registry.records.length <=

        limit

    ) {

        return;

    }

    const archived =

        registry.records.splice(

            0,

            registry.records.length -

            limit

        );

    registry.statistics.compressed +=

        archived.length;

}

/*
========================================
PUBLISH

========================================
*/

function publish(

    context

) {

    archive();

    emit(

        context,

        "history.completed"

    );

    return context;

}

/*
========================================
HISTORICAL ANALYTICS

========================================
*/

function analytics() {

    const byDepartment = {};

    const byType = {};

    const byWorkflow = {};

    for (

        const record of

        registry.records

    ) {

        byDepartment[

            record.department

        ] ??= 0;

        byDepartment[

            record.department

        ]++;

        byType[

            record.type

        ] ??= 0;

        byType[

            record.type

        ]++;

        if (

            record.workflowId

        ) {

            byWorkflow[

                record.workflowId

            ] ??= 0;

            byWorkflow[

                record.workflowId

            ]++;

        }

    }

    return {

        departments:

            byDepartment,

        recordTypes:

            byType,

        workflows:

            byWorkflow,

        totalRecords:

            registry.records.length,

        timelineEntries:

            registry.timeline.length

    };

}

/*
========================================
TIMELINE ANALYTICS

========================================
*/

function timelineAnalytics(

    workflowId = null

) {

    const entries =

        workflowId

        ?

        timeline({

            workflowId

        })

        :

        registry.timeline;

    return {

        total:

            entries.length,

        first:

            entries[0] ||

            null,

        last:

            entries[

                entries.length - 1

            ] ||

            null,

        duration:

            entries.length > 1

                ?

                new Date(

                    entries[

                        entries.length - 1

                    ].timestamp

                ) -

                new Date(

                    entries[0]

                        .timestamp

                )

                :

                0

    };

}

/*
========================================
EXECUTIVE TIMELINE

========================================
*/

function executiveTimeline(

    workflowId

) {

    return timeline({

        workflowId

    }).map(

        entry => ({

            timestamp:

                entry.timestamp,

            department:

                entry.department,

            stage:

                entry.type

        })

    );

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

    return {

        recorded:

            registry.statistics

                .recorded,

        archived:

            registry.statistics

                .compressed,

        middleware:

            registry.middleware

                .length,

        snapshots:

            registry.snapshots

                .length,

        timeline:

            registry.timeline

                .length,

        records:

            registry.records

                .length,

        indexes: {

            trace:

                registry.indexes

                    .trace.size,

            session:

                registry.indexes

                    .session.size,

            workflow:

                registry.indexes

                    .workflow.size,

            department:

                registry.indexes

                    .department.size,

            type:

                registry.indexes

                    .type.size

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

        timeline:

            timelineAnalytics()

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

        records:

            registry.records

                .length,

        timeline:

            registry.timeline

                .length,

        snapshots:

            registry.snapshots

                .length,

        middleware:

            registry.middleware

                .length,

        archived:

            registry.statistics

                .compressed,

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

            "Historian context missing."

        );

    }

    else {

        if (

            !context.recordId

        ) {

            errors.push(

                "Record ID missing."

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

                "Record type missing."

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

            "Historian Middleware",

        version:

            "3.0.0",

        constitution:

            "QA-001",

        runtime:

            "Historical Intelligence Engine",

        supports: [

            "immutable-history",

            "timeline-engine",

            "replay",

            "indexed-query",

            "analytics",

            "executive-timeline",

            "reporting",

            "compression"

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

            "core-historian",

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

    registry.timeline.length = 0;

    registry.records.length = 0;

    registry.snapshots.length = 0;

    registry.indexes.trace.clear();

    registry.indexes.session.clear();

    registry.indexes.workflow.clear();

    registry.indexes.department.clear();

    registry.indexes.type.clear();

    registry.statistics.recorded = 0;

    registry.statistics.compressed = 0;

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

const HistorianMiddleware =

    freeze({

        RECORD,

        createContext,

        use,

        createSnapshot,

        appendTimeline,

        correlate,

        buildIndexes,

        record,

        executeMiddleware,

        emit,

        execute,

        replay,

        query,

        queryIndex,

        timeline,

        archive,

        publish,

        analytics,

        timelineAnalytics,

        executiveTimeline,

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

    HistorianMiddleware;