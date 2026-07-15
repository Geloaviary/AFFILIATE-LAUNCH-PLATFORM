"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

campaign-intelligence.js

Constitutional Rule STP-003

Campaign Intelligence

        │
        ▼

Strategic Campaign Analysis

        │
        ▼

Campaign Direction

--------------------------------------------------

Constitutional Responsibility

This planner worker interprets the
certified Campaign Intelligence produced
by the Research Department and converts
it into strategic campaign guidance.

It NEVER

• Performs Research
• Discovers Competitors
• Creates Marketing Angles
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

        "planner.campaign-intelligence",

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

function assertCampaignIntelligence(

    campaignIntelligence

) {

    if (

        !isObject(

            campaignIntelligence

        )

    ) {

        throw new Error(

            "Certified Campaign Intelligence is required."

        );

    }

    return campaignIntelligence;

}

/*
==================================================
Campaign Analysis

Future versions may include

• Competitor Analysis
• Campaign Pattern Analysis
• Messaging Analysis
• Offer Analysis
• Funnel Analysis
• Winning Campaign Detection

==================================================
*/

function analyze(

    campaignIntelligence

) {

    return deepFreeze({

        campaignIntelligence,

        competitors:

            campaignIntelligence.competitors ??

            [],

        winningCampaigns:

            campaignIntelligence.winningCampaigns ??

            [],

        messaging:

            campaignIntelligence.messaging ??

            {},

        opportunities:

            campaignIntelligence.opportunities ??

            [],

        recommendations:

            campaignIntelligence.recommendations ??

            [],

        analyzedAt:

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

    campaignIntelligence

}) {

    assertCampaignIntelligence(

        campaignIntelligence

    );

    return deepFreeze({

        runtime:

            ENGINE,

        campaignAnalysis:

            analyze(

                structuredClone(

                    campaignIntelligence

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