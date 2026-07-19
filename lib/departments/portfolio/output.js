"use strict";

/*
==================================================

AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

output.js

Constitutional Department Output Boundary

Portfolio Artifact

        │
        ▼

Published Portfolio Contracts

        │
        ▼

Immutable Submission Context

        │
        ▼

Quality Assurance Director

        │
        ▼

Submission Manager

--------------------------------------------------

Constitutional Responsibility

This module is the output boundary of the
Portfolio Department.

It transfers the immutable Portfolio Artifact
and published Portfolio contracts to the
Quality Assurance Director.

It NEVER

- Validates business quality
- Certifies Portfolio output
- Commits Platform Memory
- Calls Commit Manager
- Writes Platform Memory
- Repairs Portfolio artifacts
- Executes Portfolio workers
- Declares downstream consumers

Submission Manager is the constitutional
gateway into the Quality Assurance Director.

==================================================
*/

const fs = require("fs");
const path = require("path");

const qadDir = path.resolve(
    __dirname,
    "../../quality-assurance-director"
);

console.log("QAD DIR:", qadDir);
console.log("QAD EXISTS:", fs.existsSync(qadDir));

if (fs.existsSync(qadDir)) {
    console.log("QAD FILES:", fs.readdirSync(qadDir));
}

const SubmissionManager =
    require(
        "../../quality-assurance-director/submission-manager"
    );

const {

    assertPortfolioArtifact,

    summarizePortfolioArtifact

} = require(

    "./artifact"

);

/*
==================================================
Runtime Identity

==================================================
*/

const OUTPUT =

Object.freeze({

    department:

        "portfolio",

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

function isObject(

    value

) {

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

        !isObject(

            target

        )

    ) {

        return target;

    }

    if (

        visited.has(

            target

        )

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
Published Contract Verification

The Portfolio Contract Publisher owns contract
publication.

The Output Boundary verifies only the transfer
shape required by the Quality Assurance
Director.

==================================================
*/

function assertPublishedContracts(

    contracts

) {

    if (

        !isObject(

            contracts

        )

    ) {

        throw new TypeError(

            "Published Portfolio contracts are required."

        );

    }

    return contracts;

}

/*
==================================================
Submission Context

Portfolio Artifact

        +

Published Portfolio Contracts

        │
        ▼

Immutable Submission Context

==================================================
*/

function buildSubmissionContext({

    artifact,

    contracts,

    options = {}

}) {

    assertPortfolioArtifact(

        artifact

    );

    assertPublishedContracts(

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

        typeof context.submittedAt ===

            "string" &&

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

        throw new TypeError(

            "Invalid Portfolio Submission Context."

        );

    }

    return context;

}

/*
==================================================
Department Output Runtime

Portfolio Artifact

        │
        ▼

Submission Context

        │
        ▼

Submission Manager

        │
        ▼

Quality Assurance Outcome

==================================================
*/

async function execute({

    artifact,

    contracts,

    options = {}

}) {

    const context =

        buildSubmissionContext({

            artifact,

            contracts,

            options

        });

    assertSubmissionContext(

        context

    );

    return SubmissionManager.submit(

        context

    );

}

/*
==================================================
Department Output Summary

Diagnostics and telemetry only.

==================================================
*/

function summarizeOutput(

    output

) {

    if (

        !isObject(

            output

        )

    ) {

        throw new TypeError(

            "Portfolio Department Output is required."

        );

    }

    return deepFreeze({

        artifact:

            output.artifact

                ? summarizePortfolioArtifact(

                    output.artifact

                )

                : null,

        committed:

            Boolean(

                output.committed ??

                output.submission?.committed

            ),

        certified:

            Boolean(

                output.certified ??

                output.submission?.certified

            ),

        status:

            output.status ??

            output.submission?.status ??

            "unknown"

    });

}

/*
==================================================
Public Constitutional API

==================================================
*/

module.exports =

Object.freeze({

    identity:

        OUTPUT,

    execute,

    buildSubmissionContext,

    isSubmissionContext,

    assertSubmissionContext,

    summarizeOutput

});