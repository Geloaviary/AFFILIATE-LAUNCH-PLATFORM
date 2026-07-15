"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

repair.js

Constitutional Rule QA-008

Strategy Artifact

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

This module repairs immutable Strategy
Artifacts using the constitutional
Validation Report.

It NEVER

â€¢ Executes Strategy Workers
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

    assertStrategyArtifact

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

        "strategy",

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

Strategy Artifact

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

    assertStrategyArtifact(

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

            case "STRAT-001":

                repaired.artifactId ??=

                    "STRAT-ART-UNKNOWN";

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

            case "STRAT-002":

                repaired.department =

                    "strategy";

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "artifact",

                        description:

                            "Restored strategy department."

                    })

                );

                break;

            case "STRAT-003":

                repaired.artifactType =

                    "strategy-package";

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

            case "STRAT-010":

                repaired.metadata = {

                    department:

                        "strategy",

                    artifactType:

                        "strategy-package",

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

            case "STRAT-011":

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

            case "STRAT-012":

                repaired.metadata.department =

                    "strategy";

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

    case "STRAT-021":

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

    case "STRAT-022":

    repaired.payload.workspace ??= {};

    repairs.push(

        buildRepairAction({

            code:

                violation.code,

            component:

                "workspace",

            description:

                "Created empty Strategy Workspace."

        })

    );

    break;

    case "STRAT-023":

        repaired.payload.campaign ??= Object.freeze({});

        repairs.push(

            buildRepairAction({

                code:

                    violation.code,

                component:

                    "campaign",

                description:

                    "Created empty campaign."

            })

        );

        break;

    case "STRAT-024":

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

            case "STRAT-030":

                repaired.payload.workspace =

                    {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "workspace",

                        description:

                            "Created missing Strategy Workspace."

                    })

                );

                break;

            /*
            ----------------------------------
            Metadata
            ----------------------------------
            */

            case "STRAT-031":

                workspace.metadata = {

                    department:

                        "strategy",

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

            case "STRAT-032":

                workspace.metadata ??= {};

                workspace.metadata.department =

                    "strategy";

                break;

            case "STRAT-033":

                workspace.metadata ??= {};

                workspace.metadata.workspaceVersion =

                    "1.0.0";

                break;

            case "STRAT-034":

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

            case "STRAT-040":

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

            case "STRAT-041":

            case "STRAT-042":

            case "STRAT-043":

                workspace.contracts ??= {};

                break;

            /*
            ----------------------------------
            Statistics
            ----------------------------------
            */

            case "STRAT-050":

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

            case "STRAT-051":

                workspace.statistics ??= {};

                break;

            /*
            ----------------------------------
            Completion
            ----------------------------------
            */

            case "STRAT-060":

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

            case "STRAT-061":

            case "STRAT-062":

            case "STRAT-063":

            case "STRAT-064":

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

