"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

posting-sequence.js

Constitutional Rule STP-025

Posting Sequence Result

        │
        ▼

Posting Sequence Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Posting Sequence
Contract from the Posting Sequence worker.

This worker NEVER

• Executes planner workers
• Changes the posting sequence
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Posting Sequence Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.posting-sequence",

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

function assertPostingSequence(

    postingSequence

) {

    if (

        !isObject(

            postingSequence

        )

    ) {

        throw new Error(

            "Posting Sequence is required."

        );

    }

}

/*
==================================================
Posting Sequence Contract
==================================================
*/

function buildContract(

    postingSequence

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "postingSequence",

        payload:

            structuredClone(

                postingSequence

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                steps:

                    Array.isArray(

                        postingSequence.steps

                    )

                        ? postingSequence.steps.length

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

    postingSequence

}) {

    assertPostingSequence(

        postingSequence

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        postingSequence:

            buildContract(

                postingSequence

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