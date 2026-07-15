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

function fail(
    message,
    code = 20
) {

    console.error(
        message
    );

    process.exitCode =
        code;

}

function readText(
    relativePath
) {

    const absolutePath =

        path.join(
            ROOT,
            relativePath
        );

    if (
        !fs.existsSync(
            absolutePath
        )
    ) {

        fail(
            `Missing required file: ${relativePath}`
        );

        return null;

    }

    return fs.readFileSync(
        absolutePath,
        "utf8"
    );

}

function countMatches(
    source,
    pattern
) {

    const matches =
        source.match(
            pattern
        );

    return matches
        ? matches.length
        : 0;

}

section(
    "STAGE 6 LIVE DEPLOYED RUNTIME WAITING CERTIFICATION"
);

console.log(
    "PROJECT ROOT:",
    ROOT
);

console.log(
    "AUDIT MODE: READ ONLY"
);

const executivePath =
    "api/manage-campaigns.js";

const transportPath =
    "api/utils.js";

const dashboardPath =
    "public/index.html";

const runtimeIndexPath =
    "lib/departments/runtime/index.js";

const runtimeManagerPath =
    "lib/departments/runtime/manager.js";

const runtimeObservationPath =
    "lib/departments/runtime/observation.js";

const executive =
    readText(
        executivePath
    );

const transport =
    readText(
        transportPath
    );

const dashboard =
    readText(
        dashboardPath
    );

const runtimeIndex =
    readText(
        runtimeIndexPath
    );

const runtimeManager =
    readText(
        runtimeManagerPath
    );

const runtimeObservation =
    readText(
        runtimeObservationPath
    );

if (

    executive === null ||
    transport === null ||
    dashboard === null ||
    runtimeIndex === null ||
    runtimeManager === null ||
    runtimeObservation === null

) {

    process.exitCode =
        20;

    return;

}

section(
    "EXECUTIVE EDGE CERTIFICATION"
);

