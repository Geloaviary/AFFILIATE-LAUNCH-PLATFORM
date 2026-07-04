"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Production Department

artifact.js

Constitutional Rule QA-005

Production Manager

        ↓

Production Result

        ↓

Immutable Production Artifact

        ↓

output.js

        ↓

Quality Assurance Director

        ↓

Platform Memory

Constitutional Responsibility

This module is responsible ONLY for
constructing the immutable Production
Artifact.

It NEVER

• Writes Platform Memory
• Calls the Quality Assurance Director
• Performs Validation
• Repairs Artifacts
• Executes Business Logic
• Records Audits
• Mutates Department Output

==================================================
*/

const crypto =

    require(

        "crypto"

    );

/*
==================================================
Department Identity
==================================================
*/

const DEPARTMENT =

Object.freeze({

    name:

        "production",

    artifactType:

        "production-package",

    version:

        1,

    runtimeVersion:

        "1.0.0"

});

/*
==================================================
Artifact Identity

Every Production Artifact receives a
permanent constitutional identity before
leaving the department.

The identity remains immutable throughout
its lifecycle.

Production

        ↓

Quality Assurance Director

        ↓

Commit

        ↓

Audit

        ↓

Platform Memory

==================================================
*/

function generateArtifactId() {

    const timestamp =

        Date.now()

            .toString(36)

            .toUpperCase();

    const random =

        crypto

            .randomBytes(8)

            .toString("hex")

            .toUpperCase();

    return [

        "PROD",

        "ART",

        timestamp,

        random

    ].join("-");

}

/*
==================================================
Internal Utilities

Private helpers used exclusively by the
Production Artifact runtime.

==================================================
*/

/*
--------------------------------------------------
Object Detection
--------------------------------------------------
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

/*
--------------------------------------------------
Deep Freeze

Recursively freezes the complete object
graph.

Supports:

• Objects
• Arrays
• Nested Structures

Circular references are protected using
WeakSet.

==================================================
*/

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
Production Metadata

Creates immutable constitutional metadata
shared by every Production Artifact.

==================================================
*/

function buildMetadata({

    campaignId = null,

    sessionId = null,

    requestId = null,

    source = "production-manager",

    createdBy = DEPARTMENT.name,

    tags = []

} = {}) {

    return deepFreeze({

        department:

            DEPARTMENT.name,

        artifactType:

            DEPARTMENT.artifactType,

        runtimeVersion:

            DEPARTMENT.runtimeVersion,

        campaignId,

        sessionId,

        requestId,

        source,

        createdBy,

        createdAt:

            new Date().toISOString(),

        tags:

            Array.isArray(tags)

                ? [...tags]

                : []

    });

}

/*
==================================================
Production Payload

Production Manager

        ↓

Production Result

        ↓

Production Payload

This represents the immutable business
contract for the Production Department.

==================================================
*/

function isProductionPayload(

    payload

) {

    return (

        isObject(

            payload

        ) &&

        isObject(

            payload.videoPlan

        ) &&

        Array.isArray(

            payload.scenes

        ) &&

        isObject(

            payload.timeline

        ) &&

        isObject(

            payload.metadata

        )

    );

}

/*
==================================================
Payload Assertion

==================================================
*/

function assertProductionPayload(

    payload

) {

    if (

        !isProductionPayload(

            payload

        )

    ) {

        throw new TypeError(

            "Invalid Production Payload."

        );

    }

    return payload;

}

/*
==================================================
Metadata Verification

==================================================
*/

function isProductionMetadata(

    metadata

) {

    return (

        isObject(

            metadata

        ) &&

        metadata.department ===

            DEPARTMENT.name &&

        metadata.artifactType ===

            DEPARTMENT.artifactType &&

        typeof metadata.runtimeVersion ===

            "string" &&

        typeof metadata.createdAt ===

            "string"

    );

}

/*
==================================================
Metadata Assertion

==================================================
*/

function assertProductionMetadata(

    metadata

) {

    if (

        !isProductionMetadata(

            metadata

        )

    ) {

        throw new TypeError(

            "Invalid Production Metadata."

        );

    }

    return metadata;

}

