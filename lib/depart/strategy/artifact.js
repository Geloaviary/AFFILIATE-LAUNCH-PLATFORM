"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

artifact.js

Constitutional Rule QA-005

Strategy Manager

        ↓

Strategy Result

        ↓

Immutable Strategy Artifact

        ↓

output.js

        ↓

Quality Assurance Director

        ↓

Platform Memory

Constitutional Responsibility

This module is responsible ONLY for
constructing the immutable Strategy
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

    name: "strategy",

    artifactType: "strategy-package",

    version: 1,

    runtimeVersion: "1.0.0"

});

/*
==================================================
Artifact Identity

Every Strategy Artifact receives a
permanent constitutional identity before
leaving the department.

The identity remains immutable throughout
its lifecycle.

Strategy

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
Strategy Artifact runtime.

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
Strategy Metadata

Creates immutable constitutional metadata
shared by every Strategy Artifact.

==================================================
*/

function buildMetadata({

    campaignId = null,

    sessionId = null,

    requestId = null,

    source = "strategy-manager",

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
Strategy Payload

Strategy Manager

        ↓

Strategy Result

        ↓

Strategy Payload

This represents the immutable business
contract for the Strategy Department.

==================================================
*/

function isStrategyPayload(

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

            payload.campaign

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

function assertStrategyPayload(

    payload

) {

    if (

        !isStrategyPayload(

            payload

        )

    ) {

        throw new TypeError(

            "Invalid Strategy Payload."

        );

    }

    return payload;

}

/*
==================================================
Metadata Verification

==================================================
*/

function isStrategyMetadata(

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

function assertStrategyMetadata(

    metadata

) {

    if (

        !isStrategyMetadata(

            metadata

        )

    ) {

        throw new TypeError(

            "Invalid Strategy Metadata."

        );

    }

    return metadata;

}

/*
==================================================
Strategy Artifact Construction

Strategy Result

        ↓

Verified Payload

        ↓

Immutable Strategy Artifact

This is the ONLY constitutional entry point
for creating Strategy Artifacts.

==================================================
*/

function buildStrategyArtifact({

    payload,

    metadata = {}

} = {}) {

    /*
    ----------------------------------
    Verify Business Payload
    ----------------------------------
    */

    assertStrategyPayload(

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

    assertStrategyMetadata(

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

function isStrategyArtifact(

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

        isStrategyMetadata(

            artifact.metadata

        ) &&

        isStrategyPayload(

            artifact.payload

        )

    );

}

/*
==================================================
Artifact Assertion

==================================================
*/

function assertStrategyArtifact(

    artifact

) {

    if (

        !isStrategyArtifact(

            artifact

        )

    ) {

        throw new TypeError(

            "Invalid Strategy Artifact."

        );

    }

    return artifact;

}

/*
==================================================
Artifact Snapshot

Creates a fully detached mutable snapshot
of the immutable Strategy Artifact.

Snapshots are intended for:

• Logging
• Diagnostics
• Reporting
• Analytics

They are NEVER committed back to Platform
Memory.

==================================================
*/

function snapshotStrategyArtifact(

    artifact

) {

    assertStrategyArtifact(

        artifact

    );

    return structuredClone(

        artifact

    );

}

/*
==================================================
Artifact Clone

Creates another immutable Strategy Artifact
instance.

==================================================
*/

function cloneStrategyArtifact(

    artifact

) {

    return deepFreeze(

        snapshotStrategyArtifact(

            artifact

        )

    );

}

/*
==================================================
Artifact Serialization

Produces the canonical serialized
representation of the Strategy Artifact.

==================================================
*/

function serializeStrategyArtifact(

    artifact

) {

    assertStrategyArtifact(

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

function summarizeStrategyArtifact(

    artifact

) {

    assertStrategyArtifact(

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

    campaignId:

        artifact.payload.campaign?.id ||

        null,

    campaignName:

        artifact.payload.campaign?.name ||

        null,

    workspaceReady:

    Boolean(

        artifact.payload.workspace

    ),

    campaignReady:

        Boolean(

            artifact.payload.campaign

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

    buildStrategyArtifact,

    isStrategyArtifact,

    assertStrategyArtifact,

    snapshotStrategyArtifact,

    cloneStrategyArtifact,

    serializeStrategyArtifact,

    summarizeStrategyArtifact

});