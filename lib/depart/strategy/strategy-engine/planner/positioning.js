"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

positioning.js

Constitutional Rule STP-006

Niche Analysis

        │
        ▼

Product Analysis

        │
        ▼

Strategic Positioning

--------------------------------------------------

Constitutional Responsibility

This planner worker transforms
analyzed niche and product intelligence
into campaign positioning.

It NEVER

• Performs Research
• Selects Campaigns
• Generates Marketing Angles
• Writes Platform Memory
• Mutates Inputs

==================================================
*/

const ENGINE =

Object.freeze({

    department:

        "strategy",

    component:

        "planner.positioning",

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

    nicheAnalysis,

    productAnalysis

}) {

    if (

        !isObject(

            nicheAnalysis

        )

    ) {

        throw new Error(

            "Niche Analysis is required."

        );

    }

    if (

        !isObject(

            productAnalysis

        )

    ) {

        throw new Error(

            "Product Analysis is required."

        );

    }

}

/*
==================================================
Positioning Builder

Future versions may include

• Audience Positioning
• Brand Positioning
• Offer Positioning
• Value Proposition
• Market Differentiation
• Messaging Framework

==================================================
*/

function buildPositioning({

    nicheAnalysis,

    productAnalysis

}) {

    return deepFreeze({

        audience:

            structuredClone(

                nicheAnalysis.audience

            ),

        market:

            structuredClone(

                nicheAnalysis.market

            ),

        valueProposition:

            structuredClone(

                nicheAnalysis.valueProposition

            ),

        differentiation: {},

        messaging: {},

        offer: {},

        product:

            structuredClone(

                productAnalysis.product

            ),

        benefits:

            structuredClone(

                productAnalysis.benefits

            ),

        sellingPoints:

            structuredClone(

                productAnalysis.sellingPoints

            ),

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

    nicheAnalysis,

    productAnalysis

}) {

    assertInput({

        nicheAnalysis,

        productAnalysis

    });

    return deepFreeze({

        runtime:

            ENGINE,

        positioning:

            buildPositioning({

                nicheAnalysis:

                    structuredClone(

                        nicheAnalysis

                    ),

                productAnalysis:

                    structuredClone(

                        productAnalysis

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