"use strict";

const Runtime =
    require(
        "./lib/departments/runtime"
    );

function section(
    title
) {

    console.log("");
    console.log(
        "========================================"
    );

    console.log(
        title
    );

    console.log(
        "========================================"
    );

    console.log("");

}

function isObject(
    value
) {

    return (
        value !== null &&
        typeof value ===
            "object"
    );

}

function inspectObject({

    name,

    value,

    depth = 0,

    visited = new WeakSet()

}) {

    const indent =
        "  ".repeat(
            depth
        );

    if (
        !isObject(
            value
        )
    ) {

        console.log(
            `${indent}${name}:`,
            typeof value,
            JSON.stringify(
                value
            )
        );

        return;

    }

    if (
        visited.has(
            value
        )
    ) {

        console.log(
            `${indent}${name}: [CIRCULAR]`
        );

        return;

    }

    visited.add(
        value
    );

    console.log(
        `${indent}${name}:`,
        Array.isArray(
            value
        )
            ? `ARRAY(${value.length})`
            : "OBJECT",
        "FROZEN:",
        Object.isFrozen(
            value
        )
    );

    if (
        depth >= 6
    ) {

        return;

    }

    if (
        Array.isArray(
            value
        )
    ) {

        value
            .slice(
                0,
                10
            )
            .forEach(
                (
                    item,
                    index
                ) => {

                    inspectObject({

                        name:
                            `[${index}]`,

                        value:
                            item,

                        depth:
                            depth + 1,

                        visited

                    });

                }
            );

        return;

    }

    for (
        const key of Object.keys(
            value
        )
    ) {

        inspectObject({

            name:
                key,

            value:
                value[key],

            depth:
                depth + 1,

            visited

        });

    }

}

