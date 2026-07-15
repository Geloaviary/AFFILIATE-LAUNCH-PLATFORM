"use strict";

const fs =
    require(
        "fs"
    );

const path =
    require(
        "path"
    );

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

function countMatches(
    source,
    pattern
) {

    return (
        source.match(
            pattern
        ) || []
    ).length;

}

function replaceExact({

    source,

    target,

    replacement,

    name

}) {

    const count =
        source
            .split(
                target
            )
            .length - 1;

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
    "STAGE 4B RUNTIME EXECUTIVE EDGE REPAIR"
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

const sourceBuffer =
    fs.readFileSync(
        TARGET
    );

let source =
    sourceBuffer.toString(
        "utf8"
    );

console.log(
    "SOURCE BYTE LENGTH:",
    sourceBuffer.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    sourceBuffer.length >= 3 &&
    sourceBuffer[0] === 0xef &&
    sourceBuffer[1] === 0xbb &&
    sourceBuffer[2] === 0xbf
);

console.log(
    "CRLF COUNT:",
    (
        source.match(
            /\r\n/g
        ) || []
    ).length
);

console.log(
    "LF COUNT:",
    (
        source.match(
            /(?<!\r)\n/g
        ) || []
    ).length
);

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

console.log(
    "RUNTIME IMPORT REFERENCES:",
    countMatches(
        source,
        /lib\/departments\/runtime/g
    )
);

console.log(
    "RUNTIME EXECUTE REFERENCES:",
    countMatches(
        source,
        /Runtime\.execute\s*\(/g
    )
);

console.log(
    "STRATEGY EXECUTE REFERENCES:",
    countMatches(
        source,
        /StrategyEngine\.execute\s*\(/g
    )
);

if (
    countMatches(
        source,
        /lib\/departments\/runtime/g
    ) !== 0
) {

    fail(
        "Runtime import already exists."
    );

}

if (
    countMatches(
        source,
        /Runtime\.execute\s*\(/g
    ) !== 0
) {

    fail(
        "Runtime.execute already exists."
    );

}

if (
    countMatches(
        source,
        /StrategyEngine\.execute\s*\(/g
    ) !== 1
) {

    fail(
        "Expected exactly one StrategyEngine.execute reference."
    );

}

const CRLF =
    "\r\n";

const legacyImport =

    [
        "const StrategyEngine =",
        "",
        "    require(",
        "",
        "        \"../departments/strategy/strategy-engine/engine\"",
        "",
        "    );"
    ].join(
        CRLF
    );

const runtimeImport =

    [
        "const Runtime =",
        "",
        "    require(",
        "",
        "        \"../lib/departments/runtime\"",
        "",
        "    );"
    ].join(
        CRLF
    );

console.log("");
console.log(
    "========================================"
);
console.log(
    "REPAIR EXECUTIVE AUTHORITY IMPORT"
);
console.log(
    "========================================"
);
console.log("");

source =
    replaceExact({

        source,

        target:
            legacyImport,

        replacement:
            runtimeImport,

        name:
            "LEGACY STRATEGY IMPORT"

    });

const legacyExecution =

    [
        "const {",
        "",
        "    strategy,",
        "",
        "    campaign",
        "",
        "} =",
        "",
        "await StrategyEngine.execute({",
        "",
        "    campaignId,",
        "",
        "    name,",
        "",
        "    productUrl,",
        "",
        "    affiliateUrl,",
        "",
        "    revenueGoal,",
        "",
        "    research,",
        "",
        "    createdAt:",
        "",
        "        now",
        "",
        "});"
    ].join(
        CRLF
    );

const runtimeExecution =

    [
        "const runtimeResult =",
        "",
        "    await Runtime.execute({",
        "",
        "        campaignId,",
        "",
        "        name,",
        "",
        "        productUrl,",
        "",
        "        affiliateUrl,",
        "",
        "        revenueGoal,",
        "",
        "        research,",
        "",
        "        createdAt:",
        "",
        "            now",
        "",
        "    });",
        "",
        "const runtimeDepartments =",
        "",
        "    Array.isArray(",
        "",
        "        runtimeResult?.departments",
        "",
        "    )",
        "",
        "        ? runtimeResult.departments",
        "",
        "        : Array.isArray(",
        "",
        "            runtimeResult?.report?.departments",
        "",
        "        )",
        "",
        "            ? runtimeResult.report.departments",
        "",
        "            : [];",
        "",
        "const strategyDepartment =",
        "",
        "    runtimeDepartments.find(",
        "",
        "        department =>",
        "",
        "            department?.department ===",
        "",
        "                \"strategy\" ||",
        "",
        "            department?.name ===",
        "",
        "                \"strategy\" ||",
        "",
        "            department?.id ===",
        "",
        "                \"strategy\"",
        "",
        "    ) || null;",
        "",
        "const strategyStatus =",
        "",
        "    String(",
        "",
        "        strategyDepartment?.status ||",
        "",
        "        \"UNKNOWN\"",
        "",
        "    ).toUpperCase();",
        "",
        "if (",
        "",
        "    strategyStatus ===",
        "",
        "        \"WAITING\"",
        "",
        ") {",
        "",
        "    return res.status(202).json({",
        "",
        "        status:",
        "",
        "            \"waiting\",",
        "",
        "        department:",
        "",
        "            \"strategy\",",
        "",
        "        reason:",
        "",
        "            strategyDepartment?.reason ||",
        "",
        "            strategyDepartment?.message ||",
        "",
        "            \"Strategy Department is waiting for required contracts.\",",
        "",
        "        campaignId,",
        "",
        "        runtime:",
        "",
        "            runtimeResult",
        "",
        "    });",
        "",
        "}",
        "",
        "const strategyOutput =",
        "",
        "    strategyDepartment?.output ||",
        "",
        "    strategyDepartment?.result ||",
        "",
        "    strategyDepartment?.value ||",
        "",
        "    null;",
        "",
        "if (",
        "",
        "    !strategyOutput ||",
        "",
        "    !strategyOutput.strategy ||",
        "",
        "    !strategyOutput.campaign",
        "",
        ") {",
        "",
        "    throw new Error(",
        "",
        "        \"Runtime completed without executable Strategy campaign output.\"",
        "",
        "    );",
        "",
        "}",
        "",
        "const {",
        "",
        "    strategy,",
        "",
        "    campaign",
        "",
        "} =",
        "",
        "    strategyOutput;"
    ].join(
        CRLF
    );

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

source =
    replaceExact({

        source,

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
    "POST-REPAIR STRUCTURAL AUDIT"
);
console.log(
    "========================================"
);
console.log("");

const runtimeImportCount =
    countMatches(
        source,
        /lib\/departments\/runtime/g
    );

const runtimeExecuteCount =
    countMatches(
        source,
        /Runtime\.execute\s*\(/g
    );

const strategyExecuteCount =
    countMatches(
        source,
        /StrategyEngine\.execute\s*\(/g
    );

const strategyImportCount =
    countMatches(
        source,
        /departments\/strategy\/strategy-engine\/engine/g
    );

const waitingCount =
    countMatches(
        source,
        /strategyStatus ===[\s\S]*?"WAITING"/g
    );

console.log(
    "RUNTIME IMPORT:",
    runtimeImportCount
);

console.log(
    "RUNTIME EXECUTE:",
    runtimeExecuteCount
);

console.log(
    "STRATEGY EXECUTE:",
    strategyExecuteCount
);

console.log(
    "LEGACY STRATEGY IMPORT:",
    strategyImportCount
);

console.log(
    "STRATEGY WAITING BOUNDARY:",
    waitingCount
);

if (
    runtimeImportCount !== 1
) {

    fail(
        "Runtime import certification failed."
    );

}

if (
    runtimeExecuteCount !== 1
) {

    fail(
        "Runtime.execute certification failed."
    );

}

if (
    strategyExecuteCount !== 0
) {

    fail(
        "Direct StrategyEngine.execute remains."
    );

}

if (
    strategyImportCount !== 0
) {

    fail(
        "Legacy Strategy engine import remains."
    );

}

if (
    waitingCount !== 1
) {

    fail(
        "Strategy WAITING boundary certification failed."
    );

}

const outputBuffer =
    Buffer.from(
        source,
        "utf8"
    );

fs.writeFileSync(
    TARGET,
    outputBuffer
);

const writtenBuffer =
    fs.readFileSync(
        TARGET
    );

const writtenSource =
    writtenBuffer.toString(
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
    "SOURCE WRITTEN:",
    true
);

console.log(
    "OUTPUT BYTE LENGTH:",
    writtenBuffer.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    writtenBuffer.length >= 3 &&
    writtenBuffer[0] === 0xef &&
    writtenBuffer[1] === 0xbb &&
    writtenBuffer[2] === 0xbf
);

console.log(
    "CRLF COUNT:",
    (
        writtenSource.match(
            /\r\n/g
        ) || []
    ).length
);

console.log(
    "LF COUNT:",
    (
        writtenSource.match(
            /(?<!\r)\n/g
        ) || []
    ).length
);

if (
    (
        writtenSource.match(
            /(?<!\r)\n/g
        ) || []
    ).length !== 0
) {

    fail(
        "Unexpected LF-only line endings introduced."
    );

}

console.log("");
console.log(
    "========================================"
);
console.log(
    "STAGE 4B EXECUTIVE EDGE REPAIR COMPLETE"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "EXECUTION AUTHORITY: Runtime.execute"
);

console.log(
    "DIRECT STRATEGY EXECUTION: NONE"
);

console.log(
    "STRATEGY WAITING RESPONSE: HTTP 202"
);

console.log(
    "CAMPAIGN PERSISTENCE BEFORE STRATEGY READY: NONE"
);

console.log(
    "NEW API FILE: NONE"
);

console.log("");