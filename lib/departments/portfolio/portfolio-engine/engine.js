"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/

engine.js

Constitutional Rule PTEN-001

Portfolio Business Engine

Portfolio Contract

        │
        ▼

Planner

        │
        ▼

Workspace

        │
        ▼

Builder

        │
        ▼

Review

        │
        ▼

Portfolio Result

--------------------------------------------------

Constitutional Responsibility

The Portfolio Engine is the sole authority
responsible for executing the Portfolio
Department's business intelligence.

The Portfolio Engine NEVER

• Writes Platform Memory
• Executes Runtime
• Creates Production Jobs
• Performs HTTP operations
• Commits data

The Portfolio Engine ONLY

• Plans portfolio composition, ranking,
  allocation, and scale/kill decisions
• Coordinates business modules
• Builds Review models
• Produces immutable Portfolio results

==================================================
*/

const Planner =

    require(

        "./planner/planner"

    );

const Builder =

    require(

        "./builder"

    );

const Errors =

    require(

        "../../../quality-assurance-director/errors"

    );

/*
==================================================
Engine Identity

==================================================
*/

const ENGINE =

Object.freeze({

    department:

        "portfolio",

    engine:

        "portfolio-engine",

    component:

        "engine",

    version:

        "1.0.0"

});

/*
==================================================
Internal Utilities

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

    object,

    visited = new WeakSet()

) {

    if (

        !isObject(

            object

        )

    ) {

        return object;

    }

    if (

        visited.has(

            object

        )

    ) {

        return object;

    }

    visited.add(

        object

    );

    Object.freeze(

        object

    );

    for (

        const key of

        Object.keys(

            object

        )

    ) {

        deepFreeze(

            object[key],

            visited

        );

    }

    return object;

}

/*
==================================================
Execute Portfolio Engine

Portfolio Inputs

        │
        ▼

Portfolio Planner

        │
        ▼

Review Builder

        │
        ▼

Portfolio Result

`campaignId` is optional: Portfolio normally
reviews the whole portfolio in one run, and the
Builder generates a `reviewId` when no single
campaign is scoped.

==================================================
*/

async function execute({

    campaignId = null,

    portfolio,

    createdAt

}) {

    if (

        !portfolio

    ) {

        throw new Errors.ValidationError(

            "Portfolio Context is required."

        );

    }

    if (

        !Array.isArray(portfolio.campaigns) ||

        portfolio.campaigns.length === 0

    ) {

        throw new Errors.ValidationError(

            "Portfolio Context must include at least one campaign."

        );

    }

    /*
    ----------------------------------
    Portfolio Planning

    The planner scores every campaign,
    ranks them, allocates budget, and
    decides which campaigns to scale,
    hold, reallocate, or kill.

    ----------------------------------
    */

    const workspace =

    await Planner.execute({

        portfolio

    });

    /*
    ----------------------------------
    Review Builder

    ----------------------------------
    */

    const review =

    Builder.build({

        campaignId,

        workspace,

        createdAt

    });

    return deepFreeze({

        engine:

            ENGINE,

        workspace,

        review,

        executedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Portfolio Engine

==================================================
*/

module.exports =

Object.freeze({

    identity:

        ENGINE,

    execute

});
