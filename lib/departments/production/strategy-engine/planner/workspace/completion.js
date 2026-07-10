"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/

Completion.js

Constitutional Rule STP-029

Workspace Completion

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Workspace
Completion Record.

This worker records the successful
completion of the Strategy Planner.

It NEVER

• Certifies Department Output
• Certifies Business Contracts
• Calls QAD
• Writes Platform Memory

QAD remains the ONLY constitutional
authority that certifies Department
Contracts for Platform Memory.

==================================================
*/

const COMPLETION =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.completion",

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

function assertContracts(

    contracts

) {

    if (

        !isObject(

            contracts

        )

    ) {

        throw new Error(

            "Workspace Contracts are required."

        );

    }

}

function assertStatistics(

    statistics

) {

    if (

        !isObject(

            statistics

        )

    ) {

        throw new Error(

            "Workspace Statistics are required."

        );

    }

}

/*
==================================================
Planner Completion
==================================================
*/

function buildCompletion({

    contracts,

    statistics

}) {

    return deepFreeze({

        runtime:

            COMPLETION,

        plannerCompleted:

            true,

        workspaceComplete:

            true,

        immutable:

            Object.isFrozen(

                contracts

            ),

        contracts:

            Object.keys(

                contracts

            ).length,

        statisticsVerified:

            isObject(

                statistics

            ),

        completionVersion:

            COMPLETION.version,

        completedAt:

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

    contracts,

    statistics

}) {

    assertContracts(

        contracts

    );

    assertStatistics(

        statistics

    );

    return deepFreeze({

        runtime:

            COMPLETION,

        completion:

             buildCompletion({

                  contracts,

                  statistics

             })

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