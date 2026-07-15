"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Strategy Department

strategy-engine/

engine.js

Constitutional Rule STEN-001

Strategy Business Engine

Research Artifact

        â”‚

        â–¼

Planner

        â”‚

        â–¼

Workspace

        â”‚

        â–¼

Builder

        â”‚

        â–¼

Campaign

        â”‚

        â–¼

Strategy Result

--------------------------------------------------

Constitutional Responsibility

The Strategy Engine is the sole authority
responsible for executing the Strategy
Department's business intelligence.

The Strategy Engine NEVER

â€¢ Writes Platform Memory
â€¢ Executes Runtime
â€¢ Creates Production Jobs
â€¢ Performs HTTP operations
â€¢ Commits data

The Strategy Engine ONLY

â€¢ Plans campaigns
â€¢ Coordinates business modules
â€¢ Builds campaign models
â€¢ Produces immutable Strategy results

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

        "strategy",

    engine:

        "strategy-engine",

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
Execute Strategy Engine

Strategy Inputs

        â”‚

        â–¼

Strategy Planner

        â”‚

        â–¼

Campaign Model Builder

        â”‚

        â–¼

Strategy Result

==================================================
*/

async function execute({

    campaignId,

    research,

    createdAt

}) {

    if (

        !research

    ) {

        throw new Errors.ValidationError(

            "Research Artifact is required."

        );

    }

    /*
    ----------------------------------
    Campaign Planning

    Future versions of the planner
    will generate campaign angles,
    messaging, scripts, sequencing,
    hooks and CTA.

    ----------------------------------
    */

    const workspace =

    await Planner.execute({

        research

    });

    /*
    ----------------------------------
    Campaign Builder

    ----------------------------------
    */

    const campaign =

    Builder.build({

        campaignId,

        workspace,

        createdAt

    });

    return deepFreeze({

        engine:

            ENGINE,

        workspace,

        campaign,

        executedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Strategy Engine

==================================================
*/

module.exports =

Object.freeze({

    identity:

        ENGINE,

    execute

});