"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

artifact.js

Constitutional Rule RTA-001

Runtime Artifact

Manager

        │
        ▼

Runtime Results

        │
        ▼

Immutable Runtime Artifact

--------------------------------------------------

Constitutional Responsibility

The Runtime Artifact Builder is the sole
authority responsible for assembling the
immutable Runtime Artifact.

The Runtime Artifact NEVER

• Executes departments
• Reads Platform Memory
• Dispatches work
• Performs business logic

The Runtime Artifact ONLY

• Aggregates runtime planning and dispatch results
• Produces immutable runtime state
• Provides the Runtime Manager output

==================================================
*/

const crypto =

    require(

        "crypto"

    );

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Artifact Identity

==================================================
*/

const ARTIFACT =

Object.freeze({

    department:

        "runtime",

    component:

        "artifact",

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
Build Runtime Artifact

Manager

        │

        ▼

Runtime Planning

        │

        ▼

Immutable Runtime Artifact

==================================================
*/

async function buildArtifact({

    input,

    runtime,

    dispatcher,

    engineering

}) {

    if (

        !isObject(

            input

        )

    ) {

        throw new Errors.ValidationError(

            "Runtime input is required."

        );

    }

    if (

        !isObject(

            runtime

        )

    ) {

        throw new Errors.ValidationError(

            "Runtime planning result is required."

        );

    }

    if (

        !isObject(

            dispatcher

        )

    ) {

        throw new Errors.ValidationError(

            "Dispatcher result is required."

        );

    }

    if (

        !isObject(

            engineering

        )

    ) {

        throw new Errors.ValidationError(

            "Engineering certification is required."

        );

    }

    return deepFreeze({

        artifact:

            Object.freeze({

                id:

                    crypto.randomUUID(),

                type:

                    "runtime-artifact",

                version:

                    1

            }),

        runtime:

            ARTIFACT,

        campaignId:

            input.campaignId,

        command:

            input.command,

        input,

        engineering,

        planning:

            runtime,

        dispatch:

            dispatcher,

        createdAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Runtime Artifact

==================================================
*/

module.exports =

Object.freeze({

    identity:

        ARTIFACT,

    build:

        buildArtifact

});