"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

contracts.js

Constitutional Rule RTCN-001

Runtime Contracts

Runtime

        │
        ▼

Platform Memory

        │
        ▼

Certified Contract Catalog

--------------------------------------------------

Constitutional Responsibility

The Runtime Contracts component is the sole
Runtime authority responsible for resolving
certified contracts stored in Platform Memory.

The Runtime Contracts NEVER

• Executes departments
• Builds execution plans
• Dispatches work
• Performs business logic

The Runtime Contracts ONLY

• Loads available certified contracts
• Resolves required contract sets
• Verifies required contract availability
• Provides immutable contract data

==================================================
*/

const PlatformMemory =

    require(

        "../../lib/platform-memory"

    );

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

/*
==================================================
Contracts Identity

==================================================
*/

const CONTRACTS =

Object.freeze({

    department:

        "runtime",

    component:

        "contracts",

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

    object,

    visited = new WeakSet()

) {

    if (

        !isObject(

            object

        )

    ) {

        return object;

    }

    if (

        visited.has(

            object

        )

    ) {

        return object;

    }

    visited.add(

        object

    );

    Object.freeze(

        object

    );

    for (

        const key of

        Object.keys(

            object

        )

    ) {

        deepFreeze(

            object[key],

            visited

        );

    }

    return object;

}

/*
==================================================
Load Available Contracts

Platform Memory

        │

        ▼

contracts/

==================================================
*/

async function loadAvailable({

    campaignId

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    const contracts =

        await PlatformMemory.loadContracts({

            campaignId

        });

    return deepFreeze(

        contracts ||

        {}

    );

}

/*
==================================================
Load Required Contracts

Platform Memory

        │

        ▼

Certified Contract Catalog

        │

        ▼

Required Contract Set

==================================================
*/

async function loadRequired({

    campaignId,

    requiredContracts = []

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    if (

        !Array.isArray(

            requiredContracts

        )

    ) {

        throw new Errors.ValidationError(

            "Required contracts must be an array."

        );

    }

    const available =

        await loadAvailable({

            campaignId

        });

    const resolved = {};

    for (

        const contractName of

        requiredContracts

    ) {

        if (

            contractName in

            available

        ) {

            resolved[

                contractName

            ] =

                available[

                    contractName

                ];

        }

    }

    return deepFreeze(

        resolved

    );

}

/*
==================================================
Verify Required Contracts

Required Contracts

        │

        ▼

Certified Contract Catalog

        │

        ▼

Ready?

==================================================
*/

async function hasRequired({

    campaignId,

    requiredContracts = []

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    if (

        !Array.isArray(

            requiredContracts

        )

    ) {

        throw new Errors.ValidationError(

            "Required contracts must be an array."

        );

    }

    return PlatformMemory.hasContracts({

        campaignId,

        contracts:

            requiredContracts

    });

}

/*
==================================================
Public Runtime Contracts

==================================================
*/

module.exports =

Object.freeze({

    identity:

        CONTRACTS,

    loadAvailable,

    loadRequired,

    hasRequired

});