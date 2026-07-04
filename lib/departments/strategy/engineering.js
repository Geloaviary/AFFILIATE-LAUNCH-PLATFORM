"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

engineering.js

Constitutional Rule ENG-001

Department Source

        │
        ▼

Engineering Runtime

        │
        ▼

Engineering Report

--------------------------------------------------

Constitutional Responsibility

Engineering is the sole authority responsible
for the technical health of the Research
Department.

Engineering continuously inspects, repairs,
verifies and certifies the department source
code.

Engineering NEVER

• Executes Research
• Repairs Business Artifacts
• Performs Validation
• Writes Platform Memory
• Modifies Other Departments

Engineering ONLY modifies the technical
implementation of the Research Department.

==================================================
*/

const fs =

    require(

        "fs"

    );

const path =

    require(

        "path"

    );

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

/*
==================================================
Engineering Runtime Identity

==================================================
*/

const ENGINEERING =

Object.freeze({

    department:

        "research",

    component:

        "engineering",

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
Engineering Context

Department Source

        │

        ▼

Immutable Engineering Context

==================================================
*/

function buildEngineeringContext({

    departmentRoot,

    runtimeVersion =

        ENGINEERING.version

}) {

    if (

        typeof departmentRoot !==

        "string"

    ) {

        throw new Errors.ValidationError(

            "Invalid department root."

        );

    }

    return deepFreeze({

        runtime:

            ENGINEERING,

        departmentRoot:

            path.resolve(

                departmentRoot

            ),

        runtimeVersion,

        inspectedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Engineering Issue

Represents one immutable technical issue
discovered during inspection.

==================================================
*/

function buildIssue({

    code,

    category,

    severity =

        "error",

    message,

    file = null

}) {

    return deepFreeze({

        code,

        category,

        severity,

        message,

        file

    });

}

/*
==================================================
Architecture Certification

Verifies the constitutional structure of the
Research Department.

==================================================
*/

function inspectArchitecture(

    context

) {

    const issues = [];

    const requiredFiles = [

        "index.js",

        "input.js",

        "manager.js",

        "artifact.js",

        "output.js",

        "validator.js",

        "repair.js",

        "learning.js",

        "engineering.js"

    ];

    for (

        const file of requiredFiles

    ) {

        const location =

            path.join(

                context.departmentRoot,

                file

            );

        if (

            !fs.existsSync(

                location

            )

        ) {

            issues.push(

                buildIssue({

                    code:

                        "ENG-001",

                    category:

                        "architecture",

                    message:

                        `Missing constitutional file: ${file}`,

                    file

                })

            );

        }

    }

    return issues;

}

/*
==================================================
Dependency Certification

Verifies that every constitutional module
can be resolved successfully.

==================================================
*/

function inspectDependencies(

    context

) {

    const issues = [];

    const files =

        fs.readdirSync(

            context.departmentRoot

        );

    for (

        const file of files

    ) {

        if (

            !file.endsWith(

                ".js"

            )

        ) {

            continue;

        }

        try {

            require(

                path.join(

                    context.departmentRoot,

                    file

                )

            );

        }

        catch (

            error

        ) {

            issues.push(

                buildIssue({

                    code:

                        "ENG-002",

                    category:

                        "dependency",

                    message:

                        error.message,

                    file

                })

            );

        }

    }

    return issues;

}

/*
==================================================
Runtime Certification

Verifies the constitutional public
department contract.

==================================================
*/

function inspectRuntime(

    context

) {

    const issues = [];

    const runtime =

        require(

            path.join(

                context.departmentRoot,

                "index.js"

            )

        );

    /*
    ----------------------------------
    execute()

    ----------------------------------
    */

    if (

        typeof runtime.execute !==

        "function"

    ) {

        issues.push(

            buildIssue({

                code:

                    "ENG-003",

                category:

                    "runtime",

                message:

                    "Missing execute() runtime.",

                file:

                    "index.js"

            })

        );

    }

    /*
    ----------------------------------
    identity

    ----------------------------------
    */

    if (

        !runtime.identity

    ) {

        issues.push(

            buildIssue({

                code:

                    "ENG-004",

                category:

                    "runtime",

                message:

                    "Missing department identity.",

                file:

                    "index.js"

            })

        );

    }

    return issues;

}

/*
==================================================
Constitutional Health Scoring

Calculates the weighted constitutional
health of the Research Department.

==================================================
*/

function calculateHealth(

    issues

) {

    const architectureIssues =

        issues.filter(

            issue =>

                issue.category ===

                "architecture"

        ).length;

    const dependencyIssues =

        issues.filter(

            issue =>

                issue.category ===

                "dependency"

        ).length;

    const runtimeIssues =

        issues.filter(

            issue =>

                issue.category ===

                "runtime"

        ).length;

    /*
    ----------------------------------
    Weighted Score
    ----------------------------------
    */

    const architecturePenalty =

        architectureIssues * 10;

    const dependencyPenalty =

        dependencyIssues * 10;

    const runtimePenalty =

        runtimeIssues * 20;

    const score =

        Math.max(

            0,

            100 -

            architecturePenalty -

            dependencyPenalty -

            runtimePenalty

        );

    return deepFreeze({

        score,

        architectureIssues,

        dependencyIssues,

        runtimeIssues

    });

}

/*
==================================================
Department Certification

Determines the constitutional technical
state of the department.

==================================================
*/

function determineCertification(

    health

) {

    if (

        health.score >= 95

    ) {

        return "CERTIFIED";

    }

    if (

        health.score >= 70

    ) {

        return "DEGRADED";

    }

    return "FAILED";

}

/*
==================================================
Engineering Report

Immutable constitutional engineering report.

==================================================
*/

function buildEngineeringReport({

    context,

    issues

}) {

    const health =

        calculateHealth(

            issues

        );

    return deepFreeze({

        runtime:

            ENGINEERING,

        inspectedAt:

            context.inspectedAt,

        certification:

            determineCertification(

                health

            ),

        health,

        issues,

        statistics:

            Object.freeze({

                totalIssues:

                    issues.length,

                architectureIssues:

                    health.architectureIssues,

                dependencyIssues:

                    health.dependencyIssues,

                runtimeIssues:

                    health.runtimeIssues

            })

    });

}

/*
==================================================
Engineering Repair Engine

Applies deterministic technical repairs
to the Research Department.

Only repairs that can be proven safe
are executed automatically.

==================================================
*/

function repairIssues(

    context,

    issues

) {

    const repairs = [];

    for (

        const issue of issues

    ) {

        switch (

            issue.code

        ) {

            /*
            ----------------------------------
            Missing Department Identity
            ----------------------------------
            */

            case "ENG-004":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        repaired:

                            false,

                        action:

                            "Restore department identity.",

                        reason:

                            "Requires controlled source update."

                    })

                );

                break;

            /*
            ----------------------------------
            Missing execute()

            ----------------------------------
            */

            case "ENG-003":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        repaired:

                            false,

                        action:

                            "Restore execute() runtime.",

                        reason:

                            "Requires runtime reconstruction."

                    })

                );

                break;

            /*
            ----------------------------------
            Broken Dependency

            ----------------------------------
            */

            case "ENG-002":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        repaired:

                            false,

                        action:

                            "Attempt dependency recovery.",

                        reason:

                            "Automatic dependency repair disabled."

                    })

                );

                break;

            /*
            ----------------------------------
            Missing Constitutional File

            ----------------------------------
            */

            case "ENG-001":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        repaired:

                            false,

                        action:

                            "Restore constitutional file.",

                        reason:

                            "Missing source file cannot be regenerated automatically."

                    })

                );

                break;

        }

    }

    return deepFreeze(

        repairs

    );

}

