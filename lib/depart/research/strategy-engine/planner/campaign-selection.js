"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

campaign-selection.js

Constitutional Rule STP-005

Opportunity Analysis

        │
        ▼

Campaign Analysis

        │
        ▼

Campaign Selection

        │
        ▼

Campaign Decision

--------------------------------------------------

Constitutional Responsibility

This planner worker transforms analyzed
business intelligence into the selected
campaign strategy.

It NEVER

• Performs Research
• Discovers Opportunities
• Generates Marketing Angles
• Generates Scripts
• Writes Platform Memory
• Mutates Inputs

==================================================
*/

const crypto =

    require(

        "node:crypto"

    );

const ENGINE =

Object.freeze({

    department:

        "strategy",

    component:

        "planner.campaign-selection",

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

function assertInput({

    opportunityAnalysis,

    campaignAnalysis

}) {

    if (

        !isObject(

            opportunityAnalysis

        )

    ) {

        throw new Error(

            "Opportunity Analysis is required."

        );

    }

    if (

        !isObject(

            campaignAnalysis

        )

    ) {

        throw new Error(

            "Campaign Analysis is required."

        );

    }

}

/*
==================================================
Campaign Selection

Future versions may include

• Campaign Scoring

• Revenue Projection

• Risk Assessment

• Portfolio Fit

• Campaign Priority

• AI Campaign Selection

==================================================
*/

function buildCampaign({

    opportunityAnalysis,

    campaignAnalysis

}) {

    return deepFreeze({

        id:

            null,

        status:

            "planned",

        objective:

            "",

        priority:

            "normal",

        type:

            "",

        opportunity:

            structuredClone(

                opportunityAnalysis

            ),

        intelligence:

            structuredClone(

                campaignAnalysis

            ),

        confidence:

            opportunityAnalysis.confidence ??

            null,

        score:

            opportunityAnalysis.score ??

            null,

        createdAt:

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

    opportunityAnalysis,

    campaignAnalysis

}) {

    assertInput({

        opportunityAnalysis,

        campaignAnalysis

    });

    return deepFreeze({

        runtime:

            ENGINE,

        campaign:

            buildCampaign({

                opportunityAnalysis:

                    structuredClone(

                        opportunityAnalysis

                    ),

                campaignAnalysis:

                    structuredClone(

                        campaignAnalysis

                    )

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