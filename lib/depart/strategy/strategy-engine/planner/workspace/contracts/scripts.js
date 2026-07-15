"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

scripts.js

Constitutional Rule STP-021

Scripts Result

        │
        ▼

Scripts Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Scripts Contract
from the Scripts worker.

This worker NEVER

• Executes planner workers
• Changes generated scripts
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Scripts Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.scripts",

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

function assertScripts(

    scripts

) {

    if (

        !Array.isArray(

            scripts

        )

    ) {

        throw new Error(

            "Scripts are required."

        );

    }

}

/*
==================================================
Scripts Contract
==================================================
*/

function buildContract(

    scripts

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "scripts",

        payload:

            structuredClone(

                scripts

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                total:

                    scripts.length

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

    scripts

}) {

    assertScripts(

        scripts

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        scripts:

            buildContract(

                scripts

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