/*
==================================================
Engineering Verification

Runs a complete constitutional certification
after repair.

==================================================
*/

function verifyEngineering(

    context

) {

    return deepFreeze([

        ...inspectArchitecture(

            context

        ),

        ...inspectDependencies(

            context

        ),

        ...inspectRuntime(

            context

        )

    ]);

}

/*
==================================================
Engineering Cycle

Performs one complete engineering cycle.

Inspection

↓

Repair

↓

Verification

==================================================
*/

function executeEngineeringCycle(

    context

) {

    const initialIssues = [

        ...inspectArchitecture(

            context

        ),

        ...inspectDependencies(

            context

        ),

        ...inspectRuntime(

            context

        )

    ];

    const repairs =

        repairIssues(

            context,

            initialIssues

        );

    const verifiedIssues =

        verifyEngineering(

            context

        );

    return deepFreeze({

        issues:

            verifiedIssues,

        repairs

    });

}

/*
==================================================
Department Certification

Produces the immutable constitutional
technical certification of the department.

==================================================
*/

function buildCertification(

    report

) {

    return deepFreeze({

        department:

            ENGINEERING.department,

        component:

            ENGINEERING.component,

        certifiedAt:

            new Date()

                .toISOString(),

        status:

            report.certification,

        score:

            report.health.score,

        healthy:

            report.certification ===

                "CERTIFIED"

    });

}

/*
==================================================
Engineering Runtime

Department Source

        │

        ▼

Inspection

        │

        ▼

Repair

        │

        ▼

Verification

        │

        ▼

Engineering Report

        │

        ▼

Department Certification

==================================================
*/

function execute({

    departmentRoot

}) {

    /*
    ----------------------------------
    Engineering Context
    ----------------------------------
    */

    const context =

        buildEngineeringContext({

            departmentRoot

        });

    /*
    ----------------------------------
    Engineering Cycle
    ----------------------------------
    */

    const cycle =

        executeEngineeringCycle(

            context

        );

    /*
    ----------------------------------
    Engineering Report
    ----------------------------------
    */

    const report =

        buildEngineeringReport({

            context,

            issues:

                cycle.issues

        });

    /*
    ----------------------------------
    Department Certification
    ----------------------------------
    */

    const certification =

        buildCertification(

            report

        );

    /*
    ----------------------------------
    Immutable Runtime Result
    ----------------------------------
    */

    return deepFreeze({

        report,

        certification,

        repairs:

            cycle.repairs

    });

}

/*
==================================================
Public Runtime

Constitutional public interface.

==================================================
*/

module.exports =

Object.freeze({

    execute

});