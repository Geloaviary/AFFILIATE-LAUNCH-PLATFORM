"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

validator.js

Constitutional Rule RTV-001

Runtime Validation

Runtime Artifact

        │
        ▼

Validation

        │
        ▼

Certification

--------------------------------------------------

Constitutional Responsibility

The Runtime Validator is the sole authority
responsible for validating Runtime Artifacts.

The Validator NEVER

• Executes departments
• Repairs artifacts
• Dispatches work
• Reads Platform Memory

The Validator ONLY

• Validates Runtime Artifacts
• Detects structural defects
• Certifies Runtime integrity

==================================================
*/

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

/*
==================================================
Validator Identity

==================================================
*/

const VALIDATOR =

Object.freeze({

    department:

        "runtime",

    component:

        "validator",

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
Validate Runtime Artifact

Runtime Artifact

        │

        ▼

Validation Report

==================================================
*/

async function execute({

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

    const issues = [];

    /*
    ----------------------------------------------
    Artifact Identity

    ----------------------------------------------
    */

    if (

        !artifact.artifact

    ) {

        issues.push(

            "Missing artifact descriptor."

        );

    }

    /*
    ----------------------------------------------
    Runtime Input

    ----------------------------------------------
    */

    if (

        !artifact.input

    ) {

        issues.push(

            "Missing runtime input."

        );

    }

    /*
    ----------------------------------------------
    Runtime Execution

    ----------------------------------------------
    */

    if (

        !artifact.execution

    ) {

        issues.push(

            "Missing runtime execution."

        );

    }

    /*
    ----------------------------------------------
    Dispatcher Result

    ----------------------------------------------
    */

    if (

        !artifact.dispatch

    ) {

        issues.push(

            "Missing dispatcher result."

        );

    }

    /*
    ----------------------------------------------
    Engineering Certification

    ----------------------------------------------
    */

    if (

        !artifact.engineering

    ) {

        issues.push(

            "Missing engineering certification."

        );

    }

    return deepFreeze({

        validator:

            VALIDATOR,

        valid:

            issues.length === 0,

        issues,

        validatedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Public Runtime Validator

==================================================
*/

module.exports =

Object.freeze({

    identity:

        VALIDATOR,

    execute

});

