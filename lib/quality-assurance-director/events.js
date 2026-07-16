const RuntimeId =
    require("../identity/runtime");

const Constants =

    require(

        "./constants"

    );


/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Enterprise Event Runtime

Responsible for

• Event Bus
• Event Registry
• Publish / Subscribe
• Event History
• Event Validation
• Runtime Coordination

Constitution:
QA-001

========================================
*/

const Registry = require("./registry");
const ServiceContainer = require("./service");

/*
========================================
VERSION

========================================
*/

const VERSION = Object.freeze({

    runtime: "3.0.0",

    constitution: "QA-001"

});

/*
========================================
EVENT BUS

========================================
*/

const runtime = {

    id:

        RuntimeId.generateEventId(),

    createdAt:

        new Date()

            .toISOString(),

    listeners:

        new Map(),

    history: [],

    metadata:

        new Map(),

    statistics: {

        registrations: 0,

        publications: 0,

        deliveries: 0,

        failures: 0

    },

    initialized:

        false

};

/*
========================================
REGISTER EVENT

========================================
*/

function register(

    event,

    metadata = {}

) {

    if (

        !event ||

        typeof event !==

            "string"

    ) {

        throw new TypeError(

            "Event name is required."

        );

    }

    Registry.registerEvent(

        event,

        Object.freeze({

            event,

            ...metadata,

            registeredAt:

                new Date()

                    .toISOString()

        })

    );

    runtime.statistics
        .registrations++;

    return event;

}

/*
========================================
SUBSCRIBE

========================================
*/

function subscribe(

    event,

    listener

) {

    if (

        typeof listener !==

        "function"

    ) {

        throw new TypeError(

            "Listener must be a function."

        );

    }

    if (

        !runtime.listeners.has(

            event

        )

    ) {

        runtime.listeners.set(

            event,

            new Set()

        );

    }

    runtime.listeners
        .get(event)
        .add(listener);

    return listener;

}

function subscribeRuntime(

    runtimeEngine

) {

    subscribe(

        Constants.EVENT.CONTRACT_COMMITTED,

        async event => {

            await runtimeEngine.observe({

                campaignId:

                    event.payload.campaignId

            });

        }

    );

}

/*
========================================
ONCE

========================================
*/

function once(

    event,

    listener

) {

    async function wrapper(

        payload

    ) {

        unsubscribe(

            event,

            wrapper

        );

        return listener(

            payload

        );

    }

    subscribe(

        event,

        wrapper

    );

    return wrapper;

}

/*
========================================
UNSUBSCRIBE

========================================
*/

function unsubscribe(

    event,

    listener

) {

    if (

        !runtime.listeners.has(

            event

        )

    ) {

        return false;

    }

    return runtime.listeners
        .get(event)
        .delete(listener);

}

/*
========================================
PUBLISH

========================================
*/

async function publish(

    envelope

) {

    if (

        !envelope ||

        typeof envelope !==

            "object"

    ) {

        throw new TypeError(

            "Event envelope is required."

        );

    }

    const event =

        envelope.type;

    if (

        !event

    ) {

        throw new TypeError(

            "Event type is required."

        );

    }

    runtime.statistics.publications++;

    const listeners =

        runtime.listeners.get(

            event

        ) ||

        new Set();

    const started =

        Date.now();

    for (

        const listener of listeners

    ) {

        try {

            await listener(

                envelope

            );

            runtime.statistics
                .deliveries++;

        }

        catch (

            error

        ) {

            runtime.statistics
                .failures++;

            Registry.recordFailure(

                error

            );

        }

    }

    runtime.history.push(

        Object.freeze({

            id:

                RuntimeId.generateEventId(),

            event,

            payload:

                structuredClone(

                    envelope

                ),

            listeners:

                listeners.size,

            duration:

                Date.now() -

                started,

            timestamp:

                new Date()

                    .toISOString()

        })

    );

    return true;

}

/*
========================================
BROADCAST

========================================
*/

async function broadcast(

    payload = {}

) {

    for (

        const event of

        runtime.listeners.keys()

    ) {

        await publish({

            type:

                 event,

            payload,

            publishedAt:

               new Date()

                    .toISOString()

          });

    }

}

/*
========================================
VALIDATE

========================================
*/

function validate() {

    return {

        valid: true,

        listeners:

            runtime.listeners.size,

        registrations:

            runtime.statistics
                .registrations,

        publications:

            runtime.statistics
                .publications

    };

}

/*
========================================
REGISTER METADATA

========================================
*/

function registerMetadata(

    name,

    metadata

) {

    runtime.metadata.set(

        name,

        Object.freeze(

            metadata

        )

    );

    Registry.registerMetadata(

        name,

        metadata

    );

    return metadata;

}

