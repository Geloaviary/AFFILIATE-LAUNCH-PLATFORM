"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

output.js

Constitutional Rule QA-005

Department Artifact

        ↓

Submission Manager

This module is the ONLY constitutional
exit point for Platform Truth produced
by the Research Department.

It NEVER:

• Writes Platform Memory
• Performs Validation
• Performs Commits
• Records Audits
• Repairs Artifacts
• Mutates Artifacts

Its ONLY responsibility is to transfer
ownership of a constitutional artifact
from the Department to the Quality
Assurance Director.

==================================================
*/

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
Output Constants
==================================================
*/

const OUTPUT = Object.freeze({

    department:

        "research"

});

/*
==================================================
Submission Context

The Submission Context represents the
constitutional transfer of ownership
from the Research Department to the
Quality Assurance Director.

Once the artifact enters the
Submission Manager, the department no
longer owns its lifecycle.

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

        /*
        ----------------------------------
        Department Identity
        ----------------------------------
        */

        department:

            OUTPUT.department,

        /*
        ----------------------------------
        Artifact Identity
        ----------------------------------
        */

        artifactId:

            artifact.artifactId,

        artifactType:

            artifact.artifactType,

        version:

            artifact.version,

        /*
        ----------------------------------
        Constitutional Artifact
        ----------------------------------
        */

        artifact,

        /*
        ----------------------------------
        Submission Metadata
        ----------------------------------
        */

        submittedAt:

            new Date().toISOString(),

        options:

            Object.freeze({

                ...options

            })

    });

}

/*
==================================================
Submission

Department

        ↓

Submission Manager

==================================================
*/

async function submitArtifact(

    artifact,

    options = {}

) {

    const submission =

        buildSubmissionContext(

            artifact,

            options

        );

    return SubmissionManager.submit(

        submission

    );

}

/*
==================================================
Submission Outcome

Constitutional Responsibility

The Research Department transfers
ownership of the artifact to the
Submission Manager.

The Submission Manager returns the
constitutional outcome.

output.js NEVER interprets business
logic.

It simply normalizes the outcome and
returns it to the Research Engine.

==================================================
*/

function buildSubmissionOutcome(

    result

) {

    if (!result) {

        throw new Error(

            "Submission Manager returned an invalid submission outcome."

        );

    }

    return Object.freeze({

        /*
        ----------------------------------
        Constitutional Identity
        ----------------------------------
        */

        artifactId:

            result.artifactId,

        department:

            result.department,

        artifactType:

            result.artifactType,

        /*
        ----------------------------------
        Submission Result
        ----------------------------------
        */

        status:

            result.status,

        certified:

            Boolean(

                result.certified

            ),

        committed:

            Boolean(

                result.committed

            ),

        /*
        ----------------------------------
        Repair Information

        Present only when certification
        fails.

        ----------------------------------
        */

        repair:

            result.repair ||

            null,

        /*
        ----------------------------------
        Commit Information

        Present only after a successful
        commit.

        ----------------------------------
        */

        commit:

            result.commit ||

            null,

        /*
        ----------------------------------
        Audit Information

        Present only after a successful
        audit.

        ----------------------------------
        */

        audit:

            result.audit ||

            null

    });

}

/*
==================================================
Department Exit

Research Artifact

        ↓

Submission Manager

        ↓

Normalized Submission Outcome

==================================================
*/

async function submitArtifact(

    artifact,

    options = {}

) {

    const submission =

        buildSubmissionContext(

            artifact,

            options

        );

    const result =
        console.log("QAD: Submission Manager");
        await SubmissionManager.submit(

            submission

        );

    return buildSubmissionOutcome(

        result

    );

}

/*
==================================================
Submission Outcome Assertions

These utilities protect the constitutional
boundary between the Research Department
and the Quality Assurance Director.

The department only receives validated,
normalized submission outcomes.

==================================================
*/

/*
--------------------------------------------------
Submission Outcome Verification
--------------------------------------------------
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
--------------------------------------------------
Submission Outcome Assertion
--------------------------------------------------
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

            "Invalid constitutional submission outcome."

        );

    }

    return outcome;

}

/*
--------------------------------------------------
Submission Success
--------------------------------------------------
*/

function isCertified(

    outcome

) {

    assertSubmissionOutcome(

        outcome

    );

    return (

        outcome.certified === true &&

        outcome.committed === true

    );

}

/*
--------------------------------------------------
Submission Repair
--------------------------------------------------
*/

function requiresRepair(

    outcome

) {

    assertSubmissionOutcome(

        outcome

    );

    return (

        outcome.certified === false

    );

}

/*
==================================================
Constitutional Submission Execution

This section performs the complete
department → QAD handoff.

Once the Submission Manager accepts the
artifact, constitutional ownership is
transferred from the Research Department
to the Quality Assurance Director.

==================================================
*/

async function executeSubmission(

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
    Build Submission
    ----------------------------------
    */

    const submission =

        buildSubmissionContext(

            artifact,

            options

        );

    /*
    ----------------------------------
    Submit To QAD
    ----------------------------------
    */

    const outcome =
        
        await SubmissionManager.submit(

            submission

        );

    /*
    ----------------------------------
    Normalize Result
    ----------------------------------
    */

    const normalized =

        buildSubmissionOutcome(

            outcome

        );

    /*
    ----------------------------------
    Constitutional Verification
    ----------------------------------
    */

    assertSubmissionOutcome(

        normalized

    );

    /*
    ----------------------------------
    Return Certified Outcome

    output.js never performs
    business decisions.

    It simply returns the
    constitutional outcome.

    ----------------------------------
    */

    return normalized;

}

/*
==================================================
Public Constitutional API

This module exports the complete
constitutional interface between the
Research Department and the Quality
Assurance Director.

The exported API is immutable.

==================================================
*/

module.exports = Object.freeze({

    /*
    ----------------------------------
    Submission
    ----------------------------------
    */

    submitArtifact,

    /*
    ----------------------------------
    Submission Context
    ----------------------------------
    */

    buildSubmissionContext,

    /*
    ----------------------------------
    Submission Execution
    ----------------------------------
    */

    executeSubmission,

    /*
    ----------------------------------
    Submission Outcome
    ----------------------------------
    */

    buildSubmissionOutcome,

    isSubmissionOutcome,

    assertSubmissionOutcome,

    isCertified,

    requiresRepair

});