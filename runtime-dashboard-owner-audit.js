"use strict";

const fs =
    require(
        "fs"
    );

const path =
    require(
        "path"
    );

/*
==================================================
Runtime Dashboard Owner Audit

Stage 2

Audit only.

Purpose:

- inspect the active dashboard render owner
- identify existing fetch ownership
- identify polling ownership
- identify status render surfaces
- identify safe Runtime observation insertion points

No repository files are modified.

==================================================
*/

const ROOT =
    process.cwd();

const DASHBOARD_PATH =
    path.join(
        ROOT,
        "public",
        "index.html"
    );

const LEGACY_PATH =
    path.join(
        ROOT,
        "legacy",
        "app-v1.html"
    );

/*
==================================================
Utilities
==================================================
*/

function countMatches(
    source,
    pattern
) {

    return (
        source.match(
            pattern
        ) ||
        []
    ).length;

}

function lineNumberAt(
    source,
    index
) {

    return (
        source
            .slice(
                0,
                index
            )
            .split(
                /\r?\n/
            )
            .length
    );

}

function extractReferences(
    source,
    pattern,
    contextLines = 3
) {

    const lines =
        source.split(
            /\r?\n/
        );

    const references = [];

    for (
        let index = 0;
        index < lines.length;
        index += 1
    ) {

        if (
            !pattern.test(
                lines[index]
            )
        ) {

            pattern.lastIndex = 0;

            continue;

        }

        pattern.lastIndex = 0;

        const start =
            Math.max(
                0,
                index - contextLines
            );

        const end =
            Math.min(
                lines.length,
                index + contextLines + 1
            );

        references.push({

            line:
                index + 1,

            context:
                lines
                    .slice(
                        start,
                        end
                    )
                    .map(
                        (
                            line,
                            contextIndex
                        ) => {

                            const actualLine =
                                start +
                                contextIndex +
                                1;

                            const marker =
                                actualLine ===
                                index + 1
                                    ? ">"
                                    : " ";

                            return (
                                `${marker} ${String(
                                    actualLine
                                ).padStart(
                                    5,
                                    " "
                                )} | ${line}`
                            );

                        }
                    )
                    .join(
                        "\n"
                    )

        });

    }

    return references;

}

function printReferences(
    title,
    references
) {

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

    console.log(
        "REFERENCES:",
        references.length
    );

    console.log("");

    for (
        const reference of references
    ) {

        console.log(
            "LINE:",
            reference.line
        );

        console.log(
            reference.context
        );

        console.log("");

    }

}

