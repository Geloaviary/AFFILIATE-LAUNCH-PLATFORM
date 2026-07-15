"use strict";

const Runtime =
    require(
        "./lib/departments/runtime"
    );

function isObject(
    value
) {

    return (
        value !== null &&
        typeof value ===
            "object"
    );

}

function printSection(
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

function inspectObject({

    name,

    value

}) {

    printSection(
        name
    );

    console.log(
        "TYPE:",
        typeof value
    );

    console.log(
        "IS OBJECT:",
        isObject(
            value
        )
    );

    console.log(
        "IS ARRAY:",
        Array.isArray(
            value
        )
    );

    console.log(
        "FROZEN:",
        isObject(
            value
        )
            ? Object.isFrozen(
                value
            )
            : false
    );

    console.log(
        "KEYS:",
        isObject(
            value
        )
            ? Object.keys(
                value
            )
            : []
    );

    console.log("");
    console.log(
        "VALUE:"
    );

    console.log(
        JSON.stringify(
            value,
            null,
            2
        )
    );

}

(async () => {

    printSection(
        "STAGE 5 LIVE RUNTIME WAITING PATH AUDIT"
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

    if (
        typeof Runtime.execute !==
            "function"
    ) {

        throw new TypeError(
            "Runtime.execute is unavailable."
        );

    }

    const campaignId =

        "runtime-waiting-audit-" +

        Date.now()
            .toString(
                36
            );

    const input = {

        campaignId,

        name:
            "Runtime Waiting Audit",

        productUrl:
            "https://example.invalid/product",

        affiliateUrl:
            "https://example.invalid/affiliate",

        revenueGoal:
            "1000",

        research:
            null,

        createdAt:
            new Date()
                .toISOString()

    };

    inspectObject({

        name:
            "RUNTIME EXECUTION INPUT",

        value:
            input

    });

    let runtimeResult;

    try {

        runtimeResult =

            await Runtime.execute(
                input
            );

    } catch (
        error
    ) {

        printSection(
            "RUNTIME EXECUTION THREW"
        );

        console.error(
            "ERROR NAME:",
            error?.name
        );

        console.error(
            "ERROR CODE:",
            error?.code
        );

        console.error(
            "ERROR MESSAGE:",
            error?.message
        );

        console.error(
            "ERROR STACK:"
        );

        console.error(
            error?.stack
        );

        process.exitCode = 20;

        return;

    }

    inspectObject({

        name:
            "RAW RUNTIME EXECUTION RESULT",

        value:
            runtimeResult

    });

    printSection(
        "TOP LEVEL SHAPE"
    );

    console.log(
        "TOP LEVEL KEYS:",
        isObject(
            runtimeResult
        )
            ? Object.keys(
                runtimeResult
            )
            : []
    );

    for (
        const [
            key,
            value
        ] of Object.entries(
            runtimeResult || {}
        )
    ) {

        console.log(
            key,
            "=>",
            {
                type:
                    typeof value,

                array:
                    Array.isArray(
                        value
                    ),

                object:
                    isObject(
                        value
                    ),

                keys:
                    isObject(
                        value
                    )
                        ? Object.keys(
                            value
                        )
                        : []
            }
        );

    }

    const candidateArrays = [];

    function discoverArrays({

        value,

        path = "runtimeResult",

        depth = 0,

        visited = new WeakSet()

    }) {

        if (
            depth > 8 ||
            !isObject(
                value
            )
        ) {

            return;

        }

        if (
            visited.has(
                value
            )
        ) {

            return;

        }

        visited.add(
            value
        );

        if (
            Array.isArray(
                value
            )
        ) {

            candidateArrays.push({

                path,

                length:
                    value.length,

                value

            });

            value.forEach(
                (
                    item,
                    index
                ) => {

                    discoverArrays({

                        value:
                            item,

                        path:
                            `${path}[${index}]`,

                        depth:
                            depth + 1,

                        visited

                    });

                }
            );

            return;

        }

        for (
            const [
                key,
                child
            ] of Object.entries(
                value
            )
        ) {

            discoverArrays({

                value:
                    child,

                path:
                    `${path}.${key}`,

                depth:
                    depth + 1,

                visited

            });

        }

    }

    discoverArrays({

        value:
            runtimeResult

    });

    printSection(
        "DISCOVERED ARRAYS"
    );

    console.log(
        "ARRAY COUNT:",
        candidateArrays.length
    );

    for (
        const candidate of
        candidateArrays
    ) {

        console.log("");
        console.log(
            "PATH:",
            candidate.path
        );

        console.log(
            "LENGTH:",
            candidate.length
        );

        console.log(
            "ITEM SHAPES:"
        );

        candidate.value
            .slice(
                0,
                20
            )
            .forEach(
                (
                    item,
                    index
                ) => {

                    console.log(
                        index,
                        isObject(
                            item
                        )
                            ? Object.keys(
                                item
                            )
                            : typeof item
                    );

                }
            );

    }

    const strategyCandidates = [];

    function discoverStrategy({

        value,

        path = "runtimeResult",

        depth = 0,

        visited = new WeakSet()

    }) {

        if (
            depth > 10 ||
            !isObject(
                value
            )
        ) {

            return;

        }

        if (
            visited.has(
                value
            )
        ) {

            return;

        }

        visited.add(
            value
        );

        const serializedIdentity =

            [
                value.department,
                value.name,
                value.id,
                value.departmentId,
                value.component
            ]
                .filter(
                    item =>
                        typeof item ===
                            "string"
                )
                .join(
                    " "
                )
                .toLowerCase();

        if (
            serializedIdentity.includes(
                "strategy"
            )
        ) {

            strategyCandidates.push({

                path,

                keys:
                    Object.keys(
                        value
                    ),

                value

            });

        }

        if (
            Array.isArray(
                value
            )
        ) {

            value.forEach(
                (
                    item,
                    index
                ) => {

                    discoverStrategy({

                        value:
                            item,

                        path:
                            `${path}[${index}]`,

                        depth:
                            depth + 1,

                        visited

                    });

                }
            );

            return;

        }

        for (
            const [
                key,
                child
            ] of Object.entries(
                value
            )
        ) {

            discoverStrategy({

                value:
                    child,

                path:
                    `${path}.${key}`,

                depth:
                    depth + 1,

                visited

            });

        }

    }

    discoverStrategy({

        value:
            runtimeResult

    });

    printSection(
        "STRATEGY CANDIDATE DISCOVERY"
    );

    console.log(
        "STRATEGY CANDIDATES:",
        strategyCandidates.length
    );

    strategyCandidates.forEach(
        (
            candidate,
            index
        ) => {

            console.log("");
            console.log(
                "CANDIDATE:",
                index + 1
            );

            console.log(
                "PATH:",
                candidate.path
            );

            console.log(
                "KEYS:",
                candidate.keys
            );

            console.log(
                "VALUE:"
            );

            console.log(
                JSON.stringify(
                    candidate.value,
                    null,
                    2
                )
            );

        }
    );

    printSection(
        "RUNTIME OBSERVATION AFTER EXECUTION"
    );

    let observation;

    try {

        observation =

            await Runtime.observe({

                campaignId

            });

    } catch (
        error
    ) {

        console.error(
            "OBSERVATION ERROR NAME:",
            error?.name
        );

        console.error(
            "OBSERVATION ERROR CODE:",
            error?.code
        );

        console.error(
            "OBSERVATION ERROR MESSAGE:",
            error?.message
        );

        process.exitCode = 30;

        return;

    }

    inspectObject({

        name:
            "RAW RUNTIME OBSERVATION",

        value:
            observation

    });

    printSection(
        "WAITING SEMANTIC AUDIT"
    );

    const resultText =

        JSON.stringify(
            runtimeResult
        )
            .toLowerCase();

    const observationText =

        JSON.stringify(
            observation
        )
            .toLowerCase();

    const waitingVisible =

        resultText.includes(
            "waiting"
        ) ||

        observationText.includes(
            "waiting"
        );

    const campaignIntelligenceVisible =

        resultText.includes(
            "campaign.intelligence"
        ) ||

        observationText.includes(
            "campaign.intelligence"
        );

    const productIntelligenceVisible =

        resultText.includes(
            "product.intelligence"
        ) ||

        observationText.includes(
            "product.intelligence"
        );

    console.log(
        "WAITING VISIBLE:",
        waitingVisible
    );

    console.log(
        "CAMPAIGN.INTELLIGENCE VISIBLE:",
        campaignIntelligenceVisible
    );

    console.log(
        "PRODUCT.INTELLIGENCE VISIBLE:",
        productIntelligenceVisible
    );

    console.log("");
    console.log(
        "EXPECTED SEMANTIC STATE:"
    );

    console.log(
        "Strategy waits when required contracts are unavailable."
    );

    console.log(
        "Research completion is not assumed."
    );

    console.log(
        "Missing upstream contracts are not Runtime failure."
    );

    if (
        !waitingVisible
    ) {

        console.error("");
        console.error(
            "AUDIT RESULT: FAIL"
        );

        console.error(
            "Runtime did not expose a WAITING state."
        );

        process.exitCode = 40;

        return;

    }

    printSection(
        "STAGE 5 AUDIT RESULT"
    );

    console.log(
        "AUDIT RESULT: PASS"
    );

    console.log(
        "RUNTIME EXECUTION: COMPLETED"
    );

    console.log(
        "WAITING STATE: VISIBLE"
    );

    console.log(
        "FILES MODIFIED BY AUDIT: NONE"
    );

})().catch(

    error => {

        console.error("");
        console.error(
            "UNHANDLED AUDIT ERROR:"
        );

        console.error(
            error
        );

        process.exitCode = 99;

    }

);