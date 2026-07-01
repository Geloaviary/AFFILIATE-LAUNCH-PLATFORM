/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Enterprise Runtime Registry

Single Source of Truth

Responsibilities

• Runtime Catalog
• Enterprise Discovery
• Registration
• Runtime Intelligence
• Dependency Metadata

Constitution:
QA-001

========================================
*/

"use strict";

const crypto = require("crypto");

/*
========================================
VERSION

========================================
*/

const VERSION = Object.freeze({

    runtime:

        "4.0.0",

    architecture:

        "1.0.0",

    constitution:

        "QA-001",

    module:

        "Enterprise Runtime Registry"

});

/*
========================================
SUPPORTED TYPES

========================================
*/

const TYPES = Object.freeze({

    RUNTIME:

        "runtime",

    SERVICE:

        "service",

    MANAGER:

        "manager",

    MIDDLEWARE:

        "middleware",

    HOOK:

        "hook",

    INTEGRATION:

        "integration",

    CONFIGURATION:

        "configuration",

    PROVIDER:

        "provider",

    ENGINE:

        "engine",

    ADAPTER:

        "adapter",

    CONTROLLER:

        "controller",

    WORKER:

        "worker",

    PLUGIN:

        "plugin"

});

/*
========================================
SUPPORTED LIFECYCLES

========================================
*/

const LIFECYCLE = Object.freeze({

    SINGLETON:

        "singleton",

    TRANSIENT:

        "transient",

    SCOPED:

        "scoped"

});

/*
========================================
INDEX OPERATIONS

Canonical operations used by
the Index Engine.

========================================
*/

const INDEX_OPERATION = Object.freeze({

    ADD:

        "add",

    REMOVE:

        "remove"

});

/*
========================================
CLONE UTILITY

Provides a platform-safe deep
clone operation.

========================================
*/

function clone(

    value

) {

    if (

        typeof globalThis
            .structuredClone ===

        "function"

    ) {

        return globalThis

            .structuredClone(

                value

            );

    }

    return JSON.parse(

        JSON.stringify(

            value

        )

    );

}

/*
========================================
ENTERPRISE RUNTIME

Architecture

runtime

├── state
├── metadata
├── catalog
├── indexes
└── extensions

========================================
*/

const runtime = {

    /*
    ================================
    Runtime State
    ================================
    */

    state: {

        id:

            crypto.randomUUID(),

        initialized:

            false,

        createdAt:

            new Date()

                .toISOString(),

        statistics: {

            registrations: 0,

            unregistrations: 0,

            resolutions: 0,

            queries: 0,

            searches: 0,

            snapshots: 0

        }

    },

    /*
    ================================
    Runtime Metadata

    Immutable information describing
    this runtime.

    ================================
    */

    metadata:

        Object.freeze({

            runtimeVersion:

                VERSION.runtime,

            architectureVersion:

                VERSION.architecture,

            constitution:

                VERSION.constitution,

            module:

                VERSION.module

        }),

    /*
    ================================
    Catalog Engine

    Primary System of Record.

    Composite Key

        type:name

    Value

        Immutable Registration Record

    ================================
    */

    catalog: {

        entries:

            new Map()

    },

    /*
    ================================
    Index Engine

    Dynamic Enterprise Index Store.

    Structure

        indexName

            ↓

        Map

            ↓

        indexKey

            ↓

        Set(recordKeys)

    ================================
    */

    indexes:

        new Map(),

    /*
    ================================
    Extension Registry

    Reserved for future platform
    capabilities.

    ================================
    */

    extensions:

        new Map()

};

/*
========================================
INDEX ACCESSOR

Creates an index on demand.

========================================
*/

function index(

    name

) {

    if (

        typeof name !==

        "string" ||

        name.length === 0

    ) {

        throw new TypeError(

            "Index name must be a non-empty string."

        );

    }

    if (

        !runtime.indexes.has(

            name

        )

    ) {

        runtime.indexes.set(

            name,

            new Map()

        );

    }

    return runtime.indexes.get(

        name

    );

}

/*
========================================
ADD INDEX ENTRY

========================================
*/

function addIndex(

    indexName,

    indexKey,

    recordKey

) {

    const store =

        index(

            indexName

        );

    if (

        !store.has(

            indexKey

        )

    ) {

        store.set(

            indexKey,

            new Set()

        );

    }

    store.get(

        indexKey

    ).add(

        recordKey

    );

}

/*
========================================
REMOVE INDEX ENTRY

========================================
*/

function removeIndex(

    indexName,

    indexKey,

    recordKey

) {

    const store =

        runtime.indexes.get(

            indexName

        );

    if (

        !store

    ) {

        return;

    }

    const bucket =

        store.get(

            indexKey

        );

    if (

        !bucket

    ) {

        return;

    }

    bucket.delete(

        recordKey

    );

    if (

        bucket.size === 0

    ) {

        store.delete(

            indexKey

        );

    }

    if (

        store.size === 0

    ) {

        runtime.indexes.delete(

            indexName

        );

    }

}

