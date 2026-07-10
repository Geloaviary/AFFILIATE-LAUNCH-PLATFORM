"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

angles.js

Constitutional Rule STP-005

Strategy Intelligence

        │
        ▼

Marketing Angle Planning

        │
        ▼

Five Marketing Angles

--------------------------------------------------

Constitutional Responsibility

This planner worker transforms certified
business intelligence into multiple
marketing approaches for the campaign.

It NEVER

• Performs Research
• Discovers Opportunities
• Writes Scripts
• Generates CTA
• Writes Platform Memory
• Mutates Inputs

==================================================
*/

const ENGINE =

Object.freeze({

    department:

        "strategy",

    component:

        "planner.marketing-angles",

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

    campaign,

    positioning

}) 

{

    if (

    !isObject(

        campaign

    )

) {

    throw new Error(

        "Campaign is required."

    );

}

if (

    !isObject(

        positioning

    )

) {

    throw new Error(

        "Positioning is required."

    );

}

}

/*
==================================================
Angle Planning

Future versions may generate the
angles using AI.

Current responsibility is to build
the constitutional planning structure.

==================================================
*/

function buildMarketingAngles({

   campaign,

   positioning

}) {

    return deepFreeze([

    {

    id: 1,

    type: "problem-solution",

    campaign:

        campaign,

    positioning:

        positioning,

    objective: "",

    message: "",

    emotion: ""

    },

        {

            id: 2,

            type: "benefit",

            campaign:

               campaign,

            positioning:

               positioning,

            objective: "",

            message: "",

            emotion: ""


        },

        {

            id: 3,

            type: "comparison",

            campaign:

               campaign,

            positioning:

               positioning,

            objective: "",

            message: "",

            emotion: ""


        },

        {

            id: 4,

            type: "story",

            campaign:

                 campaign,

            positioning:

                positioning,

            objective: "",

            message: "",

            emotion: ""


        },

        {

            id: 5,

            type: "social-proof",

            campaign:

                campaign,

            positioning:

                positioning,

            objective: "",

            message: "",

            emotion: ""


        }

    ]);

}

/*
==================================================
Planner Runtime
==================================================
*/

function execute({

    campaign,

    positioning

}) {

    assertInput({

    campaign,

    positioning

});

    return deepFreeze({

        runtime:

            ENGINE,

        angles:

            buildMarketingAngles({

        campaign:

             structuredClone(

                 campaign

             ),

        positioning:

              structuredClone(

                positioning

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