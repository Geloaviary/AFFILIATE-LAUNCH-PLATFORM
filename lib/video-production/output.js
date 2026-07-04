"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Production Department

output.js

Constitutional Rule QA-006

Production Artifact

        │
        ▼

Output Runtime

        │
        ▼

Quality Assurance Director

        │
        ▼

Platform Memory

--------------------------------------------------

Constitutional Responsibility

This module prepares immutable Production
Artifacts for delivery outside the department.

It NEVER

• Executes Production Workers
• Modifies Business Data
• Repairs Artifacts
• Performs Quality Assurance
• Writes Platform Memory

==================================================
*/

const {

    assertProductionArtifact,

    summarizeProductionArtifact,

    serializeProductionArtifact,

    snapshotProductionArtifact

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

        "production",

    component:

        "output",

    version:

        "1.0.0"

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
Output Context

Creates the immutable runtime context used
by the Output Runtime.

The Output Context is internal to the
Production Department.

==================================================
*/

function buildOutputContext(

    artifact

) {

    assertProductionArtifact(

        artifact

    );

    return deepFreeze({

        artifact,

        runtime:

            OUTPUT,

        producedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Output Construction

Production Artifact

        │

        ▼

Immutable Production Output

==================================================
*/

function buildProductionOutput(

    context

) {

    return deepFreeze({

        runtime:

            context.runtime,

        producedAt:

            context.producedAt,

        artifact:

            context.artifact,

        summary:

            summarizeProductionArtifact(

                context.artifact

            )

    });

}

/*
==================================================
Output Verification

==================================================
*/

function isProductionOutput(

    output

) {

    return (

        isObject(

            output

        ) &&

        isObject(

            output.runtime

        ) &&

        isObject(

            output.artifact

        ) &&

        isObject(

            output.summary

        ) &&

        typeof output.producedAt ===

            "string"

    );

}

/*
==================================================
Output Assertion

==================================================
*/

function assertProductionOutput(

    output

) {

    if (

        !isProductionOutput(

            output

        )

    ) {

        throw new TypeError(

            "Invalid Production Output."

        );

    }

    return output;

}

/*
==================================================
Output Summary

Provides a lightweight immutable runtime
summary without exposing the full artifact.

==================================================
*/

function summarizeProductionOutput(

    output

) {

    assertProductionOutput(

        output

    );

    return deepFreeze({

        department:

            output.runtime.department,

        component:

            output.runtime.component,

        version:

            output.runtime.version,

        producedAt:

            output.producedAt,

        artifact:

            output.summary

    });

}

/*
==================================================
Output Runtime

Production Artifact

        │

        ▼

Output Context

        │

        ▼

Immutable Production Output

==================================================
*/

function execute(

    artifact

) {

    /*
    ----------------------------------
    Verify Constitutional Artifact
    ----------------------------------
    */

    assertProductionArtifact(

        artifact

    );

    /*
    ----------------------------------
    Build Output Context
    ----------------------------------
    */

    const context =

        buildOutputContext(

            artifact

        );

    /*
    ----------------------------------
    Build Immutable Output
    ----------------------------------
    */

    const output =

        buildProductionOutput(

            context

        );

    /*
    ----------------------------------
    Verify Output Contract
    ----------------------------------
    */

    assertProductionOutput(

        output

    );

    /*
    ----------------------------------
    Return Immutable Output
    ----------------------------------
    */

    return output;

}

/*
==================================================
Output Snapshot

Creates a detached mutable snapshot for:

• QA
• Diagnostics
• Reports
• Learning

==================================================
*/

function snapshotProductionOutput(

    output

) {

    assertProductionOutput(

        output

    );

    return structuredClone(

        output

    );

}

/*
==================================================
Output Serialization

Canonical transport format.

==================================================
*/

function serializeProductionOutput(

    output

) {

    assertProductionOutput(

        output

    );

    return JSON.stringify(

        output,

        null,

        2

    );

}

/*
==================================================
Public Runtime

Constitutional public interface for the
Production Output Runtime.

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------
    Runtime
    ----------------------------------
    */

    execute,

    /*
    ----------------------------------
    Output
    ----------------------------------
    */

    buildOutputContext,

    buildProductionOutput,

    /*
    ----------------------------------
    Verification
    ----------------------------------
    */

    isProductionOutput,

    assertProductionOutput,

    /*
    ----------------------------------
    Operations
    ----------------------------------
    */

    snapshotProductionOutput,

    serializeProductionOutput,

    summarizeProductionOutput

});

