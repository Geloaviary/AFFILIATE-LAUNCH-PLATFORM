"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

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
for the technical health of the Strategy
Department.

Engineering continuously inspects, repairs,
verifies and certifies the department source
code.

Engineering NEVER

• Executes Strategy Workers
• Repairs Business Artifacts
• Validates Business Data
• Writes Platform Memory
• Modifies Other Departments

Engineering ONLY modifies the technical
implementation of the Strategy Department.

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

        "strategy",

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
discovered during department inspection.

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
Strategy Department.

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

        "strategy-engine.js",

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

                        `Missing required file: ${file}`,

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
can be resolved.

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

Verifies constitutional runtime contracts.

==================================================
*/

function inspectRuntime(

    context

) {

    const issues = [];

    const index =

        require(

            path.join(

                context.departmentRoot,

                "index.js"

            )

        );

    if (

        typeof index.execute !==

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

    if (

        !index.identity

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
Health Scoring

Calculates the constitutional health of the
Strategy Department.

==================================================
*/

function calculateHealth(

    issues

) {

    const errors =

        issues.filter(

            issue =>

                issue.severity ===

                "error"

        ).length;

    const warnings =

        issues.filter(

            issue =>

                issue.severity ===

                "warning"

        ).length;

    const score =

        Math.max(

            0,

            100 -

            (errors * 20) -

            (warnings * 5)

        );

    return Object.freeze({

        score,

        errors,

        warnings

    });

}

/*
==================================================
Department Certification

Determines the constitutional certification
state of the department.

==================================================
*/

function determineCertification(

    health

) {

    if (

        health.errors === 0 &&

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

Immutable constitutional technical report.

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

                    issues.filter(

                        issue =>

                            issue.category ===

                            "architecture"

                    ).length,

                dependencyIssues:

                    issues.filter(

                        issue =>

                            issue.category ===

                            "dependency"

                    ).length,

                runtimeIssues:

                    issues.filter(

                        issue =>

                            issue.category ===

                            "runtime"

                    ).length

            })

    });

}

/*
==================================================
Engineering Repair Engine

Repairs automatically recoverable technical
issues discovered during certification.

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
            --------------------------------------
            Missing Department Identity
            --------------------------------------
            */

            case "ENG-004":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        action:

                            "Restore department identity.",

                        repaired:

                            false,

                        reason:

                            "Source modification requires controlled rewrite."

                    })

                );

                break;

            /*
            --------------------------------------
            Missing Runtime
            --------------------------------------
            */

            case "ENG-003":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        action:

                            "Restore execute() runtime.",

                        repaired:

                            false,

                        reason:

                            "Requires runtime reconstruction."

                    })

                );

                break;

            /*
            --------------------------------------
            Broken Dependency
            --------------------------------------
            */

            case "ENG-002":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        action:

                            "Attempt dependency recovery.",

                        repaired:

                            false,

                        reason:

                            "Automatic dependency rewriting is disabled."

                    })

                );

                break;

            /*
            --------------------------------------
            Missing Constitutional File
            --------------------------------------
            */

            case "ENG-001":

                repairs.push(

                    Object.freeze({

                        issue:

                            issue.code,

                        action:

                            "Restore constitutional file.",

                        repaired:

                            false,

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

Re-certifies the department after automatic
repair has completed.

==================================================
*/

function verifyEngineering(

    context

) {

    const issues = [

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

    return deepFreeze(

        issues

    );

}

/*
==================================================
Department Certification

Produces the immutable constitutional
technical certification for the department.

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

Certification

==================================================
*/

function execute({

    departmentRoot

}) {

    /*
    ----------------------------------
    Context
    ----------------------------------
    */

    const context =

        buildEngineeringContext({

            departmentRoot

        });

    /*
    ----------------------------------
    Initial Inspection
    ----------------------------------
    */

    const issues = [

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

    /*
    ----------------------------------
    Automatic Repairs
    ----------------------------------
    */

    const repairs =

        repairIssues(

            context,

            issues

        );

    /*
    ----------------------------------
    Verification
    ----------------------------------
    */

    const verifiedIssues =

        verifyEngineering(

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

                verifiedIssues,

            repairs

        });

    /*
    ----------------------------------
    Certification
    ----------------------------------
    */

    const certification =

        buildCertification(

            report

        );

    return deepFreeze({

        report,

        certification

    });

}

/*
==================================================
Public Runtime

==================================================
*/

module.exports =

Object.freeze({

    execute

});