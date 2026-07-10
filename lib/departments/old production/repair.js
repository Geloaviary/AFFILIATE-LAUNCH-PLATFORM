"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Production Department

repair.js

Constitutional Rule QA-008

Production Artifact

        │
        ▼

Validation Report

        │
        ▼

Repair Runtime

        │
        ▼

Repair Report

--------------------------------------------------

Constitutional Responsibility

This module repairs immutable Production
Artifacts using the constitutional
Validation Report.

It NEVER

• Executes Production Workers
• Performs Validation
• Writes Platform Memory
• Calls Quality Assurance Director
• Mutates the original Artifact

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

const {

    assertValidation

} = require(

    "./validator"

);

/*
==================================================
Repair Runtime Identity
==================================================
*/

const REPAIR =

Object.freeze({

    department:

        "production",

    component:

        "repair",

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
Repair Context

Production Artifact

        │

Validation Report

        │

        ▼

Immutable Repair Context

==================================================
*/

function buildRepairContext({

    artifact,

    report

}) {

    assertProductionArtifact(

        artifact

    );

    assertValidation(

        report

    );

    return deepFreeze({

        runtime:

            REPAIR,

        artifact,

        report,

        repairedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Repair Action

Represents a single immutable repair
performed by the Repair Runtime.

==================================================
*/

function buildRepairAction({

    code,

    component,

    description

}) {

    return deepFreeze({

        code,

        component,

        description

    });

}

/*
==================================================
Artifact Repairs

Repairs constitutional artifact identity.

==================================================
*/

function repairArtifact(

    artifact,

    violations,

    repairs

) {

    const repaired =

        structuredClone(

            artifact

        );

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "PROD-001":

                repaired.artifactId ??=

                    "PROD-ART-UNKNOWN";

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "artifact",

                        description:

                            "Generated missing artifact identifier."

                    })

                );

                break;

            case "PROD-002":

                repaired.department =

                    "production";

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "artifact",

                        description:

                            "Restored production department."

                    })

                );

                break;

            case "PROD-003":

                repaired.artifactType =

                    "production-package";

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "artifact",

                        description:

                            "Restored artifact type."

                    })

                );

                break;

        }

    }

    return repaired;

}

/*
==================================================
Metadata Repairs

==================================================
*/

function repairMetadata(

    artifact,

    violations,

    repairs

) {

    const repaired =

        structuredClone(

            artifact

        );

    repaired.metadata ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "PROD-010":

                repaired.metadata = {

                    department:

                        "production",

                    artifactType:

                        "production-package",

                    runtimeVersion:

                        "1.0.0",

                    createdAt:

                        new Date()

                            .toISOString()

                };

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "metadata",

                        description:

                            "Created missing metadata."

                    })

                );

                break;

            case "PROD-011":

                repaired.metadata.createdAt =

                    new Date()

                        .toISOString();

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "metadata",

                        description:

                            "Restored creation timestamp."

                    })

                );

                break;

            case "PROD-012":

                repaired.metadata.department =

                    "production";

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "metadata",

                        description:

                            "Corrected metadata department."

                    })

                );

                break;

        }

    }

    return repaired;

}

/*
==================================================
Payload Repairs

==================================================
*/

function repairPayload(

    artifact,

    violations,

    repairs

) {

    const repaired =

        structuredClone(

            artifact

        );

    repaired.payload ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "PROD-021":

                repaired.payload.videoPlan ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "video-plan",

                        description:

                            "Created empty Video Plan."

                    })

                );

                break;

            case "PROD-022":

                repaired.payload.scenes ??= [];

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "scenes",

                        description:

                            "Created empty scene collection."

                    })

                );

                break;

            case "PROD-023":

                repaired.payload.timeline ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "timeline",

                        description:

                            "Created empty timeline."

                    })

                );

                break;

            case "PROD-024":

                repaired.payload.metadata ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "payload",

                        description:

                            "Created production payload metadata."

                    })

                );

                break;

        }

    }

    return repaired;

}

