"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

output.js

Constitutional Rule RD-004

Research Business Contract

        ↓

Research Artifact

        ↓

Quality Assurance Director

        ↓

Certified Submission

        ↓

Department Output

        ↓

UI / API

Constitutional Responsibility

This module is the ONLY exit point
for business data produced by the
Research Department.

Responsibilities

• Build Submission Context
• Transfer ownership to QAD
• Convert certified artifacts back
  into the Department contract
• Produce the UI contract

It NEVER

• Writes Platform Memory
• Performs Validation
• Repairs Artifacts
• Records Audits
• Performs Business Logic

==================================================
*/

const {

    buildResearchInput

} = require(

    "./input"

);


const SubmissionManager =
    require(
        "../quality-assurance-director/submission-manager"
    );

const {

    assertResearchArtifact

} = require(
    "./artifact"
);

/*
==================================================
Department Identity
==================================================
*/

const OUTPUT =

    Object.freeze({

        department:

            "research"

    });

/*
==================================================
Submission Context

Research Artifact

        ↓

Submission Context

The Submission Context transfers
constitutional ownership from the
Research Department to the
Quality Assurance Director.

==================================================
*/

function buildSubmissionContext(

    artifact,

    options = {}

) {

    assertResearchArtifact(

        artifact

    );

    return Object.freeze({

        department:

            OUTPUT.department,

        artifactId:

            artifact.artifactId,

        artifactType:

            artifact.artifactType,

        version:

            artifact.version,

        artifact,

        submittedAt:

            new Date()

                .toISOString(),

        options:

            Object.freeze({

                ...options

            })

    });

}

/*
==================================================
Submission Execution

Research Artifact

        ↓

Submission Manager

        ↓

Constitutional Submission Outcome

==================================================
*/

async function submitArtifact(

    artifact,

    options = {}

) {

    /*
    ----------------------------------
    Verify Constitutional Artifact
    ----------------------------------
    */

    assertResearchArtifact(

        artifact

    );

    /*
    ----------------------------------
    Build Submission Context
    ----------------------------------
    */

    const submission =

        buildSubmissionContext(

            artifact,

            options

        );

    /*
    ----------------------------------
    Submit To Quality Assurance Director
    ----------------------------------
    */

    const submissionOutcome =

        await SubmissionManager.submit(

            submission

        );

    /*
    ----------------------------------
    Return Constitutional Outcome

    output.js does not interpret
    certification.

    It simply returns the certified
    submission produced by QAD.

    ----------------------------------
    */

    return submissionOutcome;

}

/*
==================================================
Department Output

Certified Research Artifact

        +

Submission Outcome

        ↓

Research Department Contract

This is the ONLY public contract
returned by the Research Department.

The UI never receives constitutional
artifacts.

The UI never receives commit receipts.

The UI never receives audit records.

==================================================
*/

function buildDepartmentOutput({

    artifact,

    submission

}) {

    /*
    ----------------------------------
    Constitutional Verification
    ----------------------------------
    */

    assertResearchArtifact(

        artifact

    );

    assertSubmissionOutcome(

        submission

    );

    /*
    ----------------------------------
    Restore Business Contract

    The artifact payload represents
    the certified Research Result.

    ----------------------------------
    */

const research =

    buildResearchInput(

        artifact

    );

    /*
    ----------------------------------
    Department Output

    This becomes the public API
    consumed by the UI.

    ----------------------------------
    */

    return Object.freeze({

        /*
        ------------------------------
        Business Contract
        ------------------------------
        */

        ...research,

        /*
        ------------------------------
        Constitutional Metadata
        ------------------------------
        */

        artifact:

            Object.freeze({

                id:

                    artifact.artifactId,

                type:

                    artifact.artifactType,

                version:

                    artifact.version

            }),

        certification:

            Object.freeze({

                status:

                    submission.status,

                certified:

                    submission.certified,

                committed:

                    submission.committed

            })

    });

}

/*
==================================================
Submission Outcome Verification

The Submission Outcome is produced
exclusively by the Quality Assurance
Director.

The Research Department never creates
Submission Outcomes.

==================================================
*/

function isSubmissionOutcome(

    outcome

) {

    return (

        outcome !== null &&

        typeof outcome === "object" &&

        typeof outcome.artifactId ===

            "string" &&

        typeof outcome.department ===

            "string" &&

        typeof outcome.artifactType ===

            "string" &&

        typeof outcome.status ===

            "string" &&

        typeof outcome.certified ===

            "boolean" &&

        typeof outcome.committed ===

            "boolean"

    );

}

