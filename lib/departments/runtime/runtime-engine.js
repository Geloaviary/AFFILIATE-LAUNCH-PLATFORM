"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

runtime-engine.js

Constitutional Rule RTE-001

Runtime Registry

        │
        ▼

Department Requirements

        │
        ▼

Certified Contract Availability

        │
        ▼

Execution Plan

--------------------------------------------------

Constitutional Responsibility

The Runtime Engine is the sole
Runtime authority responsible for
determining department execution eligibility
from Runtime registrations and certified
contract availability.

The Runtime Engine NEVER

• Executes departments
• Performs business logic
• Modifies Platform Memory
• Creates contracts
• Validates department artifacts

The Runtime Engine ONLY

• Reads runtime registrations
• Evaluates department eligibility
• Verifies required contract availability
• Resolves required contract sets
• Builds execution plans

==================================================
*/

const Registry =

    require(

        "./registry"

    );

const Errors =

    require(

        "../../quality-assurance-director/errors"

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

Runtime Registry

        │

        ▼

Eligibility Evaluation

        │

        ▼

Required Contracts

        │

        ▼

Execution Plan

==================================================
*/

async function buildExecutionPlan({

    campaignId

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    const registrations =

        Registry.list();

    const executionPlan = [];

    for (

        const registration of registrations

    ) {

        /*
        ----------------------------------
        Disabled Department

        Disabled registrations are not
        eligible for Runtime execution.

        ----------------------------------
        */

        if (

            registration.enabled === false

        ) {

            continue;

        }

        /*
        ----------------------------------
        Required Contract Availability

        Departments become eligible only
        when every declared requirement
        exists in Platform Memory.

        ----------------------------------
        */

        const ready =

            await Contracts.hasRequired({

                campaignId,

                requiredContracts:

                    registration.requires

            });

        if (

            !ready

        ) {

            continue;

        }

        /*
        ----------------------------------
        Resolve Required Contract Set

        Runtime provides only the certified
        contracts declared by requires[].

        ----------------------------------
        */

        const contracts =

            await Contracts.loadRequired({

                campaignId,

                requiredContracts:

                    registration.requires

            });

        /*
        ----------------------------------
        Build Execution Plan Entry

        ----------------------------------
        */

        executionPlan.push(

            deepFreeze({

                campaignId,

                department:

                    registration.department,

                contracts

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

        plannedAt:

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