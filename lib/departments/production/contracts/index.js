"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

contracts/

index.js

Constitutional Rule SD-008

Strategy Artifact

        │
        ▼

Contract Publishers

        │
        ▼

Published Contract Catalog

--------------------------------------------------

Constitutional Responsibility

Coordinates all Strategy Department
contract publishers.

It NEVER

• Executes Strategy Workers
• Builds Business Contracts
• Repairs Artifacts
• Writes Platform Memory
• Calls QAD

It ONLY publishes department contracts
built from the immutable Strategy
Workspace.

==================================================
*/

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

const {

    assertStrategyArtifact

} =

    require(

        "../artifact"

    );

const Production =

    require(

        "./production"

    );

const Publishing =

    require(

        "./publishing"

    );

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
Contract Publication

Strategy Artifact

        │

        ▼

Production Publisher

Publishing Publisher

        │

        ▼

Published Contract Catalog

==================================================
*/

function publishContracts(

    artifact

) {

    assertStrategyArtifact(

        artifact

    );

    return deepFreeze({

        production:

            Production.build(

                artifact

            ),

        publishing:

            Publishing.build(

                artifact

            )

    });

}

/*
==================================================
Summary

==================================================
*/

function summarizeContracts(

    contracts

) {

    return deepFreeze({

        generated:

            Object.keys(

                contracts

            ).length,

        departments:

            Object.keys(

                contracts

            ),

        generatedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Verification

==================================================
*/

function assertPublishedContracts(

    contracts

) {

    if (

        !isObject(

            contracts

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid published contracts."

        );

    }

    return contracts;

}

/*
==================================================
Public Runtime

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------
    Runtime
    ----------------------------------
    */

    publishContracts,

    summarizeContracts,

    /*
    ----------------------------------
    Verification
    ----------------------------------
    */

    assertPublishedContracts

});