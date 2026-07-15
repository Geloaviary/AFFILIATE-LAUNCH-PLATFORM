"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

optimization.js

Constitutional Rule STP-026

Optimization Result

        │
        ▼

Optimization Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Optimization
Contract from the Optimization worker.

This worker NEVER

• Executes planner workers
• Changes optimization decisions
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Optimization Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.optimization",

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

function assertOptimization(

    optimization

) {

    if (

        !isObject(

            optimization

        )

    ) {

        throw new Error(

            "Optimization is required."

        );

    }

}

/*
==================================================
Optimization Contract
==================================================
*/

function buildContract(

    optimization

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "optimization",

        payload:

            structuredClone(

                optimization

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                recommendations:

                    Array.isArray(

                        optimization.recommendations

                    )

                        ? optimization.recommendations.length

                        : 0

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

    optimization

}) {

    assertOptimization(

        optimization

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        optimization:

            buildContract(

                optimization

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