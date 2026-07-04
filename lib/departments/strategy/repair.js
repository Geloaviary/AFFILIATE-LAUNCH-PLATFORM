"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

repair.js

Constitutional Rule RD-006

Research Artifact

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

This module repairs immutable Research
Artifacts using the constitutional
Validation Report.

It NEVER

• Executes Research
• Performs Validation
• Writes Platform Memory
• Calls the Quality Assurance Director
• Mutates the original Artifact

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

        "research",

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

Research Artifact

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

    assertResearchArtifact(

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

Represents one immutable repair
performed by the Research Runtime.

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
Research Identity Repairs

==================================================
*/

function repairIdentity(

    working,

    violations,

    repairs

) {

    working.payload ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "RSCH-001":

                working.payload.niche ??=

                    "Unknown";

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "identity",

                        description:

                            "Restored missing research niche."

                    })

                );

                break;

            case "RSCH-002":

                working.payload.winner ??=

                    {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "identity",

                        description:

                            "Created empty winner package."

                    })

                );

                break;

        }

    }

    return working;

}

/*
==================================================
Research Intelligence Repairs

==================================================
*/

function repairIntelligence(

    working,

    violations,

    repairs

) {

    working.payload ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "RSCH-010":

                working.payload.validatedProducts ??=

                    [];

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "intelligence",

                        description:

                            "Created validated products collection."

                    })

                );

                break;

            case "RSCH-011":

                working.payload.top5 ??=

                    [];

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "intelligence",

                        description:

                            "Created Top 5 ranking."

                    })

                );

                break;

            case "RSCH-012":

                working.payload.marketIntelligence ??=

                    {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "intelligence",

                        description:

                            "Created market intelligence package."

                    })

                );

                break;

        }

    }

    return working;

}

/*
==================================================
Research Asset Repairs

==================================================
*/

function repairAssets(

    working,

    violations,

    repairs

) {

    working.payload ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "RSCH-020":

                working.payload.assets ??=

                    {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "assets",

                        description:

                            "Created research asset package."

                    })

                );

                break;

        }

    }

    return working;

}

/*
==================================================
Research Plan Repairs

==================================================
*/

function repairPlans(

    working,

    violations,

    repairs

) {

    working.payload ??= {};

    for (

        const violation of violations

    ) {

        switch (

            violation.code

        ) {

            case "RSCH-030":

                working.payload.plans ??=

                    {};

                repairs.push(

                    buildRepairAction({

                        code:

                            violation.code,

                        component:

                            "plans",

                        description:

                            "Created research plans package."

                    })

                );

                break;

        }

    }

    return working;

}

/*
==================================================
Repair Statistics

==================================================
*/

function buildRepairStatistics(

    repairs

) {

    return deepFreeze({

        repairsApplied:

            repairs.length,

        identityRepairs:

            repairs.filter(

                repair =>

                    repair.component ===

                    "identity"

            ).length,

        intelligenceRepairs:

            repairs.filter(

                repair =>

                    repair.component ===

                    "intelligence"

            ).length,

        assetRepairs:

            repairs.filter(

                repair =>

                    repair.component ===

                    "assets"

            ).length,

        planRepairs:

            repairs.filter(

                repair =>

                    repair.component ===

                    "plans"

            ).length

    });

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

            buildRepairStatistics(

                repairs

            )

    });

}

/*
==================================================
Repair Pipeline

==================================================
*/

function executeRepairPipeline(

    context

) {

    const working =

        structuredClone(

            context.artifact

        );

    const repairs = [];

    repairIdentity(

        working,

        context.report.violations,

        repairs

    );

    repairIntelligence(

        working,

        context.report.violations,

        repairs

    );

    repairAssets(

        working,

        context.report.violations,

        repairs

    );

    repairPlans(

        working,

        context.report.violations,

        repairs

    );

    return {

        repairedArtifact:

            deepFreeze(

                working

            ),

        repairs

    };

}

/*
==================================================
Repair Assertion

Verifies the constitutional Repair Report.

==================================================
*/

function assertRepair(

    report

) {

    if (

        !report ||

        !report.repairedArtifact ||

        !Array.isArray(

            report.repairs

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Research Repair Report."

        );

    }

    return report;

}

/*
==================================================
Research Repair Runtime

Research Artifact

        │

Validation Report

        │

        ▼

Repair Context

        │

        ▼

Repair Pipeline

        │

        ▼

Repair Report

        │

        ▼

Assertion

==================================================
*/

function execute({

    artifact,

    report

}) {

    /*
    ----------------------------------
    Build Immutable Context
    ----------------------------------
    */

    const context =

        buildRepairContext({

            artifact,

            report

        });

    /*
    ----------------------------------
    Execute Repair Pipeline
    ----------------------------------
    */

    const {

        repairedArtifact,

        repairs

    } =

        executeRepairPipeline(

            context

        );

    /*
    ----------------------------------
    Build Immutable Report
    ----------------------------------
    */

    const repairReport =

        buildRepairReport({

            artifact:

                repairedArtifact,

            repairs,

            repairedAt:

                context.repairedAt

        });

    /*
    ----------------------------------
    Verify Report
    ----------------------------------
    */

    assertRepair(

        repairReport

    );

    return repairReport;

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

    buildRepairContext,

    /*
    ----------------------------------
    Report
    ----------------------------------
    */

    buildRepairReport,

    buildRepairStatistics,

    /*
    ----------------------------------
    Assertion
    ----------------------------------
    */

    assertRepair

});