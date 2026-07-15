"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

const TARGETS = [
    "api/manage-campaigns.js",
    "lib/departments/runtime/index.js",
    "lib/departments/runtime/manager.js",
    "lib/departments/runtime/runtime-engine.js",
    "lib/departments/runtime/input.js"
];

const PATTERNS = [
    {
        name: "Runtime require",
        pattern: /require\s*\([^)]*departments[\\/]runtime[^)]*\)/gi
    },
    {
        name: "Runtime.execute",
        pattern: /\bRuntime\.execute\s*\(/g
    },
    {
        name: "Strategy require",
        pattern: /require\s*\([^)]*strategy[^)]*\)/gi
    },
    {
        name: "StrategyEngine",
        pattern: /\bStrategyEngine\b/g
    },
    {
        name: "Strategy execute",
        pattern: /\bStrategy(?:Engine)?\.execute\s*\(/g
    },
    {
        name: "manager execute",
        pattern: /\bmanager\.execute\s*\(/g
    },
    {
        name: "RuntimeEngine.execute",
        pattern: /\bRuntimeEngine\.execute\s*\(/g
    },
    {
        name: "Bootstrap.execute",
        pattern: /\bBootstrap\.execute\s*\(/g
    },
    {
        name: "action",
        pattern: /\baction\b/g
    },
    {
        name: "campaignId",
        pattern: /\bcampaignId\b/g
    }
];

function lineNumberAt(source, index) {
    return source
        .slice(0, index)
        .split(/\r?\n/)
        .length;
}

function printContext(
    source,
    index,
    radius = 10
) {
    const lines = source.split(/\r?\n/);

    const lineNumber =
        lineNumberAt(source, index);

    const start = Math.max(
        0,
        lineNumber - radius - 1
    );

    const end = Math.min(
        lines.length,
        lineNumber + radius
    );

    console.log(
        `LINE: ${lineNumber}`
    );

    for (
        let i = start;
        i < end;
        i++
    ) {
        const marker =
            i + 1 === lineNumber
                ? ">"
                : " ";

        console.log(
            `${marker} ${String(i + 1).padStart(5, " ")} | ${lines[i]}`
        );
    }
}

console.log("");
console.log(
    "========================================"
);
console.log(
    "RUNTIME EXECUTIVE COMMAND AUDIT"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "PROJECT ROOT:",
    ROOT
);

console.log(
    "AUDIT MODE: READ ONLY"
);

for (const relativePath of TARGETS) {
    console.log("");
    console.log(
        "========================================"
    );
    console.log(
        "FILE:",
        relativePath
    );
    console.log(
        "========================================"
    );

    const absolutePath =
        path.join(
            ROOT,
            relativePath
        );

    if (!fs.existsSync(absolutePath)) {
        console.log("");
        console.log("STATUS: MISSING");
        continue;
    }

    const source =
        fs.readFileSync(
            absolutePath,
            "utf8"
        );

    console.log("");
    console.log(
        "BYTE LENGTH:",
        Buffer.byteLength(
            source,
            "utf8"
        )
    );

    for (const definition of PATTERNS) {
        definition.pattern.lastIndex = 0;

        const matches = [
            ...source.matchAll(
                definition.pattern
            )
        ];

        definition.pattern.lastIndex = 0;

        console.log("");
        console.log(
            `${definition.name.toUpperCase()}:`,
            matches.length
        );

        for (
            const match of matches.slice(0, 10)
        ) {
            console.log("");

            printContext(
                source,
                match.index
            );
        }
    }
}

console.log("");
console.log(
    "========================================"
);
console.log(
    "EXECUTIVE COMMAND AUDIT COMPLETE"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "FILES MODIFIED BY AUDIT: NONE"
);

console.log(
    "DECISION TARGET:"
);

console.log(
    "Does api/manage-campaigns.js bypass Runtime.execute()?"
);

console.log("");