"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

dispatcher.js

Constitutional Rule RTD-001

Execution Plan

        │
        ▼

Execution Fingerprint

        │
        ▼

Execution Reservation

        │
        ▼

Department Entrypoint

        │
        ▼

Execution State

        │
        ▼

Department Output

--------------------------------------------------

Constitutional Responsibility

The Dispatcher is the sole Runtime authority
responsible for dispatching executable
departments through the certified
Execution Ledger.

The Dispatcher NEVER

• Builds execution plans
• Reads Platform Memory
• Makes scheduling decisions
• Performs department business logic
• Modifies department contracts
• Certifies Department Output
• Commits Department Output

The Dispatcher ONLY

• Resolves runtime registrations
• Builds execution fingerprints
• Reserves eligible executions
• Invokes department entrypoints
• Passes approved execution context
• Marks executions completed
• Marks executions failed
• Collects execution results

==================================================
*/

const Registry =

    require(

        "./registry"

    );

const ExecutionLedger =

    require(

        "./execution-ledger"

    );

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Dispatcher Identity

==================================================
*/

const DISPATCHER =

Object.freeze({

    department:

        "runtime",

    component:

        "dispatcher",

    version:

        "1.0.0"

});

/*
==================================================
Dispatch Status

==================================================
*/

const STATUS =

Object.freeze({

    COMPLETED:

        "completed",

    FAILED:

        "failed",

    SKIPPED:

        "skipped"

});

/*
==================================================
Internal Utilities

==================================================
*/

function isObject(

    value

) {

    return (

        value !== null &&

        typeof value ===

            "object" &&

        !Array.isArray(

            value

        )

    );

}

function deepFreeze(

    target,

    visited = new WeakSet()

) {

    if (

        target === null ||

        typeof target !==

            "object"

    ) {

        return target;

    }

    if (

        visited.has(

            target

        )

    ) {

        return target;

    }

    visited.add(

        target

    );

    Object.freeze(

        target

    );

    for (

        const key of Object.keys(

            target

        )

    ) {

        deepFreeze(

            target[key],

            visited

        );

    }

    return target;

}

/*
==================================================
Resolve Runtime Registration

Department Identity

        │

        ▼

Runtime Registration

==================================================
*/

function resolveRegistration(

    department

) {

    const registration =

        Registry.resolve(

            department

        );

    if (

        !registration ||

        typeof registration.entrypoint !==

            "function"

    ) {

        throw new Errors.ValidationError(

            `Invalid runtime registration: ${department}`

        );

    }

    return registration;

}

/*
==================================================
Validate Execution Plan Entry

Execution Plan Entry

        │

        ▼

Dispatch Context

==================================================
*/

function validateObservation(

    observation

) {

    if (

        !isObject(

            observation,

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid runtime observation."

        );

    }

    if (

        typeof observation.department !==

            "string" ||

        observation.department.length === 0

    ) {

        throw new Errors.ValidationError(

            "Observation department is required."

        );

    }

    if (

        !observation.campaignId

    ) {

        throw new Errors.ValidationError(

            `Campaign ID is required for department "${observation.department}".`

        );

    }

    if (

        !isObject(

            observation.contracts

        )

    ) {

        throw new Errors.ValidationError(

            `Approved contracts are required for department "${observation.department}".`

        );

    }

}

/*
==================================================
Build Execution Fingerprint

Approved execution context is delegated
to the certified Execution Ledger.

==================================================
*/

function buildExecutionFingerprint(

    observation,

) {

    return ExecutionLedger

        .buildFingerprint({

            campaignId:

                observation.campaignId,

            department:

                observation.department,

            contracts:

                observation.contracts

        });

}

/*
==================================================
Build Skipped Result

A running or completed execution fingerprint
is not dispatched again.

==================================================
*/

function buildSkippedResult({

    observation,

    fingerprint

}) {

    return deepFreeze({

        department:

            observation.department,

        campaignId:

            observation.campaignId,

        fingerprint,

        status:

            STATUS.SKIPPED,

        reason:

            "execution-not-eligible",

        result:

            null

    });

}

/*
==================================================
Build Completed Result

==================================================
*/

