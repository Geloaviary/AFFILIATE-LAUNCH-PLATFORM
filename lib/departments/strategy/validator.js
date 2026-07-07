"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

validator.js

Constitutional Rule QA-007

Strategy Artifact

        │
        ▼

Validation Runtime

        │
        ▼

Validation Report

        │
        ▼

Quality Assurance Director

--------------------------------------------------

Constitutional Responsibility

This module validates immutable Strategy
Artifacts before they leave the department.

It NEVER

• Repairs Artifacts
• Executes Business Logic
• Writes Platform Memory
• Calls Department Workers
• Mutates Artifacts

==================================================
*/

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

const {

    assertStrategyArtifact

} = require(

    "./artifact"

);

/*
==================================================
Validator Runtime Identity
==================================================
*/

const VALIDATOR =

Object.freeze({

    department:

        "strategy",

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
Validation Context

Strategy Artifact

        │
        ▼

Immutable Validation Context

==================================================
*/

function buildValidationContext(

    artifact

) {

    assertStrategyArtifact(

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
Violation Builder

Every validation failure is represented by
an immutable constitutional violation.

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

        severity,

        message

    });

}

/*
==================================================
Artifact Validation

Verifies the constitutional identity of the
Strategy Artifact.

==================================================
*/

function validateArtifact(

    artifact

) {

    const violations = [];

    if (

        !artifact.artifactId

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-001",

                component:

                    "artifact",

                message:

                    "Artifact identifier is missing."

            })

        );

    }

    if (

        artifact.department !==

         "strategy"

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-002",

                component:

                    "artifact",

                message:

                    "Invalid department."

            })

        );

    }

    if (

        artifact.artifactType !==

        "strategy-package"

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-003",

                component:

                    "artifact",

                message:

                    "Invalid artifact type."

            })

        );

    }

    return violations;

}

/*
==================================================
Metadata Validation

==================================================
*/

function validateMetadata(

    metadata

) {

    const violations = [];

    if (

        !metadata

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-010",

                component:

                    "metadata",

                message:

                    "Metadata is missing."

            })

        );

        return violations;

    }

    if (

        typeof metadata.createdAt !==

        "string"

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-011",

                component:

                    "metadata",

                message:

                    "Creation timestamp is missing."

            })

        );

    }

    if (

        metadata.department !==

        "strategy"

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-012",

                component:

                    "metadata",

                message:

                    "Metadata department is invalid."

            })

        );

    }

    return violations;

}

function validatePayload(

    payload

) {

    const violations = [];

    if (

        !payload

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-020",

                component:

                    "payload",

                message:

                    "Payload is missing."

            })

        );

        return violations;

    }

    if (

        !payload.winner

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-021",

                component:

                    "winner",

                message:

                    "Winner is missing."

            })

        );

    }

    if (

        !payload.competitor

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-022",

                component:

                    "competitor",

                message:

                    "Competitor is missing."

            })

        );

    }

    if (

        !payload.marketIntelligence

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-023",

                component:

                    "market-intelligence",

                message:

                    "Market Intelligence is missing."

            })

        );

    }

    if (

        !payload.campaignIntelligence

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-024",

                component:

                    "campaign-intelligence",

                message:

                    "Campaign Intelligence is missing."

            })

        );

    }

    if (

        !payload.productIntelligence

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-025",

                component:

                    "product-intelligence",

                message:

                    "Product Intelligence is missing."

            })

        );

    }

    return violations;

}

/*
==================================================
Business Rule Validation

==================================================
*/

function validateBusinessRules(

    artifact

) {

    const violations = [];

    const payload =

        artifact.payload;

    if (

        payload.opportunities &&

        Array.isArray(

            payload.opportunities.reviewOpportunities

        ) &&

        payload.opportunities.reviewOpportunities.length === 0

    ) {

        violations.push(

            buildViolation({

                code:

                    "STRAT-050",

                component:

                    "opportunities",

                message:

                    "Strategy contains no review opportunities.",

                severity:

                    "warning"

            })

        );

    }

    return violations;

}
/*
==================================================
Validation Report

==================================================
*/

function buildValidationReport(

    context

) {

    const violations = [

        ...validateArtifact(

            context.artifact

        ),

        ...validateMetadata(

            context.artifact.metadata

        ),

        ...validatePayload(

            context.artifact.payload

        ),

        ...validateBusinessRules(

            context.artifact

        )

    ];

    const errors =

        violations.filter(

            violation =>

                violation.severity ===

                "error"

        ).length;

    const warnings =

        violations.filter(

            violation =>

                violation.severity ===

                "warning"

        ).length;

    return deepFreeze({

        runtime:

            VALIDATOR,

        validatedAt:

            context.validatedAt,

        valid:

            errors === 0,

        violations,

        statistics:

            Object.freeze({

                opportunities:

    context.artifact.payload.opportunities

        ? Object.keys(

            context.artifact.payload.opportunities

        ).length

        : 0,

                errors,

                warnings,

                violations:

                    violations.length

            })

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
Validation Runtime

Strategy Artifact

        │

        ▼

Validation Context

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
Public Runtime

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
    Validation
    ----------------------------------
    */

    buildValidationContext,

    buildValidationReport,

    /*
    ----------------------------------
    Verification
    ----------------------------------
    */

    assertValidation

});