/*
========================================
SYNCHRONIZE INDEXES

Synchronizes every Enterprise
Index in a single pass.

Operations

• ADD
• REMOVE

========================================
*/

function synchronizeIndexes(

    record,

    operation

) {

    if (

        !record ||

        typeof record !==

        "object"

    ) {

        throw new TypeError(

            "Invalid registration record."

        );

    }

    if (

        operation !==

        INDEX_OPERATION.ADD &&

        operation !==

        INDEX_OPERATION.REMOVE

    ) {

        throw new Error(

            `Unsupported index operation: ${operation}`

        );

    }

    const handler =

        operation ===

        INDEX_OPERATION.ADD

            ? addIndex

            : removeIndex;

    /*
    ------------------------------------
    Type
    ------------------------------------
    */

    handler(

        "type",

        record.type,

        record.key

    );

    /*
    ------------------------------------
    Lifecycle
    ------------------------------------
    */

    handler(

        "lifecycle",

        record.lifecycle,

        record.key

    );

    /*
    ------------------------------------
    Tags
    ------------------------------------
    */

    for (

        const tag of

        record.tags

    ) {

        handler(

            "tag",

            tag,

            record.key

        );

    }

    /*
    ------------------------------------
    Dependencies
    ------------------------------------
    */

    for (

        const dependency of

        record.dependencies

    ) {

        handler(

            "dependency",

            dependency,

            record.key

        );

    }

    /*
    ------------------------------------
    Metadata

    Stored as

    key:value

    ------------------------------------
    */

    for (

        const [

            key,

            value

        ] of Object.entries(

            record.metadata

        )

    ) {

        handler(

            "metadata",

            `${key}:${value}`,

            record.key

        );

    }

}

/*
========================================
VALIDATE REGISTRATION

========================================
*/

function validateRegistration(

    registration

) {

    if (

        registration == null ||

        typeof registration !==

        "object"

    ) {

        throw new TypeError(

            "Registration must be an object."

        );

    }

    if (

        !Object.values(

            TYPES

        ).includes(

            registration.type

        )

    ) {

        throw new Error(

            `Unsupported registration type: ${registration.type}`

        );

    }

    if (

        typeof registration.name !==

        "string" ||

        registration.name.trim() ===

        ""

    ) {

        throw new Error(

            "Registration name is required."

        );

    }

    if (

        registration.instance ===

        undefined

    ) {

        throw new Error(

            "Registration instance is required."

        );

    }

    if (

        registration.lifecycle &&

        !Object.values(

            LIFECYCLE

        ).includes(

            registration.lifecycle

        )

    ) {

        throw new Error(

            `Unsupported lifecycle: ${registration.lifecycle}`

        );

    }

    return true;

}

/*
========================================
NORMALIZE REGISTRATION

Canonical immutable record.

========================================
*/

function normalize({

    type,

    name,

    instance,

    lifecycle =

        LIFECYCLE.SINGLETON,

    metadata = {},

    tags = [],

    dependencies = []

}) {

    metadata =

        metadata &&

        typeof metadata ===

        "object"

            ? metadata

            : {};

    tags =

        Array.isArray(

            tags

        )

            ? tags

            : [];

    dependencies =

        Array.isArray(

            dependencies

        )

            ? dependencies

            : [];

    const key =

        `${type}:${name}`;

    return Object.freeze({

        id:

            crypto.randomUUID(),

        key,

        type,

        name,

        instance,

        lifecycle,

        metadata:

            clone(

                metadata

            ),

        tags:

            Object.freeze([

                ...tags

            ]),

        dependencies:

            Object.freeze([

                ...dependencies

            ]),

        registeredAt:

            new Date()

                .toISOString()

    });

}

/*
========================================
REGISTER

Registration Pipeline

Validate

↓

Normalize

↓

Duplicate Check

↓

Store

↓

Synchronize Indexes

↓

Statistics

↓

Return Immutable Record

========================================
*/

function register(

    registration

) {

    validateRegistration(

        registration

    );

    const record =

        normalize(

            registration

        );

    if (

        runtime.catalog.entries.has(

            record.key

        )

    ) {

        throw new Error(

            `Registration already exists: ${record.key}`

        );

    }

    runtime.catalog.entries.set(

        record.key,

        record

    );

    synchronizeIndexes(

        record,

        INDEX_OPERATION.ADD

    );

    runtime.state.statistics
        .registrations++;

    return record;

}

/*
========================================
RESOLVE

Exact lookup.

Complexity

O(1)

========================================
*/

