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

Dispatcher

        │
        ▼

Department Entrypoint

        │
        ▼

Department Output

--------------------------------------------------

Constitutional Responsibility

The Dispatcher is the sole authority
responsible for dispatching executable
departments.

The Dispatcher NEVER

• Builds execution plans
• Reads Platform Memory
• Makes scheduling decisions
• Performs business logic
• Modifies department contracts

The Dispatcher ONLY

• Resolves runtime registrations
• Invokes department entrypoints
• Passes approved execution context
• Collects execution results

==================================================
*/

const Registry =

    require(

        "./registry"

    );

const Errors =

    require(

        "../quality-assurance-director/errors"

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
Internal Utilities

==================================================
*/

function isObject(

    value

) {

    return (

        value !== null &&

        typeof value ===

            "object"

    );

}

function deepFreeze(

    target,

    visited = new WeakSet()

) {

    if (

        !isObject(

            target

        )

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

        typeof registration.entrypoint !== "function"

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

        typeof plan.department !== "string" ||

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
Dispatch Execution Plan

Execution Plan

        │

        ▼

Department Entrypoint

        │

        ▼

Department Output

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

            async plan => {

                validateExecutionPlanEntry(

                    plan

                );

                const registration =

                     resolveRegistration(

                        plan.department

                    );

                const result =

                     await registration.entrypoint({

                         campaignId:

                            plan.campaignId,

                         contracts:

                             plan.contracts

                     });

                return Object.freeze({

                    department:

                        plan.department,

                    status:

                        "completed",

                    result

                });

            }

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

Department Execution

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

                    "completed"

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

    execute

});