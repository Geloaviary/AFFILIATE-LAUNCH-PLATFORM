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

Department Contracts

--------------------------------------------------

Constitutional Responsibility

The Runtime Contracts component is the sole
authority responsible for interacting with
department contracts stored in Platform Memory.

The Runtime Contracts NEVER

• Executes departments
• Builds execution plans
• Dispatches work
• Performs business logic

The Runtime Contracts ONLY

• Loads available contracts
• Loads individual contracts
• Normalizes contract access
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
Load Department Contract

==================================================
*/

async function load({

    campaignId,

    department

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    if (

        !department

    ) {

        throw new Errors.ValidationError(

            "Department is required."

        );

    }

    const contracts =

        await loadAvailable({

            campaignId

        });

    return (

        contracts[

            department

        ] ||

        null

    );

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

    load,

    loadAvailable

});