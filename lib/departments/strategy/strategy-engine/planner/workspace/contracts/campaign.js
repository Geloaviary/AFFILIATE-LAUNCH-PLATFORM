"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

campaign.js

Constitutional Rule STP-017

Campaign Result

        │
        ▼

Campaign Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Campaign Contract
from the Campaign Selection worker.

This worker NEVER

• Executes planner workers
• Changes campaign decisions
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Campaign Contract for the Strategy
Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.campaign",

    version:

        "1.0.0"

});

/*
==================================================
Utilities
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
Verification
==================================================
*/

function assertCampaign(

    campaign

) {

    if (

        !isObject(

            campaign

        )

    ) {

        throw new Error(

            "Campaign is required."

        );

    }

}

/*
==================================================
Campaign Contract
==================================================
*/

function buildContract(

    campaign

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "campaign",

        payload:

            structuredClone(

                campaign

            ),

        certified:

            false,

        createdAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Runtime
==================================================
*/

function execute({

    campaign

}) {

    assertCampaign(

        campaign

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        campaign:

            buildContract(

                campaign

            )

    });

}

/*
==================================================
Public API
==================================================
*/

module.exports =

Object.freeze({

    execute

});