/*
========================================
INITIALIZE

========================================
*/

async function initialize() {

    if (

        runtime.initialized

    ) {

        return runtime;

    }

    runtime.initialized = true;

    runtime.startedAt =

        new Date()

            .toISOString();

    runtime.state =

        "running";

    Registry.registerRuntime(

        "qa-event-runtime",

        {

            id:

                runtime.id,

            startedAt:

                runtime.startedAt,

            version:

                VERSION.runtime

        }

    );

    register(

    "ContractCommitted",

    {

        authority:

            "CommitManager"

    }

);

    await publish({

        type:

            "qa.runtime.initialized",

          payload: {

         runtimeId:

            runtime.id

         },

        publishedAt:

            new Date()

               .toISOString()

     });

    return runtime;

}

/*
========================================
START

========================================
*/

async function start() {

    await initialize();

    await publish({

        type:

            "qa.runtime.started",

        payload: {

            startedAt:

                runtime.startedAt

        },

        publishedAt:

             new Date()

               .toISOString()

    });

    return true;

}

/*
========================================
STOP

========================================
*/

async function stop() {

    await publish({

        type:

            "qa.runtime.stopping",

        payload: {},

        publishedAt:

            new Date()

                .toISOString()

    });

    runtime.state =

        "stopped";

    await publish({

        type:

            "qa.runtime.stopped",

        payload: {},

        publishedAt:

            new Date()

                .toISOString()

    });

    return true;

}

/*
========================================
EXECUTE EVENT

========================================
*/

async function execute(

    event,

    payload = {}

) {

    return publish({

         type:

            event,

          payload,

    publishedAt:

            new Date()

                .toISOString()

      });

}

/*
========================================
EMIT LIFECYCLE EVENT

========================================
*/

async function lifecycle(

    stage,

    payload = {}

) {

    return publish({

        type:

            `qa.lifecycle.${stage}`,

        payload,

        publishedAt:

            new Date()

                 .toISOString()

    });

}

/*
========================================
EMIT MIDDLEWARE EVENT

========================================
*/

async function middleware(

    name,

    stage,

    payload = {}

) {

    return publish({

       type:

            `qa.middleware.${name}.${stage}`,

       payload,

       publishedAt:

           new Date()

                .toISOString()

     });

}

/*
========================================
EMIT HOOK EVENT

========================================
*/

async function hook(

    name,

    stage,

    payload = {}

) {

    return publish({

       type:

           `qa.hook.${name}.${stage}`,

       payload,

       publishedAt:

           new Date()

                .toISOString()

    });
    

}

/*
========================================
EMIT INTEGRATION EVENT

========================================
*/

async function integration(

    department,

    stage,

    payload = {}

) {

    return publish({

        type:

            `qa.integration.${department}.${stage}`,

        payload,

        publishedAt:

           new Date()

                .toISOString()

    });

}

/*
========================================
HEALTH

========================================
*/

function health() {

    return {

        healthy:

            runtime.initialized,

        runtime:

            runtime.state ||

            "stopped",

        listeners:

            runtime.listeners.size,

        publications:

            runtime.statistics
                .publications,

        deliveries:

            runtime.statistics
                .deliveries,

        failures:

            runtime.statistics
                .failures,

        history:

            runtime.history.length,

        startedAt:

            runtime.startedAt ||

            null,

        timestamp:

            new Date()

                .toISOString()

    };

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

    return structuredClone(

        runtime.statistics

    );

}

/*
========================================
RUNTIME STATE

========================================
*/

function runtimeState() {

    return {

        id:

            runtime.id,

        initialized:

            runtime.initialized,

        state:

            runtime.state ||

            "stopped",

        startedAt:

            runtime.startedAt ||

            null,

        listeners:

            runtime.listeners.size,

        history:

            runtime.history.length

    };

}

/*
========================================
EVENT SUMMARY

========================================
*/

function eventSummary() {

    return {

        registeredEvents:

            runtime.statistics
                .registrations,

        listenerGroups:

            runtime.listeners.size,

        publishedEvents:

            runtime.statistics
                .publications,

        deliveredEvents:

            runtime.statistics
                .deliveries,

        historyEntries:

            runtime.history.length,

        metadata:

            [

                ...runtime.metadata.keys()

            ]

    };

}

/*
========================================
EVENT ANALYTICS

========================================
*/