function resolve(

    type,

    name

) {

    runtime.state.statistics
        .resolutions++;

    const record =

        runtime.catalog.entries.get(

            `${type}:${name}`

        );

    return record

        ? clone(record)

        : null;

}

/*
========================================
EXISTS

Exact lookup.

Complexity

O(1)

========================================
*/

function exists(

    type,

    name

) {

    return runtime.catalog.entries.has(

        `${type}:${name}`

    );

}

/*
========================================
QUERY

Structured discovery.

Uses Enterprise Indexes.

========================================
*/

function query({

    type,

    lifecycle,

    tags = [],

    metadata = {}

} = {}) {

    runtime.state.statistics
        .queries++;

    let candidateKeys =

        null;

    /*
    ------------------------------------
    TYPE
    ------------------------------------
    */

    if (

        type

    ) {

        const bucket =

            runtime.indexes

                .get("type")

                ?.get(type);

        candidateKeys =

            new Set(

                bucket || []

            );

    }

    /*
    ------------------------------------
    LIFECYCLE
    ------------------------------------
    */

    if (

        lifecycle

    ) {

        const bucket =

            runtime.indexes

                .get("lifecycle")

                ?.get(lifecycle);

        const keys =

            new Set(

                bucket || []

            );

        candidateKeys =

            candidateKeys

                ? new Set(

                    [...candidateKeys]

                        .filter(

                            key =>

                                keys.has(

                                    key

                                )

                        )

                )

                : keys;

    }

    /*
    ------------------------------------
    TAGS
    ------------------------------------
    */

    for (

        const tag of

        tags

    ) {

        const bucket =

            runtime.indexes

                .get("tag")

                ?.get(tag);

        const keys =

            new Set(

                bucket || []

            );

        candidateKeys =

            candidateKeys

                ? new Set(

                    [...candidateKeys]

                        .filter(

                            key =>

                                keys.has(

                                    key

                                )

                        )

                )

                : keys;

    }

    const records =

        candidateKeys

            ? [...candidateKeys]

                .map(

                    key =>

                        runtime.catalog.entries.get(

                            key

                        )

                )

                .filter(Boolean)

            : [

                ...runtime.catalog.entries.values()

            ];

    return records

        .filter(

            record =>

                Object.entries(

                    metadata

                )

                .every(

                    ([

                        key,

                        value

                    ]) =>

                        record.metadata[

                            key

                        ] ===

                        value

                )

        )

        .map(

            clone

        );

}

/*
========================================
SEARCH

Enterprise Full Text Search.

========================================
*/

function search(

    term = ""

) {

    runtime.state.statistics
        .searches++;

    const queryText =

        String(

            term

        )

        .toLowerCase();

    return [

        ...runtime.catalog.entries.values()

    ]

    .filter(

        record =>

            record.name

                .toLowerCase()

                .includes(

                    queryText

                ) ||

            record.type

                .toLowerCase()

                .includes(

                    queryText

                ) ||

            record.tags.some(

                tag =>

                    tag

                        .toLowerCase()

                        .includes(

                            queryText

                        )

            )

    )

    .map(

        clone

    );

}

/*
========================================
UNREGISTER

Reverse Registration Pipeline.

========================================
*/

function unregister(

    type,

    name

) {

    const record =

        runtime.catalog.entries.get(

            `${type}:${name}`

        );

    if (

        !record

    ) {

        return false;

    }

    synchronizeIndexes(

        record,

        INDEX_OPERATION.REMOVE

    );

    runtime.catalog.entries.delete(

        record.key

    );

    runtime.state.statistics
        .unregistrations++;

    return true;

}

/*
========================================
DEPENDENCY GRAPH

========================================
*/

function dependencyGraph() {

    const graph =

        new Map();

    for (

        const record of

        runtime.catalog.entries.values()

    ) {

        graph.set(

            record.key,

            Object.freeze([

                ...record.dependencies

            ])

        );

    }

    return graph;

}

/*
========================================
STATISTICS

Runtime statistics snapshot.

========================================
*/

function statistics() {

    return Object.freeze(

        clone(

            runtime.state.statistics

        )

    );

}

/*
========================================
METADATA

Registry metadata snapshot.

========================================
*/

function metadata() {

    return Object.freeze(

        clone(

            runtime.metadata

        )

    );

}

/*
========================================
HEALTH

Runtime health assessment.

========================================
*/

function health() {

    return Object.freeze({

        healthy:

            true,

        initialized:

            runtime.state.initialized,

        registrations:

            runtime.state.statistics

                .registrations,

        entries:

            runtime.catalog.entries

                .size,

        indexes:

            runtime.indexes

                .size,

        checkedAt:

            new Date()

                .toISOString()

    });

}

