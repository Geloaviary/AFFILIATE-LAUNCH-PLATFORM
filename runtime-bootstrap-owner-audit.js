"use strict";

const fs =
    require(
        "fs"
    );

const path =
    require(
        "path"
    );

const childProcess =
    require(
        "child_process"
    );

/*
==================================================
Runtime Bootstrap Owner Audit

READ ONLY

Purpose:

Discover the existing Platform Bootstrap owner
and determine how Runtime Department execution
is currently started.

This audit modifies NO repository files.

Constitutional questions:

1. Where is bootstrap defined?
2. Who invokes bootstrap?
3. Does bootstrap invoke Runtime?
4. Does Runtime execute registered departments?
5. Is startup HTTP-owned, CLI-owned, module-owned,
   or deployment-owned?
6. Can the dashboard observe Runtime without
   becoming execution authority?

==================================================
*/

const ROOT =
    process.cwd();

const SELF =
    path.relative(
        ROOT,
        __filename
    ).replace(
        /\\/g,
        "/"
    );

const EXCLUDED_DIRECTORIES =
    new Set([
        ".git",
        "node_modules",
        ".next",
        "dist",
        "build",
        "coverage"
    ]);

const SOURCE_EXTENSIONS =
    new Set([
        ".js",
        ".cjs",
        ".mjs",
        ".json",
        ".html"
    ]);

/*
==================================================
Utilities
==================================================
*/

function walk(
    directory,
    files = []
) {

    const entries =
        fs.readdirSync(
            directory,
            {
                withFileTypes:
                    true
            }
        );

    for (
        const entry of entries
    ) {

        if (
            EXCLUDED_DIRECTORIES.has(
                entry.name
            )
        ) {

            continue;

        }

        const absolutePath =
            path.join(
                directory,
                entry.name
            );

        if (
            entry.isDirectory()
        ) {

            walk(
                absolutePath,
                files
            );

            continue;

        }

        const extension =
            path.extname(
                entry.name
            ).toLowerCase();

        if (
            !SOURCE_EXTENSIONS.has(
                extension
            )
        ) {

            continue;

        }

        const relativePath =
            path.relative(
                ROOT,
                absolutePath
            ).replace(
                /\\/g,
                "/"
            );

        if (
            relativePath === SELF
        ) {

            continue;

        }

        files.push({
            absolutePath,
            relativePath
        });

    }

    return files;

}

function readSource(
    file
) {

    try {

        return fs.readFileSync(
            file.absolutePath,
            "utf8"
        );

    } catch (
        error
    ) {

        return "";

    }

}

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

function printContext(
    source,
    index,
    radius = 8
) {

    const lines =
        source.split(
            /\r?\n/
        );

    const lineNumber =
        lineNumberAt(
            source,
            index
        );

    const start =
        Math.max(
            0,
            lineNumber -
            radius -
            1
        );

    const end =
        Math.min(
            lines.length,
            lineNumber +
            radius
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
            `${marker} ${String(
                i + 1
            ).padStart(
                5,
                " "
            )} | ${lines[i]}`
        );

    }

}

function discoverMatches(
    files,
    patterns
) {

    const results = [];

    for (
        const file of files
    ) {

        const source =
            readSource(
                file
            );

        if (
            !source
        ) {

            continue;

        }

        const evidence = [];

        for (
            const definition of patterns
        ) {

            const count =
                countMatches(
                    source,
                    definition.pattern
                );

            if (
                count > 0
            ) {

                evidence.push({
                    name:
                        definition.name,
                    count
                });

            }

        }

        if (
            evidence.length
        ) {

            results.push({
                file:
                    file.relativePath,
                source,
                evidence
            });

        }

    }

    return results;

}

function printDiscovery(
    title,
    results,
    contextPatterns = []
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

    console.log(
        "FILES:",
        results.length
    );

    for (
        const result of results
    ) {

        console.log("");
        console.log(
            "FILE:",
            result.file
        );

        console.log(
            "EVIDENCE:",
            result.evidence
                .map(
                    item =>
                        `${item.name}=${item.count}`
                )
                .join(
                    ", "
                )
        );

        for (
            const pattern of
            contextPatterns
        ) {

            const match =
                pattern.exec(
                    result.source
                );

            pattern.lastIndex = 0;

            if (
                match
            ) {

                console.log("");

                printContext(
                    result.source,
                    match.index
                );

                break;

            }

        }

    }

}

