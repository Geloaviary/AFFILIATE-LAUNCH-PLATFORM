"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

validator.js

Constitutional Rule QA-007

Portfolio Artifact

        â”‚
        â–¼

Validation Runtime

        â”‚
        â–¼

Validation Report

        â”‚
        â–¼

Quality Assurance Director

--------------------------------------------------

Constitutional Responsibility

This module validates immutable Portfolio
Artifacts before they leave the department.

It NEVER

â€¢ Repairs Artifacts
â€¢ Executes Business Logic
â€¢ Writes Platform Memory
â€¢ Calls Department Workers
â€¢ Mutates Artifacts

==================================================
*/

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

const {

    assertPortfolioArtifact

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

        "portfolio",

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

Portfolio Artifact

        â”‚
        â–¼

Immutable Validation Context

==================================================
*/

function buildValidationContext(

    artifact

) {

    assertPortfolioArtifact(

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
Portfolio Artifact.

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

                    "PORT-001",

                component:

                    "artifact",

                message:

                    "Artifact identifier is missing."

            })

        );

    }

    if (

        artifact.department !==

         "portfolio"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-002",

                component:

                    "artifact",

                message:

                    "Invalid department."

            })

        );

    }

    if (

        artifact.artifactType !==

        "portfolio-review"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-003",

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

                    "PORT-010",

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

                    "PORT-011",

                component:

                    "metadata",

                message:

                    "Creation timestamp is missing."

            })

        );

    }

    if (

        metadata.department !==

        "portfolio"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-012",

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

    if (!payload) {

        violations.push(

            buildViolation({

                code: "PORT-020",
                component: "payload",
                message: "Payload is missing."

            })

        );

        return violations;

    }

    if (!payload.engine) {

        violations.push(

            buildViolation({

                code: "PORT-021",
                component: "engine",
                message: "Engine information is missing."

            })

        );

    }

    if (

    !payload.workspace

) {

    violations.push(

        buildViolation({

            code:

                "PORT-022",

            component:

                "workspace",

            message:

                "Portfolio Workspace is missing."

        })

    );

}

    if (!payload.review) {

        violations.push(

            buildViolation({

                code: "PORT-023",
                component: "review",
                message: "Review is missing."

            })

        );

    }

    if (

        typeof payload.executedAt !==

        "string"

    ) {

        violations.push(

            buildViolation({

                code: "PORT-024",
                component: "executedAt",
                message: "Execution timestamp is missing."

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

    return [];

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

        ),

        ...validateWorkspace(

           context.artifact.payload.workspace

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

Portfolio Artifact

        â”‚

        â–¼

Validation Context

        â”‚

        â–¼

Validation Report

        â”‚

        â–¼

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

function validateWorkspace(

    workspace

) {

    const violations = [];

    if (

        !workspace

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-030",

                component:

                    "workspace",

                message:

                    "Workspace is missing."

            })

        );

        return violations;

    }

    if (

    !Object.isFrozen(

        workspace

    )

) {

    violations.push(

        buildViolation({

            code:

                "PORT-035",

            component:

                "workspace",

            message:

                "Workspace must be immutable."

        })

    );

}

    return [

        ...validateWorkspaceMetadata(

            workspace.metadata

        ),

        ...validateWorkspaceContracts(

            workspace.contracts

        ),

        ...validateWorkspaceStatistics(

            workspace.statistics

        ),

        ...validateWorkspaceCompletion(

           workspace.completion

        )

    ];

}

function validateWorkspaceMetadata(

    metadata

) {

    const violations = [];

    if (

        !metadata

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-031",

                component:

                    "workspace.metadata",

                message:

                    "Workspace metadata is missing."

            })

        );

        return violations;

    }

    if (

        metadata.department !==

        "portfolio"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-032",

                component:

                    "workspace.metadata",

                message:

                    "Workspace department is invalid."

            })

        );

    }

    if (

        typeof metadata.workspaceVersion !==

        "string"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-033",

                component:

                    "workspace.metadata",

                message:

                    "Workspace version is missing."

            })

        );

    }

    if (

        typeof metadata.generatedAt !==

        "string"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-034",

                component:

                    "workspace.metadata",

                message:

                    "Workspace timestamp is missing."

            })

        );

    }

    return violations;

}

function validateWorkspaceContracts(

    contracts

) {

    const violations = [];

    if (

        !contracts

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-040",

                component:

                    "workspace.contracts",

                message:

                    "Workspace contracts are missing."

            })

        );

        return violations;

    }

    if (

    !Object.isFrozen(

        contracts

    )

) {

    violations.push(

        buildViolation({

            code:

                "PORT-043",

            component:

                "workspace.contracts",

            message:

                "Workspace contracts collection must be immutable."

        })

    );

}

    const required = [

        "campaigns",

        "composition",

        "ranking",

        "scaleDecisions",

        "killDecisions",

        "allocation",

        "statistics",

        "health",

        "history"

    ];

    for (

        const contract of required

    ) {

        if (

            !contracts[contract]

        ) {

            violations.push(

                buildViolation({

                    code:

                        "PORT-041",

                    component:

                        `workspace.contracts.${contract}`,

                    message:

                        `${contract} contract is missing.`

                })

            );

        }

        else if (

    !Object.isFrozen(

        contracts[contract]

    )

) {

    violations.push(

        buildViolation({

            code:

                "PORT-042",

            component:

                `workspace.contracts.${contract}`,

            message:

                `${contract} contract is mutable.`

        })

    );

}

    }

    return violations;

}

function validateWorkspaceStatistics(

    statistics

) {

    const violations = [];

    if (

        !statistics

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-050",

                component:

                    "workspace.statistics",

                message:

                    "Workspace statistics are missing."

            })

        );

        return violations;

    }

    const required = [

        "campaigns",

        "composition",

        "ranking",

        "scaleDecisions",

        "killDecisions",

        "allocation",

        "statistics",

        "health",

        "history"

    ];

    for (

        const field of required

    ) {

        if (

            typeof statistics[field] !==

            "number"

        ) {

            violations.push(

                buildViolation({

                    code:

                        "PORT-051",

                    component:

                        `workspace.statistics.${field}`,

                    message:

                        `${field} statistic is invalid.`

                })

            );

        }

    }

    return violations;

}

function validateWorkspaceCompletion(

       completion

) {

    const violations = [];

    if (

        !completion

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-060",

                component:

                    "workspace.completion",

                message:

                    "Workspace completion is missing."

            })

        );

        return violations;

    }

    if (

        completion.plannerCompleted !==

        true

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-061",

                component:

                    "workspace.completion",

                message:

                    "Planner completion is invalid."

            })

        );

    }

    if (

        completion.workspaceComplete !==

        true

    ) {

        violations.push(

            buildViolation({

                code:

                    "PORT-062",

                component:

                    "workspace.completion",

                message:

                    "Workspace completion is invalid."

            })

        );

    }

if (

    completion.immutable !==

    true

) {

        violations.push(

            buildViolation({

                code:

                    "PORT-063",

                component:

                    "workspace.completion",

                message:

                    "Workspace is not immutable."

            })

        );

    }

    if (

    !Object.isFrozen(

        completion

    )

) {

    violations.push(

        buildViolation({

            code:

                "PORT-064",

            component:

                "workspace.completion",

            message:

                "Completion record must be immutable."

        })

    );

}

    return violations;

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