"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Platform Memory

manager.js

Constitutional Rule PMM-001

Platform Memory Manager

Platform Memory API

        │
        ▼

Platform Memory Manager

        │
        ▼

Platform Memory Service

--------------------------------------------------

Constitutional Responsibility

The Platform Memory Manager is the sole
coordinator of Platform Memory operations.

The Manager NEVER

• Reads KV directly
• Writes KV directly
• Performs business logic
• Knows department implementations

The Manager ONLY

• Coordinates Platform Memory requests
• Delegates to Platform Memory Service
• Returns immutable results

==================================================
*/

const Service =

    require(

        "./service"

    );

/*
==================================================
Identity

==================================================
*/

const MANAGER =

Object.freeze({

    component:

        "platform-memory-manager",

    version:

        "1.0.0"

});

/*
==================================================
Load Certified Contracts

==================================================
*/

async function loadContracts({

    campaignId

}) {

    return Service.loadContracts({

        campaignId

    });

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

    return Service.loadContract({

        campaignId,

        contract

    });

}

/*
==================================================
Verify Required Contracts

==================================================
*/

async function hasContracts({

    campaignId,

    contracts

}) {

    return Service.hasContracts({

        campaignId,

        contracts

    });

}

/*
==================================================
Public Platform Memory Manager

==================================================
*/

module.exports =

Object.freeze({

    identity:

        MANAGER,

    loadContracts,

    loadContract,

    hasContracts

});