/*
==================================================
Precondition
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "STAGE 2 RUNTIME DASHBOARD OWNER AUDIT"
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
    "DASHBOARD OWNER:",
    path.relative(
        ROOT,
        DASHBOARD_PATH
    )
);

console.log("");

if (
    !fs.existsSync(
        DASHBOARD_PATH
    )
) {

    throw new Error(
        "public/index.html is missing."
    );

}

const source =
    fs.readFileSync(
        DASHBOARD_PATH,
        "utf8"
    );

console.log(
    "SOURCE BYTE LENGTH:",
    Buffer.byteLength(
        source,
        "utf8"
    )
);

console.log(
    "SOURCE LINES:",
    source.split(
        /\r?\n/
    ).length
);

console.log("");

/*
==================================================
Encoding Integrity
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "SOURCE ENCODING INTEGRITY"
);
console.log(
    "========================================"
);
console.log("");

const sourceBuffer =
    fs.readFileSync(
        DASHBOARD_PATH
    );

const bomPresent =
    sourceBuffer.length >= 3 &&
    sourceBuffer[0] === 0xef &&
    sourceBuffer[1] === 0xbb &&
    sourceBuffer[2] === 0xbf;

const utf8RoundTrip =
    Buffer.from(
        source,
        "utf8"
    ).equals(
        sourceBuffer
    );

const knownMojibake =
    /∩╗┐|├░|ΓÇ|≡ƒ|┬|┼╕/.test(
        source
    );

console.log(
    "UTF-8 BOM PRESENT:",
    bomPresent
);

console.log(
    "UTF-8 ROUND TRIP:",
    utf8RoundTrip
        ? "PASS"
        : "FAIL"
);

console.log(
    "KNOWN MOJIBAKE PRESENT:",
    knownMojibake
);

console.log("");

if (
    !utf8RoundTrip
) {

    throw new Error(
        "Dashboard source failed UTF-8 round-trip audit."
    );

}

if (
    knownMojibake
) {

    throw new Error(
        "Dashboard source contains known mojibake."
    );

}

/*
==================================================
Structural Inventory
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "DASHBOARD STRUCTURAL INVENTORY"
);
console.log(
    "========================================"
);
console.log("");

const scriptCount =
    countMatches(
        source,
        /<script\b/gi
    );

const inlineScriptCount =
    countMatches(
        source,
        /<script(?![^>]*\bsrc\s*=)[^>]*>/gi
    );

const externalScriptCount =
    countMatches(
        source,
        /<script[^>]*\bsrc\s*=/gi
    );

const fetchCount =
    countMatches(
        source,
        /\bfetch\s*\(/g
    );

const intervalCount =
    countMatches(
        source,
        /\bsetInterval\s*\(/g
    );

const timeoutCount =
    countMatches(
        source,
        /\bsetTimeout\s*\(/g
    );

const asyncFunctionCount =
    countMatches(
        source,
        /\basync\s+function\s+[A-Za-z_$][A-Za-z0-9_$]*\s*\(/g
    );

console.log(
    "SCRIPT TAGS:",
    scriptCount
);

console.log(
    "INLINE SCRIPT TAGS:",
    inlineScriptCount
);

console.log(
    "EXTERNAL SCRIPT TAGS:",
    externalScriptCount
);

console.log(
    "FETCH CALLS:",
    fetchCount
);

console.log(
    "SETINTERVAL CALLS:",
    intervalCount
);

console.log(
    "SETTIMEOUT CALLS:",
    timeoutCount
);

console.log(
    "ASYNC FUNCTION DECLARATIONS:",
    asyncFunctionCount
);

console.log("");

/*
==================================================
Function Inventory
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "FUNCTION INVENTORY"
);
console.log(
    "========================================"
);
console.log("");

const functionPattern =
    /\b(?:async\s+)?function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g;

const functions = [];

let functionMatch;

while (
    (
        functionMatch =
            functionPattern.exec(
                source
            )
    ) !== null
) {

    functions.push({

        name:
            functionMatch[1],

        line:
            lineNumberAt(
                source,
                functionMatch.index
            ),

        async:
            /^async\s+function/.test(
                functionMatch[0]
            )

    });

}

for (
    const functionEntry of functions
) {

    console.log(
        JSON.stringify(
            functionEntry
        )
    );

}

console.log("");

console.log(
    "FUNCTIONS:",
    functions.length
);

console.log("");

/*
==================================================
Fetch Ownership
==================================================
*/