/*
==================================================
Production Artifact Construction

Production Result

        ↓

Verified Payload

        ↓

Immutable Production Artifact

This is the ONLY constitutional entry point
for creating Production Artifacts.

==================================================
*/

function buildProductionArtifact({

    payload,

    metadata = {}

} = {}) {

    /*
    ----------------------------------
    Verify Business Payload
    ----------------------------------
    */

    assertProductionPayload(

        payload

    );

    /*
    ----------------------------------
    Build Constitutional Metadata
    ----------------------------------
    */

    const artifactMetadata =

        buildMetadata(

            metadata

        );

    assertProductionMetadata(

        artifactMetadata

    );

    /*
    ----------------------------------
    Construct Immutable Artifact
    ----------------------------------
    */

    const artifact = {

        artifactId:

            generateArtifactId(),

        department:

            DEPARTMENT.name,

        artifactType:

            DEPARTMENT.artifactType,

        version:

            DEPARTMENT.version,

        runtimeVersion:

            DEPARTMENT.runtimeVersion,

        createdAt:

            artifactMetadata.createdAt,

        metadata:

            artifactMetadata,

        payload:

            structuredClone(

                payload

            )

    };

    /*
    ----------------------------------
    Constitutional Immutability
    ----------------------------------
    */

    return deepFreeze(

        artifact

    );

}

/*
==================================================
Artifact Verification

==================================================
*/

function isProductionArtifact(

    artifact

) {

    return (

        isObject(

            artifact

        ) &&

        typeof artifact.artifactId ===

            "string" &&

        artifact.department ===

            DEPARTMENT.name &&

        artifact.artifactType ===

            DEPARTMENT.artifactType &&

        typeof artifact.version ===

            "number" &&

        typeof artifact.runtimeVersion ===

            "string" &&

        isProductionMetadata(

            artifact.metadata

        ) &&

        isProductionPayload(

            artifact.payload

        )

    );

}

/*
==================================================
Artifact Assertion

==================================================
*/

function assertProductionArtifact(

    artifact

) {

    if (

        !isProductionArtifact(

            artifact

        )

    ) {

        throw new TypeError(

            "Invalid Production Artifact."

        );

    }

    return artifact;

}

/*
==================================================
Artifact Snapshot

Creates a fully detached mutable snapshot
of the immutable Production Artifact.

Snapshots are intended for:

• Logging
• Diagnostics
• Reporting
• Analytics

They are NEVER committed back to Platform
Memory.

==================================================
*/

function snapshotProductionArtifact(

    artifact

) {

    assertProductionArtifact(

        artifact

    );

    return structuredClone(

        artifact

    );

}

/*
==================================================
Artifact Clone

Creates another immutable Production Artifact
instance.

==================================================
*/

function cloneProductionArtifact(

    artifact

) {

    return deepFreeze(

        snapshotProductionArtifact(

            artifact

        )

    );

}

/*
==================================================
Artifact Serialization

Produces the canonical serialized
representation of the Production Artifact.

==================================================
*/

function serializeProductionArtifact(

    artifact

) {

    assertProductionArtifact(

        artifact

    );

    return JSON.stringify(

        artifact,

        null,

        2

    );

}

/*
==================================================
Artifact Summary

Provides a lightweight constitutional summary
for dashboards, diagnostics and Quality
Assurance.

==================================================
*/

function summarizeProductionArtifact(

    artifact

) {

    assertProductionArtifact(

        artifact

    );

    return Object.freeze({

        artifactId:

            artifact.artifactId,

        department:

            artifact.department,

        artifactType:

            artifact.artifactType,

        runtimeVersion:

            artifact.runtimeVersion,

        createdAt:

            artifact.createdAt,

        sceneCount:

            Array.isArray(

                artifact.payload.scenes

            )

                ? artifact.payload.scenes.length

                : 0,

        timelineReady:

            Boolean(

                artifact.payload.timeline

            ),

        videoPlanReady:

            Boolean(

                artifact.payload.videoPlan

            )

    });

}

/*
==================================================
Artifact Export

Public constitutional API.

==================================================
*/

module.exports =

Object.freeze({

    buildProductionArtifact,

    isProductionArtifact,

    assertProductionArtifact,

    snapshotProductionArtifact,

    cloneProductionArtifact,

    serializeProductionArtifact,

    summarizeProductionArtifact

});