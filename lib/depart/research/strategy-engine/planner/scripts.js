"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/

scripts.js

Constitutional Rule STP-007

Campaign

        │
        ▼

Positioning

        │
        ▼

Marketing Angles

        │
        ▼

Campaign Hooks

        │
        ▼

Script Planning

        │
        ▼

Campaign Scripts

--------------------------------------------------

Constitutional Responsibility

This planner worker transforms approved
Campaign, Positioning,
Marketing Angles and Hooks
into production-ready script plans.

It NEVER

• Performs Research
• Selects Opportunities
• Generates CTA
• Writes Platform Memory
• Mutates Inputs

==================================================
*/

const ShortPlan =
    require("./script-types/short-plan");

const ReviewPlan =
    require("./script-types/review-plan");

const ComparisonPlan =
    require("./script-types/comparison-plan");

const TutorialPlan =
    require("./script-types/tutorial-plan");

const ListiclePlan =
    require("./script-types/listicle-plan");

const ENGINE =

Object.freeze({

    department:

        "strategy",

    component:

        "planner.scripts",

    version:

        "1.0.0"

});

const SCRIPT_PLANNERS =

Object.freeze({

    short:

        ShortPlan,

    review:

        ReviewPlan,

    comparison:

        ComparisonPlan,

    tutorial:

        TutorialPlan,

    listicle:

        ListiclePlan

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

function resolvePlanner(

    type = "short"

) {

    return (

        SCRIPT_PLANNERS[

            String(type)

                .toLowerCase()

        ] ||

        SCRIPT_PLANNERS.short

    );

}

/*
==================================================
Verification
==================================================
*/

function assertInput({

    campaign,

    positioning,

    hooks

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

        hooks

    )

) {

    throw new Error(

        "Campaign Hooks are required."

    );

}

}

/*
==================================================
Script Planning

Future versions may generate AI-powered
30–45 second vertical video scripts.

==================================================
*/

function buildScripts({

    campaign,

    positioning,

    hooks

}) {

    return deepFreeze(

        hooks.map(

            hook => {

                const planner =

                    resolvePlanner(

                        hook.campaign.contentType ??

                        "short"

                    );

                const script =

                    planner.execute({

                        campaign:

                            hook.campaign,

                        positioning:

                            hook.positioning,

                        hook:

                            hook.hook,

                        objective:

                            hook.objective,

                        message:

                            hook.message,

                        emotion:

                            hook.emotion

                    });

                return {

                    angleId:

                        hook.angleId,

                    angleType:

                        hook.angleType,

                    campaign:

                        hook.campaign,

                    positioning:

                        hook.positioning,

                    objective:

                        hook.objective,

                    message:

                        hook.message,

                    emotion:

                        hook.emotion,

                    hook:

                        hook.hook,

                    script

                };

            }

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

    hooks

}) {

    assertInput({

        campaign,

        positioning,

        hooks

    });

    return deepFreeze({

        runtime:

            ENGINE,

        scripts:

            buildScripts({

    campaign:

        structuredClone(

            campaign

        ),

    positioning:

        structuredClone(

            positioning

        ),

    hooks:

        structuredClone(

            hooks 

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