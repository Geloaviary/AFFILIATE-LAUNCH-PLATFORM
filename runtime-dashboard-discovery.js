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
Runtime Dashboard Discovery Audit

Audit Only

This script discovers the existing UI topology
without assuming:

- app/
- pages/
- src/
- components/

It does not modify repository files.

==================================================
*/

const ROOT =
    process.cwd();

const EXCLUDED_DIRECTORIES =
    new Set([

        ".git",
        ".next",
        ".vercel",
        "node_modules",
        "coverage",
        "dist",
        "build"

    ]);

const SOURCE_EXTENSIONS =
    new Set([

        ".js",
        ".jsx",
        ".ts",
        ".tsx",
        ".html"

    ]);

const MANIFEST_NAMES =
    new Set([

        "package.json",
        "vite.config.js",
        "vite.config.ts",
        "next.config.js",
        "next.config.mjs",
        "next.config.ts"

    ]);

/*
==================================================
Utilities
==================================================
*/

function relative(
    location
) {

    return path.relative(
        ROOT,
        location
    ) || ".";

}

function safeRead(
    location
) {

    try {

        return fs.readFileSync(
            location,
            "utf8"
        );

    } catch {

        return null;

    }

}

function walk(
    root,
    results = []
) {

    let entries;

    try {

        entries =
            fs.readdirSync(
                root,
                {
                    withFileTypes:
                        true
                }
            );

    } catch {

        return results;

    }

    for (
        const entry of entries
    ) {

        const location =
            path.join(
                root,
                entry.name
            );

        if (
            entry.isDirectory()
        ) {

            if (
                EXCLUDED_DIRECTORIES.has(
                    entry.name
                )
            ) {

                continue;

            }

            walk(
                location,
                results
            );

            continue;

        }

        if (
            entry.isFile()
        ) {

            results.push(
                location
            );

        }

    }

    return results;

}

function countMatches(
    source,
    patterns
) {

    let count = 0;

    for (
        const pattern of patterns
    ) {

        const matches =
            source.match(
                pattern
            );

        if (
            matches
        ) {

            count +=
                matches.length;

        }

    }

    return count;

}

