"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

product-intelligence.js

Constitutional Rule STP-004

Product Intelligence

        │
        ▼

Strategic Product Analysis

        │
        ▼

Product Strategy

--------------------------------------------------

Constitutional Responsibility

This planner worker interprets the
certified Product Intelligence produced
by the Research Department and converts
it into product-specific campaign
strategy.

It NEVER

• Performs Research
• Discovers Products
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

        "planner.product-intelligence",

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

function assertProductIntelligence(

    productIntelligence

) {

    if (

        !isObject(

            productIntelligence

        )

    ) {

        throw new Error(

            "Certified Product Intelligence is required."

        );

    }

    return productIntelligence;

}

/*
==================================================
Product Analysis

Future versions may include

• Feature Analysis
• Benefit Analysis
• Pain Point Mapping
• Objection Analysis
• Offer Analysis
• Pricing Analysis
• Competitive Advantage
• CTA Recommendation

==================================================
*/

function analyze(

    productIntelligence

) {

    return deepFreeze({

        productIntelligence,

        product:

            productIntelligence.product ??

            {},

        features:

            productIntelligence.features ??

            [],

        benefits:

            productIntelligence.benefits ??

            [],

        painPoints:

            productIntelligence.painPoints ??

            [],

        objections:

            productIntelligence.objections ??

            [],

        sellingPoints:

            productIntelligence.sellingPoints ??

            [],

        offers:

            productIntelligence.offers ??

            [],

        guarantees:

            productIntelligence.guarantees ??

            [],

        recommendations:

            productIntelligence.recommendations ??

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

    productIntelligence

}) {

    assertProductIntelligence(

        productIntelligence

    );

    return deepFreeze({

        runtime:

            ENGINE,

        productAnalysis:

            analyze(

                structuredClone(

                    productIntelligence

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