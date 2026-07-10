"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

runtime-engine.js

Constitutional Rule RTE-001

Runtime Contracts

        │
        ▼

Available Contracts

        │
        ▼

Build Execution Plan

        │
        ▼

Dispatch Everything Ready

--------------------------------------------------

Constitutional Responsibility

The Runtime Engine is the sole 
authority responsible for discovering 
executable department contracts made 
available through the Runtime Contracts component.

The Runtime Engine NEVER

• Executes departments
• Performs business logic
• Modifies Platform Memory
• Creates contracts
• Validates department artifacts

The Runtime Engine ONLY

• Discovers contracts
• Builds execution plans
• Schedules executable departments

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

const Contracts =

    require(

        "./contracts"

    );

/*
==================================================
Runtime Identity

==================================================
*/

const ENGINE =

Object.freeze({

    department:

        "runtime",

    component:

        "runtime-engine",

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
Build Execution Plan

Available Contracts

        │

        ▼

Department Registry

        │

        ▼

Execution Plan

==================================================
*/

async function buildExecutionPlan({

    campaignId

}) {

    const availableContracts =

         await Contracts.loadAvailable({

                  campaignId

           });

    const departments =

        Registry.list();

    const executionPlan = [];

    for (

        const department of departments

    ) {

        /*
        ----------------------------------
        Department Contract

        Example

        strategy

        production

        publishing

        ----------------------------------
        */

        const contract =

            availableContracts[

                department.consumes

            ];

        if (

            !contract

        ) {

            continue;

        }

        /*
        ----------------------------------
        Already Running

        ----------------------------------
        */

        if (

            contract.status ===

            "running"

        ) {

            continue;

        }

        /*
        ----------------------------------
        Already Completed

        ----------------------------------
        */

        if (

            contract.status ===

            "completed"

        ) {

            continue;

        }

        /*
        ----------------------------------
        Ready To Execute

        ----------------------------------
        */
         
        executionPlan.push(

    deepFreeze({

        campaignId,

        department:

            department.name,

        contract

    })

);

    }

    return deepFreeze(

        executionPlan

    );

}

/*
==================================================
Runtime Engine

Runtime Engine

        │

        ▼

Runtime Contracts

        │

        ▼

Available Contracts

        │

        ▼

Execution Plan

==================================================
*/

async function execute({

    input

}) {

    if (

        !input ||

        !input.campaignId

    ) {

        throw new Errors.ValidationError(

            "Runtime Input is invalid."

        );

    }

    const executionPlan =

        await buildExecutionPlan({

            campaignId:

                input.campaignId

        });

    return deepFreeze({

        runtime:

            ENGINE,

        campaignId:

            input.campaignId,

        command:

            input.command,

        executionPlan,

        totalDepartments:

            executionPlan.length,

        executedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Runtime Engine

==================================================
*/

module.exports =

Object.freeze({

    identity:

        ENGINE,

    execute

});