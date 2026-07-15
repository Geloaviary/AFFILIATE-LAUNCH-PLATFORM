"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

niche-positioning.js

Constitutional Rule STP-002

Niche Intelligence

        │
        ▼

Positioning Analysis

        │
        ▼

Strategic Positioning

--------------------------------------------------

Constitutional Responsibility

This planner worker transforms the
certified Niche Intelligence into
strategic market positioning for
campaign planning.

It NEVER

• Performs Research
• Discovers Niches
• Generates Marketing Angles
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

        "planner.niche-positioning",

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

function assertNiche(

    niche

) {

    if (

        !isObject(

            niche

        )

    ) {

        throw new Error(

            "Certified Niche Intelligence is required."

        );

    }

    return niche;

}

/*
==================================================
Positioning Analysis

Future versions may include

• Audience Positioning
• Market Positioning
• Brand Positioning
• Value Proposition
• Competitive Differentiation
• Messaging Direction

==================================================
*/

function analyze(

    niche

) {

    return deepFreeze({

        niche,

        audience:

            niche.audience ??

            {},

        market:

            niche.market ??

            {},

        positioning:

            niche.positioning ??

            {},

        valueProposition:

            niche.valueProposition ??

            {},

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

    niche

}) {

    assertNiche(

        niche

    );

    return deepFreeze({

        runtime:

            ENGINE,

        nicheAnalysis:

            analyze(

                structuredClone(

                    niche

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