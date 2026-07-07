"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

input.js

Knowledge Acquisition Gateway

Constitution

MEM-001
MEM-002
MEM-003
MEM-004
MEM-005
MEM-006
MEM-007
QA-001

--------------------------------------------------

Responsibilities

✓ Read Platform Memory
✓ Load certified Research Packages
✓ Select certified knowledge
✓ Acquire external knowledge when required
✓ Submit external knowledge to QAD
✓ Reload certified Platform Memory
✓ Build immutable Research Context

This module SHALL NEVER

✗ Execute Research
✗ Build Research Artifacts
✗ Perform Validation
✗ Perform Repairs
✗ Call OpenAI directly
✗ Search the Internet directly
✗ Write Platform Memory

The Research Manager consumes only the
Research Context returned by this module.

==================================================
*/

const PlatformMemory =

    require(
        "../quality-assurance-director/platform-memory-adapter"
    );

const Errors =

    require(
        "../quality-assurance-director/errors"
    );

const KnowledgeAcquisition =

    require(
        "./knowledge-acquisition"
    );

/*
==================================================
Runtime Identity
==================================================
*/

const RUNTIME =

Object.freeze({

    department:

        "research",

    runtime:

        "input",

    version:

        "2.0.0",

    constitution:

        "MEM-001"

});

/*
==================================================
Department Runtime States

Research never exposes WAITING.

READY

Knowledge available.

INVALID

Acquisition failed after constitutional
processing.

==================================================
*/

const STATUS =

Object.freeze({

    READY:

        "ready",

    INVALID:

        "invalid"

});

/*
==================================================
Ready Context

Returned when certified Research knowledge
is available.

==================================================
*/

function buildReadyContext({

    context,

    runtime,

    metrics

} = {}) {

    return Object.freeze({

        status:

            STATUS.READY,

        context,

        runtime,

        metrics

    });

}

/*
==================================================
Invalid Context

Returned only when Research cannot produce
a certified Research Package.

==================================================
*/

function buildInvalidContext({

    violations = [],

    message = null

} = {}) {

    return Object.freeze({

        status:

            STATUS.INVALID,

        violations,

        message

    });

}

/*
==================================================
Platform Memory Context

Manager knows nothing about Platform Memory.

==================================================
*/

function buildPlatformMemoryContext(

    options = {}

) {

    return Object.freeze({

        campaignId:

            options.campaignId ||

            null,

        sessionId:

            options.sessionId ||

            null,

        requestId:

            options.requestId ||

            null,

        niche:

            options.niche ||

            null

    });

}

/*
==================================================
Load Certified Memory

Platform Memory is the constitutional
source of truth.

==================================================
*/

async function loadCertifiedMemory(

    context

) {

    return PlatformMemory.loadContract({

    campaignId,

    department:

        "strategy"

});

}

/*
==================================================
Find Certified Knowledge

Search Platform Memory by certified
knowledge type.

==================================================
*/

function findCertifiedKnowledge(

    memory,

    type

) {

    if (

        !Array.isArray(

            memory

        )

    ) {

        return null;

    }

    const record =

        memory.find(

            item =>

                item &&

                item.type === type &&

                item.certified === true

        );

    return record ?

        record.payload :

        null;

}

/*
==================================================
Research Knowledge Selection

Research consumes exactly one certified
Research Package.

==================================================
*/

function selectResearchKnowledge(

    memory

) {

    return Object.freeze({

        research:

            findCertifiedKnowledge(

                memory,

                "research-package"

            )

    });

}

/*
==================================================
Knowledge Verification

==================================================
*/

function isResearchKnowledge(

    selection

) {

    return Boolean(

        selection &&

        typeof selection === "object"

    );

}

function assertResearchKnowledge(

    selection

) {

    if (

        !isResearchKnowledge(

            selection

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Research Knowledge."

        );

    }

    return selection;

}

/*
==================================================
Research Context Builder

Transforms certified knowledge into the
immutable Research Business Context.

==================================================
*/

function buildResearchContext(

    selection

) {

    assertResearchKnowledge(

        selection

    );

    return Object.freeze({

        research:

            selection.research

    });

}

/*
==================================================
Research Context Verification

==================================================
*/

function isResearchContext(

    context

) {

    return Boolean(

        context &&

        typeof context === "object"

    );

}

function assertResearchContext(

    context

) {

    if (

        !isResearchContext(

            context

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Research Context."

        );

    }

    return context;

}

/*
==================================================
Research Knowledge Acquisition

Platform Memory is always queried first.

If the required Research Package does not
exist, delegate acquisition to the Knowledge
Acquisition Service.

The service SHALL

1. Acquire external knowledge
2. Submit candidate to QAD
3. Commit certified package to Platform Memory
4. Return only after certification succeeds

==================================================
*/

