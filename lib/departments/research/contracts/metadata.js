"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

contracts/

metadata.js

Constitutional Rule SD-011

Strategy Artifact

        │
        ▼

Department Contract Metadata

--------------------------------------------------

Constitutional Responsibility

Builds immutable metadata shared by all
published Strategy Department contracts.

It NEVER

• Builds Business Contracts
• Executes Strategy Workers
• Repairs Artifacts
• Validates Artifacts
• Calls QAD
• Writes Platform Memory

It ONLY builds shared metadata used by
department contract publishers.

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
Metadata Builder

==================================================
*/

function build(

    artifact,

    department

) {

    assertStrategyArtifact(

        artifact

    );

    if (

        typeof department !==

        "string" ||

        !department.trim()

    ) {

        throw new Errors.ValidationError(

            "Invalid target department."

        );

    }

    return deepFreeze({

        artifactId:

            artifact.artifactId,

        sourceDepartment:

            artifact.department,

        targetDepartment:

            department,

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

            new Date()

                .toISOString()

    });

}

/*
==================================================
Verification

==================================================
*/

function isContractMetadata(

    metadata

) {

    return (

        isObject(

            metadata

        ) &&

        typeof metadata.artifactId ===

            "string" &&

        typeof metadata.sourceDepartment ===

            "string" &&

        typeof metadata.targetDepartment ===

            "string"

    );

}

function assertContractMetadata(

    metadata

) {

    if (

        !isContractMetadata(

            metadata

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Contract Metadata."

        );

    }

    return metadata;

}

/*
==================================================
Public Runtime

==================================================
*/

module.exports =

Object.freeze({

    build,

    isContractMetadata,

    assertContractMetadata

});