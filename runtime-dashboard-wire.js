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
Runtime Dashboard Wiring

Stage 2

Constitutional transport:

Runtime.observe()
        │
        ▼
api/utils.js
        │
        ▼
public/index.html

The UI renders Runtime observation.

The UI NEVER:

- calculates department status
- resolves contracts
- reads Platform Memory directly
- declares department requirements
- infers waiting state
- executes departments

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

function assertCount(
    source,
    pattern,
    expected,
    name
) {

    const count =
        countMatches(
            source,
            pattern
        );

    console.log(
        `${name}:`,
        count
    );

    if (
        count !== expected
    ) {

        throw new Error(
            `${name} expected ${expected}, received ${count}.`
        );

    }

}

function replaceExact(
    source,
    target,
    replacement,
    name
) {

    const count =
        source
            .split(
                target
            )
            .length -
        1;

    console.log(
        `${name} TARGETS:`,
        count
    );

    if (
        count !== 1
    ) {

        throw new Error(
            `${name} expected exactly one target, received ${count}.`
        );

    }

    return source.replace(
        target,
        replacement
    );

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
    "STAGE 2 RUNTIME DASHBOARD WIRING"
);
console.log(
    "========================================"
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

const originalBuffer =
    fs.readFileSync(
        DASHBOARD_PATH
    );

let source =
    originalBuffer.toString(
        "utf8"
    );

console.log(
    "SOURCE BYTE LENGTH:",
    originalBuffer.length
);

console.log(
    "UTF-8 BOM PRESENT:",
    originalBuffer.length >= 3 &&
    originalBuffer[0] === 0xef &&
    originalBuffer[1] === 0xbb &&
    originalBuffer[2] === 0xbf
);

console.log("");

if (
    !Buffer.from(
        source,
        "utf8"
    ).equals(
        originalBuffer
    )
) {

    throw new Error(
        "Dashboard failed UTF-8 round-trip integrity."
    );

}

if (
    /∩╗┐|├░|ΓÇ|≡ƒ|┬|┼╕/.test(
        source
    )
) {

    throw new Error(
        "Dashboard contains known mojibake."
    );

}

/*
==================================================
Collision Audit
==================================================
*/

console.log(
    "========================================"
);
console.log(
    "COLLISION AUDIT"
);
console.log(
    "========================================"
);
console.log("");

assertCount(
    source,
    /runtime-observation/g,
    0,
    "RUNTIME OBSERVATION REFERENCES"
);

assertCount(
    source,
    /runtimeDepartmentGrid/g,
    0,
    "RUNTIME DEPARTMENT GRID REFERENCES"
);

assertCount(
    source,
    /loadRuntimeObservation/g,
    0,
    "RUNTIME LOADER REFERENCES"
);

assertCount(
    source,
    /renderRuntimeObservation/g,
    0,
    "RUNTIME RENDER REFERENCES"
);

console.log("");

/*
==================================================
Runtime CSS
==================================================
*/

const cssAnchor =
`#app{
  position:relative;
  z-index:1;
}

</style>`;

const runtimeCss =
`#app{
  position:relative;
  z-index:1;
}

.runtime-control{

  margin-top:24px;

  margin-bottom:30px;

}

.runtime-summary{

  display:grid;

  grid-template-columns:
    repeat(4,1fr);

  gap:12px;

  margin-bottom:20px;

}

.runtime-summary-card{

  background:
    rgba(17,28,49,.75);

  border:
    1px solid var(--border);

  border-radius:20px;

  padding:18px;

  text-align:center;

  color:var(--muted);

  font-size:12px;

  letter-spacing:.5px;

}

.runtime-summary-card strong{

  display:block;

  margin-top:10px;

  color:white;

  font-size:28px;

}

.runtime-department-grid{

  display:grid;

  grid-template-columns:
    repeat(2,1fr);

  gap:14px;

}

.runtime-department-card{

  background:
    rgba(17,28,49,.75);

  border:
    1px solid var(--border);

  border-radius:16px;

  padding:18px;

}

.runtime-department-name{

  color:white;

  font-weight:700;

  margin-bottom:10px;

}

.runtime-department-status{

  color:var(--primary);

  font-size:13px;

  text-transform:uppercase;

  letter-spacing:1px;

  margin-bottom:10px;

}

.runtime-department-reason{

  color:var(--muted);

  font-size:13px;

  line-height:1.5;

  word-break:break-word;

}

.runtime-observed-at{

  margin-top:16px;

  color:var(--muted);

  font-size:12px;

}

</style>`;

source =
    replaceExact(
        source,
        cssAnchor,
        runtimeCss,
        "RUNTIME CSS"
    );

/*
==================================================
Runtime Dashboard Surface
==================================================
*/

const surfaceAnchor =
`  <div class="section-header">

  AI WORKFORCE

  <span>
    Autonomous Departments Currently Operating
  </span>

</div>`;

const runtimeSurface =
`  <div class="runtime-control">

  <div class="section-header">

    RUNTIME DEPARTMENT

    <span>
      Constitutional Department Execution State
    </span>

  </div>

  <div class="runtime-summary">

    <div class="runtime-summary-card">

      Registered

      <strong id="runtimeRegisteredCount">
        0
      </strong>

    </div>

    <div class="runtime-summary-card">

      Running

      <strong id="runtimeRunningCount">
        0
      </strong>

    </div>

    <div class="runtime-summary-card">

      Waiting

      <strong id="runtimeWaitingCount">
        0
      </strong>

    </div>

    <div class="runtime-summary-card">

      Failed

      <strong id="runtimeFailedCount">
        0
      </strong>

    </div>

  </div>

  <div
    id="runtimeDepartmentGrid"
    class="runtime-department-grid"
  >

    <div class="runtime-department-card">

      <div class="runtime-department-name">
        Runtime Observation
      </div>

      <div class="runtime-department-status">
        Connecting
      </div>

      <div class="runtime-department-reason">
        Awaiting Runtime Department observation.
      </div>

    </div>

  </div>

  <div
    id="runtimeObservedAt"
    class="runtime-observed-at"
  >
    Runtime observation pending.
  </div>

</div>

  <div class="section-header">

  AI WORKFORCE

  <span>
    Runtime Department Observation
  </span>

</div>`;

source =
    replaceExact(
        source,
        surfaceAnchor,
        runtimeSurface,
        "RUNTIME DASHBOARD SURFACE"
    );

/*
==================================================
Runtime Observation Client

Presentation only.

No status calculation is permitted here.
==================================================
*/

const functionAnchor =
`async function loadNiches(){`;

const runtimeClient =
`function runtimeValue(
  source,
  keys,
  fallback = null
){

  for (
    const key of keys
  ) {

    if (
      source &&
      source[key] !== undefined &&
      source[key] !== null
    ) {

      return source[key];

    }

  }

  return fallback;

}

function runtimeDepartments(
  observation
){

  const candidates = [

    observation?.departments,

    observation?.departmentStates,

    observation?.runtime?.departments,

    observation?.snapshot?.departments,

    observation?.report?.departments

  ];

  for (
    const candidate of candidates
  ) {

    if (
      Array.isArray(
        candidate
      )
    ) {

      return candidate;

    }

    if (
      candidate &&
      typeof candidate ===
        'object'
    ) {

      return Object.entries(
        candidate
      ).map(
        ([department, state]) => ({

          department,

          ...(
            state &&
            typeof state ===
              'object'
              ? state
              : {
                  status:
                    state
                }
          )

        })
      );

    }

  }

  return [];

}

function renderRuntimeObservation(
  observation
){

  const summary =
    observation?.summary ||
    observation?.counts ||
    observation?.runtime?.summary ||
    observation?.snapshot?.summary ||
    {};

  const registered =
    runtimeValue(
      summary,
      [
        'registered',
        'registeredDepartments',
        'total'
      ],
      0
    );

  const running =
    runtimeValue(
      summary,
      [
        'running'
      ],
      0
    );

  const waiting =
    runtimeValue(
      summary,
      [
        'waiting'
      ],
      0
    );

  const failed =
    runtimeValue(
      summary,
      [
        'failed'
      ],
      0
    );

  const registeredElement =
    document.getElementById(
      'runtimeRegisteredCount'
    );

  const runningElement =
    document.getElementById(
      'runtimeRunningCount'
    );

  const waitingElement =
    document.getElementById(
      'runtimeWaitingCount'
    );

  const failedElement =
    document.getElementById(
      'runtimeFailedCount'
    );

  if (
    registeredElement
  ) {

    registeredElement.textContent =
      String(
        registered
      );

  }

  if (
    runningElement
  ) {

    runningElement.textContent =
      String(
        running
      );

  }

  if (
    waitingElement
  ) {

    waitingElement.textContent =
      String(
        waiting
      );

  }

  if (
    failedElement
  ) {

    failedElement.textContent =
      String(
        failed
      );

  }

  const departments =
    runtimeDepartments(
      observation
    );

  const grid =
    document.getElementById(
      'runtimeDepartmentGrid'
    );

  if (
    grid
  ) {

    if (
      departments.length
    ) {

      grid.innerHTML =
        departments
          .map(
            department => {

              const name =
                runtimeValue(
                  department,
                  [
                    'department',
                    'name',
                    'id'
                  ],
                  'unknown'
                );

              const status =
                runtimeValue(
                  department,
                  [
                    'status',
                    'state'
                  ],
                  'unknown'
                );

              const reason =
                runtimeValue(
                  department,
                  [
                    'reason',
                    'message',
                    'detail'
                  ],
                  'No Runtime reason reported.'
                );

              return \`

<div class="runtime-department-card">

  <div class="runtime-department-name">
    \${name}
  </div>

  <div class="runtime-department-status">
    \${status}
  </div>

  <div class="runtime-department-reason">
    \${reason}
  </div>

</div>

\`;

            }
          )
          .join(
            ''
          );

    } else {

      grid.innerHTML = \`

<div class="runtime-department-card">

  <div class="runtime-department-name">
    Runtime Observation
  </div>

  <div class="runtime-department-status">
    Observed
  </div>

  <div class="runtime-department-reason">
    No department states were included in the Runtime observation.
  </div>

</div>

\`;

    }

  }

  const observedAt =
    document.getElementById(
      'runtimeObservedAt'
    );

  if (
    observedAt
  ) {

    const timestamp =
      runtimeValue(
        observation,
        [
          'observedAt',
          'timestamp',
          'generatedAt'
        ],
        null
      );

    observedAt.textContent =
      timestamp
        ? \`Observed: \${timestamp}\`
        : 'Runtime observation received.';

  }

  renderRuntimeActivity(
    departments
  );

}

function renderRuntimeActivity(
  departments
){

  const stream =
    document.getElementById(
      'activityStream'
    );

  if (
    !stream
  ) {

    return;

  }

  if (
    !departments.length
  ) {

    stream.innerHTML = \`

<div>

  Runtime observation received.

  <br><br>

  No department execution states were reported.

</div>

\`;

    return;

  }

  stream.innerHTML =
    departments
      .map(
        department => {

          const name =
            runtimeValue(
              department,
              [
                'department',
                'name',
                'id'
              ],
              'unknown'
            );

          const status =
            runtimeValue(
              department,
              [
                'status',
                'state'
              ],
              'unknown'
            );

          const reason =
            runtimeValue(
              department,
              [
                'reason',
                'message',
                'detail'
              ],
              'No Runtime reason reported.'
            );

          return \`

<div
  style="
    margin-bottom:16px;
    padding-bottom:16px;
    border-bottom:
      1px solid rgba(255,255,255,.08);
  "
>

  <div
    style="
      color:#00e5ff;
      font-size:12px;
      margin-bottom:6px;
      text-transform:uppercase;
    "
  >

    \${name} · \${status}

  </div>

  <div>
    \${reason}
  </div>

</div>

\`;

        }
      )
      .join(
        ''
      );

}

async function loadRuntimeObservation(){

  try {

    const observation =
      await apiCall(
        'utils?action=runtime-observation'
      );

    renderRuntimeObservation(
      observation
    );

  } catch (
    error
  ) {

    console.error(
      'Runtime observation failed',
      error
    );

    const grid =
      document.getElementById(
        'runtimeDepartmentGrid'
      );

    if (
      grid
    ) {

      grid.innerHTML = \`

<div class="runtime-department-card">

  <div class="runtime-department-name">
    Runtime Observation Transport
  </div>

  <div class="runtime-department-status">
    Unavailable
  </div>

  <div class="runtime-department-reason">
    \${error.message}
  </div>

</div>

\`;

    }

  }

}

async function loadNiches(){`;

source =
    replaceExact(
        source,
        functionAnchor,
        runtimeClient,
        "RUNTIME OBSERVATION CLIENT"
    );

/*
==================================================
Startup Integration
==================================================
*/

const startupAnchor =
`  await loadCampaigns();

  renderResearchCenter();`;

const runtimeStartup =
`  await loadCampaigns();

  await loadRuntimeObservation();

  renderResearchCenter();`;

source =
    replaceExact(
        source,
        startupAnchor,
        runtimeStartup,
        "RUNTIME STARTUP"
    );

/*
==================================================
Remove Simulated Activity Stream

Runtime observation becomes activity authority.
==================================================
*/

const fakeActivityPattern =
/const activityStream =[\s\S]*?\},3000\);\s*\n\s*lucide\.createIcons\(\);/;