const runtimeImports =

    countMatches(
        executive,
        /require\s*\(\s*["']\.\.\/lib\/departments\/runtime["']\s*\)/g
    );

const runtimeExecuteCalls =

    countMatches(
        executive,
        /Runtime\.execute\s*\(/g
    );

const directStrategyExecuteCalls =

    countMatches(
        executive,
        /StrategyEngine\.execute\s*\(/g
    );

console.log(
    "RUNTIME IMPORT:",
    runtimeImports
);

console.log(
    "RUNTIME EXECUTE:",
    runtimeExecuteCalls
);

console.log(
    "DIRECT STRATEGY EXECUTE:",
    directStrategyExecuteCalls
);

const executiveEdgePassed =

    runtimeImports ===
        1 &&

    runtimeExecuteCalls ===
        1 &&

    directStrategyExecuteCalls ===
        0;

console.log(
    "EXECUTIVE EDGE:",
    executiveEdgePassed
        ? "PASS"
        : "FAIL"
);

section(
    "RUNTIME PUBLIC API CERTIFICATION"
);

const executeExports =

    countMatches(
        runtimeIndex,
        /\bexecute\b/g
    );

const observeExports =

    countMatches(
        runtimeIndex,
        /\bobserve\b/g
    );

console.log(
    "EXECUTE REFERENCES:",
    executeExports
);

console.log(
    "OBSERVE REFERENCES:",
    observeExports
);

const publicApiPassed =

    executeExports >
        0 &&

    observeExports >
        0;

console.log(
    "RUNTIME PUBLIC API:",
    publicApiPassed
        ? "PASS"
        : "FAIL"
);

section(
    "RUNTIME BOOTSTRAP OWNERSHIP"
);

const bootstrapExecuteCalls =

    countMatches(
        runtimeManager,
        /Bootstrap\.execute\s*\(/g
    );

const runtimeEngineExecuteCalls =

    countMatches(
        runtimeManager,
        /RuntimeEngine\.execute\s*\(/g
    );

console.log(
    "BOOTSTRAP EXECUTE:",
    bootstrapExecuteCalls
);

console.log(
    "RUNTIME ENGINE EXECUTE:",
    runtimeEngineExecuteCalls
);

const bootstrapOwnershipPassed =

    bootstrapExecuteCalls ===
        1 &&

    runtimeEngineExecuteCalls ===
        1;

console.log(
    "BOOTSTRAP OWNERSHIP:",
    bootstrapOwnershipPassed
        ? "PASS"
        : "FAIL"
);

section(
    "WAITING BOUNDARY CERTIFICATION"
);

const waitingStatusReferences =

    countMatches(
        executive,
        /["']WAITING["']/g
    );

const waitingHttpResponses =

    countMatches(
        executive,
        /res\.status\s*\(\s*202\s*\)/g
    );

const persistenceReferences = [

    executive.indexOf(
        "await kv.set("
    ),

    executive.indexOf(
        "await createCampaignIndex("
    ),

    executive.indexOf(
        "await createCampaignJobs("
    )

];

const waitingBoundaryIndex =

    executive.indexOf(
        'strategyStatus ==='
    );

console.log(
    "WAITING STATUS REFERENCES:",
    waitingStatusReferences
);

console.log(
    "HTTP 202 RESPONSES:",
    waitingHttpResponses
);

console.log(
    "WAITING BOUNDARY INDEX:",
    waitingBoundaryIndex
);

console.log(
    "PERSISTENCE / JOB INDICES:",
    persistenceReferences
);

const persistenceAfterWaiting =

    waitingBoundaryIndex >=
        0 &&

    persistenceReferences.every(

        index =>

            index ===
                -1 ||

            index >
                waitingBoundaryIndex

    );

console.log(
    "PERSISTENCE AFTER WAITING BOUNDARY:",
    persistenceAfterWaiting
        ? "PASS"
        : "FAIL"
);

const waitingBoundaryPassed =

    waitingStatusReferences >
        0 &&

    waitingHttpResponses ===
        1 &&

    persistenceAfterWaiting;

console.log(
    "WAITING BOUNDARY:",
    waitingBoundaryPassed
        ? "PASS"
        : "FAIL"
);

section(
    "OBSERVATION TRANSPORT CERTIFICATION"
);

const observationActionReferences =

    countMatches(
        transport,
        /runtime-observation/g
    );

const runtimeObserveCalls =

    countMatches(
        transport,
        /Runtime\.observe\s*\(/g
    );

console.log(
    "RUNTIME OBSERVATION ACTION:",
    observationActionReferences
);

console.log(
    "RUNTIME OBSERVE CALL:",
    runtimeObserveCalls
);

const transportPassed =

    observationActionReferences ===
        1 &&

    runtimeObserveCalls ===
        1;

console.log(
    "OBSERVATION TRANSPORT:",
    transportPassed
        ? "PASS"
        : "FAIL"
);

section(
    "DASHBOARD CONSUMER CERTIFICATION"
);

const dashboardObservationReferences =

    countMatches(
        dashboard,
        /runtime-observation/g
    );

const dashboardDepartmentGridReferences =

    countMatches(
        dashboard,
        /runtimeDepartmentGrid/g
    );

const dashboardRuntimeLoaderReferences =

    countMatches(
        dashboard,
        /loadRuntimeObservation/g
    );

const dashboardRuntimeRenderReferences =

    countMatches(
        dashboard,
        /renderRuntimeObservation/g
    );

console.log(
    "OBSERVATION REFERENCES:",
    dashboardObservationReferences
);

console.log(
    "DEPARTMENT GRID REFERENCES:",
    dashboardDepartmentGridReferences
);

console.log(
    "RUNTIME LOADER REFERENCES:",
    dashboardRuntimeLoaderReferences
);

console.log(
    "RUNTIME RENDER REFERENCES:",
    dashboardRuntimeRenderReferences
);

const dashboardPassed =

    dashboardObservationReferences >
        0 &&

    dashboardDepartmentGridReferences >
        0 &&

    dashboardRuntimeLoaderReferences >
        0 &&

    dashboardRuntimeRenderReferences >
        0;

console.log(
    "DASHBOARD CONSUMER:",
    dashboardPassed
        ? "PASS"
        : "FAIL"
);

section(
    "RUNTIME OBSERVATION AUTHORITY"
);

const observationStatusReferences =

    countMatches(
        runtimeObservation,
        /\bstatus\b/g
    );

const observationReasonReferences =

    countMatches(
        runtimeObservation,
        /\breason\b/g
    );

const observationDepartmentReferences =

    countMatches(
        runtimeObservation,
        /\bdepartments\b/g
    );

console.log(
    "STATUS REFERENCES:",
    observationStatusReferences
);

console.log(
    "REASON REFERENCES:",
    observationReasonReferences
);

console.log(
    "DEPARTMENT REFERENCES:",
    observationDepartmentReferences
);

const observationAuthorityPassed =

    observationStatusReferences >
        0 &&

    observationDepartmentReferences >
        0;

console.log(
    "OBSERVATION AUTHORITY:",
    observationAuthorityPassed
        ? "PASS"
        : "FAIL"
);

section(
    "CERTIFICATION RESULT"
);

const passed =

    executiveEdgePassed &&
    publicApiPassed &&
    bootstrapOwnershipPassed &&
    waitingBoundaryPassed &&
    transportPassed &&
    dashboardPassed &&
    observationAuthorityPassed;

console.log(
    "EXECUTIVE EDGE:",
    executiveEdgePassed
        ? "PASS"
        : "FAIL"
);

console.log(
    "RUNTIME PUBLIC API:",
    publicApiPassed
        ? "PASS"
        : "FAIL"
);

console.log(
    "BOOTSTRAP OWNERSHIP:",
    bootstrapOwnershipPassed
        ? "PASS"
        : "FAIL"
);

console.log(
    "WAITING BOUNDARY:",
    waitingBoundaryPassed
        ? "PASS"
        : "FAIL"
);

console.log(
    "OBSERVATION TRANSPORT:",
    transportPassed
        ? "PASS"
        : "FAIL"
);

console.log(
    "DASHBOARD CONSUMER:",
    dashboardPassed
        ? "PASS"
        : "FAIL"
);

console.log(
    "OBSERVATION AUTHORITY:",
    observationAuthorityPassed
        ? "PASS"
        : "FAIL"
);

console.log("");

console.log(
    "FILES MODIFIED BY AUDIT: NONE"
);

console.log(
    "LOCAL KV EXECUTION: NONE"
);

console.log(
    "DIRECT STRATEGY EXECUTION: NONE"
);

console.log("");

console.log(
    "STAGE 6 CERTIFICATION:",
    passed
        ? "PASS"
        : "FAIL"
);

if (
    !passed
) {

    process.exitCode =
        20;

}