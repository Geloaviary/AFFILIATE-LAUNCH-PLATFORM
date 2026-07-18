"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

artifact.js

Constitutional Rule QA-005

Portfolio Manager

        ↓

Portfolio Result

        ↓

Immutable Portfolio Artifact

        ↓

output.js

        ↓

Quality Assurance Director

        ↓

Platform Memory

Constitutional Responsibility

This module is responsible ONLY for
constructing the immutable Portfolio
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

const DEPARTMENT = Object.freeze({

    name: "portfolio",

    artifactType: "portfolio-review",

    version: 1,

    runtimeVersion: "1.0.0"

});

/*
==================================================
Artifact Identity

Every Portfolio Artifact receives a
permanent constitutional identity before
leaving the department.

The identity remains immutable throughout
its lifecycle.

Portfolio

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

        "STRAT",

        "ART",

        timestamp,

        random

    ].join("-");

}

/*
==================================================
Internal Utilities

Private helpers used exclusively by the
Portfolio Artifact runtime.

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
Portfolio Metadata

Creates immutable constitutional metadata
shared by every Portfolio Artifact.

==================================================
*/

function buildMetadata({

    campaignId = null,

    sessionId = null,

    requestId = null,

    source = "portfolio-manager",

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
Portfolio Payload

Portfolio Manager

        ↓

Portfolio Result

        ↓

Portfolio Payload

This represents the immutable business
contract for the Portfolio Department.

==================================================
*/

function isPortfolioPayload(

    payload

) {

    return (

        isObject(

            payload

        ) &&

        isObject(

            payload.engine

        ) &&

        isObject(

            payload.workspace

        ) &&

        isObject(

            payload.review

        ) &&

        typeof payload.executedAt ===

            "string"

    );

}

/*
==================================================
Payload Assertion

==================================================
*/

function assertPortfolioPayload(

    payload

) {

    if (

        !isPortfolioPayload(

            payload

        )

    ) {

        throw new TypeError(

            "Invalid Portfolio Payload."

        );

    }

    return payload;

}

/*
==================================================
Metadata Verification

==================================================
*/

function isPortfolioMetadata(

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

function assertPortfolioMetadata(

    metadata

) {

    if (

        !isPortfolioMetadata(

            metadata

        )

    ) {

        throw new TypeError(

            "Invalid Portfolio Metadata."

        );

    }

    return metadata;

}

/*
==================================================
Portfolio Artifact Construction

Portfolio Result

        ↓

Verified Payload

        ↓

Immutable Portfolio Artifact

This is the ONLY constitutional entry point
for creating Portfolio Artifacts.

==================================================
*/

function buildPortfolioArtifact({

    payload,

    metadata = {}

} = {}) {

    /*
    ----------------------------------
    Verify Business Payload
    ----------------------------------
    */

    assertPortfolioPayload(

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

    assertPortfolioMetadata(

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

function isPortfolioArtifact(

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

        isPortfolioMetadata(

            artifact.metadata

        ) &&

        isPortfolioPayload(

            artifact.payload

        )

    );

}

/*
==================================================
Artifact Assertion

==================================================
*/

function assertPortfolioArtifact(

    artifact

) {

    if (

        !isPortfolioArtifact(

            artifact

        )

    ) {

        throw new TypeError(

            "Invalid Portfolio Artifact."

        );

    }

    return artifact;

}

/*
==================================================
Artifact Snapshot

Creates a fully detached mutable snapshot
of the immutable Portfolio Artifact.

Snapshots are intended for:

• Logging
• Diagnostics
• Reporting
• Analytics

They are NEVER committed back to Platform
Memory.

==================================================
*/

function snapshotPortfolioArtifact(

    artifact

) {

    assertPortfolioArtifact(

        artifact

    );

    return structuredClone(

        artifact

    );

}

/*
==================================================
Artifact Clone

Creates another immutable Portfolio Artifact
instance.

==================================================
*/

function clonePortfolioArtifact(

    artifact

) {

    return deepFreeze(

        snapshotPortfolioArtifact(

            artifact

        )

    );

}

/*
==================================================
Artifact Serialization

Produces the canonical serialized
representation of the Portfolio Artifact.

==================================================
*/

function serializePortfolioArtifact(

    artifact

) {

    assertPortfolioArtifact(

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

function summarizePortfolioArtifact(

    artifact

) {

    assertPortfolioArtifact(

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

    reviewId:

        artifact.payload.review?.id ||

        null,

    campaignId:

        artifact.payload.review?.campaignId ||

        null,

    workspaceReady:

    Boolean(

        artifact.payload.workspace

    ),

    reviewReady:

        Boolean(

            artifact.payload.review

        )

});

}

/*
==================================================
Artifact Export

Public constitutional API.

==================================================
*/

module.exports = Object.freeze({

    buildPortfolioArtifact,

    isPortfolioArtifact,

    assertPortfolioArtifact,

    snapshotPortfolioArtifact,

    clonePortfolioArtifact,

    serializePortfolioArtifact,

    summarizePortfolioArtifact

});