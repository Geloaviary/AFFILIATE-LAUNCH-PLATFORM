/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Audit Manager

Historical Authority

Constitution

QA-004

Responsibilities

• Create immutable audit records
• Preserve constitutional history
• Record certified platform truth

This manager never:

• Persists
• Commits
• Certifies
• Publishes Events
• Modifies Platform Memory

========================================
*/

"use strict";

/*
========================================
SHARED INFRASTRUCTURE

========================================
*/

const Config =

    require(

        "./config"

    );

const Constants =

    require(

        "./constants"

    );

const Errors =

    require(

        "./errors"

    );

const RuntimeId =

require("../identity/runtime");

/*
========================================
AUDIT POLICY

========================================
*/

function policy() {

    return (

        Config.audit ||

        {}

    );

}

function policyValue(

    key,

    fallback = null

) {

    const configuration =

        policy();

    return Object.prototype

        .hasOwnProperty.call(

            configuration,

            key

        )

        ? configuration[

            key

        ]

        : fallback;

}

/*
========================================
AUDIT CONTEXT

Contains immutable
commit outcome.

========================================
*/

function createAuditContext(

    commitOutcome

) {

    if (

        !commitOutcome

    ) {

        throw new Errors.ValidationError(

            "Commit Outcome is required."

        );

    }

    return Object.freeze({

        commitOutcome,

        createdAt:

            timestamp()

    });

}

/*
========================================
OPERATIONAL STATE

Domain operational state.

========================================
*/

const state = {

    auditRecords:

        0,

    lastAuditId:

        null

};

/*
========================================
PRIVATE HELPERS

========================================
*/

function timestamp() {

    return (

        new Date()

    ).toISOString();

}

function generateAuditId() {

        return RuntimeId.generateAuditId();

    }


function rememberAudit(

    auditRecord

) {

    state.auditRecords++;

    state.lastAuditId =

        auditRecord.auditId;

}

/*
========================================
CREATE AUDIT EVIDENCE

Creates immutable evidence from
the Commit Outcome.

========================================
*/

function createAuditEvidence(

    context

) {

    const {

        commitOutcome

    } = context;

    return Object.freeze({

        commitId:

            commitOutcome.commitId,

        submissionId:

            commitOutcome.submissionId,

        certificationId:

            commitOutcome.certificationId,

        committed:

            commitOutcome.committed,

        completedAt:

            commitOutcome.completedAt

    });

}



/*
========================================
CLASSIFY AUDIT

Determines the constitutional
classification of an audit.

========================================
*/

function classifyAudit(

    evidence

) {

    if (

        !evidence.committed

    ) {

        return "commit-failed";

    }

    return "constitutional-commit";

}

/*
========================================
CREATE AUDIT CLASSIFICATION

Immutable classification
artifact.

========================================
*/

function createAuditClassification(

    evidence

) {

    return Object.freeze({

        type:

            classifyAudit(

                evidence

            ),

        version:

            "QA-004",

        classifiedAt:

            timestamp()

    });

}

/*
========================================
BUILD AUDIT RECORD

Commit Outcome

↓

Evidence

↓

Classification

↓

Audit Record

========================================
*/

function buildAuditRecord(

    evidence,

    classification

) {

    const auditRecord =

        Object.freeze({

            auditId:

                generateAuditId(),

            type:

                classification.type,

            version:

                classification.version,

            evidence,

            recordedAt:

                timestamp()

        });

    rememberAudit(

        auditRecord

    );

    return auditRecord;

}

/*
========================================
VERIFY AUDIT RECORD

Structural verification only.

========================================
*/

function verifyAuditRecord(

    auditRecord

) {

    if (

        !auditRecord

    ) {

        throw new Errors.ValidationError(

            "Audit Record is required."

        );

    }

    if (

        !auditRecord.auditId

    ) {

        throw new Errors.ValidationError(

            "Audit identifier is required."

        );

    }

    if (

        !auditRecord.type

    ) {

        throw new Errors.ValidationError(

            "Audit classification is required."

        );

    }

    if (

        !auditRecord.evidence

    ) {

        throw new Errors.ValidationError(

            "Audit evidence is required."

        );

    }

    return true;

}



/*
========================================
OPERATIONAL STATE

Domain operational state.

========================================
*/

function operationalState() {

    return Object.freeze({

        auditRecords:

            state.auditRecords,

        lastAuditId:

            state.lastAuditId

    });

}

/*
========================================
VERIFY AUDIT RECORD

Private structural verification.

Never exposed publicly.

========================================
*/

function verifyAuditRecord(

    auditRecord

) {

    if (

        !auditRecord

    ) {

        throw new Errors.ValidationError(

            "Audit Record is required."

        );

    }

    if (

        !auditRecord.auditId

    ) {

        throw new Errors.ValidationError(

            "Audit identifier is required."

        );

    }

    if (

        !auditRecord.type

    ) {

        throw new Errors.ValidationError(

            "Audit classification is required."

        );

    }

    if (

        !auditRecord.evidence

    ) {

        throw new Errors.ValidationError(

            "Audit evidence is required."

        );

    }

    return auditRecord;

}

/*
========================================
AUDIT PIPELINE

Internal constitutional
history pipeline.

========================================
*/

function auditPipeline(

    commitOutcome

) {

    const context =

        createAuditContext(

            commitOutcome

        );

    const evidence =

        createAuditEvidence(

            context

        );

    const classification =

        createAuditClassification(

            evidence

        );

    const auditRecord =

        buildAuditRecord(

            evidence,

            classification

        );

    return Object.freeze(

        verifyAuditRecord(

            auditRecord

        )

    );

}

/*
========================================
CREATE AUDIT RECORD

Public constitutional
factory.

========================================
*/

function createAuditRecord(

    commitOutcome

) {

    return auditPipeline(

        commitOutcome

    );

}

/*
========================================
OPERATIONAL STATE

Historical Authority
operational state.

========================================
*/

function operationalState() {

    return Object.freeze({

        recordsCreated:

            state.auditRecords,

        lastAuditId:

            state.lastAuditId

    });

}

/*
========================================
AUDIT MANAGER

QA-004

Historical Authority

Public API

========================================
*/

const AuditManager =

    Object.freeze({

        /*
        ----------------------------
        Historical Authority

        Creates immutable
        constitutional audit
        records.

        ----------------------------
        */

        createAuditRecord

    });

/*
========================================
MODULE EXPORT

QA-004

Historical Authority

========================================
*/

module.exports =

    AuditManager;