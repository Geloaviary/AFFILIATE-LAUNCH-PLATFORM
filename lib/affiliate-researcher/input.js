"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

input.js

Constitutional Rule RD-003

Platform Memory

        ↓

Research Artifact

        ↓

Research Business Contract

This module restores immutable
Research Artifacts into the
Research Department's business
contract.

It NEVER

• Writes Platform Memory
• Performs Validation
• Repairs Artifacts
• Calls the QAD
• Performs Business Logic

==================================================
*/

const {

    assertResearchArtifact

} = require(

    "./artifact"

);

/*
==================================================
Research Input

Research Artifact

        ↓

Research Business Contract

==================================================
*/

function buildResearchInput(

    artifact

) {

    assertResearchArtifact(

        artifact

    );

    return Object.freeze({

        ...artifact.payload

    });

}

/*
==================================================
Research Input Verification
==================================================
*/

function isResearchInput(

    input

) {

    return (

        input !== null &&

        typeof input ===

            "object" &&

        input.winner &&

        typeof input.winner ===

            "object" &&

        Array.isArray(

            input.top5

        ) &&

        Array.isArray(

            input.validatedProducts

        ) &&

        input.plans &&

        typeof input.plans ===

            "object"

    );

}

/*
==================================================
Research Input Assertion
==================================================
*/

function assertResearchInput(

    input

) {

    if (

        !isResearchInput(

            input

        )

    ) {

        throw new TypeError(

            "Invalid Research Input."

        );

    }

    return input;

}

/*
==================================================
Research Input Execution

Research Artifact

        ↓

Research Business Contract

==================================================
*/

function executeInput(

    artifact

) {

    const input =

        buildResearchInput(

            artifact

        );

    assertResearchInput(

        input

    );

    return input;

}

module.exports =

    Object.freeze({

        buildResearchInput,

        isResearchInput,

        assertResearchInput,

        executeInput

    });

    