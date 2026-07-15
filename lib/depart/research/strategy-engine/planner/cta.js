"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

cta.js

Constitutional Rule STP-008

Campaign

        │
        ▼

Positioning

        │
        ▼

Campaign Scripts

        │
        ▼

CTA Planning

        │
        ▼

Campaign CTA

--------------------------------------------------

Constitutional Responsibility

This planner worker transforms approved
Campaign, Positioning and Campaign Scripts
into platform-ready Calls-to-Action.

It NEVER

• Performs Research
• Generates Scripts
• Selects Opportunities
• Writes Platform Memory
• Mutates Inputs

==================================================
*/

const ENGINE =

Object.freeze({

    department:

        "strategy",

    component:

        "planner.cta",

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

    positioning,

    scripts

}) {

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

if (

    !Array.isArray(

        scripts

    )

) {

    throw new Error(

        "Campaign Scripts are required."

    );

  }

}

/*
==================================================
CTA Planning

Future versions may generate AI-powered
affiliate CTAs optimized for each
platform and audience.

==================================================
*/

function buildCTA({

    campaign,

    positioning,

    scripts

}) {

    return deepFreeze(

        scripts.map(

            script => ({

    angleId:

        script.angleId,

    angleType:

        script.angleType,

    campaign:

        script.campaign,

    positioning:

        script.positioning,

    objective:

        script.objective,

    message:

        script.message,

    emotion:

        script.emotion,

    hook:

        script.hook,

    script:

        script.script,

    cta: {

        primary: "",

        urgency: "",

        offer: "",

        affiliateAction: "",

        platformAction: "",

        closing: ""

    }

   })

        )

    );

}

/*
==================================================
Planner Runtime
==================================================
*/

function execute({

    campaign,

    positioning,

    scripts


}) {

    assertInput({

        campaign,

        positioning,

        scripts

    });

    return deepFreeze({

        runtime:

            ENGINE,

        cta:

            buildCTA({

    campaign:

        structuredClone(

            campaign

        ),

    positioning:

        structuredClone(

            positioning

        ),

    scripts:

        structuredClone(

            scripts

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