"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

contracts.js

Constitutional Rule SD-008

Strategy Artifact

        │
        ▼

Department Business Contracts

==================================================
*/

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

const {

    assertStrategyArtifact

} = require(

    "./artifact"

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

        typeof value === "object"

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
Shared Metadata
==================================================
*/

function buildContractMetadata(

    artifact

) {

    return deepFreeze({

        artifactId:

            artifact.artifactId,

        department:

            artifact.department,

        artifactType:

            artifact.artifactType,

        version:

            artifact.version,

        campaignId:

            artifact.metadata.campaignId,

        sessionId:

            artifact.metadata.sessionId,

        requestId:

            artifact.metadata.requestId,

        createdAt:

            artifact.metadata.createdAt,

        publishedAt:

            new Date().toISOString()

    });

}

/*
==================================================
Department Contract
==================================================
*/

function buildDepartmentContract({

    department,

    payload,

    metadata

}) {

    if (

        !department ||

        !isObject(payload) ||

        !isObject(metadata)

    ) {

        throw new Errors.ValidationError(

            "Invalid Department Contract."

        );

    }

    return deepFreeze({

        department,

        metadata,

        payload

    });

}

/*
==================================================
Production Contract

Strategy

        │

        ▼

Production

Production receives ONLY executable
production planning.

==================================================
*/

function buildProductionContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const payload =

        deepFreeze({

            winner:

                artifact.payload.winner,

            niche:

                artifact.payload.niche,

            campaign:

                artifact.payload.campaignIntelligence,

            product:

                artifact.payload.productIntelligence,

            productionPlan:

                artifact.payload.productionPlan ??

                {},

            contentPlan:

                artifact.payload.contentPlan ??

                {},

            creativeDirection:

                artifact.payload.creativeDirection ??

                {}

        });

    return buildDepartmentContract({

        department:

            "production",

        metadata,

        payload

    });

}

/*
==================================================
Publishing Contract

Strategy

        │

        ▼

Publishing

Publishing receives ONLY campaign
messaging and publishing direction.

==================================================
*/

function buildPublishingContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const payload =

        deepFreeze({

            winner:

                artifact.payload.winner,

            niche:

                artifact.payload.niche,

            campaign:

                artifact.payload.campaignIntelligence,

            publishingPlan:

                artifact.payload.publishingPlan ??

                {},

            messaging:

                artifact.payload.messaging ??

                {},

            callToAction:

                artifact.payload.callToAction ??

                {},

            keywords:

                artifact.payload.keywords ??

                [],

            hashtags:

                artifact.payload.hashtags ??

                []

        });

    return buildDepartmentContract({

        department:

            "publishing",

        metadata,

        payload

    });

}

/*
==================================================
Contract Verification

==================================================
*/

function isDepartmentContract(

    contract

) {

    return (

        isObject(contract) &&

        typeof contract.department ===

            "string" &&

        isObject(

            contract.metadata

        ) &&

        isObject(

            contract.payload

        )

    );

}

function assertDepartmentContract(

    contract

) {

    if (

        !isDepartmentContract(

            contract

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Department Contract."

        );

    }

    return contract;

}

/*
==================================================
Contract Publisher

Strategy Artifact

        │

        ▼

Department Contracts

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

            buildProductionContract(

                artifact

            ),

        publishing:

            buildPublishingContract(

                artifact

            )

    });

}

/*
==================================================
Contract Summary

Useful for diagnostics and telemetry.

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
Public Constitutional API

==================================================
*/

module.exports = Object.freeze({

    /*
    ----------------------------------
    Runtime
    ----------------------------------
    */

    publishContracts,

    summarizeContracts,

    /*
    ----------------------------------
    Builders
    ----------------------------------
    */

    buildProductionContract,

    buildPublishingContract,

    /*
    ----------------------------------
    Verification
    ----------------------------------
    */

    isDepartmentContract,

    assertDepartmentContract

});