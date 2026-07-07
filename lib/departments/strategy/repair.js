"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

repair.js

Constitutional Rule QA-008

Strategy Artifact

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

This module repairs immutable Strategy
Artifacts using the constitutional
Validation Report.

It NEVER

• Executes Strategy Workers
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

    assertStrategyArtifact

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

    assertStrategyArtifact(

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

    repaired.payload ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "STRAT-021":

                repaired.payload.winner ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "winner",

                        description:

                            "Created empty winner."

                    })

                );

                break;

            case "STRAT-022":

                repaired.payload.competitor ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "competitor",

                        description:

                            "Created empty competitor."

                    })

                );

                break;

            case "STRAT-023":

                repaired.payload.marketIntelligence ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "market-intelligence",

                        description:

                            "Created Market Intelligence."

                    })

                );

                break;

            case "STRAT-024":

                repaired.payload.campaignIntelligence ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "campaign-intelligence",

                        description:

                            "Created Campaign Intelligence."

                    })

                );

                break;

            case "STRAT-025":

                repaired.payload.productIntelligence ??= {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "product-intelligence",

                        description:

                            "Created Product Intelligence."

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

