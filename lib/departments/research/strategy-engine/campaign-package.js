"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Strategy Department

campaign-package.js

Constitutional Rule STCP-001

Creates the Strategy Campaign Package from the
completed Strategy Workspace.

==================================================
*/

const CAMPAIGN_PACKAGE_BUILDER =

Object.freeze({

    department:

        "strategy",

    component:

        "campaign-package",

    version:

        "1.0.0"

});

function deepFreeze(
    object,
    visited = new WeakSet()
) {

    if (
        object === null ||
        typeof object !== "object"
    ) {

        return object;

    }

    if (
        visited.has(object)
    ) {

        return object;

    }

    visited.add(object);

    Object.freeze(object);

    for (

        const key of Object.keys(object)

    ) {

        deepFreeze(

            object[key],

            visited

        );

    }

    return object;

}

function build({

    workspace,

    campaignId,

    createdAt

}) {

    return deepFreeze({

        builder:

              CAMPAIGN_PACKAGE_BUILDER,

        version:

              CAMPAIGN_PACKAGE_BUILDER.version,

        campaignId,

        status: "planned",

        createdAt,

        runtime: {

            strategy: {

    status:

        "completed",

    workspace:

        true,

    package:

        true,

    startedAt:

        createdAt,

    completedAt:

        createdAt

},

            production: {

                status: "pending",

                artifactId: null,

                startedAt: null,

                completedAt: null

            },

            publishing: {

                status: "pending",

                startedAt: null,

                completedAt: null

            }

        },

        strategy:

            structuredClone(

                   workspace

            ),

        production: null,

        publishing: null,

        productionAssets: [],

        publishingQueue: [],

        publishedAssets: [],

        activity: [

    {

        department:

            "research",

        event:

            "artifact-certified",

        timestamp:

            createdAt

    },

    {

        department:

            "strategy",

        event:

            "workspace-packaged",

        timestamp:

            createdAt

    }

]

    });

}

module.exports =

Object.freeze({

    identity:

        CAMPAIGN_PACKAGE_BUILDER,

    build

});