function buildCompletedResult({

    observation,

    fingerprint,

    execution,

    result

}) {

    return deepFreeze({

        department:

            observation.department,

        campaignId:

           observation.campaignId,

        fingerprint,

        status:

            STATUS.COMPLETED,

        attempt:

            execution.attempt,

        result

    });

}

/*
==================================================
Build Failed Result

==================================================
*/

function buildFailedResult({

    observation,

    fingerprint,

    execution,

    error

}) {

    return deepFreeze({

        department:

            observation.department,

        campaignId:

            observation.campaignId,

        fingerprint,

        status:

            STATUS.FAILED,

        attempt:

            execution.attempt,

        error:

            deepFreeze({

                name:

                    error &&

                    typeof error.name ===

                        "string"

                        ? error.name

                        : "Error",

                message:

                    error &&

                    typeof error.message ===

                        "string"

                        ? error.message

                        : "Department execution failed."

            }),

        result:

            null

    });

}

/*
==================================================
Dispatch Department

Execution Plan Entry

        │

        ▼

Execution Fingerprint

        │

        ▼

Atomic Reservation

        │

        ▼

Department Entrypoint

        │

        ├──────────────┐

        ▼              ▼

Completed           Failed

==================================================
*/

async function dispatchObservation(

    observation

) {

    validateObservation(

        observation

    );

    if (

    observation.status !==

        "ready"

) {

    return deepFreeze({

        department:

            observation.department,

        campaignId:

            observation.campaignId,

        status:

            STATUS.SKIPPED,

        reason:

            "department-not-ready",

        result:

            null

    });

}

    const registration =

        resolveRegistration(

            observation.department

        );

    const fingerprint =

        buildExecutionFingerprint(

            observation

        );

    let execution;

    try {

        execution =

            await ExecutionLedger

                .reserve({

                    campaignId:

                        observation.campaignId,

                    department:

                        observation.department,

                    fingerprint

                });

    } catch (

        error

    ) {

        const eligible =

            await ExecutionLedger

                .canExecute({

                    campaignId:

                        observation.campaignId,

                    department:

                        observation.department,

                    fingerprint

                });

        if (

            eligible === false

        ) {

            return buildSkippedResult({

               observation,

                fingerprint

            });

        }

        throw error;

    }

    try {

        const result =

            await registration

                .entrypoint({

                    campaignId:

                       observation.campaignId,

                    contracts:

                       observation.contracts

                });

        await ExecutionLedger

            .complete({

                campaignId:

                    observation.campaignId,

                department:

                    observation.department,

                fingerprint

            });

        return buildCompletedResult({

            observation,

            fingerprint,

            execution,

            result

        });

    } catch (

        error

    ) {

        await ExecutionLedger

            .fail({

                campaignId:

                   observation.campaignId,

                department:

                    observation.department,

                fingerprint,

                error

            });

        return buildFailedResult({

            observation,

            fingerprint,

            execution,

            error

        });

    }

}

/*
==================================================
Dispatch Execution observation

Execution observation

        │

        ▼

Concurrent Department Dispatch

        │

        ▼

Execution Results

==================================================
*/

async function dispatch(

    observations = []

) {

    if (

        !Array.isArray(

            observations

        )

    ) {

        throw new Errors.ValidationError(

           "Runtime observations must be an array."

        );

    }

    const executions =

    observations.map(

        observation =>

            dispatchObservation(

                observation

            )

    );

    return deepFreeze(

        await Promise.all(

            executions

        )

    );

}

/*
==================================================
Runtime Dispatcher

Execution Plan

        │

        ▼

Ledger Protected Execution

        │

        ▼

Execution Results

==================================================
*/

async function execute({

    observations = []

} = {}) {

    const results =

        await dispatch(

            observations

        );

    return deepFreeze({

        runtime:

            DISPATCHER,

        totalObserved:

            observations.length,

        totalCompleted:

            results.filter(

                result =>

                    result.status ===

                    STATUS.COMPLETED

            ).length,

        totalFailed:

            results.filter(

                result =>

                    result.status ===

                    STATUS.FAILED

            ).length,

        totalSkipped:

            results.filter(

                result =>

                    result.status ===

                    STATUS.SKIPPED

            ).length,

        results,

        observedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Runtime Dispatcher

==================================================
*/

module.exports =

Object.freeze({

    identity:

        DISPATCHER,

    status:

        STATUS,

    dispatch,

    dispatchObservation,

    execute

});