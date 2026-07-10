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

Department Manager

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

• Resolves department managers
• Executes departments
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
Resolve Department

Department Name

        │

        ▼

Department Manager

==================================================
*/

function resolveDepartment(

    department

) {

    const manager =

        Registry.resolve(

            department

        );

    if (

        !manager

    ) {

        throw new Errors.ValidationError(

            `Unknown department: ${department}`

        );

    }

    return manager;

}

/*
==================================================
Dispatch Execution Plan

Execution Plan

        │

        ▼

Department Manager

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

                const department =

                    resolveDepartment(

                        plan.department

                    );

                const result =

                    await department.execute({

                        campaignId:

                            plan.campaignId

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

    executionPlan

}) {

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