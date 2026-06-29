const ValidationOrchestrator =
    require(
        "./validation-orchestrator"
    );

const CommitManager =
    require(
        "./commit-manager"
    );

/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Submission Manager

Object Factory

Constitution

QA-002

Responsibilities

• Create Submission
• Normalize Input
• Generate Identity
• Apply Defaults
• Validate Structure
• Return Immutable Submission

This manager never:

• Persists
• Indexes
• Certifies
• Audits
• Publishes Events

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

/*
========================================
FACTORY POLICY

========================================
*/

function policy() {

    return (

        Config.submission ||

        {}

    );

}

/*
========================================
POLICY VALUE

========================================
*/

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
FACTORY CONTEXT

Factory state only.

No runtime.

No persistence.

========================================
*/

const context = {

    created:

        0,

    lastSubmissionId:

        null

};

/*
========================================
CREATE REQUEST

Creates a mutable working copy.

Never exposed publicly.

========================================
*/

function createRequest(

    input = {}

) {

    if (

        input == null ||

        typeof input !==

        "object"

    ) {

        throw new Errors.ValidationError(

            "Submission input must be an object."

        );

    }

    return {

        ...input

    };

}

/*
========================================
GENERATE IDENTITY

========================================
*/

function generateSubmissionId() {

    if (

        typeof Constants.generateId ===

        "function"

    ) {

        return Constants.generateId();

    }

    return (

        Date.now()

            .toString(36) +

        Math.random()

            .toString(36)

            .slice(2)

    );

}

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

function rememberSubmission(

    submission

) {

    context.created++;

    context.lastSubmissionId =

        submission.id;

}

/*
========================================
NORMALIZE REQUEST

Creates a normalized working
representation.

Never mutates the original
request.

========================================
*/

function normalizeRequest(

    request

) {

    if (

        !request

    ) {

        throw new Errors.ValidationError(

            "Submission request is required."

        );

    }

    return {

        department:

            request.department ||

            policyValue(

                "defaultDepartment",

                "unknown"

            ),

        payload:

            request.payload ||

            {},

        metadata:

            {

                ...(request.metadata || {})

            },

        tags:

            Array.isArray(

                request.tags

            )

                ? [

                    ...request.tags

                ]

                : [],

        createdBy:

            request.createdBy ||

            "system"

    };

}

/*
========================================
CREATE SUBMISSION

Factory pipeline.

Request

↓

Normalize

↓

Build

↓

Return Immutable Submission

========================================
*/

/*
========================================
VALIDATE STRUCTURE

Validates the structural integrity
of a Submission.

Business validation belongs to
Validation Orchestrator.

========================================
*/

function validateStructure(

    submission

) {

    if (

        !submission

    ) {

        throw new Errors.ValidationError(

            "Submission is required."

        );

    }

    if (

        !submission.id

    ) {

        throw new Errors.ValidationError(

            "Submission identifier is required."

        );

    }

    if (

        !submission.department

    ) {

        throw new Errors.ValidationError(

            "Submission department is required."

        );

    }

    if (

        typeof submission.payload !==

        "object"

    ) {

        throw new Errors.ValidationError(

            "Submission payload must be an object."

        );

    }

    return true;

}

/*
========================================
FREEZE SUBMISSION

Centralized immutability.

========================================
*/

function freezeSubmission(

    submission

) {

    return Object.freeze({

        ...submission,

        payload:

            Object.freeze({

                ...submission.payload

            }),

        metadata:

            Object.freeze({

                ...submission.metadata

            }),

        tags:

            Object.freeze([

                ...submission.tags

            ])

    });

}

/*
========================================
BUILD SUBMISSION

Constructs the immutable
Submission domain object.

========================================
*/

/*
========================================
VALIDATE

Factory validation.

Structural validation only.

========================================
*/

function validate(

    submission

) {

    return validateStructure(

        submission

    );

}

/*
========================================
COMPLETE SUBMISSION

Finalizes the factory pipeline.

Updates factory operational
state without modifying the
immutable Submission.

========================================
*/

function completeSubmission(

    submission

) {

    rememberSubmission(

        submission

    );

    return submission;

}

/*
========================================
FACTORY PIPELINE

Internal object creation
pipeline.

========================================
*/

/*
========================================
CREATE SUBMISSION

Public factory entry point.

========================================
*/

function createSubmission(

    input

) {

    const submission =

        factoryPipeline(

            input

        );

    return completeSubmission(

        submission

    );

}

async function submit(submissionContext) {

    const {

        artifact

    } = submissionContext;

    if (!artifact) {

    throw new Errors.ValidationError(

        "Submission artifact is required."

    );

}

    const metadata = artifact.metadata || {};

    const submission = createSubmission({

        department: artifact.department,

        payload: artifact.payload,

        metadata,

        tags: metadata.tags || [],

        createdBy: artifact.department

    });

    const validation =

        await ValidationOrchestrator.validate(
            submission
        );

    if (!validation.certified) {

        return validation;

    }

    return CommitManager.commit({

        submission,

        validation,

        artifact

    });

}

/*
========================================
FACTORY STATE

Operational state only.

========================================
*/

/*
========================================
IDENTITY PIPELINE

Generates the Submission
identity independently from
object construction.

========================================
*/

function createIdentity() {

    return Object.freeze({

        id:

            generateSubmissionId(),

        createdAt:

            timestamp()

    });

}

/*
========================================
BUILD SUBMISSION

Builds a Submission using an
Identity and a normalized
request.

========================================
*/

function buildSubmission(

    identity,

    normalized

) {

    const submission = {

        id:

            identity.id,

        department:

            normalized.department,

        payload:

            normalized.payload,

        metadata:

            normalized.metadata,

        tags:

            normalized.tags,

        createdBy:

            normalized.createdBy,

        createdAt:

            identity.createdAt

    };

    validateStructure(

        submission

    );

    return freezeSubmission(

        submission

    );

}

/*
========================================
FACTORY PIPELINE

========================================
*/

function factoryPipeline(

    input

) {

    const request =

        createRequest(

            input

        );

    const normalized =

        normalizeRequest(

            request

        );

    const identity =

        createIdentity();

    return buildSubmission(

        identity,

        normalized

    );

}

/*
========================================
OPERATIONAL STATE

Factory operational state.

Used by infrastructure
observers only.

========================================
*/

function operationalState() {

    return Object.freeze({

        submissionsCreated:

            context.created,

        lastSubmissionId:

            context.lastSubmissionId

    });

}

/*
========================================
SUBMISSION MANAGER

QA-002

Public Object Factory

========================================
*/

const SubmissionManager =

    Object.freeze({

        /*
        ----------------------------
        Object Factory
        ----------------------------
        */

        createSubmission,

        /*
        ----------------------------
        Constitutional Gateway

        Department

            ↓

        Submission

            ↓

        Validation

            ↓

        Commit

        ----------------------------
        */

        submit,

        /*
        ----------------------------
        Operational State
        ----------------------------
        */

        operationalState

    });

/*
========================================
MODULE EXPORT

QA-002

Submission Manager

Object Factory

========================================
*/

module.exports =

    SubmissionManager;