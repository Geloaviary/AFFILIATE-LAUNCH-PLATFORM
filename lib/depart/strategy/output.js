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

Published Department Contracts

        │
        ▼

Department Output

        │
        ▼

Quality Assurance Director

==================================================
*/

const {

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
Department Output Builder

Strategy Artifact

        +

Published Department Contracts

        │

        ▼

Immutable Department Output

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
    Department Output
    ----------------------------------
    */

    return buildDepartmentOutput({

        artifact,

        contracts

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