(async () => {

    section(
        "STAGE 5B LIVE RUNTIME PUBLIC OUTPUT AUDIT"
    );

    console.log(
        "RUNTIME API:",
        Object.keys(
            Runtime
        )
    );

    console.log(
        "RUNTIME FROZEN:",
        Object.isFrozen(
            Runtime
        )
    );

    console.log(
        "RUNTIME EXECUTE:",
        typeof Runtime.execute
    );

    console.log(
        "RUNTIME OBSERVE:",
        typeof Runtime.observe
    );

    const request = {

        command:
            "launch-campaign",

        campaignId:
            `runtime-output-audit-${Date.now().toString(36)}`,

        requestedBy:
            "api/manage-campaigns",

        options: {

            audit:
                true

        }

    };

    section(
        "EXECUTIVE REQUEST"
    );

    console.log(
        JSON.stringify(
            request,
            null,
            2
        )
    );

    let result;

    try {

        result =

            await Runtime.execute(
                request
            );

    } catch (
        error
    ) {

        section(
            "RUNTIME EXECUTION THREW"
        );

        console.log(
            "ERROR NAME:",
            error.name
        );

        console.log(
            "ERROR CODE:",
            error.code
        );

        console.log(
            "ERROR MESSAGE:",
            error.message
        );

        console.log(
            "ERROR STACK:"
        );

        console.log(
            error.stack
        );

        process.exitCode = 20;

        return;

    }

    section(
        "PUBLIC OUTPUT TOP LEVEL"
    );

    console.log(
        "TYPE:",
        typeof result
    );

    console.log(
        "IS OBJECT:",
        isObject(
            result
        )
    );

    console.log(
        "IS ARRAY:",
        Array.isArray(
            result
        )
    );

    console.log(
        "FROZEN:",
        Object.isFrozen(
            result
        )
    );

    console.log(
        "KEYS:",
        isObject(
            result
        )
            ? Object.keys(
                result
            )
            : []
    );

    section(
        "PUBLIC OUTPUT STRUCTURAL TREE"
    );

    inspectObject({

        name:
            "result",

        value:
            result

    });

    section(
        "PUBLIC OUTPUT JSON"
    );

    console.log(
        JSON.stringify(
            result,
            null,
            2
        )
    );

    section(
        "DEPARTMENT COLLECTION PATH PROBES"
    );

    const probes = {

        "result.departments":
            result?.departments,

        "result.report.departments":
            result?.report?.departments,

        "result.runtime.departments":
            result?.runtime?.departments,

        "result.runtime.evaluation.departments":
            result?.runtime
                ?.evaluation
                ?.departments,

        "result.artifact.departments":
            result?.artifact
                ?.departments,

        "result.artifact.runtime.departments":
            result?.artifact
                ?.runtime
                ?.departments,

        "result.artifact.runtime.evaluation.departments":
            result?.artifact
                ?.runtime
                ?.evaluation
                ?.departments,

        "result.output.departments":
            result?.output
                ?.departments,

        "result.submission.departments":
            result?.submission
                ?.departments

    };

    let departmentPath =
        null;

    let departments =
        null;

    for (
        const [
            path,
            value
        ] of Object.entries(
            probes
        )
    ) {

        const found =
            Array.isArray(
                value
            );

        console.log(
            path,
            found
                ? `ARRAY(${value.length})`
                : "NOT ARRAY"
        );

        if (
            departmentPath === null &&
            found
        ) {

            departmentPath =
                path;

            departments =
                value;

        }

    }

    section(
        "DEPARTMENT TRUTH"
    );

    console.log(
        "DEPARTMENT PATH:",
        departmentPath ||
            "NOT FOUND"
    );

    console.log(
        "DEPARTMENT COUNT:",
        departments
            ? departments.length
            : 0
    );

    if (
        departments
    ) {

        for (
            const department of departments
        ) {

            console.log(
                JSON.stringify(
                    {
                        department:
                            department?.department,

                        status:
                            department?.status,

                        ready:
                            department?.ready,

                        requiredContracts:
                            department?.requiredContracts,

                        missingContracts:
                            department?.missingContracts,

                        reason:
                            department?.reason
                    },
                    null,
                    2
                )
            );

        }

    }

    const strategy =

        departments
            ?.find(

                department =>

                    department?.department ===
                        "strategy"

            ) ||
        null;

    section(
        "STRATEGY WAITING TRUTH"
    );

    console.log(
        "STRATEGY FOUND:",
        Boolean(
            strategy
        )
    );

    console.log(
        "STRATEGY STATUS:",
        strategy?.status
    );

    console.log(
        "STRATEGY READY:",
        strategy?.ready
    );

    console.log(
        "STRATEGY REQUIRED CONTRACTS:",
        strategy?.requiredContracts
    );

    console.log(
        "STRATEGY MISSING CONTRACTS:",
        strategy?.missingContracts
    );

    console.log(
        "STRATEGY REASON:",
        strategy?.reason
    );

    const passed =

        Boolean(

            departmentPath &&

            strategy &&

            String(
                strategy.status
            ).toLowerCase() ===
                "waiting" &&

            strategy.ready ===
                false &&

            Array.isArray(
                strategy.missingContracts
            ) &&

            strategy.missingContracts.length >
                0

        );

    section(
        "STAGE 5B AUDIT RESULT"
    );

    console.log(
        "PUBLIC DEPARTMENT PATH:",
        departmentPath
    );

    console.log(
        "STRATEGY WAITING:",
        strategy?.status
    );

    console.log(
        "WAITING REASON:",
        strategy?.reason
    );

    console.log(
        "MISSING CONTRACTS:",
        strategy?.missingContracts
    );

    console.log(
        "AUDIT RESULT:",
        passed
            ? "PASS"
            : "FAIL"
    );

    if (
        !passed
    ) {

        process.exitCode = 30;

    }

})().catch(

    error => {

        console.error(
            "STAGE 5B AUDIT ERROR:",
            error.code ||
                error.name,
            error.message
        );

        console.error(
            error.stack
        );

        process.exitCode = 99;

    }

);