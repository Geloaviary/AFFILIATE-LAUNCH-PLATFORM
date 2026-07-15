"use strict";

const fs = require("fs");
const path = require("path");

const ROOT =
    process.cwd();

const TARGET =
    path.join(
        ROOT,
        "api",
        "manage-campaigns.js"
    );

function fail(
    message
) {

    throw new Error(
        message
    );

}

function countExact(
    source,
    value
) {

    return source
        .split(value)
        .length - 1;

}

function replaceExact({
    source,
    target,
    replacement,
    name
}) {

    const count =
        countExact(
            source,
            target
        );

    console.log(
        `${name} TARGETS:`,
        count
    );

    if (
        count !== 1
    ) {

        fail(
            `${name} expected exactly one target, received ${count}.`
        );

    }

    return source.replace(
        target,
        replacement
    );

}

console.log("");
console.log(
    "========================================"
);
console.log(
    "STAGE 4 RUNTIME EXECUTIVE EDGE REPAIR"
);
console.log(
    "========================================"
);
console.log("");

if (
    !fs.existsSync(
        TARGET
    )
) {

    fail(
        "api/manage-campaigns.js is missing."
    );

}

const originalBuffer =
    fs.readFileSync(
        TARGET
    );

const original =
    originalBuffer.toString(
        "utf8"
    );

console.log(
    "SOURCE BYTE LENGTH:",
    originalBuffer.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    originalBuffer.length >= 3 &&
    originalBuffer[0] === 0xef &&
    originalBuffer[1] === 0xbb &&
    originalBuffer[2] === 0xbf
);

const legacyImport = `const StrategyEngine =

    require(

        "../departments/strategy/strategy-engine/engine"

    );`;

const runtimeImport = `const Runtime =

    require(

        "../lib/departments/runtime"

    );`;

const legacyExecution = `const {

    strategy,

    campaign

} =

await StrategyEngine.execute({

    campaignId,

    name,

    productUrl,

    affiliateUrl,

    revenueGoal,

    research,

    createdAt:

        now

});`;

const runtimeExecution = `const campaign = {

    id:

        campaignId,

    campaignId,

    userId,

    name,

    productUrl,

    affiliateUrl,

    revenueGoal,

    research,

    createdAt:

        now,

    status:

        "runtime-pending"

};

const runtime =

    await Runtime.execute({

        command:

            "campaign-runtime-evaluation",

        campaignId,

        requestedBy:

            "campaign-api",

        options: {

            userId,

            campaign: {

                name,

                productUrl,

                affiliateUrl,

                revenueGoal,

                research,

                createdAt:

                    now

            }

        }

    });`;

console.log("");
console.log(
    "========================================"
);
console.log(
    "PRE-REPAIR COLLISION AUDIT"
);
console.log(
    "========================================"
);
console.log("");

const runtimeImportCount =
    countExact(
        original,
        'require(\n\n        "../lib/departments/runtime"\n\n    )'
    );

const runtimeExecuteCount =
    countExact(
        original,
        "Runtime.execute("
    );

const strategyExecuteCount =
    countExact(
        original,
        "StrategyEngine.execute("
    );

console.log(
    "RUNTIME IMPORT REFERENCES:",
    runtimeImportCount
);

console.log(
    "RUNTIME EXECUTE REFERENCES:",
    runtimeExecuteCount
);

console.log(
    "STRATEGY EXECUTE REFERENCES:",
    strategyExecuteCount
);

if (
    runtimeImportCount !== 0
) {

    fail(
        "Runtime import already exists. Refusing collision."
    );

}

if (
    runtimeExecuteCount !== 0
) {

    fail(
        "Runtime.execute already exists. Refusing collision."
    );

}

if (
    strategyExecuteCount !== 1
) {

    fail(
        "Expected exactly one StrategyEngine.execute reference."
    );

}

let repaired =
    original;

console.log("");
console.log(
    "========================================"
);
console.log(
    "REPAIR LEGACY STRATEGY IMPORT"
);
console.log(
    "========================================"
);
console.log("");

repaired =
    replaceExact({

        source:
            repaired,

        target:
            legacyImport,

        replacement:
            runtimeImport,

        name:
            "LEGACY STRATEGY IMPORT"

    });

console.log("");
console.log(
    "========================================"
);
console.log(
    "REPAIR EXECUTIVE EXECUTION EDGE"
);
console.log(
    "========================================"
);
console.log("");

repaired =
    replaceExact({

        source:
            repaired,

        target:
            legacyExecution,

        replacement:
            runtimeExecution,

        name:
            "LEGACY STRATEGY EXECUTION"

    });

console.log("");
console.log(
    "========================================"
);
console.log(
    "POST-REPAIR CONTRACT AUDIT"
);
console.log(
    "========================================"
);
console.log("");

const assertions = [
    [
        "Runtime import",
        countExact(
            repaired,
            "../lib/departments/runtime"
        ) === 1
    ],
    [
        "Runtime.execute",
        countExact(
            repaired,
            "Runtime.execute("
        ) === 1
    ],
    [
        "StrategyEngine identifier absent",
        countExact(
            repaired,
            "StrategyEngine"
        ) === 0
    ],
    [
        "Legacy strategy path absent",
        countExact(
            repaired,
            "../departments/strategy/strategy-engine/engine"
        ) === 0
    ],
    [
        "Bootstrap direct call absent",
        countExact(
            repaired,
            "Bootstrap.execute("
        ) === 0
    ],
    [
        "RuntimeEngine direct call absent",
        countExact(
            repaired,
            "RuntimeEngine.execute("
        ) === 0
    ],
    [
        "Dispatcher direct call absent",
        countExact(
            repaired,
            "Dispatcher.execute("
        ) === 0
    ]
];

let passed =
    true;

for (
    const [
        name,
        result
    ] of assertions
) {

    console.log(
        `${name}:`,
        result
            ? "PASS"
            : "FAIL"
    );

    if (
        !result
    ) {

        passed =
            false;

    }

}

if (
    !passed
) {

    fail(
        "Post-repair constitutional audit failed."
    );

}

const repairedBuffer =
    Buffer.from(
        repaired,
        "utf8"
    );

fs.writeFileSync(
    TARGET,
    repairedBuffer
);

const written =
    fs.readFileSync(
        TARGET
    );

const writtenSource =
    written.toString(
        "utf8"
    );

console.log("");
console.log(
    "========================================"
);
console.log(
    "BYTE INTEGRITY"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "OUTPUT BYTE LENGTH:",
    written.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    written.length >= 3 &&
    written[0] === 0xef &&
    written[1] === 0xbb &&
    written[2] === 0xbf
);

console.log(
    "UTF-8 ROUND TRIP:",
    Buffer.from(
        writtenSource,
        "utf8"
    ).equals(
        written
    )
        ? "PASS"
        : "FAIL"
);

console.log("");
console.log(
    "========================================"
);
console.log(
    "STAGE 4 EXECUTIVE EDGE REPAIR COMPLETE"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "EXECUTION AUTHORITY: Runtime.execute"
);

console.log(
    "BOOTSTRAP AUTHORITY: Runtime Manager"
);

console.log(
    "ELIGIBILITY AUTHORITY: Runtime Engine"
);

console.log(
    "DISPATCH AUTHORITY: Runtime Dispatcher"
);

console.log(
    "DIRECT STRATEGY EXECUTION: ABSENT"
);

console.log("");