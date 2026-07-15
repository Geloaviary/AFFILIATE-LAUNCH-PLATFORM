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

function printWindow({
    source,
    index,
    before = 250,
    after = 500,
    title
}) {

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

    if (
        index < 0
    ) {

        console.log(
            "TARGET NOT FOUND"
        );

        return;

    }

    const start =
        Math.max(
            0,
            index - before
        );

    const end =
        Math.min(
            source.length,
            index + after
        );

    const fragment =
        source.slice(
            start,
            end
        );

    console.log(
        "CHARACTER INDEX:",
        index
    );

    console.log(
        "WINDOW START:",
        start
    );

    console.log(
        "WINDOW END:",
        end
    );

    console.log("");
    console.log(
        "----- RAW WINDOW -----"
    );
    console.log("");

    console.log(
        fragment
    );

    console.log("");
    console.log(
        "----- JSON STRING SHAPE -----"
    );
    console.log("");

    console.log(
        JSON.stringify(
            fragment
        )
    );

    console.log("");
    console.log(
        "----- LINE SHAPE -----"
    );
    console.log("");

    const lines =
        fragment.split(/\r?\n/);

    lines.forEach(
        (
            line,
            index
        ) => {

            console.log(
                String(index + 1)
                    .padStart(
                        4,
                        " "
                    ),
                JSON.stringify(
                    line
                )
            );

        }
    );

}

console.log("");
console.log(
    "========================================"
);
console.log(
    "STAGE 4A EXECUTIVE EDGE SHAPE AUDIT"
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

const buffer =
    fs.readFileSync(
        TARGET
    );

const source =
    buffer.toString(
        "utf8"
    );

console.log(
    "TARGET:",
    TARGET
);

console.log(
    "SOURCE BYTE LENGTH:",
    buffer.length
);

console.log(
    "SOURCE CHARACTER LENGTH:",
    source.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
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

const strategyIdentifierIndex =
    source.indexOf(
        "const StrategyEngine"
    );

const strategyPathIndex =
    source.indexOf(
        "../departments/strategy/strategy-engine/engine"
    );

const strategyExecuteIndex =
    source.indexOf(
        "StrategyEngine.execute("
    );

console.log("");
console.log(
    "STRATEGY IDENTIFIER INDEX:",
    strategyIdentifierIndex
);

console.log(
    "STRATEGY PATH INDEX:",
    strategyPathIndex
);

console.log(
    "STRATEGY EXECUTE INDEX:",
    strategyExecuteIndex
);

if (
    strategyIdentifierIndex < 0
) {

    fail(
        "StrategyEngine declaration not found."
    );

}

if (
    strategyPathIndex < 0
) {

    fail(
        "Legacy Strategy engine path not found."
    );

}

if (
    strategyExecuteIndex < 0
) {

    fail(
        "StrategyEngine.execute call not found."
    );

}

printWindow({

    source,

    index:
        strategyIdentifierIndex,

    before:
        150,

    after:
        450,

    title:
        "STRATEGY IMPORT EXACT SOURCE SHAPE"

});

printWindow({

    source,

    index:
        strategyExecuteIndex,

    before:
        400,

    after:
        1000,

    title:
        "STRATEGY EXECUTION EXACT SOURCE SHAPE"

});

console.log("");
console.log(
    "========================================"
);
console.log(
    "STRUCTURAL BOUNDARY DISCOVERY"
);
console.log(
    "========================================"
);
console.log("");

const importStart =
    strategyIdentifierIndex;

const importSemicolon =
    source.indexOf(
        ";",
        strategyPathIndex
    );

const executeStatementStart =
    source.lastIndexOf(
        "const",
        strategyExecuteIndex
    );

const executeCallEndMarker =
    source.indexOf(
        "});",
        strategyExecuteIndex
    );

console.log(
    "IMPORT START:",
    importStart
);

console.log(
    "IMPORT SEMICOLON:",
    importSemicolon
);

console.log(
    "IMPORT LENGTH:",
    importSemicolon >= 0
        ? importSemicolon -
            importStart +
            1
        : -1
);

console.log(
    "EXECUTION STATEMENT START:",
    executeStatementStart
);

console.log(
    "EXECUTION CALL END MARKER:",
    executeCallEndMarker
);

console.log(
    "EXECUTION STATEMENT LENGTH:",
    executeCallEndMarker >= 0 &&
    executeStatementStart >= 0
        ? executeCallEndMarker -
            executeStatementStart +
            3
        : -1
);

if (
    importSemicolon < 0
) {

    fail(
        "Strategy import semicolon boundary not found."
    );

}

if (
    executeStatementStart < 0
) {

    fail(
        "Strategy execution statement start not found."
    );

}

if (
    executeCallEndMarker < 0
) {

    fail(
        "Strategy execution call end not found."
    );

}

const importStatement =
    source.slice(
        importStart,
        importSemicolon + 1
    );

const executionStatement =
    source.slice(
        executeStatementStart,
        executeCallEndMarker + 3
    );

console.log("");
console.log(
    "========================================"
);
console.log(
    "EXACT IMPORT STATEMENT"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    JSON.stringify(
        importStatement
    )
);

console.log("");
console.log(
    "========================================"
);
console.log(
    "EXACT EXECUTION STATEMENT"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    JSON.stringify(
        executionStatement
    )
);

console.log("");
console.log(
    "========================================"
);
console.log(
    "AUDIT INTEGRITY"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "FILES MODIFIED BY AUDIT: NONE"
);

console.log("");
console.log(
    "========================================"
);
console.log(
    "STAGE 4A SHAPE AUDIT COMPLETE"
);
console.log(
    "========================================"
);
console.log("");