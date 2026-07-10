"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

positioning.js

Constitutional Rule STP-018

Positioning Result

        │
        ▼

Positioning Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Positioning Contract
from the Positioning worker.

This worker NEVER

• Executes planner workers
• Changes positioning decisions
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Positioning Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.positioning",

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

function assertPositioning(

    positioning

) {

    if (

        !isObject(

            positioning

        )

    ) {

        throw new Error(

            "Positioning is required."

        );

    }

}

/*
==================================================
Positioning Contract
==================================================
*/

function buildContract(

    positioning

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "positioning",

        payload:

            structuredClone(

                positioning

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

    positioning

}) {

    assertPositioning(

        positioning

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        positioning:

            buildContract(

                positioning

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