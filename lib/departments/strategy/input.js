"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V3

Strategy Department

input.js

Platform Memory Adapter

Constitution:
MEM-001
MEM-002
MEM-003
QA-001

--------------------------------------------------

Responsibilities

✓ Read Platform Memory
✓ Load certified memory
✓ Select Strategy data
✓ Normalize data
✓ Build immutable Strategy Context

This module SHALL NEVER

✗ Know other departments
✗ Execute business logic
✗ Build artifacts
✗ Submit to QAD
✗ Write Platform Memory

The Strategy Manager consumes only the
Strategy Context returned by this module.

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

/*
==================================================
Runtime Identity
==================================================
*/

const RUNTIME =

Object.freeze({

    department:
        "strategy",

    runtime:
        "input",

    version:
        "1.0.0",

    constitution:
        "MEM-001"

});

/*
==================================================
Department Runtime States
==================================================
*/

const STATUS =

Object.freeze({

    READY:

        "ready",

    WAITING:

        "waiting",

    INVALID:

        "invalid"

});

/*
==================================================
Ready Context

Returned when all required certified business
capabilities are available.

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
Waiting Context

Returned when the required certified business
capabilities are not yet available.

Waiting is a valid runtime state.

==================================================
*/

function buildWaitingContext({

    capability = null,

    waitingFor = [],

    message = null

} = {}) {

    return Object.freeze({

        status:

            STATUS.WAITING,

        capability,

        waitingFor,

        message

    });

}

/*
==================================================
Invalid Context

Returned when certified business capabilities
exist but violate the department contract.

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

This context is the only information required
to retrieve certified memory.

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

            null

    });

}

/*
==================================================
Load Certified Memory

Platform Memory is the constitutional source
of truth.

This function retrieves certified memory only.

No department knowledge exists here.

==================================================
*/

async function loadCertifiedMemory(

    context

) {

    return PlatformMemory.load(

        context

    );

}

/*
==================================================
Certified Memory Lookup

Search Platform Memory by certified memory type.

Departments know only memory types,
never storage layout.

==================================================
*/

