"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4
Research Department

artifact.js

Constitutional Rule QA-005

Research Engine

        ↓

Research Result

        ↓

Immutable Research Artifact

        ↓

output.js

This module is responsible ONLY for
constructing the constitutional
Research Artifact.

It NEVER:

• Writes Platform Memory
• Calls the QAD
• Performs Validation
• Performs Commits
• Records Audits
• Mutates Department Output

==================================================
*/

const crypto =
    require("crypto");

/*
==================================================
Department Identity
==================================================
*/

const DEPARTMENT =
    Object.freeze({

        name:
            "research",

        artifactType:
            "research-package",

        version:
            1

    });

/*
==================================================
Artifact Identity

Every artifact receives a permanent
constitutional identity before it
leaves the Research Department.

The identifier remains immutable
throughout its lifecycle.

Research

↓

QAD

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

        "ART",

        timestamp,

        random

    ].join("-");

}

/*
==================================================
Internal Utilities

These utilities are private to this module.

Their responsibility is to guarantee that every
Research Artifact becomes completely immutable
before leaving the Research Department.

Nothing outside this file should mutate an
artifact after construction.

==================================================
*/

/*
==================================================
Type Guards
==================================================
*/

function isObject(value) {

    return (

        value !== null &&

        typeof value === "object"

    );

}

/*
==================================================
Deep Freeze

Recursively freezes the complete object graph.

This guarantees constitutional immutability for:

• Artifact
• Metadata
• Payload

==================================================
*/

function deepFreeze(target) {

    if (!isObject(target)) {

        return target;

    }

    Object.freeze(target);

    for (const key of Object.keys(target)) {

        const value = target[key];

        if (

            isObject(value) &&

            !Object.isFrozen(value)

        ) {

            deepFreeze(value);

        }

    }

    return target;

}

/*
==================================================
Metadata Builder

Creates immutable constitutional metadata shared
by every Research Artifact.

==================================================
*/

function buildMetadata({

    campaignId = null,

    sessionId = null,

    requestId = null,

    source = "research-engine",

    createdBy = DEPARTMENT.name,

    tags = []

} = {}) {

    return deepFreeze({

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
Research Artifact Builder

Constitutional Responsibility

Research Result

        ↓

Immutable Research Artifact

This is the ONLY constructor for a
Research Artifact.

==================================================
*/

function buildResearchArtifact({

    payload,

    campaignId = null,

    sessionId = null,

    requestId = null,

    source = "research-engine",

    tags = []

} = {}) {

    /*
    ----------------------------------
    Required Payload
    ----------------------------------
    */

    if (!isObject(payload)) {

        throw new TypeError(

            "Research artifact payload must be an object."

        );

    }

    /*
    ----------------------------------
    Artifact Identity
    ----------------------------------
    */

    const artifactId =

        generateArtifactId();

    /*
    ----------------------------------
    Constitutional Metadata
    ----------------------------------
    */

    const metadata =

        buildMetadata({

            campaignId,

            sessionId,

            requestId,

            source,

            createdBy:

                DEPARTMENT.name,

            tags

        });

    /*
    ----------------------------------
    Constitutional Artifact
    ----------------------------------
    */

    const artifact = {

        artifactId,

        department:

            DEPARTMENT.name,

        artifactType:

            DEPARTMENT.artifactType,

        version:

            DEPARTMENT.version,

        metadata,

        payload

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
Constitutional Artifact Verification

These utilities verify that every
Research Artifact satisfies the
department contract before it leaves
the Research Department.

No Platform Memory operations occur here.

No QAD operations occur here.

==================================================
*/

/*
--------------------------------------------------
Artifact Verification
--------------------------------------------------
*/

function isResearchArtifact(

    artifact

) {

    return (

        isObject(artifact) &&

        artifact.department ===

            DEPARTMENT.name &&

        artifact.artifactType ===

            DEPARTMENT.artifactType &&

        artifact.version ===

            DEPARTMENT.version &&

        typeof artifact.artifactId ===

            "string" &&

        artifact.artifactId.length > 0 &&

        isObject(

            artifact.metadata

        ) &&

        isObject(

            artifact.payload

        )

    );

}

/*
--------------------------------------------------
Artifact Assertion

Throws immediately if the artifact
violates the constitutional contract.

--------------------------------------------------
*/

function assertResearchArtifact(

    artifact

) {

    if (

        !isResearchArtifact(

            artifact

        )

    ) {

        throw new TypeError(

            "Invalid Research Artifact."

        );

    }

    return artifact;

}

/*
--------------------------------------------------
Artifact Cloning

Creates a deep immutable clone from an
existing constitutional artifact.

Useful when rebuilding an artifact after
department repair while preserving the
constitutional contract.

--------------------------------------------------
*/

function cloneResearchArtifact(

    artifact

) {

    assertResearchArtifact(

        artifact

    );

    const clone =

        structuredClone(

            artifact

        );

    return deepFreeze(

        clone

    );

}

/*
==================================================
Constitutional Serialization

These utilities provide safe read-only
representations of a Research Artifact.

Artifacts remain immutable.

No mutation is permitted.

==================================================
*/

/*
--------------------------------------------------
Artifact Snapshot

Returns a deep cloned snapshot suitable
for logging, debugging or inspection.

The original artifact is never exposed.

--------------------------------------------------
*/

function snapshotResearchArtifact(

    artifact

) {

    assertResearchArtifact(

        artifact

    );

    return structuredClone(

        artifact

    );

}

/*
--------------------------------------------------
Artifact JSON

Produces a stable JSON representation
of the constitutional artifact.

--------------------------------------------------
*/

function serializeResearchArtifact(

    artifact,

    spacing = 2

) {

    assertResearchArtifact(

        artifact

    );

    return JSON.stringify(

        artifact,

        null,

        spacing

    );

}

/*
--------------------------------------------------
Artifact Summary

Returns a lightweight immutable summary.

Useful for logs, telemetry and audit
previews without exposing the complete
Research Package.

--------------------------------------------------
*/

function summarizeResearchArtifact(

    artifact

) {

    assertResearchArtifact(

        artifact

    );

    return Object.freeze({

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

            artifact.metadata.createdAt

    });

}

/*
--------------------------------------------------
Artifact Equality

Compares two constitutional artifacts
using their permanent identity.

--------------------------------------------------
*/

function isSameResearchArtifact(

    left,

    right

) {

    return (

        isResearchArtifact(

            left

        ) &&

        isResearchArtifact(

            right

        ) &&

        left.artifactId ===

        right.artifactId

    );

}

/*
==================================================
Public API

This module exports the complete
constitutional interface for the
Research Department Artifact.

The exported API is immutable.

==================================================
*/

module.exports = Object.freeze({

    /*
    ----------------------------------
    Artifact Construction
    ----------------------------------
    */

    buildResearchArtifact,

    /*
    ----------------------------------
    Artifact Verification
    ----------------------------------
    */

    isResearchArtifact,

    assertResearchArtifact,

    /*
    ----------------------------------
    Artifact Operations
    ----------------------------------
    */

    cloneResearchArtifact,

    snapshotResearchArtifact,

    serializeResearchArtifact,

    summarizeResearchArtifact,

    isSameResearchArtifact

});