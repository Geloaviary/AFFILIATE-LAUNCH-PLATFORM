"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

platform-strategy.js

Constitutional Rule STP-011

Campaign

        │
        ▼

Positioning

        │
        ▼

Campaign Scripts

        │
        ▼

Campaign CTA

        │
        ▼

Platform Strategy

--------------------------------------------------

Constitutional Responsibility

This planner worker transforms the
approved Campaign, Positioning,
Scripts and CTA into a platform-
specific publishing strategy.

It NEVER

• Performs Research
• Modifies Campaign Strategy
• Generates Scripts
• Generates CTA
• Publishes Content
• Writes Platform Memory
• Mutates Inputs

==================================================
*/

const ENGINE =

Object.freeze({

    department:

        "strategy",

    component:

        "planner.platform-strategy",

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

    scripts,

    cta

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

    if (

        !Array.isArray(

            cta

        )

    ) {

        throw new Error(

            "Campaign CTA is required."

        );

    }

}

/*
==================================================
Platform Strategy Builder

Future versions may determine

• Platform Adaptation

• Caption Style

• Hashtag Strategy

• Trend Adaptation

• Voice Style

• Video Duration

• Thumbnail Strategy

==================================================
*/

function buildPlatformStrategy({

    campaign,

    positioning,

    scripts,

    cta

}) {

    return deepFreeze({

        campaign:

            structuredClone(

                campaign

            ),

        positioning:

            structuredClone(

                positioning

            ),

        assets:

            Object.freeze({

                scripts:

                    structuredClone(

                        scripts

                    ),

                cta:

                    structuredClone(

                        cta

                    )

            }),

        platforms:

            Object.freeze({

                facebook: {

                    enabled: true,

                    adaptation: "",

                    objective: ""

                },

                instagram: {

                    enabled: true,

                    adaptation: "",

                    objective: ""

                },

                tiktok: {

                    enabled: true,

                    adaptation: "",

                    objective: ""

                },

                youtube: {

                    enabled: true,

                    adaptation: "",

                    objective: ""

                },

                threads: {

                    enabled: false,

                    adaptation: "",

                    objective: ""

                },

                x: {

                    enabled: false,

                    adaptation: "",

                    objective: ""

                },

                pinterest: {

                    enabled: false,

                    adaptation: "",

                    objective: ""

                },

                linkedin: {

                    enabled: false,

                    adaptation: "",

                    objective: ""

                }

            }),

        plannedAt:

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

    campaign,

    positioning,

    scripts,

    cta

}) {

    assertInput({

        campaign,

        positioning,

        scripts,

        cta

    });

    return deepFreeze({

        runtime:

            ENGINE,

        platformStrategy:

            buildPlatformStrategy({

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

                    ),

                cta:

                    structuredClone(

                        cta

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