async function ensureResearchKnowledge(

    memoryContext

) {

    /*
    ----------------------------------------------
    Initial Platform Memory
    ----------------------------------------------
    */

    let certifiedMemory =

        await loadCertifiedMemory(

            memoryContext

        );

    let selection =

        selectResearchKnowledge(

            certifiedMemory

        );

    /*
    ----------------------------------------------
    Already Available
    ----------------------------------------------
    */

    if (

        selection.research

    ) {

        return certifiedMemory;

    }

    /*
    ----------------------------------------------
    Acquire Knowledge

    Knowledge Acquisition never returns until
    a certified Research Package exists or
    throws a terminal error.

    ----------------------------------------------
    */

    await KnowledgeAcquisition.acquire(

        memoryContext

    );

    /*
    ----------------------------------------------
    Reload Certified Platform Memory

    QAD has already certified and committed
    the Research Package.

    ----------------------------------------------
    */

    certifiedMemory =

        await loadCertifiedMemory(

            memoryContext

        );

    selection =

        selectResearchKnowledge(

            certifiedMemory

        );

    /*
    ----------------------------------------------
    Constitutional Safety Check

    ----------------------------------------------
    */

    if (

        !selection.research

    ) {

        throw new Errors.ValidationError(

            "Knowledge acquisition completed without a certified Research Package."

        );

    }

    return certifiedMemory;

}

/*
==================================================
Context Metrics

Useful for diagnostics and future learning.

==================================================
*/

function buildContextMetrics(

    context

) {

    return Object.freeze({

        hasResearchPackage:

            Boolean(

                context.research

            ),

        createdAt:

            new Date()

                .toISOString(),

        runtime:

            RUNTIME.runtime,

        version:

            RUNTIME.version

    });

}

/*
==================================================
Execution Runtime

Platform Memory

↓

Knowledge Acquisition (if required)

↓

Certified Research Package

↓

Research Context

==================================================
*/

async function execute(

    options = {}

) {

    /*
    ----------------------------------------------
    Platform Memory Context
    ----------------------------------------------
    */

    const memoryContext =

        buildPlatformMemoryContext(

            options

        );

    /*
    ----------------------------------------------
    Ensure Certified Research Package

    Platform Memory is always the source
    of operational knowledge.

    ----------------------------------------------
    */

    const certifiedMemory =

        await ensureResearchKnowledge(

            memoryContext

        );

    /*
    ----------------------------------------------
    Research Knowledge Selection
    ----------------------------------------------
    */

    const selection =

        selectResearchKnowledge(

            certifiedMemory

        );

    /*
    ----------------------------------------------
    Build Immutable Research Context
    ----------------------------------------------
    */

    const researchContext =

        buildResearchContext(

            selection

        );

    /*
    ----------------------------------------------
    Constitutional Verification
    ----------------------------------------------
    */

    assertResearchContext(

        researchContext

    );

    /*
    ----------------------------------------------
    Runtime Metrics
    ----------------------------------------------
    */

    const metrics =

        buildContextMetrics(

            researchContext

        );

    /*
    ----------------------------------------------
    Department Ready
    ----------------------------------------------
    */

    return buildReadyContext({

        context:

            researchContext,

        runtime:

            RUNTIME,

        metrics

    });

}

/*
==================================================
Department Input Verification

==================================================
*/

function isDepartmentInput(

    input

) {

    return Boolean(

        input &&

        typeof input === "object" &&

        input.runtime &&

        input.context &&

        input.metrics

    );

}

function assertDepartmentInput(

    input

) {

    if (

        !isDepartmentInput(

            input

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Research Department Input."

        );

    }

    return input;

}

/*
==================================================
Department Input Factory

==================================================
*/

function buildDepartmentInput(

    runtime,

    context,

    metrics

) {

    return Object.freeze({

        runtime,

        context,

        metrics

    });

}

/*
==================================================
Department Entry

This is the constitutional entry point used by
Research Manager.

Research SHALL always return a certified
Research Context.

Knowledge acquisition is completely hidden
inside the execution runtime.

==================================================
*/

async function executeInput(

    options = {}

) {

    const result =

        await execute(

            options

        );

    switch (

        result.status

    ) {

        case STATUS.INVALID:

            throw new Errors.ValidationError(

                result.message ||

                "Invalid Research Input."

            );

        case STATUS.READY:

            return result.context;

        default:

            throw new Errors.ValidationError(

                "Unknown Research Runtime State."

            );

    }

}

/*
==================================================
Public API

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------------------
    Runtime
    ----------------------------------------------
    */

    execute:

        executeInput,

    /*
    ----------------------------------------------
    Platform Memory
    ----------------------------------------------
    */

    buildPlatformMemoryContext,

    loadCertifiedMemory,

    findCertifiedKnowledge,

    selectResearchKnowledge,

    /*
    ----------------------------------------------
    Context
    ----------------------------------------------
    */

    buildResearchContext,

    buildContextMetrics,

    buildDepartmentInput,

    /*
    ----------------------------------------------
    Verification
    ----------------------------------------------
    */

    isResearchKnowledge,

    assertResearchKnowledge,

    isResearchContext,

    assertResearchContext,

    isDepartmentInput,

    assertDepartmentInput,

    /*
    ----------------------------------------------
    Runtime States
    ----------------------------------------------
    */

    buildReadyContext,

    buildInvalidContext

});