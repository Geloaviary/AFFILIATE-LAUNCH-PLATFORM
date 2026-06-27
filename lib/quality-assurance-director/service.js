/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Enterprise Service Container

Responsibilities

• Service Registration
• Dependency Injection
• Lifecycle Management
• Resolution
• Bootstrapping
• Runtime Management

Discovery is handled by the
Enterprise Runtime Registry.

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

        "Enterprise Service Container"

});

/*
========================================
SERVICE LIFECYCLES

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
SERVICE TYPES

========================================
*/

const SERVICE_TYPE = Object.freeze({

    SERVICE:

        "service",

    MANAGER:

        "manager",

    ENGINE:

        "engine",

    PROVIDER:

        "provider",

    ADAPTER:

        "adapter",

    CONTROLLER:

        "controller"

});

/*
========================================
RESOLUTION MODES

========================================
*/

const RESOLUTION = Object.freeze({

    STRICT:

        "strict",

    OPTIONAL:

        "optional"

});

/*
========================================
CLONE

========================================
*/

function clone(

    value

) {

    return globalThis

        .structuredClone(

            value

        );

}

/*
========================================
ENTERPRISE SERVICE RUNTIME

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

            resolutions: 0,

            instantiations: 0,

            disposals: 0,

            resets: 0

        }

    },

    /*
    ================================
    Runtime Metadata
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
    Service Catalog

    Definition Store

    =================================
    */

    catalog: {

        services:

            new Map()

    },

    /*
    ================================
    Singleton Cache

    Runtime instances.

    =================================
    */

    instances:

        new Map(),

    /*
    ================================
    Scoped Cache

    Future request scope.

    =================================
    */

    scopes:

        new Map(),

    /*
    ================================
    Reserved

    =================================
    */

    extensions:

        new Map()

};

/*
========================================
SERVICE KEY

Canonical identifier.

========================================
*/

function serviceKey(

    type,

    name

) {

    return `${type}:${name}`;

}

/*
========================================
VALIDATE DEFINITION

========================================
*/

function validateDefinition(

    definition

) {

    if (

        definition == null ||

        typeof definition !==

        "object"

    ) {

        throw new TypeError(

            "Service definition must be an object."

        );

    }

    if (

        !Object.values(

            SERVICE_TYPE

        ).includes(

            definition.type

        )

    ) {

        throw new Error(

            `Unsupported service type: ${definition.type}`

        );

    }

    if (

        typeof definition.name !==

        "string" ||

        definition.name.trim() ===

        ""

    ) {

        throw new Error(

            "Service name is required."

        );

    }

    if (

        typeof definition.factory !==

        "function"

    ) {

        throw new Error(

            "Service factory is required."

        );

    }

    if (

        definition.lifecycle &&

        !Object.values(

            LIFECYCLE

        ).includes(

            definition.lifecycle

        )

    ) {

        throw new Error(

            `Unsupported lifecycle: ${definition.lifecycle}`

        );

    }

    return true;

}

/*
========================================
NORMALIZE DEFINITION

========================================
*/

function normalizeDefinition({

    type,

    name,

    factory,

    lifecycle =

        LIFECYCLE.SINGLETON,

    dependencies = [],

    metadata = {}

}) {

    dependencies =

        Array.isArray(

            dependencies

        )

            ? [

                ...new Set(

                    dependencies

                )

            ]

            : [];

    metadata =

        metadata &&

        typeof metadata ===

        "object"

            ? metadata

            : {};

    return deepFreeze({

        id:

            crypto.randomUUID(),

        key:

            serviceKey(

                type,

                name

            ),

        type,

        name,

        factory,

        lifecycle,

        dependencies,

        metadata:

            clone(

                metadata

            ),

        registeredAt:

            new Date()

                .toISOString()

    });

}

/*
========================================
REGISTER

========================================
*/

function register(

    definition

) {

    validateDefinition(

        definition

    );

    const service =

        normalizeDefinition(

            definition

        );

    if (

        runtime.catalog.services.has(

            service.key

        )

    ) {

        throw new Error(

            `Service already registered: ${service.key}`

        );

    }

    runtime.catalog.services.set(

        service.key,

        service

    );

    runtime.state.statistics
        .registrations++;

    return service;

}

/*
========================================
REMOVE

========================================
*/

function remove(

    type,

    name

) {

    const key =

        serviceKey(

            type,

            name

        );

    runtime.instances.delete(

        key

    );

    runtime.scopes.delete(

        key

    );

    return runtime.catalog.services.delete(

        key

    );

}

/*
========================================
EXISTS

========================================
*/

function exists(

    type,

    name

) {

    return runtime.catalog.services.has(

        serviceKey(

            type,

            name

        )

    );

}

/*
========================================
GET DEFINITION

Internal helper.

========================================
*/

function getDefinition(

    type,

    name,

    mode =

        RESOLUTION.STRICT

) {

    const definition =

        runtime.catalog.services.get(

            serviceKey(

                type,

                name

            )

        );

    if (

        definition

    ) {

        return definition;

    }

    if (

        mode ===

        RESOLUTION.OPTIONAL

    ) {

        return null;

    }

    throw new Error(

        `Service not found: ${type}:${name}`

    );

}

/*
========================================
CREATE INSTANCE

========================================
*/

function createInstance(

    definition

) {

    runtime.state.statistics
        .instantiations++;

    return definition.factory(

        ServiceContainer

    );

}

/*
========================================
RESOLVE SINGLETON

========================================
*/

function resolveSingleton(

    definition

) {

    if (

        runtime.instances.has(

            definition.key

        )

    ) {

        return runtime.instances.get(

            definition.key

        );

    }

    const instance =

        createInstance(

            definition

        );

    runtime.instances.set(

        definition.key,

        instance

    );

    return instance;

}

