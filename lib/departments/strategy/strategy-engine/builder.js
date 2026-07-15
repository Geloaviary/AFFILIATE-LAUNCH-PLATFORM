"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Strategy Department

strategy-engine/

builder.js

Constitutional Rule STBD-001

Campaign Builder

Builds the initial Campaign Workspace from
Strategy inputs.

The Builder NEVER

â€¢ Writes Platform Memory
â€¢ Executes Runtime
â€¢ Creates Production Jobs
â€¢ Updates Portfolio
â€¢ Performs HTTP operations

The Builder ONLY

â€¢ Creates Campaign objects
â€¢ Initializes Workspace
â€¢ Attaches Campaign Package
â€¢ Produces immutable Campaign models

==================================================
*/

const Errors =

    require(

        "../../../quality-assurance-director/errors"

    );

const CampaignPackage =

    require(

        "./campaign-package"

    );

/*
==================================================
Builder Identity

==================================================
*/

const BUILDER =

Object.freeze({

    department:

        "strategy",

    engine:

        "strategy-engine",

    component:

        "builder",

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
Assemble Campaign Model

Strategy Inputs

        â”‚

        â–¼

Campaign Package

        â”‚

        â–¼

Campaign Model

==================================================
*/

function build({

    campaignId,

    workspace,

    createdAt

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    if (

    !workspace

) {

    throw new Errors.ValidationError(

        "Strategy Workspace is required."

    );

}

    

    const campaignPackage =

        CampaignPackage.build({

            workspace,

            campaignId,

            createdAt

        });

    const campaign = {

    id:

        campaignId,

    status:

        "planned",

    strategy:

        structuredClone(

            workspace

        ),

    campaignPackage,

    createdAt

};

    return deepFreeze(

        campaign

    );

}

/*
==================================================
Public Campaign Builder

==================================================
*/

module.exports =

Object.freeze({

    identity:

        BUILDER,

    build

});