function analytics() {

    const stats =

        runtime.statistics;

    return {

        runtimeId:

            runtime.id,

        runtimeVersion:

            VERSION.runtime,

        constitution:

            VERSION.constitution,

        registrations:

            stats.registrations,

        publications:

            stats.publications,

        deliveries:

            stats.deliveries,

        failures:

            stats.failures,

        successRate:

            stats.publications === 0

                ? 100

                : Number(

                    (

                        stats.deliveries /

                        stats.publications *

                        100

                    ).toFixed(

                        2

                    )

                )

    };

}

/*
========================================
EVENT INTELLIGENCE

========================================
*/

function intelligence() {

    return {

        listeners:

            runtime.listeners.size,

        history:

            runtime.history.length,

        metadata:

            runtime.metadata.size,

        initialized:

            runtime.initialized,

        runtime:

            runtime.state ||

            "stopped"

    };

}

/*
========================================
LISTENER REPORT

========================================
*/

function listenerReport() {

    return {

        totalGroups:

            runtime.listeners.size,

        events:

            [

                ...runtime.listeners.keys()

            ],

        listeners:

            [

                ...runtime.listeners.entries()

            ].map(

                ([

                    event,

                    handlers

                ]) => ({

                    event,

                    listeners:

                        handlers.size

                })

            )

    };

}

/*
========================================
HISTORY REPORT

========================================
*/

function historyReport() {

    return {

        total:

            runtime.history.length,

        recent:

            structuredClone(

                runtime.history.slice(

                    -100

                )

            )

    };

}

/*
========================================
VALIDATION REPORT

========================================
*/

function validationReport() {

    const validation =

        validate();

    return {

        valid:

            validation.valid,

        summary:

            validation,

        timestamp:

            new Date()

                .toISOString()

    };

}

/*
========================================
DIAGNOSTICS

========================================
*/

function diagnostics() {

    return {

        runtime:

            runtimeState(),

        health:

            health(),

        analytics:

            analytics(),

        intelligence:

            intelligence(),

        listeners:

            listenerReport(),

        history:

            historyReport(),

        validation:

            validationReport()

    };

}

/*
========================================
EXECUTIVE REPORT

========================================
*/

function executiveReport() {

    return {

        runtimeId:

            runtime.id,

        runtime:

            runtimeState(),

        analytics:

            analytics(),

        health:

            health(),

        intelligence:

            intelligence(),

        listeners:

            listenerReport(),

        history:

            historyReport(),

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
SNAPSHOT

========================================
*/

function snapshot() {

    return structuredClone({

        id:

            runtime.id,

        initialized:

            runtime.initialized,

        runtime:

            runtime.state ||

            "stopped",

        startedAt:

            runtime.startedAt ||

            null,

        statistics:

            runtime.statistics,

        listeners:

            [

                ...runtime.listeners.keys()

            ],

        metadata:

            [

                ...runtime.metadata.keys()

            ],

        historySize:

            runtime.history.length

    });

}

/*
========================================
METADATA

========================================
*/

function metadata() {

    return {

        module:

            "Enterprise Event Runtime",

        runtime:

            VERSION.runtime,

        constitution:

            VERSION.constitution,

        supports: [

            "event-publishing",

            "event-subscription",

            "broadcast",

            "lifecycle-events",

            "middleware-events",

            "hook-events",

            "integration-events",

            "runtime-health",

            "analytics",

            "diagnostics",

            "immutable-history",

            "executive-reporting"

        ],

        generatedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
STATUS

========================================
*/

function status() {

    return {

        initialized:

            runtime.initialized,

        runtime:

            runtime.state ||

            "stopped",

        healthy:

            health().healthy,

        validated:

            validate().valid,

        version:

            VERSION.runtime

    };

}

/*
========================================
RESET

Testing / Development

========================================
*/

async function reset() {

    await stop();

    runtime.listeners.clear();

    runtime.metadata.clear();

    runtime.history.length = 0;

    runtime.statistics = {

        registrations: 0,

        publications: 0,

        deliveries: 0,

        failures: 0

    };

    runtime.initialized = false;

    runtime.state =

        "stopped";

    runtime.startedAt =

        null;

    await initialize();

    return runtime;

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

const EventRuntime =

    freeze({

        VERSION,

        initialize,

        start,

        stop,

        reset,

        clone,

        freeze,

        register,

        subscribe,

        subscribeRuntime,

        once,

        unsubscribe,

        publish,

        broadcast,

        execute,

        lifecycle,

        middleware,

        hook,

        integration,

        validate,

        registerMetadata,

        health,

        statistics,

        runtimeState,

        eventSummary,

        analytics,

        intelligence,

        listenerReport,

        historyReport,

        validationReport,

        diagnostics,

        executiveReport,

        snapshot,

        metadata,

        status

    });

/*
========================================
EXPORTS

Enterprise Event Runtime

QA-001

========================================
*/

module.exports =

    EventRuntime;