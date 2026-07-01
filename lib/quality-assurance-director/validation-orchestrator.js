/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Validation Orchestrator

Certification Authority

Constitution

QA-003

Responsibilities

• Structural Validation
• Business Validation
• Policy Validation
• Compliance Validation
• Certification Decision

This manager never:

• Persists
• Indexes
• Commits
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

const RuntimeId =

    require("../identity/runtime");

/*
========================================
VALIDATION POLICY

========================================
*/

function policy() {

    return (

        Config.validation ||

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
VALIDATION CONTEXT

Contains evaluation state.

No certification data.

========================================
*/

function createValidationContext(

    submission

) {

    if (

        !submission

    ) {

        throw new Errors.ValidationError(

            "Submission is required."

        );

    }

    return {

        submission,

        rules: [],

        violations: [],

        warnings: [],

        startedAt:

            new Date()

                .toISOString()

    };

}

/*
========================================
CERTIFICATION CONTEXT

Contains certification
information only.

========================================
*/

function createCertificationContext(

    validationContext

) {

    return {

        id:

            typeof Constants.generateId ===

            "function"

                ? RuntimeId.generateValidationId()

                : Date.now()

                    .toString(36),

        submissionId:

            validationContext

                .submission.id,

        department:

            validationContext

                .submission.department,

        certified:

            false,

        status:

            "pending",

        evidence: [],

        certifiedAt:

            null

    };

}

/*
========================================
OPERATIONAL STATE

Domain operational state.

========================================
*/

const state = {

    evaluations:

        0,

    certifications:

        0,

    failures:

        0,

    lastCertification:

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

function rememberCertification(

    certification

) {

    state.certifications++;

    state.lastCertification =

        certification.id;

}

function incrementFailure() {

    state.failures++;

}

/*
========================================
STRUCTURAL VALIDATION

Ensures the Submission object
is structurally complete.

========================================
*/

function validateStructure(

    context

) {

    const {

        submission,

        rules,

        violations

    } = context;

    rules.push(

        "structure"

    );

    if (

        !submission.id

    ) {

        violations.push(

            "Submission identifier is required."

        );

    }

    if (

        !submission.department

    ) {

        violations.push(

            "Submission department is required."

        );

    }

    if (

        typeof submission.payload !==

        "object"

    ) {

        violations.push(

            "Submission payload must be an object."

        );

    }

}

/*
========================================
BUSINESS VALIDATION

Business rules only.

========================================
*/

function validateBusiness(

    context

) {

    const {

        submission,

        rules,

        violations

    } = context;

    rules.push(

        "business"

    );

    if (

        Object.keys(

            submission.payload

        ).length === 0

    ) {

        violations.push(

            "Submission payload is empty."

        );

    }

}

/*
========================================
POLICY VALIDATION

Reads policy from Config.

========================================
*/

function validatePolicy(

    context

) {

    const {

        rules,

        warnings

    } = context;

    rules.push(

        "policy"

    );

    const requiredTags =

        policyValue(

            "requiredTags",

            []

        );

    if (

        requiredTags.length > 0

    ) {

        warnings.push(

            "Policy tag validation pending implementation."

        );

    }

}

/*
========================================
EXECUTE VALIDATION

Coordinates all validators.

========================================
*/

function executeValidation(

    context

) {

    validateStructure(

        context

    );

    validateBusiness(

        context

    );

    validatePolicy(

        context

    );

    state.evaluations++;

    return context;

}

/*
========================================
CREATE VALIDATION RESULT

Creates immutable validation
evidence from the completed
validation context.

========================================
*/

function createValidationResult(

    context

) {

    return Object.freeze({

        submissionId:

            context.submission.id,

        department:

            context.submission.department,

        passed:

            context.violations.length === 0,

        rules:

            Object.freeze([

                ...context.rules

            ]),

        violations:

            Object.freeze([

                ...context.violations

            ]),

        warnings:

            Object.freeze([

                ...context.warnings

            ]),

        completedAt:

            timestamp()

    });

}

/*
========================================
CREATE CERTIFICATION

Creates an immutable
Certification object.

========================================
*/

function createCertification(

    result

) {

    const certification =

        Object.freeze({

            id:

                typeof Constants.generateId ===

                "function"

                    ? RuntimeId.generateValidationId()

                    : Date.now()

                        .toString(36),

            submissionId:

                result.submissionId,

            department:

                result.department,

            certified:

                result.passed,

            status:

                result.passed

                    ? "passed"

                    : "failed",

            evidence:

                Object.freeze({

                    rules:

                        result.rules,

                    violations:

                        result.violations,

                    warnings:

                        result.warnings

                }),

            certifiedAt:

                timestamp()

        });

    if (

        certification.certified

    ) {

        rememberCertification(

            certification

        );

    }

    else {

        incrementFailure();

    }

    return certification;

}

/*
========================================
CERTIFICATION PIPELINE

Submission

↓

Validation

↓

Validation Result

↓

Certification

========================================
*/

function certifySubmission(

    submission

) {

    const context =

        createValidationContext(

            submission

        );

    const evaluated =

        executeValidation(

            context

        );

    const result =

        createValidationResult(

            evaluated

        );

    return createCertification(

        result

    );

}

/*
========================================
UPDATE OPERATIONAL STATE

========================================
*/

function rememberEvaluation() {

    state.evaluations++;

}

async function validate(
    submission
) {

    const certification =

        certifySubmission(
            submission
        );

    if (!certification.certified) {

        return Object.freeze({

            certified: false,

            submission,

            certification,

            validationId:
                certification.id,

            rules:
                certification.evidence.rules,

            repair: {

                department:
                    submission.department,

                violations:
                    certification.evidence.violations,

                warnings:
                    certification.evidence.warnings

            },

            timestamp:
                certification.certifiedAt

        });

    }

    return Object.freeze({

    certified: true,

    submission,

    certification,

    validationId:
        certification.id,

    rules:
        certification.evidence.rules,

    timestamp:
        certification.certifiedAt

});

}

/*
========================================
OPERATIONAL STATE

Domain operational state.

Shared infrastructure observes
this state.

========================================
*/

function operationalState() {

    return Object.freeze({

        evaluations:

            state.evaluations,

        certifications:

            state.certifications,

        failures:

            state.failures,

        lastCertification:

            state.lastCertification

    });

}

/*
========================================
VALIDATION ORCHESTRATOR

QA-003

Certification Authority

Public API

========================================
*/

const ValidationOrchestrator =

    Object.freeze({

        /*
        ----------------------------
        Certification

        Constitutional entry point.

        ----------------------------
        */

        validate,

        /*
        ----------------------------
        Operational State

        Domain operational state.

        Shared infrastructure may
        observe this state.

        ----------------------------
        */

        operationalState

    });

/*
========================================
MODULE EXPORT

QA-003

Validation Orchestrator

Certification Authority

========================================
*/

module.exports =

    ValidationOrchestrator;