const fakeActivityMatches =
    source.match(
        fakeActivityPattern
    );

console.log(
    "SIMULATED ACTIVITY BLOCKS:",
    fakeActivityMatches
        ? fakeActivityMatches.length
        : 0
);

if (
    !fakeActivityMatches ||
    fakeActivityMatches.length !== 1
) {

    throw new Error(
        "Expected exactly one simulated activity stream block."
    );

}

source =
    source.replace(
        fakeActivityPattern,
        `lucide.createIcons();`
    );

/*
==================================================
Runtime Polling

One Runtime observation loop.

The browser refreshes observation only.
It does not execute Runtime.
==================================================
*/

const pollingAnchor =
`lucide.createIcons();

const researchFeed =`;

const runtimePolling =
`lucide.createIcons();

setInterval(
  loadRuntimeObservation,
  5000
);

const researchFeed =`;

source =
    replaceExact(
        source,
        pollingAnchor,
        runtimePolling,
        "RUNTIME OBSERVATION POLLING"
    );

/*
==================================================
Postcondition Audit
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "POSTCONDITION AUDIT"
);
console.log(
    "========================================"
);
console.log("");

assertCount(
    source,
    /runtime-observation/g,
    1,
    "RUNTIME TRANSPORT REFERENCES"
);

assertCount(
    source,
    /async function loadRuntimeObservation/g,
    1,
    "RUNTIME LOADER"
);

assertCount(
    source,
    /function renderRuntimeObservation/g,
    1,
    "RUNTIME RENDERER"
);

assertCount(
    source,
    /function renderRuntimeActivity/g,
    1,
    "RUNTIME ACTIVITY RENDERER"
);

assertCount(
    source,
    /id="runtimeDepartmentGrid"/g,
    1,
    "RUNTIME GRID"
);

assertCount(
    source,
    /setInterval\(\s*loadRuntimeObservation,\s*5000\s*\)/g,
    1,
    "RUNTIME POLLING LOOP"
);

assertCount(
    source,
    /Math\.random\(\)\s*\*\s*activityEvents\.length/g,
    0,
    "SIMULATED ACTIVITY SELECTION"
);

assertCount(
    source,
    /const activityEvents\s*=/g,
    0,
    "SIMULATED ACTIVITY CATALOG"
);

/*
==================================================
Constitutional UI Audit
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "CONSTITUTIONAL UI AUDIT"
);
console.log(
    "========================================"
);
console.log("");

const prohibitedStatusLogic = [

    /campaign\.intelligence[\s\S]{0,100}waiting/i,

    /product\.intelligence[\s\S]{0,100}waiting/i,

    /status\s*=\s*["']waiting["']/i,

    /status\s*=\s*["']running["']/i,

    /status\s*=\s*["']failed["']/i

];

let prohibitedCount = 0;

for (
    const pattern of
    prohibitedStatusLogic
) {

    prohibitedCount +=
        countMatches(
            source,
            pattern
        );

}

console.log(
    "UI STATUS CALCULATION REFERENCES:",
    prohibitedCount
);

if (
    prohibitedCount !== 0
) {

    throw new Error(
        "Dashboard contains prohibited Runtime status calculation logic."
    );

}

/*
==================================================
Write
==================================================
*/