/*
==================================================
Scene Repairs

Repairs Production Scene violations.

==================================================
*/

function repairScenes(

    working,

    violations,

    repairs

) {

    working.payload ??= {};

    working.payload.scenes ??= [];

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "PROD-030":

                working.payload.scenes.push({

                    id:

                        `scene-${working.payload.scenes.length + 1}`,

                    duration:

                        5

                });

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "scene",

                        description:

                            "Created missing scene."

                    })

                );

                break;

            case "PROD-031":

                working.payload.scenes.forEach(

                    (

                        scene,

                        index

                    ) => {

                        scene.id ??=

                            `scene-${index + 1}`;

                    }

                );

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "scene",

                        description:

                            "Assigned missing scene identifiers."

                    })

                );

                break;

            case "PROD-032":

                working.payload.scenes.forEach(

                    scene => {

                        scene.duration ??= 5;

                    }

                );

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "scene",

                        description:

                            "Assigned default scene duration."

                    })

                );

                break;

        }

    }

    return working;

}

/*
==================================================
Timeline Repairs

Repairs Production Timeline violations.

==================================================
*/

function repairTimeline(

    working,

    violations,

    repairs

) {

    working.payload ??= {};

    working.payload.timeline ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "PROD-040":

                working.payload.timeline.entries =

                    working.payload.scenes.map(

                        scene => ({

                            sceneId:

                                scene.id,

                            duration:

                                scene.duration

                        })

                    );

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "timeline",

                        description:

                            "Rebuilt timeline entries."

                    })

                );

                break;

        }

    }

    return working;

}

/*
==================================================
Repair Report

Immutable constitutional repair report.

==================================================
*/

function buildRepairReport({

    artifact,

    repairs,

    repairedAt

}) {

    return deepFreeze({

        runtime:

            REPAIR,

        repairedAt,

        repairedArtifact:

            artifact,

        repairs,

        statistics:

            Object.freeze({

                repairsApplied:

                    repairs.length

            })

    });

}

/*
==================================================
Repair Runtime

Immutable Artifact

        │

        ▼

Working Copy

        │

        ▼

Repair Pipeline

        │

        ▼

Immutable Repair Report

==================================================
*/

function execute({

    artifact,

    report

}) {

    /*
    ----------------------------------
    Build Runtime Context
    ----------------------------------
    */

    const context =

        buildRepairContext({

            artifact,

            report

        });

    /*
    ----------------------------------
    Create Single Working Copy
    ----------------------------------
    */

    const working =

        structuredClone(

            context.artifact

        );

    /*
    ----------------------------------
    Shared Repair Log
    ----------------------------------
    */

    const repairs = [];

    /*
    ----------------------------------
    Execute Repair Pipeline
    ----------------------------------
    */

    repairArtifact(

        working,

        report.violations,

        repairs

    );

    repairMetadata(

        working,

        report.violations,

        repairs

    );

    repairPayload(

        working,

        report.violations,

        repairs

    );

    repairScenes(

        working,

        report.violations,

        repairs

    );

    repairTimeline(

        working,

        report.violations,

        repairs

    );

    /*
    ----------------------------------
    Freeze Repaired Artifact
    ----------------------------------
    */

    const repairedArtifact =

        deepFreeze(

            working

        );

    /*
    ----------------------------------
    Build Immutable Report
    ----------------------------------
    */

    return buildRepairReport({

        artifact:

            repairedArtifact,

        repairs,

        repairedAt:

            context.repairedAt

    });

}

/*
==================================================
Repair Assertion

==================================================
*/

function assertRepair(

    report

) {

    if (

        !report ||

        !report.repairedArtifact

    ) {

        throw new Errors.ValidationError(

            "Invalid Repair Report."

        );

    }

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
    Context
    ----------------------------------
    */

    buildRepairContext,

    /*
    ----------------------------------
    Reports
    ----------------------------------
    */

    buildRepairReport,

    /*
    ----------------------------------
    Assertion
    ----------------------------------
    */

    assertRepair

});

