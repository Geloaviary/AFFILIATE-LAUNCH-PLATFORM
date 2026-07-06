"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

output.js

Constitutional Rule RD-004

Output Runtime V3

--------------------------------------------------

Research Business

        │

        ▼

Research Artifact

        │

        ▼

Research Contract Publisher

        │

        ▼

Research Output Runtime

        │

        ▼

Submission Manager

        │

        ▼

Quality Assurance Director

        │

        ▼

Platform Memory

        │

        ▼

Research Department Output

--------------------------------------------------

Constitutional Responsibility

This module is the ONLY constitutional
publishing gateway for the Research
Department.

Responsibilities

• Verify constitutional inputs
• Build immutable Submission Context
• Transfer ownership to the
  Quality Assurance Director
• Restore Department Business Context
• Produce immutable Department Output

It NEVER

• Executes Research
• Creates Artifacts
• Creates Contracts
• Performs Validation
• Repairs Artifacts
• Writes Platform Memory

==================================================
*/

const Errors =
require(
    "../quality-assurance-director/errors"
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

const {

    assertContracts

} = require(
    "./contracts"
);

/*
==================================================
Runtime Identity
==================================================
*/

const OUTPUT =

Object.freeze({

    department:

        "research",

    component:

        "output",

    version:

        "3.0.0"

});

/*
==================================================
Internal Utilities
==================================================
*/

function isObject(value) {

    return (

        value !== null &&

        typeof value ===

            "object"

    );

}

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

    visited.add(target);

    Object.freeze(target);

    for (

        const key of

        Object.keys(target)

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
Submission Context

Research Artifact

+

Department Contracts

        │

        ▼

Immutable Submission Context

This object transfers constitutional
ownership from the Research
Department to the Quality Assurance
Director.

==================================================
*/

function buildSubmissionContext({

    artifact,

    contracts,

    options = {}

}) {

    assertResearchArtifact(

        artifact

    );

    assertContracts(

        contracts

    );

    return deepFreeze({

        department:

            OUTPUT.department,

        artifact,

        contracts,

        submittedAt:

            new Date()

                .toISOString(),

        options:

            deepFreeze({

                ...options

            })

    });

}

/*
==================================================
Submission Context Verification

==================================================
*/

function isSubmissionContext(

    context

) {

    return (

        isObject(

            context

        ) &&

        context.department ===

            OUTPUT.department &&

        isObject(

            context.artifact

        ) &&

        isObject(

            context.contracts

        ) &&

        isObject(

            context.options

        )

    );

}

function assertSubmissionContext(

    context

) {

    if (

        !isSubmissionContext(

            context

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Submission Context."

        );

    }

    return context;

}

/*
==================================================
Submission Summary

Useful for diagnostics,
auditing and telemetry.

==================================================
*/

function summarizeSubmission(

    context

) {

    assertSubmissionContext(

        context

    );

    return deepFreeze({

        department:

            context.department,

        artifactId:

            context.artifact

                .artifactId,

        contractCount:

            Object.keys(

                context.contracts

            ).length,

        submittedAt:

            context.submittedAt

    });

}

/*
==================================================
Part 2

Submission Runtime

        │

        ▼

Submission Manager

        │

        ▼

Submission Outcome

==================================================
*/

/*
==================================================
Submission Runtime

Submission Context

        │

        ▼

Submission Manager

        │

        ▼

Submission Outcome

The Research Department transfers
constitutional ownership of its work
to the Quality Assurance Director.

==================================================
*/

async function publish({

    artifact,

    contracts,

    options = {}

}) {

    /*
    ----------------------------------
    Constitutional Verification
    ----------------------------------
    */

    assertResearchArtifact(

        artifact

    );

    assertContracts(

        contracts

    );

    /*
    ----------------------------------
    Immutable Submission Context
    ----------------------------------
    */

    const context =

        buildSubmissionContext({

            artifact,

            contracts,

            options

        });

    /*
    ----------------------------------
    Transfer Ownership

    The Research Department no longer
    owns the submission after this
    point.

    ----------------------------------
    */

    const outcome =

        await SubmissionManager.submit(

            context

        );

    /*
    ----------------------------------
    Constitutional Verification

    Verify the Quality Assurance
    Director returned a valid
    Submission Outcome.

    ----------------------------------
    */

    assertSubmissionOutcome(

        outcome

    );

    /*
    ----------------------------------
    Restore Department Output

    ----------------------------------
    */

    return buildDepartmentOutput({

        artifact,

        outcome

    });

}

/*
==================================================
Submission Outcome

Produced ONLY by the Quality
Assurance Director.

Departments never construct
Submission Outcomes.

==================================================
*/

function isSubmissionOutcome(

    outcome

) {

    return (

        isObject(

            outcome

        ) &&

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

function assertSubmissionOutcome(

    outcome

) {

    if (

        !isSubmissionOutcome(

            outcome

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Submission Outcome."

        );

    }

    return outcome;

}

/*
==================================================
Submission Diagnostics

Useful for runtime logging,
telemetry and auditing.

==================================================
*/

function summarizeOutcome(

    outcome

) {

    assertSubmissionOutcome(

        outcome

    );

    return deepFreeze({

        artifactId:

            outcome.artifactId,

        department:

            outcome.department,

        certified:

            outcome.certified,

        committed:

            outcome.committed,

        status:

            outcome.status

    });

}

/*
==================================================
Part 3

Department Output

↓

Public Runtime

↓

Exports

==================================================
*/

/*
==================================================
Department Output

Research Artifact

        │

        ▼

Business Contract

        │

        ▼

Public Department Output

The UI, API and other platform
components consume ONLY the
Department Output.

They never consume Artifacts,
Contracts or Submission Context.

==================================================
*/

function buildDepartmentOutput({

    artifact,

    outcome

}) {

    assertResearchArtifact(

        artifact

    );

    assertSubmissionOutcome(

        outcome

    );

    /*
    ----------------------------------
    Restore Business Context

    ----------------------------------
    */

    const business =

        deepFreeze({

            ...artifact.payload

        });

    /*
    ----------------------------------
    Department Output

    ----------------------------------
    */

    return deepFreeze({

        /*
        ------------------------------
        Business Contract
        ------------------------------
        */

        ...business,

        /*
        ------------------------------
        Artifact Information

        ------------------------------
        */

        artifact:

            deepFreeze({

                id:

                    artifact.artifactId,

                type:

                    artifact.artifactType,

                version:

                    artifact.version

            }),

        /*
        ------------------------------
        Constitutional Status

        ------------------------------
        */

        submission:

            deepFreeze({

                certified:

                    outcome.certified,

                committed:

                    outcome.committed,

                status:

                    outcome.status

            })

    });

}

/*
==================================================
Department Output Verification

==================================================
*/

function isDepartmentOutput(

    output

) {

    return (

        isObject(

            output

        ) &&

        isObject(

            output.artifact

        ) &&

        isObject(

            output.submission

        )

    );

}

function assertDepartmentOutput(

    output

) {

    if (

        !isDepartmentOutput(

            output

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Department Output."

        );

    }

    return output;

}

/*
==================================================
Public Constitutional API

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------
    Runtime
    ----------------------------------
    */

    publish,

    /*
    ----------------------------------
    Submission
    ----------------------------------
    */

    buildSubmissionContext,

    summarizeSubmission,

    summarizeOutcome,

    /*
    ----------------------------------
    Output
    ----------------------------------
    */

    buildDepartmentOutput,

    /*
    ----------------------------------
    Assertions
    ----------------------------------
    */

    assertSubmissionContext,

    assertSubmissionOutcome,

    assertDepartmentOutput

});