"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

output.js

Constitutional Rule QA-006

Strategy Artifact

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

This module prepares immutable Strategy
Artifacts for delivery outside the department.

It NEVER

• Executes Strategy Workers
• Modifies Business Data
• Repairs Artifacts
• Performs Quality Assurance
• Writes Platform Memory

==================================================
*/

const {

    assertStrategyArtifact,

    summarizeStrategyArtifact,

    serializeStrategyArtifact,

    snapshotStrategyArtifact

} = require("./artifact");

/*
==================================================
Runtime Identity
==================================================
*/

const OUTPUT =

Object.freeze({

    department:

        "strategy",

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
Strategy Department.

==================================================
*/

function buildOutputContext(

    artifact

) {

    assertStrategyArtifact(

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

Strategy Artifact

        │

        ▼

Immutable Strategy Output

==================================================
*/

function buildStrategyOutput(

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

            summarizeStrategyArtifact(

                context.artifact

            )

    });

}

/*
==================================================
Output Verification

==================================================
*/

function isStrategyOutput(

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

function assertStrategyOutput(

    output

) {

    if (

        !isStrategyOutput(

            output

        )

    ) {

        throw new TypeError(

            "Invalid Strategy Output."

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

function summarizeStrategyOutput(

    output

) {

    assertStrategyOutput(

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

Strategy Artifact

        │

        ▼

Output Context

        │

        ▼

Immutable Strategy Output

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

    assertStrategyArtifact(

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

        buildStrategyOutput(

            context

        );

    /*
    ----------------------------------
    Verify Output Contract
    ----------------------------------
    */

    assertStrategyOutput(

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

function snapshotStrategyOutput(

    output

) {

    assertStrategyOutput(

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

function serializeStrategyOutput(

    output

) {

    assertStrategyOutput(

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
Strategy Output Runtime.

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

    buildStrategyOutput,

    /*
    ----------------------------------
    Verification
    ----------------------------------
    */

    isStrategyOutput,

    assertStrategyOutput,

    /*
    ----------------------------------
    Operations
    ----------------------------------
    */

    snapshotStrategyOutput,

    serializeStrategyOutput,

    summarizeStrategyOutput

});

