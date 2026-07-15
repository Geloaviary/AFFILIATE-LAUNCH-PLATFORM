"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

angles.js

Constitutional Rule STP-019

Marketing Angles Result

        │
        ▼

Angles Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Marketing Angles
Contract from the Marketing Angles worker.

This worker NEVER

• Executes planner workers
• Changes marketing angles
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Angles Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.angles",

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

function assertAngles(

    angles

) {

    if (

        !Array.isArray(

            angles

        )

    ) {

        throw new Error(

            "Marketing Angles are required."

        );

    }

}

/*
==================================================
Angles Contract
==================================================
*/

function buildContract(

    angles

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "angles",

        payload:

            structuredClone(

                angles

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                total:

                    angles.length

            }),

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

    angles

}) {

    assertAngles(

        angles

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        angles:

            buildContract(

                angles

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