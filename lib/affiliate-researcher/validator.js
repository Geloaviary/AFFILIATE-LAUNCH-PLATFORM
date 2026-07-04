"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

validator.js

Constitutional Rule RD-005

Research Artifact

        │
        ▼

Validation Runtime

        │
        ▼

Validation Report

        │
        ▼

repair.js

--------------------------------------------------

Constitutional Responsibility

This module validates immutable Research
Artifacts against the constitutional
Research contract.

It NEVER

• Repairs Artifacts
• Writes Platform Memory
• Executes Business Logic
• Calls the Quality Assurance Director
• Mutates Research Artifacts

==================================================
*/

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

const {

    assertResearchArtifact

} = require(

    "./artifact"

);

/*
==================================================
Validation Runtime Identity
==================================================
*/

const VALIDATOR =

Object.freeze({

    department:

        "research",

    component:

        "validator",

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

        typeof value === "object"

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
Validation Context

Research Artifact

        │

        ▼

Immutable Validation Context

==================================================
*/

function buildValidationContext(

    artifact

) {

    assertResearchArtifact(

        artifact

    );

    return deepFreeze({

        runtime:

            VALIDATOR,

        artifact,

        validatedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Validation Violation

Represents one constitutional
validation failure.

==================================================
*/

function buildViolation({

    code,

    component,

    message,

    severity = "error"

}) {

    return deepFreeze({

        code,

        component,

        message,

        severity

    });

}

/*
==================================================
Research Identity Validation

==================================================
*/

function validateIdentity(

    artifact,

    violations

) {

    if (

        !artifact.payload.niche

    ) {

        violations.push(

            buildViolation({

                code:

                    "RSCH-001",

                component:

                    "identity",

                message:

                    "Research niche is missing."

            })

        );

    }

    if (

        !artifact.payload.winner

    ) {

        violations.push(

            buildViolation({

                code:

                    "RSCH-002",

                component:

                    "identity",

                message:

                    "Research winner is missing."

            })

        );

    }

}

/*
==================================================
Research Intelligence Validation

==================================================
*/

function validateIntelligence(

    artifact,

    violations

) {

    const payload =

        artifact.payload;

    if (

        !Array.isArray(

            payload.validatedProducts

        )

    ) {

        violations.push(

            buildViolation({

                code:

                    "RSCH-010",

                component:

                    "intelligence",

                message:

                    "Validated products are missing."

            })

        );

    }

    if (

        !Array.isArray(

            payload.top5

        )

    ) {

        violations.push(

            buildViolation({

                code:

                    "RSCH-011",

                component:

                    "intelligence",

                message:

                    "Top 5 ranking is missing."

            })

        );

    }

    if (

        !payload.marketIntelligence

    ) {

        violations.push(

            buildViolation({

                code:

                    "RSCH-012",

                component:

                    "intelligence",

                message:

                    "Market intelligence is missing."

            })

        );

    }

}

/*
==================================================
Research Assets Validation

==================================================
*/

function validateAssets(

    artifact,

    violations

) {

    if (

        !artifact.payload.assets

    ) {

        violations.push(

            buildViolation({

                code:

                    "RSCH-020",

                component:

                    "assets",

                message:

                    "Research assets are missing."

            })

        );

    }

}

/*
==================================================
Research Plan Validation

==================================================
*/

function validatePlans(

    artifact,

    violations

) {

    if (

        !artifact.payload.plans

    ) {

        violations.push(

            buildViolation({

                code:

                    "RSCH-030",

                component:

                    "plans",

                message:

                    "Research plans are missing."

            })

        );

    }

}

/*
==================================================
Validation Pipeline

==================================================
*/

function validateResearchArtifact(

    artifact

) {

    const violations = [];

    validateIdentity(

        artifact,

        violations

    );

    validateIntelligence(

        artifact,

        violations

    );

    validateAssets(

        artifact,

        violations

    );

    validatePlans(

        artifact,

        violations

    );

    return deepFreeze(

        violations

    );

}

/*
==================================================
Validation Statistics

==================================================
*/

function buildValidationStatistics(

    violations

) {

    return deepFreeze({

        totalViolations:

            violations.length,

        identityViolations:

            violations.filter(

                violation =>

                    violation.component ===

                    "identity"

            ).length,

        intelligenceViolations:

            violations.filter(

                violation =>

                    violation.component ===

                    "intelligence"

            ).length,

        assetViolations:

            violations.filter(

                violation =>

                    violation.component ===

                    "assets"

            ).length,

        planViolations:

            violations.filter(

                violation =>

                    violation.component ===

                    "plans"

            ).length

    });

}

/*
==================================================
Validation Report

==================================================
*/

function buildValidationReport(

    context

) {

    const violations =

        validateResearchArtifact(

            context.artifact

        );

    return deepFreeze({

        runtime:

            VALIDATOR,

        valid:

            violations.length === 0,

        checkedAt:

            context.validatedAt,

        violations,

        statistics:

            buildValidationStatistics(

                violations

            )

    });

}

/*
==================================================
Validation Assertion

Validation discovers violations.

Assertion determines whether execution
may continue.

==================================================
*/

function assertValidation(

    report

) {

    if (

        !report.valid

    ) {

        throw new Errors.ValidationError(

            report.violations

                .map(

                    violation =>

                        `[${violation.code}] ${violation.message}`

                )

                .join(

                    "\n"

                )

        );

    }

    return report;

}

/*
==================================================
Research Validation Runtime

Research Artifact

        │

        ▼

Validation Context

        │

        ▼

Validation Pipeline

        │

        ▼

Validation Report

        │

        ▼

Assertion

==================================================
*/

function execute(

    artifact

) {

    const context =

        buildValidationContext(

            artifact

        );

    const report =

        buildValidationReport(

            context

        );

    assertValidation(

        report

    );

    return report;

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

    execute,

    /*
    ----------------------------------
    Context
    ----------------------------------
    */

    buildValidationContext,

    /*
    ----------------------------------
    Report
    ----------------------------------
    */

    buildValidationReport,

    buildValidationStatistics,

    /*
    ----------------------------------
    Assertion
    ----------------------------------
    */

    assertValidation

});