const fetchReferences =
    extractReferences(
        source,
        /\bfetch\s*\(/,
        12
    );

printReferences(
    "FETCH OWNERSHIP",
    fetchReferences
);

/*
==================================================
API Utils Ownership
==================================================
*/

const utilsReferences =
    extractReferences(
        source,
        /\/api\/utils|api\/utils|action=/,
        12
    );

printReferences(
    "API UTILS OWNERSHIP",
    utilsReferences
);

/*
==================================================
Polling Ownership
==================================================
*/

const intervalReferences =
    extractReferences(
        source,
        /\bsetInterval\s*\(/,
        12
    );

printReferences(
    "POLLING OWNERSHIP",
    intervalReferences
);

/*
==================================================
Timeout Ownership
==================================================
*/

const timeoutReferences =
    extractReferences(
        source,
        /\bsetTimeout\s*\(/,
        8
    );

printReferences(
    "TIMEOUT OWNERSHIP",
    timeoutReferences
);

/*
==================================================
Status Render Surfaces
==================================================
*/

const statusReferences =
    extractReferences(
        source,
        /status|running|waiting|failed|healthy|registered/i,
        5
    );

printReferences(
    "STATUS RENDER SURFACES",
    statusReferences
);

/*
==================================================
Dashboard Section Surfaces
==================================================
*/

const dashboardReferences =
    extractReferences(
        source,
        /Dashboard|Overview|Campaign|Production|Publishing|Analytics|Department/,
        4
    );

printReferences(
    "DASHBOARD SECTION SURFACES",
    dashboardReferences
);

/*
==================================================
DOM Mutation Ownership
==================================================
*/

const domReferences =
    extractReferences(
        source,
        /getElementById|querySelector|innerHTML|textContent|insertAdjacentHTML/,
        5
    );

printReferences(
    "DOM MUTATION OWNERSHIP",
    domReferences
);

/*
==================================================
DOMContentLoaded / Startup Ownership
==================================================
*/

const startupReferences =
    extractReferences(
        source,
        /DOMContentLoaded|window\.onload|addEventListener\s*\(\s*["']load["']/,
        8
    );

printReferences(
    "DASHBOARD STARTUP OWNERSHIP",
    startupReferences
);

/*
==================================================
Legacy Comparison
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "LEGACY DASHBOARD COMPARISON"
);
console.log(
    "========================================"
);
console.log("");

if (
    fs.existsSync(
        LEGACY_PATH
    )
) {

    const legacySource =
        fs.readFileSync(
            LEGACY_PATH,
            "utf8"
        );

    console.log(
        "LEGACY PRESENT: true"
    );

    console.log(
        "ACTIVE BYTE LENGTH:",
        Buffer.byteLength(
            source,
            "utf8"
        )
    );

    console.log(
        "LEGACY BYTE LENGTH:",
        Buffer.byteLength(
            legacySource,
            "utf8"
        )
    );

    console.log(
        "ACTIVE EQUALS LEGACY:",
        source ===
        legacySource
    );

    console.log(
        "ACTIVE FETCH CALLS:",
        fetchCount
    );

    console.log(
        "LEGACY FETCH CALLS:",
        countMatches(
            legacySource,
            /\bfetch\s*\(/g
        )
    );

    console.log(
        "ACTIVE POLLING CALLS:",
        intervalCount
    );

    console.log(
        "LEGACY POLLING CALLS:",
        countMatches(
            legacySource,
            /\bsetInterval\s*\(/g
        )
    );

} else {

    console.log(
        "LEGACY PRESENT: false"
    );

}

console.log("");

/*
==================================================
Runtime Transport Collision Audit
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "RUNTIME TRANSPORT COLLISION AUDIT"
);
console.log(
    "========================================"
);
console.log("");

const runtimeObservationReferences =
    extractReferences(
        source,
        /runtime-observation|Runtime\.observe|runtimeObservation|runtimeStatus/,
        5
    );

console.log(
    "EXISTING RUNTIME OBSERVATION REFERENCES:",
    runtimeObservationReferences.length
);

console.log("");

for (
    const reference of
    runtimeObservationReferences
) {

    console.log(
        "LINE:",
        reference.line
    );

    console.log(
        reference.context
    );

    console.log("");

}

if (
    runtimeObservationReferences.length >
    0
) {

    throw new Error(
        "Runtime observation UI wiring already exists. Collision review required."
    );

}

/*
==================================================
Git Integrity
==================================================
*/

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

/*
==================================================
Final Result
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "STAGE 2 DASHBOARD OWNER AUDIT COMPLETE"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "ACTIVE DASHBOARD OWNER: public/index.html"
);

console.log(
    "RUNTIME OBSERVATION TRANSPORT: api/utils.js"
);

console.log(
    "RUNTIME OBSERVATION AUTHORITY: Runtime.observe"
);

console.log(
    "STATUS CALCULATION IN UI: PROHIBITED"
);

console.log(
    "NEW API FILE: NONE"
);

console.log(
    "UI MODIFICATION: NONE"
);

console.log("");