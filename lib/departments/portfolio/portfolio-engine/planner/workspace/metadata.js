"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

portfolio-engine/planner/
workspace/

metadata.js

Constitutional Rule PTP-027

Workspace Metadata

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Workspace Metadata.

This worker NEVER

• Executes planner workers
• Modifies contracts
• Writes Platform Memory
• Calls QAD

It ONLY produces metadata describing
the Portfolio Workspace.

==================================================
*/

const METADATA =

Object.freeze({

    department:

        "portfolio",

    component:

        "workspace.metadata",

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

function assertCampaigns(

    campaigns

) {

    if (

        !isObject(

            campaigns

        )

    ) {

        throw new Error(

            "Campaigns Contract is required."

        );

    }

}

/*
==================================================
Metadata Builder
==================================================
*/

function buildMetadata({

    campaigns

}) {

    const payload =

        campaigns.payload ?? {};

    return deepFreeze({

        runtime:

            METADATA,

        department:

            "portfolio",

        workspaceVersion:

            METADATA.version,

        campaignCount:

            payload.count ??

            0,

        generatedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Runtime
==================================================
*/

function execute({

    campaigns

}) {

    assertCampaigns(

        campaigns

    );

    return deepFreeze({

        runtime:

            METADATA,

        metadata:

            buildMetadata({

                campaigns

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