/*
========================================
RESOLVE TRANSIENT

========================================
*/

function resolveTransient(

    definition

) {

    return createInstance(

        definition

    );

}

/*
========================================
RESOLVE

========================================
*/

function resolve(

    type,

    name,

    mode =

        RESOLUTION.STRICT

) {

    runtime.state.statistics
        .resolutions++;

    const definition =

        getDefinition(

            type,

            name,

            mode

        );

    if (

        !definition

    ) {

        return null;

    }

    switch (

        definition.lifecycle

    ) {

        case LIFECYCLE.SINGLETON:

            return resolveSingleton(

                definition

            );

        case LIFECYCLE.TRANSIENT:

            return resolveTransient(

                definition

            );

        case LIFECYCLE.SCOPED:

            return resolveTransient(

                definition

            );

        default:

            throw new Error(

                `Unsupported lifecycle: ${definition.lifecycle}`

            );

    }

}

/*
========================================
SINGLETON

Convenience registration.

========================================
*/

function singleton({

    type =

        SERVICE_TYPE.SERVICE,

    name,

    factory,

    dependencies = [],

    metadata = {}

}) {

    return register({

        type,

        name,

        factory,

        lifecycle:

            LIFECYCLE.SINGLETON,

        dependencies,

        metadata

    });

}

/*
========================================
FACTORY

Transient registration.

========================================
*/

function factory({

    type =

        SERVICE_TYPE.SERVICE,

    name,

    factory,

    dependencies = [],

    metadata = {}

}) {

    return register({

        type,

        name,

        factory,

        lifecycle:

            LIFECYCLE.TRANSIENT,

        dependencies,

        metadata

    });

}

/*
========================================
DISPOSE INSTANCE

========================================
*/

function disposeInstance(

    instance

) {

    if (

        !instance ||

        typeof instance !==

        "object"

    ) {

        return;

    }

    if (

        typeof instance.dispose ===

        "function"

    ) {

        instance.dispose();

        return;

    }

    if (

        typeof instance.destroy ===

        "function"

    ) {

        instance.destroy();

        return;

    }

    if (

        typeof instance.close ===

        "function"

    ) {

        instance.close();

    }

}

/*
========================================
DISPOSE

========================================
*/

function dispose(

    type,

    name

) {

    const key =

        serviceKey(

            type,

            name

        );

    const instance =

        runtime.instances.get(

            key

        );

    if (

        !instance

    ) {

        return false;

    }

    disposeInstance(

        instance

    );

    runtime.instances.delete(

        key

    );

    runtime.scopes.delete(

        key

    );

    runtime.state.statistics
        .disposals++;

    return true;

}

/*
========================================
RESET

========================================
*/

function reset() {

    for (

        const [

            key,

            instance

        ] of runtime.instances

    ) {

        disposeInstance(

            instance

        );

    }

    runtime.instances.clear();

    runtime.scopes.clear();

    runtime.state.statistics
        .resets++;

    return true;

}

/*
========================================
STATISTICS

Immutable runtime statistics.

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

========================================
*/

function health() {

    return Object.freeze({

        healthy:

            true,

        initialized:

            runtime.state.initialized,

        services:

            runtime.catalog.services

                .size,

        instances:

            runtime.instances

                .size,

        scopes:

            runtime.scopes

                .size,

        checkedAt:

            new Date()

                .toISOString()

    });

}

/*
========================================
STATUS

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

        services:

            runtime.catalog.services

                .size,

        singletonInstances:

            runtime.instances

                .size,

        scopes:

            runtime.scopes

                .size

    });

}

/*
========================================
SNAPSHOT

========================================
*/

function snapshot() {

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

            services:

                runtime.catalog.services

                    .size

        },

        instances:

            runtime.instances

                .size,

        scopes:

            runtime.scopes

                .size

    });

}

/*
========================================
VALIDATE

Runtime self validation.

========================================
*/

function validate() {

    const errors = [];

    if (

        !(

            runtime.catalog.services

            instanceof Map

        )

    ) {

        errors.push(

            "Invalid service catalog."

        );

    }

    if (

        !(

            runtime.instances

            instanceof Map

        )

    ) {

        errors.push(

            "Invalid instance cache."

        );

    }

    if (

        !(

            runtime.scopes

            instanceof Map

        )

    ) {

        errors.push(

            "Invalid scope cache."

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
BOOTSTRAP

========================================
*/

function bootstrap() {

    const report =

        validate();

    if (

        !report.valid

    ) {

        throw new Error(

            "Service Container bootstrap failed."

        );

    }

    runtime.state.initialized =

        true;

    return true;

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
CONTAINER API

Late-bound public API reference.

Prevents forward-reference
coupling during service
construction.

========================================
*/

let containerApi = null;

/*
========================================
ENTERPRISE SERVICE CONTAINER

Public Runtime

========================================
*/

const ServiceContainer = {

    /*
    ----------------------------
    Registration
    ----------------------------
    */

    register,

    remove,

    singleton,

    factory,

    /*
    ----------------------------
    Resolution
    ----------------------------
    */

    resolve,

    exists,

    /*
    ----------------------------
    Lifecycle
    ----------------------------
    */

    dispose,

    reset,

    /*
    ----------------------------
    Analytics
    ----------------------------
    */

    statistics,

    metadata,

    health,

    status,

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
CONNECT RUNTIME API

========================================
*/

containerApi =

    ServiceContainer;

/*
========================================
BOOTSTRAP

========================================
*/

bootstrap();

/*
========================================
IMMUTABLE PUBLIC API

========================================
*/

deepFreeze(

    ServiceContainer

);

/*
========================================
MODULE EXPORT

========================================
*/

module.exports =

    ServiceContainer;

    