/*
==================================================
Submission Outcome Assertion
==================================================
*/

function assertSubmissionOutcome(

    outcome

) {

    if (

        !isSubmissionOutcome(

            outcome

        )

    ) {

        throw new TypeError(

            "Invalid constitutional Submission Outcome."

        );

    }

    return outcome;

}

/*
==================================================
Department Output Verification

This verifies the public contract
returned by the Research Department.

External consumers never receive
constitutional artifacts.

==================================================
*/

function isDepartmentOutput(

    output

) {

    return (

        output !== null &&

        typeof output ===

            "object" &&

        /*
        ----------------------------------
        Business Contract
        ----------------------------------
        */

        output.winner &&

        typeof output.winner ===

            "object" &&

        Array.isArray(

            output.top5

        ) &&

        Array.isArray(

            output.validatedProducts

        ) &&

        output.plans &&

        typeof output.plans ===

            "object" &&

        /*
        ----------------------------------
        Artifact Metadata
        ----------------------------------
        */

        output.artifact &&

        typeof output.artifact ===

            "object" &&

        typeof output.artifact.id ===

            "string" &&

        typeof output.artifact.type ===

            "string" &&

        /*
        ----------------------------------
        Certification
        ----------------------------------
        */

        output.certification &&

        typeof output.certification ===

            "object" &&

        typeof output.certification.status ===

            "string" &&

        typeof output.certification.certified ===

            "boolean" &&

        typeof output.certification.committed ===

            "boolean"

    );

}

/*
==================================================
Department Output Assertion
==================================================
*/

function assertDepartmentOutput(

    output

) {

    if (

        !isDepartmentOutput(

            output

        )

    ) {

        throw new TypeError(

            "Invalid Research Department Output."

        );

    }

    return output;

}

/*
==================================================
Certification Helpers

These helpers simplify Department
business logic.

==================================================
*/

function isCertified(

    output

) {

    assertDepartmentOutput(

        output

    );

    return (

        output.certification

            .certified === true &&

        output.certification

            .committed === true

    );

}

function requiresRepair(

    output

) {

    assertDepartmentOutput(

        output

    );

    return (

        output.certification

            .certified === false

    );

}

/*
==================================================
Constitutional Submission Execution

Research Business Contract

        ↓

Research Artifact

        ↓

Submission Manager

        ↓

Department Output

This is the complete constitutional
execution pipeline for the Research
Department.

==================================================
*/

async function executeDepartmentOutput(

    artifact,

    options = {}

) {

    /*
    ----------------------------------
    Verify Artifact
    ----------------------------------
    */

    assertResearchArtifact(

        artifact

    );

    /*
    ----------------------------------
    Submit To QAD
    ----------------------------------
    */

    const submission =

        await submitArtifact(

            artifact,

            options

        );

    /*
    ----------------------------------
    Build Department Output
    ----------------------------------
    */
    
    const output =

        buildDepartmentOutput({

            artifact,

            submission

        });

    /*
    ----------------------------------
    Verify Department Contract
    ----------------------------------
    */

    assertDepartmentOutput(

        output

    );

    /*
    ----------------------------------
    Return Department Output
    ----------------------------------
    */

    return output;

}

/*
==================================================
Department Output Builder

Convenience wrapper.

Artifact

+

Options

↓

Department Output

==================================================
*/

async function execute(
    artifact,

    options = {}

) {

    return executeDepartmentOutput(

        artifact,

        options

    );

}

/*
==================================================
Public Constitutional API

The Research Department exports only
its constitutional runtime.

Every department in the platform
implements the exact same API.

==================================================
*/

module.exports =

    Object.freeze({

        /*
        ----------------------------------
        Submission
        ----------------------------------
        */

        execute,

        /*
        ----------------------------------
        Context
        ----------------------------------
        */

        buildSubmissionContext,

        /*
        ----------------------------------
        Department Output
        ----------------------------------
        */

        buildDepartmentOutput,

        isDepartmentOutput,

        assertDepartmentOutput,

        /*
        ----------------------------------
        Submission Outcome
        ----------------------------------
        */

        isSubmissionOutcome,

        assertSubmissionOutcome,

        /*
        ----------------------------------
        Department Status
        ----------------------------------
        */

        isCertified,

        requiresRepair,

    });

