"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

output.js

Constitutional Rule RTO-001

Runtime Output

Runtime Artifact

        │
        ▼

Runtime Output

--------------------------------------------------

Constitutional Responsibility

The Runtime Output component is the sole
authority responsible for publishing the
Runtime Department output.

The Output component NEVER

• Executes departments
• Repairs artifacts
• Reads Platform Memory
• Performs business logic

The Output component ONLY

• Normalizes Runtime output
• Publishes Runtime results
• Produces immutable Runtime responses

==================================================
*/

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Output Identity

==================================================
*/

const OUTPUT =

Object.freeze({

    department:

        "runtime",

    component:

        "output",

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
Publish Runtime Output

Runtime Artifact

        │

        ▼

Runtime Response

==================================================
*/

function publishOutput({

    artifact

}) {

    if (

        !isObject(

            artifact

        )

    ) {

        throw new Errors.ValidationError(

            "Runtime Artifact is required."

        );

    }

    return deepFreeze({

        runtime:

            OUTPUT,

        artifact,

        status:

            "published",

        publishedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Runtime Output

==================================================
*/

module.exports =

Object.freeze({

    identity:

        OUTPUT,

    publish:

        publishOutput

});

