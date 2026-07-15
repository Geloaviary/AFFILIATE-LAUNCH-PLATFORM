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

function printWindow(
    source,
    index,
    before,
    after
) {

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

    const window =
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
        window
    );

    console.log("");

    console.log(
        "----- JSON STRING SHAPE -----"
    );

    console.log("");

    console.log(
        JSON.stringify(
            window
        )
    );

    console.log("");

    console.log(
        "----- LINE SHAPE -----"
    );

    console.log("");

    const lines =
        window.split(
            /\r\n|\n|\r/
        );

    lines.forEach(
        (
            line,
            index
        ) => {

            console.log(

                String(
                    index + 1
                ).padStart(
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

if (
    !fs.existsSync(
        TARGET
    )
) {

    throw new Error(
        `Dashboard target missing: ${TARGET}`
    );

}

const source =
    fs.readFileSync(
        TARGET,
        "utf8"
    );

const bytes =
    fs.readFileSync(
        TARGET
    );

section(
    "STAGE 6A RUNTIME DASHBOARD EXACT SHAPE AUDIT"
);

console.log(
    "TARGET:",
    TARGET
);

console.log(
    "SOURCE BYTE LENGTH:",
    bytes.length
);

console.log(
    "SOURCE CHARACTER LENGTH:",
    source.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
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

const styleCloseIndex =
    source.indexOf(
        "</style>"
    );

const sidebarIndex =
    source.indexOf(
        'id="sidebar"'
    );

const overviewIndex =
    source.indexOf(
        'id="overview"'
    );

const activeCampaignCountIndex =
    source.indexOf(
        'id="activeCampaignCount"'
    );

const loadCampaignsIndex =
    source.indexOf(
        "async function loadCampaigns"
    );

const renderCampaignsIndex =
    source.indexOf(
        "function renderCampaigns"
    );

const startupIndex =
    source.indexOf(
        "(async function(){"
    );

const scriptCloseIndex =
    source.lastIndexOf(
        "</script>"
    );

section(
    "STRUCTURAL INDEX DISCOVERY"
);

console.log(
    "STYLE CLOSE INDEX:",
    styleCloseIndex
);

console.log(
    "SIDEBAR INDEX:",
    sidebarIndex
);

console.log(
    "OVERVIEW INDEX:",
    overviewIndex
);

console.log(
    "ACTIVE CAMPAIGN COUNT INDEX:",
    activeCampaignCountIndex
);

console.log(
    "LOAD CAMPAIGNS INDEX:",
    loadCampaignsIndex
);

console.log(
    "RENDER CAMPAIGNS INDEX:",
    renderCampaignsIndex
);

console.log(
    "STARTUP INDEX:",
    startupIndex
);

console.log(
    "SCRIPT CLOSE INDEX:",
    scriptCloseIndex
);

section(
    "STYLE CLOSING BOUNDARY"
);

printWindow(
    source,
    styleCloseIndex,
    800,
    300
);

section(
    "SIDEBAR EXACT SHAPE"
);

printWindow(
    source,
    sidebarIndex,
    700,
    1400
);

section(
    "OVERVIEW PAGE EXACT SHAPE"
);

printWindow(
    source,
    overviewIndex,
    1000,
    3000
);

section(
    "ACTIVE CAMPAIGN METRIC SHAPE"
);

printWindow(
    source,
    activeCampaignCountIndex,
    1200,
    1800
);

section(
    "LOAD CAMPAIGNS FUNCTION SHAPE"
);

printWindow(
    source,
    loadCampaignsIndex,
    800,
    3000
);

section(
    "RENDER CAMPAIGNS FUNCTION SHAPE"
);

printWindow(
    source,
    renderCampaignsIndex,
    800,
    2500
);

section(
    "DASHBOARD STARTUP EXACT SHAPE"
);

printWindow(
    source,
    startupIndex,
    1200,
    2500
);

section(
    "SCRIPT CLOSING BOUNDARY"
);

printWindow(
    source,
    scriptCloseIndex,
    3000,
    300
);

section(
    "RUNTIME COLLISION AUDIT"
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

    console.log(
        name,
        matches
            ? matches.length
            : 0
    );

}

section(
    "AUDIT INTEGRITY"
);

console.log(
    "FILES MODIFIED BY AUDIT: NONE"
);

section(
    "STAGE 6A DASHBOARD SHAPE AUDIT COMPLETE"
);