/*
==================================================
Start
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "RUNTIME BOOTSTRAP OWNER AUDIT"
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

const files =
    walk(
        ROOT
    );

console.log(
    "SOURCE FILES INSPECTED:",
    files.length
);

/*
==================================================
Bootstrap Definition Discovery
==================================================
*/

const bootstrapDefinitions =
    discoverMatches(
        files,
        [
            {
                name:
                    "bootstrap filename",
                pattern:
                    /bootstrap/i
            },
            {
                name:
                    "bootstrap function",
                pattern:
                    /(?:async\s+)?function\s+bootstrap\s*\(/gi
            },
            {
                name:
                    "bootstrap assignment",
                pattern:
                    /\bbootstrap\s*=\s*(?:async\s*)?\(/gi
            },
            {
                name:
                    "bootstrap export",
                pattern:
                    /(?:module\.exports|exports\.[A-Za-z0-9_$]+)[\s\S]{0,100}bootstrap/gi
            },
            {
                name:
                    "bootstrap class method",
                pattern:
                    /\bbootstrap\s*\([^)]*\)\s*\{/gi
            }
        ]
    );

printDiscovery(
    "BOOTSTRAP DEFINITION DISCOVERY",
    bootstrapDefinitions,
    [
        /(?:async\s+)?function\s+bootstrap\s*\(/gi,
        /\bbootstrap\s*=\s*(?:async\s*)?\(/gi,
        /\bbootstrap\s*\([^)]*\)\s*\{/gi
    ]
);

/*
==================================================
Bootstrap Invocation Discovery
==================================================
*/

const bootstrapInvocations =
    discoverMatches(
        files,
        [
            {
                name:
                    "bootstrap call",
                pattern:
                    /\bbootstrap\s*\(/gi
            },
            {
                name:
                    ".bootstrap call",
                pattern:
                    /\.bootstrap\s*\(/gi
            },
            {
                name:
                    "bootstrap require",
                pattern:
                    /require\s*\([^)]*bootstrap[^)]*\)/gi
            },
            {
                name:
                    "bootstrap import",
                pattern:
                    /(?:import|from)[^\n;]*bootstrap/gi
            }
        ]
    );

printDiscovery(
    "BOOTSTRAP INVOCATION DISCOVERY",
    bootstrapInvocations,
    [
        /\.bootstrap\s*\(/gi,
        /\bbootstrap\s*\(/gi,
        /require\s*\([^)]*bootstrap[^)]*\)/gi
    ]
);

/*
==================================================
Runtime Invocation Discovery
==================================================
*/

const runtimeInvocations =
    discoverMatches(
        files,
        [
            {
                name:
                    "Runtime require",
                pattern:
                    /require\s*\([^)]*departments[\\/]runtime[^)]*\)/gi
            },
            {
                name:
                    "Runtime.execute",
                pattern:
                    /\bRuntime\.execute\s*\(/g
            },
            {
                name:
                    "Runtime.observe",
                pattern:
                    /\bRuntime\.observe\s*\(/g
            },
            {
                name:
                    "runtime.execute",
                pattern:
                    /\bruntime\.execute\s*\(/g
            },
            {
                name:
                    "runtime.observe",
                pattern:
                    /\bruntime\.observe\s*\(/g
            }
        ]
    );

printDiscovery(
    "RUNTIME INVOCATION DISCOVERY",
    runtimeInvocations,
    [
        /\bRuntime\.execute\s*\(/g,
        /\bruntime\.execute\s*\(/g,
        /\bRuntime\.observe\s*\(/g,
        /\bruntime\.observe\s*\(/g
    ]
);

/*
==================================================
Department Runtime Internal Discovery
==================================================
*/

const runtimeDirectory =
    path.join(
        ROOT,
        "lib",
        "departments",
        "runtime"
    );

console.log("");
console.log(
    "========================================"
);
console.log(
    "RUNTIME DEPARTMENT FILE TREE"
);
console.log(
    "========================================"
);
console.log("");

if (
    fs.existsSync(
        runtimeDirectory
    )
) {

    const runtimeFiles =
        walk(
            runtimeDirectory,
            []
        );

    for (
        const file of runtimeFiles
    ) {

        console.log(
            file.relativePath
        );

    }

} else {

    console.log(
        "RUNTIME DEPARTMENT DIRECTORY: MISSING"
    );

}

/*
==================================================
Startup / Entrypoint Discovery
==================================================
*/

const startupOwners =
    discoverMatches(
        files,
        [
            {
                name:
                    "require.main",
                pattern:
                    /require\.main\s*===\s*module/g
            },
            {
                name:
                    "process argv",
                pattern:
                    /process\.argv/g
            },
            {
                name:
                    "server listen",
                pattern:
                    /\.listen\s*\(/g
            },
            {
                name:
                    "DOMContentLoaded",
                pattern:
                    /DOMContentLoaded/g
            },
            {
                name:
                    "window load",
                pattern:
                    /window\.addEventListener\s*\(\s*["']load["']/g
            },
            {
                name:
                    "immediate async invocation",
                pattern:
                    /\(\s*async\s+function\s*\([^)]*\)\s*\{/g
            },
            {
                name:
                    "Vercel handler",
                pattern:
                    /exports\.default\s*=\s*async\s+function\s+handler/g
            }
        ]
    );

printDiscovery(
    "STARTUP / ENTRYPOINT OWNER DISCOVERY",
    startupOwners,
    [
        /require\.main\s*===\s*module/g,
        /\.listen\s*\(/g,
        /exports\.default\s*=\s*async\s+function\s+handler/g,
        /\(\s*async\s+function\s*\([^)]*\)\s*\{/g
    ]
);

/*
==================================================
Package Manifest
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "PACKAGE STARTUP CONTRACT"
);
console.log(
    "========================================"
);
console.log("");

const packagePath =
    path.join(
        ROOT,
        "package.json"
    );

if (
    fs.existsSync(
        packagePath
    )
) {

    const packageSource =
        fs.readFileSync(
            packagePath,
            "utf8"
        );

    const packageJson =
        JSON.parse(
            packageSource
        );

    console.log(
        JSON.stringify(
            {
                name:
                    packageJson.name ||
                    null,
                main:
                    packageJson.main ||
                    null,
                scripts:
                    packageJson.scripts ||
                    {},
                bin:
                    packageJson.bin ||
                    null
            },
            null,
            2
        )
    );

} else {

    console.log(
        "package.json: MISSING"
    );

}

/*
==================================================
Git Integrity
==================================================
*/

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

let modifiedByAudit = [];

try {

    const output =
        childProcess.execFileSync(
            "git",
            [
                "status",
                "--short"
            ],
            {
                cwd:
                    ROOT,
                encoding:
                    "utf8"
            }
        );

    modifiedByAudit =
        output
            .split(
                /\r?\n/
            )
            .filter(
                Boolean
            )
            .filter(
                line =>
                    line.includes(
                        SELF
                    )
            );

} catch (
    error
) {

    console.log(
        "GIT STATUS AUDIT:",
        "UNAVAILABLE"
    );

}

console.log(
    "AUDIT SCRIPT:",
    SELF
);

console.log(
    "AUDIT SELF STATUS REFERENCES:",
    modifiedByAudit.length
);

console.log(
    "REPOSITORY FILES MODIFIED BY AUDIT: NONE"
);

/*
==================================================
Final
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "RUNTIME BOOTSTRAP OWNER AUDIT COMPLETE"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "DASHBOARD EXECUTION AUTHORITY: NONE ASSUMED"
);

console.log(
    "BOOTSTRAP OWNER: DISCOVERY REQUIRED"
);

console.log(
    "RUNTIME EXECUTION OWNER: DISCOVERY REQUIRED"
);

console.log(
    "UI WIRING: PAUSED"
);

console.log(
    "FILES MODIFIED BY AUDIT: NONE"
);

console.log("");