function findCertifiedMemory(

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
Strategy Memory Selection

Platform Memory may contain certified data
from many sources.

This module SHALL select only the certified
information required by the Strategy
Department.

The Strategy Department remains unaware
of who originally produced the data.

==================================================
*/

function selectStrategyMemory(memory) {

    return Object.freeze({

        /*
        ------------------------------------------
        Research Intelligence
        ------------------------------------------
        */

        winner:

            findCertifiedMemory(
                memory,
                "winner"
            ),

        top5:

            findCertifiedMemory(
                memory,
                "top5"
            ) || [],

        /*
        ------------------------------------------
        Research Package
        ------------------------------------------
        */

        research:

            findCertifiedMemory(
                memory,
                "research-package"
            ),

        /*
        ------------------------------------------
        Intelligence
        ------------------------------------------
        */

        marketIntelligence:

            findCertifiedMemory(
                memory,
                "market-intelligence"
            ) || {},

        productIntelligence:

            findCertifiedMemory(
                memory,
                "product-intelligence"
            ) || {},

        audienceIntelligence:

            findCertifiedMemory(
                memory,
                "audience-intelligence"
            ) || {},

        competitiveIntelligence:

            findCertifiedMemory(
                memory,
                "competitive-intelligence"
            ) || {},

        /*
        ------------------------------------------
        Metadata
        ------------------------------------------
        */

        metadata:

            findCertifiedMemory(
                memory,
                "metadata"
            ) || {}

    });

}

/*
==================================================
Selection Verification

==================================================
*/

function isStrategySelection(selection) {

    return Boolean(

        selection &&
        typeof selection === "object" &&
        selection.winner &&
        selection.top5

    );

}

function assertStrategySelection(

    selection

) {

    if (

        !isStrategySelection(

            selection

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Strategy Memory Selection."

        );

    }

    return selection;

}

/*
==================================================
Strategy Context Builder

Normalize the selected certified memory into
the immutable Strategy Business Context.

The Strategy Manager consumes ONLY this
context.

==================================================
*/

function buildStrategyContext(selection) {

    assertStrategySelection(
        selection
    );

    return Object.freeze({

        winner:

            selection.winner,

        top5:

            selection.top5,

        research:

            selection.research,

        marketIntelligence:

            selection.marketIntelligence,

        productIntelligence:

            selection.productIntelligence,

        audienceIntelligence:

            selection.audienceIntelligence,

        competitiveIntelligence:

            selection.competitiveIntelligence,

        metadata:

            selection.metadata

    });

}

/*
==================================================
Strategy Context Verification

==================================================
*/

function isStrategyContext(context) {

    return Boolean(

        context &&
        typeof context === "object" &&
        context.winner &&
        Array.isArray(context.top5)

    );

}

function assertStrategyContext(

    context

) {

    if (

        !isStrategyContext(

            context

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Strategy Context."

        );

    }

    return context;

}

/*
==================================================
Context Metrics

Useful for diagnostics and future learning.

==================================================
*/

function buildContextMetrics(context) {

    return Object.freeze({

        hasWinner:

            Boolean(context.winner),

        opportunities:

            Array.isArray(context.top5)
                ? context.top5.length
                : 0,

        hasResearch:

            Boolean(context.research),

        hasMarketIntelligence:

            Boolean(context.marketIntelligence),

        hasAudienceIntelligence:

            Boolean(context.audienceIntelligence),

        createdAt:

            new Date().toISOString(),

        runtime:

            RUNTIME.runtime,

        version:

            RUNTIME.version

    });

}

/*
==================================================
Execution Runtime

Read Platform Memory.

Select certified information.

Normalize into the immutable Strategy Context.

==================================================
*/

async function execute(

    options = {}

) {

    /*
    ----------------------------------------------
    Build Platform Memory Context
    ----------------------------------------------
    */

    const context =

        buildPlatformMemoryContext(

            options

        );

    /*
    ----------------------------------------------
    Load Certified Platform Memory
    ----------------------------------------------
    */

    const certifiedMemory =

        await loadCertifiedMemory(

            context

        );

    if (

    !certifiedMemory ||

    (Array.isArray(certifiedMemory) &&
     certifiedMemory.length === 0)

) {

    return buildWaitingContext({

    capability:

        "platform-memory",

    waitingFor: [

        "platform-memory"

    ],

    message:

        "Awaiting certified Platform Memory."

});

}

    /*
    ----------------------------------------------
    Department Memory Selection
    ----------------------------------------------
    */

    const selection =

    selectStrategyMemory(

        certifiedMemory

    );

/*
----------------------------------------------
Research Required

Strategy requires certified Research
artifacts before planning may begin.

----------------------------------------------
*/

if (

    !selection.winner

) {

    return buildWaitingContext({

        capability:

            "research-package",

        waitingFor: [

            "winner",
            "top5"

        ],

        message:

            "Awaiting certified Research Package."

    });

}

    /*
    ----------------------------------------------
    Build Strategy Context
    ----------------------------------------------
    */

   const strategyContext =

    buildStrategyContext(

        selection

    );

    /*
    ----------------------------------------------
    Constitutional Verification
    ----------------------------------------------
    */

    assertStrategyContext(

    strategyContext

    );

    /*
    ----------------------------------------------
    Runtime Metrics
    ----------------------------------------------
    */

    const metrics =

        buildContextMetrics(

    strategyContext

    );

    /*
    ----------------------------------------------
    Department Input
    ----------------------------------------------
    */

    return buildReadyContext({

    context:

        strategyContext,

    runtime:

        RUNTIME,

    metrics

});

}

/*
==================================================
Department Input Verification

These assertions protect the constitutional
boundary between Platform Memory and the
Strategy Manager.

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

            "Invalid Strategy Department Input."

        );

    }

    return input;

}

/*
==================================================
Department Input Factory

Construct the immutable Department Input.

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
Strategy Manager.

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

    case STATUS.WAITING:

        return result;

    case STATUS.INVALID:

        throw new Errors.ValidationError(

            result.message ||

            "Invalid Strategy Input."

        );

    case STATUS.READY:

        return result.context;

    default:

        throw new Errors.ValidationError(

            "Unknown Strategy Runtime State."

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
    Context
    ----------------------------------------------
    */

    buildPlatformMemoryContext,

    loadCertifiedMemory,

    selectStrategyMemory,

    buildStrategyContext,

    buildContextMetrics,

    buildDepartmentInput,

    /*
    ----------------------------------------------
    Verification
    ----------------------------------------------
    */

    isStrategySelection,

   assertStrategySelection,

    isStrategyContext,

   assertStrategyContext,

    isDepartmentInput,

    assertDepartmentInput,

    buildReadyContext,

    buildWaitingContext,

    buildInvalidContext

});

