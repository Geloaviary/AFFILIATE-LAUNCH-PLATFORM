"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

output.js

Constitutional Rule SD-009

Strategy Artifact

        │
        ▼

Department Contracts

        │
        ▼

Submission Manager

        │
        ▼

Platform Memory

==================================================
*/

const SubmissionManager =

    require(

        "../quality-assurance-director/submission-manager"

    );

const {

    buildSubmissionContext,

    buildDepartmentOutput

} = require(

    "../quality-assurance-director/output"

);

const {

    assertStrategyArtifact,

    summarizeStrategyArtifact

} = require(

    "./artifact"

);

const {

    assertContracts

} = require(

    "./contracts"

);

/*
==================================================
Runtime Identity
==================================================
*/

const OUTPUT =

Object.freeze({

    department:

        "strategy",

    component:

        "output",

    version:

        "2.0.0"

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

        !isObject(target)

    ) {

        return target;

    }

    if (

        visited.has(target)

    ) {

        return target;

    }

    visited.add(target);

    Object.freeze(target);

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
Department Output Runtime

Strategy Artifact

        +

Department Contracts

        │

        ▼

Submission Manager

        │

        ▼

Committed Department Output

==================================================
*/

async function execute({

    artifact,

    contracts,

    options = {}

}) {

    /*
    ----------------------------------
    Constitutional Verification
    ----------------------------------
    */

    assertStrategyArtifact(

        artifact

    );

    assertContracts(

        contracts

    );

    /*
    ----------------------------------
    Build Submission Context
    ----------------------------------
    */

    const submission =

        buildSubmissionContext({

            artifact,

            contracts,

            options

        });

    /*
    ----------------------------------
    Constitutional Submission
    ----------------------------------
    */

    const outcome =

        await SubmissionManager.submit(

            submission

        );

    /*
    ----------------------------------
    Department Output
    ----------------------------------
    */

    return buildDepartmentOutput({

        artifact,

        contracts,

        submission:

            outcome

    });

}

/*
==================================================
Department Output Summary

==================================================
*/

function summarizeOutput(

    output

) {

    return deepFreeze({

        artifact:

            summarizeStrategyArtifact(

                output.artifact

            ),

        committed:

            Boolean(

                output.submission?.committed

            ),

        certified:

            Boolean(

                output.submission?.certified

            ),

        status:

            output.submission?.status ??

            "unknown"

    });

}

/*
==================================================
Public Constitutional API

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------
    Runtime
    ----------------------------------
    */

    execute,

    /*
    ----------------------------------
    Output
    ----------------------------------
    */

    summarizeOutput

});