const outputBuffer =
    Buffer.from(
        source,
        "utf8"
    );

fs.writeFileSync(
    DASHBOARD_PATH,
    outputBuffer
);

console.log("");
console.log(
    "SOURCE WRITTEN:",
    true
);

console.log(
    "OUTPUT BYTE LENGTH:",
    outputBuffer.length
);

/*
==================================================
Written Integrity
==================================================
*/

const writtenBuffer =
    fs.readFileSync(
        DASHBOARD_PATH
    );

const writtenSource =
    writtenBuffer.toString(
        "utf8"
    );

const bomPresent =
    writtenBuffer.length >= 3 &&
    writtenBuffer[0] === 0xef &&
    writtenBuffer[1] === 0xbb &&
    writtenBuffer[2] === 0xbf;

const roundTrip =
    Buffer.from(
        writtenSource,
        "utf8"
    ).equals(
        writtenBuffer
    );

const mojibakePresent =
    /∩╗┐|├░|ΓÇ|≡ƒ|┬|┼╕/.test(
        writtenSource
    );

console.log("");
console.log(
    "UTF-8 BOM PRESENT:",
    bomPresent
);

console.log(
    "UTF-8 ROUND TRIP:",
    roundTrip
        ? "PASS"
        : "FAIL"
);

console.log(
    "KNOWN MOJIBAKE PRESENT:",
    mojibakePresent
);

if (
    bomPresent
) {

    throw new Error(
        "Dashboard contains UTF-8 BOM."
    );

}

if (
    !roundTrip
) {

    throw new Error(
        "Written dashboard failed UTF-8 round trip."
    );

}

if (
    mojibakePresent
) {

    throw new Error(
        "Written dashboard contains known mojibake."
    );

}

/*
==================================================
Final Result
==================================================
*/

console.log("");
console.log(
    "========================================"
);
console.log(
    "STAGE 2 RUNTIME DASHBOARD WIRING COMPLETE"
);
console.log(
    "========================================"
);
console.log("");

console.log(
    "DASHBOARD OWNER: public/index.html"
);

console.log(
    "TRANSPORT: api/utils.js"
);

console.log(
    "OBSERVATION AUTHORITY: Runtime.observe"
);

console.log(
    "UI STATUS CALCULATION: NONE"
);

console.log(
    "SIMULATED ACTIVITY STREAM: REMOVED"
);

console.log(
    "RUNTIME POLLING: 5000ms"
);

console.log(
    "NEW API FILE: NONE"
);

console.log("");