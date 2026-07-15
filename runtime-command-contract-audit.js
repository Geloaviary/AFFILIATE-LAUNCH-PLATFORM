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
    __dirname;

const RUNTIME_ROOT =
    path.join(
        ROOT,
        "lib",
        "departments",
        "runtime"
    );

const INPUT_FILE =
    path.join(
        RUNTIME_ROOT,
        "input.js"
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

function readUtf8(
    file
) {

    return fs.readFileSync(
        file,
        "utf8"
    );

}

function relative(
    file
) {

    return path
        .relative(
            ROOT,
            file
        )
        .replace(
            /\\/g,
            "/"
        );

}

function lineNumberAt(
    source,
    index
) {

    return source
        .slice(
            0,
            index
        )
        .split(
            /\r\n|\n|\r/
        )
        .length;

}

function printWindow({

    source,

    index,

    before = 500,

    after = 900

}) {

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

    console.log(
        source.slice(
            start,
            end
        )
    );

}

function walk(
    directory
) {

    const files = [];

    for (
        const entry of fs.readdirSync(
            directory,
            {
                withFileTypes:
                    true
            }
        )
    ) {

        if (
            entry.name ===
                "node_modules" ||

            entry.name ===
                ".git"
        ) {

            continue;

        }

        const absolute =
            path.join(
                directory,
                entry.name
            );

        if (
            entry.isDirectory()
        ) {

            files.push(
                ...walk(
                    absolute
                )
            );

            continue;

        }

        if (
            /\.(js|cjs|mjs)$/.test(
                entry.name
            )
        ) {

            files.push(
                absolute
            );

        }

    }

    return files;

}

section(
    "STAGE 5A RUNTIME EXECUTIVE COMMAND CONTRACT AUDIT"
);

console.log(
    "PROJECT ROOT:",
    ROOT
);

console.log(
    "RUNTIME ROOT:",
    RUNTIME_ROOT
);

console.log(
    "INPUT FILE:",
    INPUT_FILE
);

if (
    !fs.existsSync(
        INPUT_FILE
    )
) {

    throw new Error(
        "Runtime input.js was not found."
    );

}

const inputSource =
    readUtf8(
        INPUT_FILE
    );

section(
    "RUNTIME INPUT SOURCE INTEGRITY"
);

console.log(
    "SOURCE BYTE LENGTH:",
    fs.readFileSync(
        INPUT_FILE
    ).length
);

console.log(
    "SOURCE CHARACTER LENGTH:",
    inputSource.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    inputSource.charCodeAt(
        0
    ) === 0xFEFF
);

const requiredMessage =

    "Executive command is required.";

const requiredIndex =

    inputSource.indexOf(
        requiredMessage
    );

console.log(
    "REQUIRED MESSAGE INDEX:",
    requiredIndex
);

if (
    requiredIndex === -1
) {

    throw new Error(
        "Executive command validation message was not found."
    );

}

section(
    "EXECUTIVE COMMAND VALIDATION OWNER"
);

console.log(
    "LINE:",
    lineNumberAt(
        inputSource,
        requiredIndex
    )
);

printWindow({

    source:
        inputSource,

    index:
        requiredIndex,

    before:
        1000,

    after:
        1600

});

const commandReferences = [];

const commandPatterns = [

    /\bcommand\b/g,

    /executiveCommand/g,

    /commandType/g,

    /validateCommand/g,

    /allowedCommands/g,

    /SUPPORTED_COMMANDS/g,

    /COMMANDS/g

];

for (
    const pattern of commandPatterns
) {

    let match;

    while (
        (
            match =
                pattern.exec(
                    inputSource
                )
        ) !== null
    ) {

        commandReferences.push({

            token:
                match[0],

            index:
                match.index,

            line:
                lineNumberAt(
                    inputSource,
                    match.index
                )

        });

    }

}

section(
    "INPUT COMMAND REFERENCES"
);

console.log(
    "REFERENCES:",
    commandReferences.length
);

commandReferences
    .sort(
        (
            left,
            right
        ) =>
            left.index -
            right.index
    )
    .forEach(
        reference => {

            console.log(
                `LINE ${reference.line}:`,
                reference.token
            );

        }
    );

section(
    "COMMAND STRING LITERAL DISCOVERY"
);

const literalPattern =

    /["'`]([^"'`\r\n]{1,100})["'`]/g;

const literals = [];

let literalMatch;

while (
    (
        literalMatch =
            literalPattern.exec(
                inputSource
            )
    ) !== null
) {

    const value =
        literalMatch[1];

    if (
        /command|bootstrap|start|execute|run|campaign|runtime|department|platform/i.test(
            value
        )
    ) {

        literals.push({

            value,

            line:
                lineNumberAt(
                    inputSource,
                    literalMatch.index
                )

        });

    }

}

literals.forEach(
    literal => {

        console.log(
            `LINE ${literal.line}:`,
            JSON.stringify(
                literal.value
            )
        );

    }
);

const repositoryFiles =
    walk(
        ROOT
    );

section(
    "REPOSITORY RUNTIME EXECUTE CALLER DISCOVERY"
);

console.log(
    "JAVASCRIPT FILES:",
    repositoryFiles.length
);

const executeCallers = [];

for (
    const file of repositoryFiles
) {

    const rel =
        relative(
            file
        );

    if (
        rel ===
            "runtime-command-contract-audit.js" ||

        rel ===
            "runtime-live-waiting-audit.js" ||

        rel.startsWith(
            "node_modules/"
        )
    ) {

        continue;

    }

    const source =
        readUtf8(
            file
        );

    const patterns = [

        /Runtime\s*\.\s*execute\s*\(/g,

        /\.\/lib\/departments\/runtime/g,

        /lib\/departments\/runtime/g

    ];

    const matches = [];

    for (
        const pattern of patterns
    ) {

        let match;

        while (
            (
                match =
                    pattern.exec(
                        source
                    )
            ) !== null
        ) {

            matches.push({

                token:
                    match[0],

                index:
                    match.index,

                line:
                    lineNumberAt(
                        source,
                        match.index
                    )

            });

        }

    }

    if (
        matches.length
    ) {

        executeCallers.push({

            file:
                rel,

            source,

            matches:
                matches.sort(
                    (
                        left,
                        right
                    ) =>
                        left.index -
                        right.index
                )

        });

    }

}

console.log(
    "CALLER FILES:",
    executeCallers.length
);

for (
    const caller of executeCallers
) {

    section(
        `CALLER: ${caller.file}`
    );

    for (
        const match of caller.matches
    ) {

        console.log(
            "TOKEN:",
            match.token
        );

        console.log(
            "LINE:",
            match.line
        );

        printWindow({

            source:
                caller.source,

            index:
                match.index,

            before:
                500,

            after:
                1200

        });

        console.log("");

    }

}

section(
    "COMMAND PROPERTY REPOSITORY DISCOVERY"
);

const commandPropertyFiles = [];

for (
    const file of repositoryFiles
) {

    const rel =
        relative(
            file
        );

    if (
        rel ===
            "runtime-command-contract-audit.js"
    ) {

        continue;

    }

    const source =
        readUtf8(
            file
        );

    const pattern =

        /\bcommand\s*:\s*([^,\r\n}]+)/g;

    const matches = [];

    let match;

    while (
        (
            match =
                pattern.exec(
                    source
                )
        ) !== null
    ) {

        matches.push({

            value:
                match[1]
                    .trim(),

            index:
                match.index,

            line:
                lineNumberAt(
                    source,
                    match.index
                )

        });

    }

    if (
        matches.length
    ) {

        commandPropertyFiles.push({

            file:
                rel,

            matches

        });

    }

}

console.log(
    "FILES WITH command PROPERTY:",
    commandPropertyFiles.length
);

for (
    const item of commandPropertyFiles
) {

    console.log("");
    console.log(
        "FILE:",
        item.file
    );

    item.matches.forEach(
        match => {

            console.log(
                `LINE ${match.line}:`,
                match.value
            );

        }
    );

}

section(
    "RUNTIME MANAGER COMMAND CONSUMPTION"
);

const managerFile =
    path.join(
        RUNTIME_ROOT,
        "manager.js"
    );

if (
    fs.existsSync(
        managerFile
    )
) {

    const managerSource =
        readUtf8(
            managerFile
        );

    const managerPatterns = [

        /\bcommand\b/g,

        /input\s*\.\s*command/g,

        /command\s*===/g,

        /switch\s*\([^)]*command[^)]*\)/g

    ];

    const managerMatches = [];

    for (
        const pattern of managerPatterns
    ) {

        let match;

        while (
            (
                match =
                    pattern.exec(
                        managerSource
                    )
            ) !== null
        ) {

            managerMatches.push({

                token:
                    match[0],

                index:
                    match.index,

                line:
                    lineNumberAt(
                        managerSource,
                        match.index
                    )

            });

        }

    }

    console.log(
        "MANAGER COMMAND REFERENCES:",
        managerMatches.length
    );

    managerMatches
        .sort(
            (
                left,
                right
            ) =>
                left.index -
                right.index
        )
        .forEach(
            match => {

                console.log("");
                console.log(
                    "TOKEN:",
                    match.token
                );

                console.log(
                    "LINE:",
                    match.line
                );

                printWindow({

                    source:
                        managerSource,

                    index:
                        match.index,

                    before:
                        400,

                    after:
                        900

                });

            }
        );

} else {

    console.log(
        "manager.js not found"
    );

}

section(
    "AUDIT INTEGRITY"
);

console.log(
    "FILES MODIFIED BY AUDIT: NONE"
);

section(
    "STAGE 5A COMMAND CONTRACT AUDIT COMPLETE"
);

console.log(
    "PURPOSE: DISCOVER RUNTIME EXECUTIVE COMMAND CONTRACT"
);

console.log(
    "REPAIR: NONE"
);

console.log(
    "COMMAND VALUE ASSUMED: NONE"
);