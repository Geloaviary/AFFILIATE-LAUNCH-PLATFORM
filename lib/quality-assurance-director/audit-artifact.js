"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

audit-artifact.js

Constitution

QA-001

Audit Record

        ↓

Immutable Audit Artifact

This module is responsible ONLY for
constructing the constitutional
Audit Artifact.

It NEVER:

• Writes Platform Memory
• Calls Commit Manager
• Performs Validation
• Performs Classification
• Performs Persistence
• Mutates Audit Records

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

            "quality-assurance",

        artifactType:

            "audit-record",

        version:

            1

    });

/*
==================================================
Artifact Identity

Every audit artifact receives a
permanent constitutional identity.

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

        "AUD",

        timestamp,

        random

    ].join("-");

}

/*
==================================================
Metadata
==================================================
*/

function buildMetadata() {

    return Object.freeze({

        createdAt:

            new Date()

                .toISOString(),

        createdBy:

            DEPARTMENT.name

    });

}

/*
==================================================
Audit Artifact Builder
==================================================
*/

function buildAuditArtifact(

    auditRecord

) {

    if (

        !auditRecord ||

        typeof auditRecord !==

            "object"

    ) {

        throw new TypeError(

            "Audit record is required."

        );

    }

    return Object.freeze({

        artifactId:

            generateArtifactId(),

        department:

            DEPARTMENT.name,

        artifactType:

            DEPARTMENT.artifactType,

        version:

            DEPARTMENT.version,

        metadata:

            buildMetadata(),

        payload:

            auditRecord

    });

}

/*
==================================================
Verification
==================================================
*/

function isAuditArtifact(

    artifact

) {

    return (

        artifact &&

        typeof artifact ===

            "object" &&

        typeof artifact.artifactId ===

            "string" &&

        artifact.department ===

            DEPARTMENT.name &&

        artifact.artifactType ===

            DEPARTMENT.artifactType &&

        artifact.version ===

            DEPARTMENT.version &&

        artifact.payload &&

        typeof artifact.payload ===

            "object"

    );

}

function assertAuditArtifact(

    artifact

) {

    if (

        !isAuditArtifact(

            artifact

        )

    ) {

        throw new TypeError(

            "Invalid Audit Artifact."

        );

    }

    return artifact;

}

/*
==================================================
PUBLIC API
==================================================
*/

module.exports =

    Object.freeze({

        buildAuditArtifact,

        isAuditArtifact,

        assertAuditArtifact

    });