"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/

metadata.js

Constitutional Rule STP-027

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
the Strategy Workspace.

==================================================
*/

const METADATA =

Object.freeze({

    department:

        "strategy",

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

function assertCampaign(

    campaign

) {

    if (

        !isObject(

            campaign

        )

    ) {

        throw new Error(

            "Campaign Contract is required."

        );

    }

}

/*
==================================================
Metadata Builder
==================================================
*/

function buildMetadata({

    campaign

}) {

    const payload =

        campaign.payload ?? {};

    return deepFreeze({

        runtime:

            METADATA,

        department:

            "strategy",

        workspaceVersion:

            METADATA.version,

        campaignId:

            payload.campaignId ??

            null,

        campaignName:

            payload.name ??

            null,

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

    campaign

}) {

    assertCampaign(

        campaign

    );

    return deepFreeze({

        runtime:

            METADATA,

        metadata:

            buildMetadata({

                campaign

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