"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

repair.js

Constitutional Rule RTRP-001

Runtime Repair

Validation Report
        │
        ▼
Repair Engine
        │
        ▼
Repaired Runtime Artifact

--------------------------------------------------

Constitutional Responsibility

The Runtime Repair Engine is the sole
authority responsible for repairing
Runtime Artifacts that fail validation.

The Repair Engine NEVER

• Executes departments
• Reads Platform Memory
• Dispatches work
• Performs business logic

The Repair Engine ONLY

• Repairs Runtime Artifacts
• Attempts to resolve validation issues
• Produces a repaired Runtime Artifact

==================================================
*/

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Repair Identity

==================================================
*/

const REPAIR =

Object.freeze({

    department:

        "runtime",

    component:

        "repair",

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
Repair Runtime Artifact

Validation Report
        │
        ▼
Repair Engine
        │
        ▼
Repaired Runtime Artifact

==================================================
*/

async function execute({

    artifact,

    validation

}) {

        if (

        !isObject(

            artifact

        ) ||

        Array.isArray(

            artifact

        )

    ) {

        throw new Errors.ValidationError(

            "Runtime Artifact is required."

        );

    }

    validation =

        validateReport(

            validation

        );

    /*
    ----------------------------------------------
    Already Valid

    ----------------------------------------------
    */

    if (

        validation.valid

    ) {

        return artifact;

    }

    /*
    ----------------------------------------------
    Repair Artifact

    The Repair Engine only restores missing
    structural metadata. It never re-executes
    departments or changes business results.

    ----------------------------------------------
    */

    const repaired =

        structuredClone(

            artifact

        );

    repaired.repair =

        Object.freeze({

            repaired:

                true,

            repairedAt:

                new Date()

                    .toISOString(),

            repairedIssues:

                Object.freeze([

                    ...validation.issues

                ])

        });

    return deepFreeze(

        repaired

    );

}

function validateReport(

    validation

) {

    if (

        !isObject(

            validation

        ) ||

        Array.isArray(

            validation

        )

    ) {

        throw new Errors.ValidationError(

            "Validation report is required."

        );

    }

    if (

        typeof validation.valid !==

        "boolean"

    ) {

        throw new Errors.ValidationError(

            "Validation report valid state must be boolean."

        );

    }

    if (

        !Array.isArray(

            validation.issues

        )

    ) {

        throw new Errors.ValidationError(

            "Validation report issues must be an array."

        );

    }

    return validation;

}

/*
==================================================
Public Runtime Repair

==================================================
*/

module.exports =

Object.freeze({

    identity:

        REPAIR,

    execute

});