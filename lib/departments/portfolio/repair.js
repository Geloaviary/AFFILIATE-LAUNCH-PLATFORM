"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

repair.js

Constitutional Rule QA-008

Portfolio Artifact

        â”‚
        â–¼

Validation Report

        â”‚
        â–¼

Repair Runtime

        â”‚
        â–¼

Repair Report

--------------------------------------------------

Constitutional Responsibility

This module repairs immutable Portfolio
Artifacts using the constitutional
Validation Report.

It NEVER

â€¢ Executes Portfolio Workers
â€¢ Performs Validation
â€¢ Writes Platform Memory
â€¢ Calls Quality Assurance Director
â€¢ Mutates the original Artifact

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
Repair Runtime Identity
==================================================
*/

const REPAIR =

Object.freeze({

    department:

        "portfolio",

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

Portfolio Artifact

        â”‚

Validation Report

        â”‚

        â–¼

Immutable Repair Context

==================================================
*/

function buildRepairContext({

    artifact,

    report

}) {

    assertPortfolioArtifact(

        artifact

    );

    if (

    !report ||

    !Array.isArray(

        report.violations

    )

) {

    throw new Errors.ValidationError(

        "Invalid Validation Report."

    );

}

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

            case "PORT-001":

                repaired.artifactId ??=

                    "PORT-ART-UNKNOWN";

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

            case "PORT-002":

                repaired.department =

                    "portfolio";

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "artifact",

                        description:

                            "Restored portfolio department."

                    })

                );

                break;

            case "PORT-003":

                repaired.artifactType =

                    "portfolio-review";

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

            case "PORT-010":

                repaired.metadata = {

                    department:

                        "portfolio",

                    artifactType:

                        "portfolio-review",

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

            case "PORT-011":

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

            case "PORT-012":

                repaired.metadata.department =

                    "portfolio";

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

    repaired.payload.engine ??= Object.freeze({});

    for (

        const violation of violations

    ) {

        switch (

    violation.code

) {

    case "PORT-021":

        repaired.payload.engine ??= {};

        repairs.push(

            buildRepairAction({

                code:

                    violation.code,

                component:

                    "engine",

                description:

                    "Created missing engine information."

            })

        );

        break;

    case "PORT-022":

    repaired.payload.workspace ??= {};

    repairs.push(

        buildRepairAction({

            code:

                violation.code,

            component:

                "workspace",

            description:

                "Created empty Portfolio Workspace."

        })

    );

    break;

    case "PORT-023":

        repaired.payload.review ??= Object.freeze({});

        repairs.push(

            buildRepairAction({

                code:

                    violation.code,

                component:

                    "review",

                description:

                    "Created empty review."

            })

        );

        break;

    case "PORT-024":

        repaired.payload.executedAt ??=

            new Date()

                .toISOString();

        repairs.push(

            buildRepairAction({

                code:

                    violation.code,

                component:

                    "executedAt",

                description:

                    "Generated execution timestamp."

            })

        );

        break;

      }

    }

    return repaired;

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

        â”‚

        â–¼

Working Copy

        â”‚

        â–¼

Repair Pipeline

        â”‚

        â–¼

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

    let repaired =

    repairArtifact(

        working,

        report.violations,

        repairs

    );

repaired =

    repairMetadata(

        repaired,

        report.violations,

        repairs

    );

repaired =

    repairPayload(

        repaired,

        report.violations,

        repairs

    );

repaired =

    repairWorkspace(

        repaired,

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

            repaired

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

function repairWorkspace(

    artifact,

    violations,

    repairs

) {

    const repaired =

        structuredClone(

            artifact

        );

    repaired.payload ??= {};

    repaired.payload.workspace ??= {};

    const workspace =

        repaired.payload.workspace;

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            /*
            ----------------------------------
            Workspace
            ----------------------------------
            */

            case "PORT-030":

                repaired.payload.workspace =

                    {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "workspace",

                        description:

                            "Created missing Portfolio Workspace."

                    })

                );

                break;

            /*
            ----------------------------------
            Metadata
            ----------------------------------
            */

            case "PORT-031":

                workspace.metadata = {

                    department:

                        "portfolio",

                    workspaceVersion:

                        "1.0.0",

                    campaignId:

                        null,

                    generatedAt:

                        new Date()

                            .toISOString()

                };

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "workspace.metadata",

                        description:

                            "Created Workspace metadata."

                    })

                );

                break;

            case "PORT-032":

                workspace.metadata ??= {};

                workspace.metadata.department =

                    "portfolio";

                break;

            case "PORT-033":

                workspace.metadata ??= {};

                workspace.metadata.workspaceVersion =

                    "1.0.0";

                break;

            case "PORT-034":

                workspace.metadata ??= {};

                workspace.metadata.generatedAt =

                    new Date()

                        .toISOString();

                break;

            /*
            ----------------------------------
            Contracts
            ----------------------------------
            */

            case "PORT-040":

                workspace.contracts = {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "workspace.contracts",

                        description:

                            "Created Workspace contract collection."

                    })

                );

                break;

            case "PORT-041":

            case "PORT-042":

            case "PORT-043":

                workspace.contracts ??= {};

                break;

            /*
            ----------------------------------
            Statistics
            ----------------------------------
            */

            case "PORT-050":

                workspace.statistics =

                    {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "workspace.statistics",

                        description:

                            "Created Workspace statistics."

                    })

                );

                break;

            case "PORT-051":

                workspace.statistics ??= {};

                break;

            /*
            ----------------------------------
            Completion
            ----------------------------------
            */

            case "PORT-060":

                workspace.completion = {

                    plannerCompleted:

                        false,

                    workspaceComplete:

                        false,

                    immutable:

                        false

                };

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "workspace.completion",

                        description:

                            "Created Workspace completion record."

                    })

                );

                break;

            case "PORT-061":

            case "PORT-062":

            case "PORT-063":

            case "PORT-064":

                workspace.completion ??= {

                    plannerCompleted:

                        false,

                    workspaceComplete:

                        false,

                    immutable:

                        false

                };

                break;

        }

    }

    return repaired;

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

