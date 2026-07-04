"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Production Department

validator.js

Constitutional Rule QA-007

Production Artifact

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

This module validates immutable Production
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

    assertProductionArtifact

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

        "production",

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

Production Artifact

        │
        ▼

Immutable Validation Context

==================================================
*/

function buildValidationContext(

    artifact

) {

    assertProductionArtifact(

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
Production Artifact.

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

                    "PROD-001",

                component:

                    "artifact",

                message:

                    "Artifact identifier is missing."

            })

        );

    }

    if (

        artifact.department !==

        "production"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-002",

                component:

                    "artifact",

                message:

                    "Invalid department."

            })

        );

    }

    if (

        artifact.artifactType !==

        "production-package"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-003",

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

                    "PROD-010",

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

                    "PROD-011",

                component:

                    "metadata",

                message:

                    "Creation timestamp is missing."

            })

        );

    }

    if (

        metadata.department !==

        "production"

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-012",

                component:

                    "metadata",

                message:

                    "Metadata department is invalid."

            })

        );

    }

    return violations;

}

/*
==================================================
Payload Validation

==================================================
*/

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

                    "PROD-020",

                component:

                    "payload",

                message:

                    "Payload is missing."

            })

        );

        return violations;

    }

    if (

        !payload.videoPlan

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-021",

                component:

                    "video-plan",

                message:

                    "Video Plan is missing."

            })

        );

    }

    if (

        !Array.isArray(

            payload.scenes

        )

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-022",

                component:

                    "scenes",

                message:

                    "Scenes collection is missing."

            })

        );

    }

    if (

        !payload.timeline

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-023",

                component:

                    "timeline",

                message:

                    "Timeline is missing."

            })

        );

    }

    if (

        !payload.metadata

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-024",

                component:

                    "metadata",

                message:

                    "Production metadata is missing."

            })

        );

    }

    return violations;

}

/*
==================================================
Scene Validation

==================================================
*/

function validateScenes(

    scenes

) {

    const violations = [];

    if (

        !Array.isArray(

            scenes

        )

    ) {

        return violations;

    }

    scenes.forEach(

        (

            scene,

            index

        ) => {

            if (

                !scene

            ) {

                violations.push(

                    buildViolation({

                        code:

                            "PROD-030",

                        component:

                            "scene",

                        message:

                            `Scene ${index} is missing.`

                    })

                );

                return;

            }

            if (

                !scene.id

            ) {

                violations.push(

                    buildViolation({

                        code:

                            "PROD-031",

                        component:

                            "scene",

                        message:

                            `Scene ${index} has no identifier.`

                    })

                );

            }

            if (

                !scene.duration

            ) {

                violations.push(

                    buildViolation({

                        code:

                            "PROD-032",

                        component:

                            "scene",

                        message:

                            `Scene ${index} has no duration.`

                    })

                );

            }

        }

    );

    return violations;

}

/*
==================================================
Timeline Validation

==================================================
*/

function validateTimeline(

    timeline

) {

    const violations = [];

    if (

        !timeline

    ) {

        return violations;

    }

    if (

        !Array.isArray(

            timeline.entries ||

            timeline.scenes

        )

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-040",

                component:

                    "timeline",

                message:

                    "Timeline contains no entries."

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

        Array.isArray(

            payload.scenes

        ) &&

        payload.scenes.length === 0

    ) {

        violations.push(

            buildViolation({

                code:

                    "PROD-050",

                component:

                    "production",

                message:

                    "Production contains no scenes."

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

        ...validateScenes(

            context.artifact.payload.scenes

        ),

        ...validateTimeline(

            context.artifact.payload.timeline

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

                scenes:

                    Array.isArray(

                        context.artifact

                            .payload

                            .scenes

                    )

                        ? context.artifact

                            .payload

                            .scenes

                            .length

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

Production Artifact

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