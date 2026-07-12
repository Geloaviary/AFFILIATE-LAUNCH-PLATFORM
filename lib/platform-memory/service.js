"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Platform Memory

service.js

Constitutional Rule PMS-001

Platform Memory Service

Platform Memory Manager

        │
        ▼

Platform Memory Service

        │
        ▼

Platform Memory Adapter

--------------------------------------------------

Constitutional Responsibility

The Platform Memory Service is the sole
authority responsible for managing certified
contracts stored in Platform Memory.

The Service NEVER

• Executes departments
• Performs business logic
• Knows department implementations

The Service ONLY

• Loads certified contracts
• Resolves contract lookups
• Verifies contract availability
• Provides read-only Platform Memory access

==================================================
*/

const PlatformMemoryAdapter =

    require(

        "../quality-assurance-director/platform-memory-adapter"

    );

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

/*
==================================================
Identity

==================================================
*/

const SERVICE =

Object.freeze({

    component:

        "platform-memory-service",

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

        typeof value === "object"

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
Load Certified Contract Catalog

==================================================
*/

async function loadContracts({

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

        await PlatformMemoryAdapter.loadContracts({

            campaignId

        });

    return deepFreeze(

        contracts ||

        {}

    );

}

/*
==================================================
Load Single Certified Contract

==================================================
*/

async function loadContract({

    campaignId,

    contract

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    if (

        !contract

    ) {

        throw new Errors.ValidationError(

            "Contract name is required."

        );

    }

    const resolved =

        await PlatformMemoryAdapter.loadContract({

            campaignId,

            contract

        });

    return deepFreeze(

        resolved ||

        null

    );

}

/*
==================================================
Verify Required Contracts

==================================================
*/

async function hasContracts({

    campaignId,

    contracts = []

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

            contracts

        )

    ) {

        throw new Errors.ValidationError(

            "Contracts must be an array."

        );

    }

    return PlatformMemoryAdapter.hasContracts({

        campaignId,

        contracts

    });

}

/*
==================================================
Public Platform Memory Service

==================================================
*/

module.exports =

Object.freeze({

    identity:

        SERVICE,

    loadContracts,

    loadContract,

    hasContracts

});