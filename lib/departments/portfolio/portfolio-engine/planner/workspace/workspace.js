"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

portfolio-engine/planner/
workspace/

workspace.js

Constitutional Rule PTP-030

Portfolio Workspace

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Portfolio Workspace.

It NEVER

• Executes planner workers
• Builds contracts
• Calculates statistics
• Performs verification
• Calls QAD
• Writes Platform Memory

It ONLY assembles the completed
Workspace Components into one immutable
Portfolio Workspace.

==================================================
*/

const WORKSPACE =

Object.freeze({

    department:

        "portfolio",

    component:

        "workspace",

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

function assertWorkspaceComponent(

    component,

    name

) {

    if (

        !isObject(

            component

        )

    ) {

        throw new Error(

            `${name} is required.`

        );

    }

}

/*
==================================================
Workspace Builder
==================================================
*/

function buildWorkspace({

    metadata,

    contracts,

    statistics,

    completion

}) {

    return deepFreeze({

        runtime:

            WORKSPACE,

        metadata,

        contracts,

        statistics,

        completion

    });

}

/*
==================================================
Runtime
==================================================
*/

function execute({

    metadata,

    contracts,

    statistics,

    completion

}) {

    assertWorkspaceComponent(

        metadata,

        "Workspace Metadata"

    );

    assertWorkspaceComponent(

        contracts,

        "Workspace Contracts"

    );

    assertWorkspaceComponent(

        statistics,

        "Workspace Statistics"

    );

    assertWorkspaceComponent(

        completion,

       "Workspace Completion"

    );

    return deepFreeze({

        runtime:

            WORKSPACE,

        workspace:

            buildWorkspace({

                metadata,

                contracts,

                statistics,

                completion

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