/*
========================================
STATUS

Current runtime status.

========================================
*/

function status() {

    return Object.freeze({

        runtimeId:

            runtime.state.id,

        initialized:

            runtime.state.initialized,

        createdAt:

            runtime.state.createdAt,

        healthy:

            health()

                .healthy,

        entries:

            runtime.catalog.entries

                .size,

        indexes:

            runtime.indexes

                .size

    });

}

/*
========================================
DIAGNOSTICS

Enterprise runtime diagnostics.

========================================
*/

function diagnostics() {

    return Object.freeze({

        runtime:

            status(),

        metadata:

            metadata(),

        statistics:

            statistics(),

        catalog: {

            entries:

                runtime.catalog.entries

                    .size

        },

        indexes:

            [...runtime.indexes.keys()],

        extensions:

            runtime.extensions

                .size,

        generatedAt:

            new Date()

                .toISOString()

    });

}

/*
========================================
SNAPSHOT

Immutable runtime snapshot.

========================================
*/

function snapshot() {

    runtime.state.statistics
        .snapshots++;

    return Object.freeze({

        state:

            clone(

                runtime.state

            ),

        metadata:

            clone(

                runtime.metadata

            ),

        catalog: {

            entries:

                runtime.catalog.entries

                    .size

        },

        indexes:

            [...runtime.indexes.keys()],

        extensions:

            runtime.extensions

                .size

    });

}

/*
========================================
VALIDATE

Runtime self-validation.

========================================
*/

function validate() {

    const errors = [];

    if (

        !(

            runtime.catalog.entries

            instanceof Map

        )

    ) {

        errors.push(

            "Catalog is invalid."

        );

    }

    if (

        !(

            runtime.indexes

            instanceof Map

        )

    ) {

        errors.push(

            "Index store is invalid."

        );

    }

    if (

        !(

            runtime.extensions

            instanceof Map

        )

    ) {

        errors.push(

            "Extension registry is invalid."

        );

    }

    return Object.freeze({

        valid:

            errors.length === 0,

        errors:

            Object.freeze(

                errors

            ),

        checkedAt:

            new Date()

                .toISOString()

    });

}

/*
========================================
DEEP FREEZE

Recursively freezes objects.

========================================
*/

function deepFreeze(

    value

) {

    if (

        value === null ||

        typeof value !==

        "object" ||

        Object.isFrozen(

            value

        )

    ) {

        return value;

    }

    for (

        const property of

        Object.getOwnPropertyNames(

            value

        )

    ) {

        deepFreeze(

            value[

                property

            ]

        );

    }

    return Object.freeze(

        value

    );

}

/*
========================================
BOOTSTRAP

Initializes the Registry.

========================================
*/

function bootstrap() {

    const report =

        validate();

    if (

        !report.valid

    ) {

        throw new Error(

            "Registry bootstrap failed."

        );

    }

    runtime.state.initialized =

        true;

    return true;

}

/*
========================================
COMPATIBILITY API

Supports existing QAD modules.

========================================
*/

function registerRuntime(

    name,

    metadata = {}

) {

    return register({

        type: TYPES.RUNTIME,

        name,

        instance: metadata,

        metadata

    });

}

function registerEvent(

    name,

    metadata = {}

) {

    return register({

        type: TYPES.INTEGRATION,

        name,

        instance: metadata,

        metadata

    });

}

function registerMetadata(

    name,

    metadata = {}

) {

    return register({

        type: TYPES.CONFIGURATION,

        name,

        instance: metadata,

        metadata

    });

}

function registerConfiguration(

    name,

    metadata = {}

) {

    return register({

        type: TYPES.CONFIGURATION,

        name,

        instance: metadata,

        metadata

    });

}

function recordFailure(

    error

) {

    return error;

}

/*
========================================
ENTERPRISE REGISTRY

Public Runtime

========================================
*/

const Registry = {

    /*
    ----------------------------
    Registration
    ----------------------------
    */

    register,

    unregister,

    registerRuntime,

    registerEvent,

    registerMetadata,

    registerConfiguration,

    recordFailure,

    /*
    ----------------------------
    Discovery
    ----------------------------
    */

    resolve,

    exists,

    query,

    search,

    dependencyGraph,

    /*
    ----------------------------
    Analytics
    ----------------------------
    */

    statistics,

    metadata,

    health,

    status,

    diagnostics,

    snapshot,

    validate,

    /*
    ----------------------------
    Runtime
    ----------------------------
    */

    bootstrap

};

/*
========================================
BOOTSTRAP RUNTIME

========================================
*/

bootstrap();

/*
========================================
IMMUTABLE PUBLIC API

========================================
*/

deepFreeze(

    Registry

);

/*
========================================
MODULE EXPORT

========================================
*/

module.exports =

    Registry;