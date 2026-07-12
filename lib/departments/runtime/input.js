"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

input.js

Constitutional Rule RTI-001

Executive Command

        │
        ▼

Runtime Input Builder

        │
        ▼

Immutable Runtime Input

--------------------------------------------------

Constitutional Responsibility

The Runtime Input Builder is the sole authority
responsible for transforming Executive Commands
into immutable Runtime Input.

Runtime Input NEVER

• Executes departments
• Reads Platform Memory
• Dispatches work
• Performs business logic
• Modifies executive commands

Runtime Input ONLY normalizes and certifies
the Executive Command for the Runtime Manager.

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
Runtime Identity

==================================================
*/

const INPUT =

Object.freeze({

    department:

        "runtime",

    component:

        "input",

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
Executive Command Validation

==================================================
*/

function validateCommand(

    command

) {

    if (

        typeof command !==

        "string"

    ) {

        throw new Errors.ValidationError(

            "Executive command is required."

        );

    }

    return command.trim();

}

/*
==================================================
Runtime Input Builder

Executive Command

        │

        ▼

Immutable Runtime Input

==================================================
*/

async function buildInput(

    request = {}

) {

    if (

        !isObject(

            request

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid runtime request."

        );

    }

    const command =

        validateCommand(

            request.command

        );

    return deepFreeze({

        runtime:

            INPUT,

        requestId:

            crypto.randomUUID(),

        command,

        campaignId:

            request.campaignId ||

            null,

        requestedBy:

            request.requestedBy ||

            "executive",

        options:

            deepFreeze({

                ...(request.options || {})

            }),

        createdAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Runtime Input

==================================================
*/

module.exports =

Object.freeze(

    buildInput

);