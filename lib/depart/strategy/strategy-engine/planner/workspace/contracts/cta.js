"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

cta.js

Constitutional Rule STP-022

Call-To-Action Result

        │
        ▼

CTA Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Call-To-Action
Contract from the CTA worker.

This worker NEVER

• Executes planner workers
• Changes generated CTAs
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
CTA Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.cta",

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

function assertCTA(

    cta

) {

    if (

        !Array.isArray(

            cta

        )

    ) {

        throw new Error(

            "CTA is required."

        );

    }

}

/*
==================================================
CTA Contract
==================================================
*/

function buildContract(

    cta

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "cta",

        payload:

            structuredClone(

                cta

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                total:

                    cta.length

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

    cta

}) {

    assertCTA(

        cta

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        cta:

            buildContract(

                cta

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