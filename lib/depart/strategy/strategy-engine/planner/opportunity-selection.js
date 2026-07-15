"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

opportunity-selection.js

Constitutional Rule STP-001

Opportunity Intelligence

        │
        ▼

Strategy Evaluation

        │
        ▼

Selected Opportunity

--------------------------------------------------

Constitutional Responsibility

This planner worker evaluates the
Research Department's certified Winner
and prepares it for campaign planning.

It NEVER

• Performs Research
• Discovers Opportunities
• Builds Campaigns
• Generates Scripts
• Writes Platform Memory
• Mutates Inputs

==================================================
*/

const ENGINE =

Object.freeze({

    department:

        "strategy",

    component:

        "planner.opportunity-selection",

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

function assertWinner(

    winner

) {

    if (

        !isObject(

            winner

        )

    ) {

        throw new Error(

            "Certified Winner is required."

        );

    }

    return winner;

}

/*
==================================================
Opportunity Evaluation

Future versions may include

• Revenue Scoring
• Portfolio Fit
• Competition Weight
• Seasonal Weight
• Business Risk

==================================================
*/

function evaluate(

    winner

) {

    return deepFreeze({

        winner,

        score:

            winner.score ??

            null,

        confidence:

            winner.confidence ??

            null,

        selected:

            true,

        evaluatedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Planner Runtime
==================================================
*/

function execute({

    winner

}) {

    assertWinner(

        winner

    );

    return deepFreeze({

        runtime:

            ENGINE,

        opportunityAnalysis:

            evaluate(

                structuredClone(

                    winner

                )

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