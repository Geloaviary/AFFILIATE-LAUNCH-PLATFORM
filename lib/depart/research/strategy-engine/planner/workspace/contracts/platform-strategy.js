"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

platform-strategy.js

Constitutional Rule STP-023

Platform Strategy Result

        │
        ▼

Platform Strategy Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Platform Strategy
Contract from the Platform Strategy worker.

This worker NEVER

• Executes planner workers
• Changes platform strategy
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Platform Strategy Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.platform-strategy",

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

function assertPlatformStrategy(

    platformStrategy

) {

    if (

        !isObject(

            platformStrategy

        )

    ) {

        throw new Error(

            "Platform Strategy is required."

        );

    }

}

/*
==================================================
Platform Strategy Contract
==================================================
*/

function buildContract(

    platformStrategy

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "platformStrategy",

        payload:

            structuredClone(

                platformStrategy

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                platforms:

                    Object.keys(

                        platformStrategy.platforms ??

                        {}

                    ).length

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

    platformStrategy

}) {

    assertPlatformStrategy(

        platformStrategy

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        platformStrategy:

            buildContract(

                platformStrategy

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