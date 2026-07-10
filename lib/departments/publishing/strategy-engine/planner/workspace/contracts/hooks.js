"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

hooks.js

Constitutional Rule STP-020

Hooks Result

        │
        ▼

Hooks Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Hooks Contract
from the Hooks worker.

This worker NEVER

• Executes planner workers
• Changes generated hooks
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Hooks Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.hooks",

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

function assertHooks(

    hooks

) {

    if (

        !Array.isArray(

            hooks

        )

    ) {

        throw new Error(

            "Hooks are required."

        );

    }

}

/*
==================================================
Hooks Contract
==================================================
*/

function buildContract(

    hooks

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "hooks",

        payload:

            structuredClone(

                hooks

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                total:

                    hooks.length

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

    hooks

}) {

    assertHooks(

        hooks

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        hooks:

            buildContract(

                hooks

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