/*
==================================================
Repository Inventory
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "RUNTIME DASHBOARD DISCOVERY AUDIT"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "PROJECT ROOT:",
    ROOT
);

console.log("");

const files =
    walk(
        ROOT
    );

console.log(
    "REPOSITORY FILES INSPECTED:",
    files.length
);

console.log("");

/*
==================================================
Manifest Discovery
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "FRONTEND MANIFEST DISCOVERY"
);
console.log(
    "========================================"
);
console.log("");

const manifests =
    files.filter(
        location =>
            MANIFEST_NAMES.has(
                path.basename(
                    location
                )
            )
    );

if (
    manifests.length === 0
) {

    console.log(
        "FRONTEND MANIFESTS: NONE"
    );

} else {

    for (
        const manifest of manifests
    ) {

        console.log(
            "MANIFEST:",
            relative(
                manifest
            )
        );

    }

}

console.log("");

/*
==================================================
Package Classification
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "PACKAGE CLASSIFICATION"
);
console.log(
    "========================================"
);
console.log("");

const packageFiles =
    manifests.filter(
        location =>
            path.basename(
                location
            ) ===
                "package.json"
    );

const packageReports = [];

for (
    const packageFile of packageFiles
) {

    const source =
        safeRead(
            packageFile
        );

    if (
        !source
    ) {

        continue;

    }

    let manifest;

    try {

        manifest =
            JSON.parse(
                source
            );

    } catch {

        console.log(
            "INVALID PACKAGE JSON:",
            relative(
                packageFile
            )
        );

        continue;

    }

    const dependencyNames =
        new Set([

            ...Object.keys(
                manifest.dependencies ||
                {}
            ),

            ...Object.keys(
                manifest.devDependencies ||
                {}
            )

        ]);

    const frameworks = [];

    if (
        dependencyNames.has(
            "react"
        )
    ) {

        frameworks.push(
            "react"
        );

    }

    if (
        dependencyNames.has(
            "next"
        )
    ) {

        frameworks.push(
            "next"
        );

    }

    if (
        dependencyNames.has(
            "vite"
        )
    ) {

        frameworks.push(
            "vite"
        );

    }

    if (
        dependencyNames.has(
            "vue"
        )
    ) {

        frameworks.push(
            "vue"
        );

    }

    if (
        dependencyNames.has(
            "svelte"
        )
    ) {

        frameworks.push(
            "svelte"
        );

    }

    const report = {

        file:
            relative(
                packageFile
            ),

        name:
            manifest.name ||
            null,

        frameworks,

        scripts:
            Object.keys(
                manifest.scripts ||
                {}
            )

    };

    packageReports.push(
        report
    );

    console.log(
        JSON.stringify(
            report,
            null,
            2
        )
    );

}

console.log("");

/*
==================================================
UI Source Discovery
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "UI SOURCE DISCOVERY"
);
console.log(
    "========================================"
);
console.log("");

const sourceFiles =
    files.filter(
        location =>
            SOURCE_EXTENSIONS.has(
                path.extname(
                    location
                ).toLowerCase()
            )
    );

console.log(
    "SOURCE FILES:",
    sourceFiles.length
);

console.log("");

/*
==================================================
Dashboard Candidate Scoring
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "DASHBOARD CANDIDATE RANKING"
);
console.log(
    "========================================"
);
console.log("");

const candidates = [];

for (
    const location of sourceFiles
) {

    const source =
        safeRead(
            location
        );

    if (
        source === null
    ) {

        continue;

    }

    const fileName =
        path.basename(
            location
        );

    const normalizedPath =
        relative(
            location
        ).replace(
            /\\/g,
            "/"
        );

    let score = 0;

    const evidence = [];

    function addEvidence(
        condition,
        points,
        label
    ) {

        if (
            !condition
        ) {

            return;

        }

        score +=
            points;

        evidence.push(
            label
        );

    }

    addEvidence(
        /dashboard/i.test(
            fileName
        ),
        20,
        "dashboard filename"
    );

    addEvidence(
        /overview/i.test(
            fileName
        ),
        12,
        "overview filename"
    );

    addEvidence(
        /home/i.test(
            fileName
        ),
        8,
        "home filename"
    );

    addEvidence(
        /dashboard/i.test(
            normalizedPath
        ),
        12,
        "dashboard path"
    );

    addEvidence(
        /\bDashboard\b/.test(
            source
        ),
        10,
        "Dashboard text"
    );

    addEvidence(
        /\bOverview\b/.test(
            source
        ),
        6,
        "Overview text"
    );

    addEvidence(
        /\bCampaign\b/.test(
            source
        ),
        4,
        "Campaign text"
    );

    addEvidence(
        /\bProduction\b/.test(
            source
        ),
        3,
        "Production text"
    );

    addEvidence(
        /\bPublishing\b/.test(
            source
        ),
        3,
        "Publishing text"
    );

    addEvidence(
        /\bAnalytics\b/.test(
            source
        ),
        3,
        "Analytics text"
    );

    addEvidence(
        /useState\s*\(/.test(
            source
        ),
        4,
        "useState"
    );

    addEvidence(
        /useEffect\s*\(/.test(
            source
        ),
        5,
        "useEffect"
    );

    addEvidence(
        /fetch\s*\(/.test(
            source
        ),
        5,
        "fetch"
    );

    addEvidence(
        /\/api\//.test(
            source
        ),
        4,
        "API consumer"
    );

    addEvidence(
        /setInterval\s*\(/.test(
            source
        ),
        4,
        "polling"
    );

    addEvidence(
        /\bstatus\b/i.test(
            source
        ),
        3,
        "status"
    );

    if (
        score > 0
    ) {

        candidates.push({

            score,

            file:
                normalizedPath,

            evidence

        });

    }

}

candidates.sort(
    (
        left,
        right
    ) =>
        right.score -
        left.score
);

for (
    const candidate of
    candidates.slice(
        0,
        30
    )
) {

    console.log(
        "SCORE:",
        candidate.score
    );

    console.log(
        "FILE:",
        candidate.file
    );

    console.log(
        "EVIDENCE:",
        candidate.evidence.join(
            ", "
        )
    );

    console.log("");

}

if (
    candidates.length === 0
) {

    console.log(
        "DASHBOARD CANDIDATES: NONE"
    );

    console.log("");

}

/*
==================================================
Existing API Consumer Discovery
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "API UTILS CONSUMER DISCOVERY"
);
console.log(
    "========================================"
);
console.log("");

const apiConsumers = [];

for (
    const location of sourceFiles
) {

    const source =
        safeRead(
            location
        );

    if (
        source === null
    ) {

        continue;

    }

    const references =
        countMatches(
            source,
            [

                /\/api\/utils/g,
                /api\/utils/g,
                /action=/g

            ]
        );

    if (
        references > 0
    ) {

        apiConsumers.push({

            file:
                relative(
                    location
                ).replace(
                    /\\/g,
                    "/"
                ),

            references

        });

    }

}

apiConsumers.sort(
    (
        left,
        right
    ) =>
        right.references -
        left.references
);

for (
    const consumer of
    apiConsumers
) {

    console.log(
        "FILE:",
        consumer.file
    );

    console.log(
        "REFERENCES:",
        consumer.references
    );

    console.log("");

}

if (
    apiConsumers.length === 0
) {

    console.log(
        "API UTILS CONSUMERS: NONE"
    );

    console.log("");

}

/*
==================================================
Fetch / Polling Owner Discovery
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "FETCH AND POLLING OWNER DISCOVERY"
);
console.log(
    "========================================"
);
console.log("");

const transportOwners = [];

for (
    const location of sourceFiles
) {

    const source =
        safeRead(
            location
        );

    if (
        source === null
    ) {

        continue;

    }

    const fetchCount =
        countMatches(
            source,
            [
                /fetch\s*\(/g
            ]
        );

    const intervalCount =
        countMatches(
            source,
            [
                /setInterval\s*\(/g
            ]
        );

    const effectCount =
        countMatches(
            source,
            [
                /useEffect\s*\(/g
            ]
        );

    if (
        fetchCount === 0 &&
        intervalCount === 0 &&
        effectCount === 0
    ) {

        continue;

    }

    transportOwners.push({

        file:
            relative(
                location
            ).replace(
                /\\/g,
                "/"
            ),

        fetch:
            fetchCount,

        interval:
            intervalCount,

        effect:
            effectCount

    });

}

transportOwners.sort(
    (
        left,
        right
    ) => {

        const leftScore =
            left.fetch +
            left.interval +
            left.effect;

        const rightScore =
            right.fetch +
            right.interval +
            right.effect;

        return (
            rightScore -
            leftScore
        );

    }
);

for (
    const owner of
    transportOwners.slice(
        0,
        50
    )
) {

    console.log(
        JSON.stringify(
            owner
        )
    );

}

if (
    transportOwners.length === 0
) {

    console.log(
        "FETCH / POLLING OWNERS: NONE"
    );

}

console.log("");

/*
==================================================
Likely Render Owners
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "LIKELY DASHBOARD RENDER OWNERS"
);
console.log(
    "========================================"
);
console.log("");

const likelyOwners =
    candidates.slice(
        0,
        10
    );

for (
    const owner of likelyOwners
) {

    console.log(
        JSON.stringify(
            owner,
            null,
            2
        )
    );

}

if (
    likelyOwners.length === 0
) {

    console.log(
        "LIKELY RENDER OWNERS: NONE"
    );

}

console.log("");

/*
==================================================
Final Audit Result
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "DISCOVERY RESULT"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "MANIFESTS:",
    manifests.length
);

console.log(
    "PACKAGES:",
    packageReports.length
);

console.log(
    "SOURCE FILES:",
    sourceFiles.length
);

console.log(
    "DASHBOARD CANDIDATES:",
    candidates.length
);

console.log(
    "API UTILS CONSUMERS:",
    apiConsumers.length
);

console.log(
    "FETCH / POLLING OWNERS:",
    transportOwners.length
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
    "RUNTIME DASHBOARD DISCOVERY COMPLETE"
);
console.log(
    "========================================"
);
console.log("");