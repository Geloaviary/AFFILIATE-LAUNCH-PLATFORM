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

function validateExecutionPlanEntry(

    plan

) {

    if (

        !isObject(

            plan

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid execution plan entry."

        );

    }

    if (

        typeof plan.department !==

            "string" ||

        plan.department.length === 0

    ) {

        throw new Errors.ValidationError(

            "Execution plan department is required."

        );

    }

    if (

        !plan.campaignId

    ) {

        throw new Errors.ValidationError(

            `Campaign ID is required for department "${plan.department}".`

        );

    }

    if (

        !isObject(

            plan.contracts

        )

    ) {

        throw new Errors.ValidationError(

            `Approved contracts are required for department "${plan.department}".`

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

    plan

) {

    return ExecutionLedger

        .buildFingerprint({

            campaignId:

                plan.campaignId,

            department:

                plan.department,

            contracts:

                plan.contracts

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

    plan,

    fingerprint

}) {

    return deepFreeze({

        department:

            plan.department,

        campaignId:

            plan.campaignId,

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

    plan,

    fingerprint,

    execution,

    result

}) {

    return deepFreeze({

        department:

            plan.department,

        campaignId:

            plan.campaignId,

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

    plan,

    fingerprint,

    execution,

    error

}) {

    return deepFreeze({

        department:

            plan.department,

        campaignId:

            plan.campaignId,

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

async function dispatchDepartment(

    plan

) {

    validateExecutionPlanEntry(

        plan

    );

    const registration =

        resolveRegistration(

            plan.department

        );

    const fingerprint =

        buildExecutionFingerprint(

            plan

        );

    let execution;

    try {

        execution =

            await ExecutionLedger

                .reserve({

                    campaignId:

                        plan.campaignId,

                    department:

                        plan.department,

                    fingerprint

                });

    } catch (

        error

    ) {

        const eligible =

            await ExecutionLedger

                .canExecute({

                    campaignId:

                        plan.campaignId,

                    department:

                        plan.department,

                    fingerprint

                });

        if (

            eligible === false

        ) {

            return buildSkippedResult({

                plan,

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

                        plan.campaignId,

                    contracts:

                        plan.contracts

                });

        await ExecutionLedger

            .complete({

                campaignId:

                    plan.campaignId,

                department:

                    plan.department,

                fingerprint

            });

        return buildCompletedResult({

            plan,

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

                    plan.campaignId,

                department:

                    plan.department,

                fingerprint,

                error

            });

        return buildFailedResult({

            plan,

            fingerprint,

            execution,

            error

        });

    }

}

/*
==================================================
Dispatch Execution Plan

Execution Plan

        │

        ▼

Concurrent Department Dispatch

        │

        ▼

Execution Results

==================================================
*/

async function dispatch(

    executionPlan = []

) {

    if (

        !Array.isArray(

            executionPlan

        )

    ) {

        throw new Errors.ValidationError(

            "Execution plan must be an array."

        );

    }

    const executions =

        executionPlan.map(

            plan =>

                dispatchDepartment(

                    plan

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

    executionPlan = []

} = {}) {

    const results =

        await dispatch(

            executionPlan

        );

    return deepFreeze({

        runtime:

            DISPATCHER,

        totalDispatched:

            executionPlan.length,

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

        dispatchedAt:

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

    execute

});