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

const TARGET =
    path.join(
        ROOT,
        "public",
        "index.html"
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

function fail(
    message
) {

    throw new Error(
        message
    );

}

function countExact(
    source,
    target
) {

    if (
        !target
    ) {

        return 0;

    }

    return source
        .split(
            target
        )
        .length - 1;

}

function replaceExact(
    source,
    target,
    replacement,
    label
) {

    const count =
        countExact(
            source,
            target
        );

    console.log(
        `${label} TARGETS:`,
        count
    );

    if (
        count !== 1
    ) {

        fail(
            `${label} expected exactly one target, received ${count}.`
        );

    }

    return source.replace(
        target,
        replacement
    );

}

if (
    !fs.existsSync(
        TARGET
    )
) {

    fail(
        `Dashboard target missing: ${TARGET}`
    );

}

const sourceBytes =
    fs.readFileSync(
        TARGET
    );

const source =
    sourceBytes.toString(
        "utf8"
    );

const hasBom =
    sourceBytes.length >= 3 &&
    sourceBytes[0] === 0xef &&
    sourceBytes[1] === 0xbb &&
    sourceBytes[2] === 0xbf;

const crlfCount =
    (
        source.match(
            /\r\n/g
        ) || []
    ).length;

const lfCount =
    (
        source.match(
            /(?<!\r)\n/g
        ) || []
    ).length;

section(
    "STAGE 6B RUNTIME DASHBOARD CONSUMER WIRING"
);

console.log(
    "TARGET:",
    TARGET
);

console.log(
    "SOURCE BYTE LENGTH:",
    sourceBytes.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    hasBom
);

console.log(
    "CRLF COUNT:",
    crlfCount
);

console.log(
    "LF COUNT:",
    lfCount
);

if (
    hasBom
) {

    fail(
        "Dashboard source unexpectedly contains UTF-8 BOM."
    );

}

if (
    crlfCount === 0
) {

    fail(
        "Dashboard source is not CRLF shaped."
    );

}

if (
    lfCount !== 0
) {

    fail(
        "Dashboard source contains mixed LF line endings."
    );

}

section(
    "PRE-WIRING COLLISION AUDIT"
);

const collisionTargets = {

    runtimeObservation:
        /runtime-observation/g,

    runtimeDepartmentGrid:
        /runtimeDepartmentGrid/g,

    loadRuntimeObservation:
        /loadRuntimeObservation/g,

    renderRuntimeObservation:
        /renderRuntimeObservation/g,

    runtimeSummary:
        /runtimeSummary/g,

    runtimeDepartmentCard:
        /runtime-department-card/g

};

for (
    const [
        name,
        pattern
    ] of Object.entries(
        collisionTargets
    )
) {

    const matches =
        source.match(
            pattern
        );

    const count =
        matches
            ? matches.length
            : 0;

    console.log(
        name,
        count
    );

    if (
        count !== 0
    ) {

        fail(
            `Dashboard Runtime collision detected for ${name}.`
        );

    }

}

const EOL =
    "\r\n";

const startupTarget =
    [
        "  (async function(){",
        "",
        "  await loadNiches();",
        "",
        "  await loadCampaigns();",
        "",
        "  renderResearchCenter();",
        "",
        "})();"
    ].join(
        EOL
    );

const runtimeConsumer =
    [
        "let runtimeObservation = null;",
        "",
        "function ensureRuntimeDepartmentGrid(){",
        "",
        "  let runtimeDepartmentGrid =",
        "    document.getElementById(",
        "      'runtimeDepartmentGrid'",
        "    );",
        "",
        "  if(runtimeDepartmentGrid){",
        "",
        "    return runtimeDepartmentGrid;",
        "",
        "  }",
        "",
        "  const overview =",
        "    document.getElementById(",
        "      'overview'",
        "    );",
        "",
        "  if(!overview){",
        "",
        "    return null;",
        "",
        "  }",
        "",
        "  const runtimeSummary =",
        "    document.createElement(",
        "      'div'",
        "    );",
        "",
        "  runtimeSummary.id =",
        "    'runtimeSummary';",
        "",
        "  runtimeSummary.style.marginBottom =",
        "    '24px';",
        "",
        "  runtimeSummary.innerHTML = `",
        "",
        "<div",
        "  class=\"card\"",
        "  style=\"",
        "    border:1px solid rgba(0,229,255,.12);",
        "    background:rgba(15,23,42,.72);",
        "  \"",
        ">",
        "",
        "  <h2",
        "    style=\"",
        "      color:#00e5ff;",
        "      margin-bottom:8px;",
        "    \"",
        "  >",
        "    RUNTIME DEPARTMENT OBSERVATION",
        "  </h2>",
        "",
        "  <div",
        "    style=\"",
        "      color:#94a3b8;",
        "      margin-bottom:18px;",
        "    \"",
        "  >",
        "    Constitutional Runtime status",
        "  </div>",
        "",
        "  <div",
        "    id=\"runtimeDepartmentGrid\"",
        "    style=\"",
        "      display:grid;",
        "      grid-template-columns:repeat(auto-fit,minmax(220px,1fr));",
        "      gap:12px;",
        "    \"",
        "  ></div>",
        "",
        "</div>",
        "",
        "`;",
        "",
        "  overview.prepend(",
        "    runtimeSummary",
        "  );",
        "",
        "  runtimeDepartmentGrid =",
        "    document.getElementById(",
        "      'runtimeDepartmentGrid'",
        "    );",
        "",
        "  return runtimeDepartmentGrid;",
        "",
        "}",
        "",
        "function renderRuntimeObservation(",
        "  observation",
        "){",
        "",
        "  const runtimeDepartmentGrid =",
        "    ensureRuntimeDepartmentGrid();",
        "",
        "  if(!runtimeDepartmentGrid){",
        "",
        "    return;",
        "",
        "  }",
        "",
        "  const departments =",
        "    Array.isArray(",
        "      observation?.departments",
        "    )",
        "      ? observation.departments",
        "      : [];",
        "",
        "  runtimeDepartmentGrid.innerHTML =",
        "    '';",
        "",
        "  departments.forEach(",
        "    department => {",
        "",
        "      const runtimeDepartmentCard =",
        "        document.createElement(",
        "          'div'",
        "        );",
        "",
        "      runtimeDepartmentCard.className =",
        "        'runtime-department-card';",
        "",
        "      runtimeDepartmentCard.style.padding =",
        "        '14px';",
        "",
        "      runtimeDepartmentCard.style.border =",
        "        '1px solid rgba(255,255,255,.08)';",
        "",
        "      runtimeDepartmentCard.style.borderRadius =",
        "        '10px';",
        "",
        "      runtimeDepartmentCard.style.background =",
        "        'rgba(2,6,23,.55)';",
        "",
        "      const departmentName =",
        "        String(",
        "          department?.department ||",
        "          department?.name ||",
        "          department?.id ||",
        "          ''",
        "        );",
        "",
        "      const departmentStatus =",
        "        String(",
        "          department?.status ||",
        "          ''",
        "        );",
        "",
        "      const departmentReason =",
        "        String(",
        "          department?.reason ||",
        "          department?.message ||",
        "          ''",
        "        );",
        "",
        "      runtimeDepartmentCard.innerHTML = `",
        "",
        "<div",
        "  style=\"",
        "    color:#e2e8f0;",
        "    font-weight:700;",
        "    margin-bottom:8px;",
        "  \"",
        ">",
        "  ${departmentName}",
        "</div>",
        "",
        "<div",
        "  style=\"",
        "    color:#00e5ff;",
        "    font-size:12px;",
        "    margin-bottom:8px;",
        "  \"",
        ">",
        "  ${departmentStatus}",
        "</div>",
        "",
        "<div",
        "  style=\"",
        "    color:#94a3b8;",
        "    font-size:12px;",
        "    line-height:1.5;",
        "  \"",
        ">",
        "  ${departmentReason}",
        "</div>",
        "",
        "`;",
        "",
        "      runtimeDepartmentGrid.appendChild(",
        "        runtimeDepartmentCard",
        "      );",
        "",
        "    }",
        "  );",
        "",
        "}",
        "",
        "async function loadRuntimeObservation(){",
        "",
        "  try {",
        "",
        "    const latestCampaign =",
        "      campaigns[0] ||",
        "      null;",
        "",
        "    const campaignId =",
        "      latestCampaign?.campaignId ||",
        "      latestCampaign?.id ||",
        "      null;",
        "",
        "    const query =",
        "      campaignId",
        "        ? `utils?action=runtime-observation&campaignId=${encodeURIComponent(campaignId)}`",
        "        : 'utils?action=runtime-observation';",
        "",
        "    runtimeObservation =",
        "      await apiCall(",
        "        query",
        "      );",
        "",
        "    renderRuntimeObservation(",
        "      runtimeObservation",
        "    );",
        "",
        "  } catch (e) {",
        "",
        "    console.error(",
        "      'Runtime observation failed',",
        "      e",
        "    );",
        "",
        "  }",
        "",
        "}",
        ""
    ].join(
        EOL
    );

const startupReplacement =
    [
        runtimeConsumer,
        "  (async function(){",
        "",
        "  await loadNiches();",
        "",
        "  await loadCampaigns();",
        "",
        "  renderResearchCenter();",
        "",
        "  await loadRuntimeObservation();",
        "",
        "})();"
    ].join(
        EOL
    );

section(
    "WIRE RUNTIME OBSERVATION CONSUMER"
);

let output =
    replaceExact(
        source,
        startupTarget,
        startupReplacement,
        "DASHBOARD STARTUP"
    );

section(
    "POST-WIRING STRUCTURAL AUDIT"
);

const postTargets = {

    runtimeObservation:
        /runtime-observation/g,

    runtimeDepartmentGrid:
        /runtimeDepartmentGrid/g,

    loadRuntimeObservation:
        /loadRuntimeObservation/g,

    renderRuntimeObservation:
        /renderRuntimeObservation/g,

    runtimeSummary:
        /runtimeSummary/g,

    runtimeDepartmentCard:
        /runtime-department-card/g

};

const postCounts = {};

for (
    const [
        name,
        pattern
    ] of Object.entries(
        postTargets
    )
) {

    const matches =
        output.match(
            pattern
        );

    postCounts[name] =
        matches
            ? matches.length
            : 0;

    console.log(
        name,
        postCounts[name]
    );

}

if (
    postCounts.runtimeObservation < 1
) {

    fail(
        "Runtime observation transport reference missing."
    );

}

if (
    postCounts.runtimeDepartmentGrid < 1
) {

    fail(
        "Runtime department grid missing."
    );

}

if (
    postCounts.loadRuntimeObservation < 2
) {

    fail(
        "Runtime observation loader is not wired to startup."
    );

}

if (
    postCounts.renderRuntimeObservation < 2
) {

    fail(
        "Runtime observation renderer is not wired."
    );

}

if (
    postCounts.runtimeSummary < 1
) {

    fail(
        "Runtime summary container missing."
    );

}

if (
    postCounts.runtimeDepartmentCard < 1
) {

    fail(
        "Runtime department card missing."
    );

}

section(
    "UI AUTHORITY AUDIT"
);

const prohibitedCalculations = [

    /status\s*===\s*["']READY["']/,

    /status\s*===\s*["']WAITING["']/,

    /status\s*===\s*["']RUNNING["']/,

    /status\s*===\s*["']FAILED["']/,

    /missingContracts\s*=/,

    /missing\s+contracts/i

];

let prohibitedCount =
    0;

for (
    const pattern of prohibitedCalculations
) {

    if (
        pattern.test(
            runtimeConsumer
        )
    ) {

        prohibitedCount++;

        console.log(
            "PROHIBITED UI CALCULATION:",
            pattern.toString()
        );

    }

}

console.log(
    "PROHIBITED STATUS CALCULATIONS:",
    prohibitedCount
);

if (
    prohibitedCount !== 0
) {

    fail(
        "Dashboard attempts to calculate Runtime authority."
    );

}

section(
    "BYTE INTEGRITY"
);

const outputBytes =
    Buffer.from(
        output,
        "utf8"
    );

const outputHasBom =
    outputBytes.length >= 3 &&
    outputBytes[0] === 0xef &&
    outputBytes[1] === 0xbb &&
    outputBytes[2] === 0xbf;

const outputCrlfCount =
    (
        output.match(
            /\r\n/g
        ) || []
    ).length;

const outputLfCount =
    (
        output.match(
            /(?<!\r)\n/g
        ) || []
    ).length;

console.log(
    "OUTPUT BYTE LENGTH:",
    outputBytes.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    outputHasBom
);

console.log(
    "CRLF COUNT:",
    outputCrlfCount
);

console.log(
    "LF COUNT:",
    outputLfCount
);

if (
    outputHasBom
) {

    fail(
        "Output unexpectedly contains UTF-8 BOM."
    );

}

if (
    outputCrlfCount === 0 ||
    outputLfCount !== 0
) {

    fail(
        "Output line ending integrity failed."
    );

}

fs.writeFileSync(
    TARGET,
    outputBytes
);

console.log(
    "SOURCE WRITTEN:",
    true
);

section(
    "STAGE 6B RUNTIME DASHBOARD CONSUMER WIRING COMPLETE"
);

console.log(
    "DASHBOARD AUTHORITY: OBSERVATION ONLY"
);

console.log(
    "RUNTIME STATUS AUTHORITY: Runtime.observe"
);

console.log(
    "RUNTIME EXECUTION AUTHORITY: NONE IN UI"
);

console.log(
    "STATUS CALCULATION IN UI: NONE"
);

console.log(
    "NEW API FILE: NONE"
);