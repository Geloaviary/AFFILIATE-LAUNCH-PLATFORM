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
Runtime Transport Byte-Safe Recovery

Constitutional Purpose

Recover api/utils.js directly from Git HEAD
as raw bytes.

Decode canonical Git bytes as UTF-8 using Node.

Insert only:

- Runtime Department import
- runtime-observation transport action

The repair NEVER

- Calculates Runtime status
- Calculates waiting reasons
- Reads Platform Memory
- Creates a new API file
- Modifies unrelated API behavior

==================================================
*/

const ROOT =
    process.cwd();

const UTILS_PATH =
    path.resolve(
        ROOT,
        "api",
        "utils.js"
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

console.log("");

console.log(
    "========================================"
);

console.log(
    "RUNTIME TRANSPORT BYTE-SAFE RECOVERY"
);

console.log(
    "========================================"
);

console.log("");

/*
==================================================
Recover Canonical Git Bytes
==================================================
*/

console.log(
    "RECOVERING HEAD SOURCE AS RAW BYTES"
);

const headBytes =
    childProcess.execFileSync(
        "git",
        [
            "show",
            "HEAD:api/utils.js"
        ],
        {
            cwd:
                ROOT,

            encoding:
                null,

            maxBuffer:
                10 * 1024 * 1024
        }
    );

if (
    !Buffer.isBuffer(
        headBytes
    )
) {

    fail(
        "Git HEAD recovery did not return a Buffer."
    );

}

if (
    headBytes.length === 0
) {

    fail(
        "Git HEAD source is empty."
    );

}

console.log(
    "HEAD BYTE LENGTH:",
    headBytes.length
);

console.log(
    "HEAD BUFFER:",
    Buffer.isBuffer(
        headBytes
    )
);

const headSource =
    headBytes.toString(
        "utf8"
    );

if (
    !headSource.trim()
) {

    fail(
        "Decoded HEAD source is empty."
    );

}

/*
==================================================
Canonical UTF-8 Verification
==================================================
*/

const roundTripBytes =
    Buffer.from(
        headSource,
        "utf8"
    );

if (
    !headBytes.equals(
        roundTripBytes
    )
) {

    fail(
        "HEAD source failed UTF-8 byte round-trip verification."
    );

}

console.log(
    "HEAD UTF-8 ROUND TRIP: PASS"
);

const canonicalFireEmoji =
    headSource.includes(
        "🔥"
    );

console.log(
    "CANONICAL FIRE EMOJI:",
    canonicalFireEmoji
);

if (
    !canonicalFireEmoji
) {

    fail(
        "Canonical HEAD source does not contain expected UTF-8 emoji."
    );

}

/*
==================================================
Locate Insertion Boundaries
==================================================
*/

const fetchPattern =
    /const\s+fetch\s*=\s*require\(\s*"node-fetch"\s*\)\s*;/g;

const handlerPattern =
    /exports\.default\s*=\s*async\s+function\s+handler\s*\(\s*req\s*,\s*res\s*\)\s*\{\s*const\s+\{\s*action\s*\}\s*=\s*req\.query\s*;/g;

const fetchCount =
    countMatches(
        headSource,
        fetchPattern
    );

const handlerCount =
    countMatches(
        headSource,
        handlerPattern
    );

console.log(
    "FETCH IMPORT MATCHES:",
    fetchCount
);

console.log(
    "DEFAULT HANDLER MATCHES:",
    handlerCount
);

if (
    fetchCount !== 1
) {

    fail(
        `Expected one node-fetch import. Found: ${fetchCount}`
    );

}

if (
    handlerCount !== 1
) {

    fail(
        `Expected one default handler. Found: ${handlerCount}`
    );

}

/*
==================================================
Transport Source
==================================================
*/

const runtimeImport = `

const Runtime = require(
  "../lib/departments/runtime"
);`;

const observationAction = `

  // ============ RUNTIME OBSERVATION ============
  if (action === "runtime-observation") {
    try {
      const campaignId =
        typeof req.query.campaignId === "string" &&
        req.query.campaignId.trim()
          ? req.query.campaignId.trim()
          : null;

      const observation =
        await Runtime.observe({
          campaignId
        });

      return res.status(200).json(observation);
    } catch (error) {
      console.error(
        "[RUNTIME OBSERVATION ERROR]",
        error
      );

      return res.status(500).json({
        error: error.message
      });
    }
  }`;

/*
==================================================
Insert Runtime Import
==================================================
*/

let recoveredSource =
    headSource.replace(
        fetchPattern,
        match =>
            match +
            runtimeImport
    );

const handlerCountAfterImport =
    countMatches(
        recoveredSource,
        handlerPattern
    );

if (
    handlerCountAfterImport !== 1
) {

    fail(
        "Default handler became ambiguous after Runtime import insertion."
    );

}

/*
==================================================
Insert Observation Action
==================================================
*/

recoveredSource =
    recoveredSource.replace(
        handlerPattern,
        match =>
            match +
            observationAction
    );

/*
==================================================
Source Contract Audit
==================================================
*/

const runtimeImportCount =
    countMatches(
        recoveredSource,
        /require\(\s*"\.\.\/lib\/departments\/runtime"\s*\)/g
    );

const observationActionCount =
    countMatches(
        recoveredSource,
        /action\s*===\s*"runtime-observation"/g
    );

const runtimeObserveCount =
    countMatches(
        recoveredSource,
        /Runtime\.observe\s*\(/g
    );

const defaultHandlerCount =
    countMatches(
        recoveredSource,
        /exports\.default\s*=\s*async\s+function\s+handler/g
    );

console.log("");

console.log(
    "RUNTIME IMPORT:",
    runtimeImportCount
);

console.log(
    "OBSERVATION ACTION:",
    observationActionCount
);

console.log(
    "RUNTIME OBSERVE:",
    runtimeObserveCount
);

console.log(
    "DEFAULT HANDLER:",
    defaultHandlerCount
);

if (
    runtimeImportCount !== 1
) {

    fail(
        "Runtime import contract is invalid."
    );

}

if (
    observationActionCount !== 1
) {

    fail(
        "Runtime observation action contract is invalid."
    );

}

if (
    runtimeObserveCount !== 1
) {

    fail(
        "Runtime observation authority contract is invalid."
    );

}

if (
    defaultHandlerCount !== 1
) {

    fail(
        "Default handler contract is invalid."
    );

}

/*
==================================================
Canonical Content Preservation

Remove approved transport additions from the
recovered source.

The resulting source MUST equal canonical HEAD
exactly.

This is stronger than mojibake marker scanning.

==================================================
*/

const preservationSource =
    recoveredSource
        .replace(
            runtimeImport,
            ""
        )
        .replace(
            observationAction,
            ""
        );

const canonicalPreserved =
    preservationSource ===
    headSource;

console.log("");

console.log(
    "CANONICAL SOURCE PRESERVED:",
    canonicalPreserved
);

if (
    !canonicalPreserved
) {

    fail(
        "Unrelated canonical source content changed."
    );

}

/*
==================================================
Write UTF-8 Without BOM
==================================================
*/

const outputBytes =
    Buffer.from(
        recoveredSource,
        "utf8"
    );

fs.writeFileSync(
    UTILS_PATH,
    outputBytes
);

console.log(
    "SOURCE WRITTEN:",
    true
);

console.log(
    "OUTPUT BYTE LENGTH:",
    outputBytes.length
);

/*
==================================================
Physical Byte Verification
==================================================
*/

const writtenBytes =
    fs.readFileSync(
        UTILS_PATH
    );

const hasUtf8Bom =
    writtenBytes.length >= 3 &&
    writtenBytes[0] === 0xef &&
    writtenBytes[1] === 0xbb &&
    writtenBytes[2] === 0xbf;

const writtenSource =
    writtenBytes.toString(
        "utf8"
    );

const fireEmojiPreserved =
    writtenSource.includes(
        "🔥"
    );

const knownCorruptionPresent =
    writtenSource.includes(
        "≡ƒöÑ"
    ) ||
    writtenSource.includes(
        "├░"
    ) ||
    writtenSource.includes(
        "∩╗┐"
    );

console.log("");

console.log(
    "UTF-8 BOM PRESENT:",
    hasUtf8Bom
);

console.log(
    "FIRE EMOJI PRESERVED:",
    fireEmojiPreserved
);

console.log(
    "KNOWN CORRUPTION PRESENT:",
    knownCorruptionPresent
);

if (
    hasUtf8Bom
) {

    fail(
        "UTF-8 BOM remains."
    );

}

if (
    !fireEmojiPreserved
) {

    fail(
        "Canonical UTF-8 emoji was not preserved."
    );

}

if (
    knownCorruptionPresent
) {

    fail(
        "Known mojibake corruption remains."
    );

}

/*
==================================================
Written Source Preservation Audit
==================================================
*/

const writtenPreservationSource =
    writtenSource
        .replace(
            runtimeImport,
            ""
        )
        .replace(
            observationAction,
            ""
        );

const writtenCanonicalPreserved =
    writtenPreservationSource ===
    headSource;

console.log(
    "WRITTEN CANONICAL PRESERVED:",
    writtenCanonicalPreserved
);

if (
    !writtenCanonicalPreserved
) {

    fail(
        "Written source changed unrelated canonical content."
    );

}

console.log("");

console.log(
    "========================================"
);

console.log(
    "BYTE-SAFE RECOVERY COMPLETE"
);

console.log(
    "========================================"
);

console.log("");

console.log(
    "HEAD RAW BUFFER: PASS"
);

console.log(
    "UTF-8 ROUND TRIP: PASS"
);

console.log(
    "CANONICAL SOURCE PRESERVATION: PASS"
);

console.log(
    "RUNTIME IMPORT: PASS"
);

console.log(
    "OBSERVATION ACTION: PASS"
);

console.log(
    "RUNTIME AUTHORITY: Runtime.observe"
);

console.log(
    "UTF-8 BOM: ABSENT"
);

console.log(
    "CANONICAL EMOJI: PRESERVED"
);

console.log(
    "KNOWN MOJIBAKE: ABSENT"
);

console.log(
    "NEW API FILE: NONE"
);

console.log("");

console.log(
    "RUNTIME TRANSPORT BYTE INTEGRITY: PASS"
);