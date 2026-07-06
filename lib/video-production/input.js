"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V3

Production Department

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
✓ Select Production data
✓ Normalize data
✓ Build immutable Production Context

This module SHALL NEVER

✗ Know other departments
✗ Execute business logic
✗ Build artifacts
✗ Submit to QAD
✗ Write Platform Memory

The Production Manager consumes only the
Production Context returned by this module.

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
        "Production",

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
Production Memory Selection

Platform Memory may contain certified data
from many sources.

This module SHALL select only the certified
information required by the Production
Department.

The Production Department remains unaware
of who originally produced the data.

==================================================
*/

function selectProductionMemory(

    memory

) {

    return Object.freeze({

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

        videoPlan:

            findCertifiedMemory(

                memory,

               "video-plan"

            ),

        plans:

            findCertifiedMemory(

                memory,

                "plans"

            ) || {},

        assets:

            findCertifiedMemory(

                memory,

                "assets"

            ) || {},

        campaignIntelligence:

            findCertifiedMemory(

                memory,

                "campaign-intelligence"

            ) || {},

        productIntelligence:

            findCertifiedMemory(

                memory,

                "product-intelligence"

            ) || {},

        revenueProjection:

            findCertifiedMemory(

                memory,

                "revenue-projection"

            ) || {},

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

function isProductionSelection(

    selection

) {

    return Boolean(

    selection &&

    typeof selection === "object" &&

    selection.videoPlan

);

}

function assertProductionSelection(

    selection

) {

    if (

        !isProductionSelection(

            selection

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Production Memory selection."

        );

    }

    return selection;

}

/*
==================================================
Production Context Builder

Normalize the selected certified memory into
the immutable Production Business Context.

The Production Manager consumes ONLY this
context.

==================================================
*/

function buildProductionContext(

    selection

) {

    assertProductionSelection(

        selection

    );

    return Object.freeze({

        /*
        ------------------------------------------
        Production Runtime
        ------------------------------------------
        */

        winner:

            selection.winner,

        top5:

            selection.top5,

        videoPlan:

            selection.videoPlan,

        plans:

            selection.plans,

        assets:

            selection.assets,

        campaignIntelligence:

            selection.campaignIntelligence,

        productIntelligence:

            selection.productIntelligence,

        revenueProjection:

            selection.revenueProjection,

        metadata:

            selection.metadata

    });

}

/*
==================================================
Production Context Verification

==================================================
*/

function isProductionContext(

    context

) {

    return Boolean(

    context &&

    typeof context === "object" &&

    context.videoPlan &&

    context.plans &&

    context.assets

);

}

function assertProductionContext(

    context

) {

    if (

        !isProductionContext(

            context

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Production Context."

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

function buildContextMetrics(

    context

) {

    return Object.freeze({

        hasWinner:

            Boolean(

                context.winner

            ),

        topProducts:

    Array.isArray(

        context.top5

    )

        ? context.top5.length

        : 0,

        hasPlans:

            Object.keys(

                context.plans

            ).length > 0,

        hasAssets:

            Object.keys(

                context.assets

            ).length > 0,

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

Read Platform Memory.

Select certified information.

Normalize into the immutable Production Context.

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

    selectProductionMemory(

        certifiedMemory

    );

/*
----------------------------------------------
Video Plan Required

Production executes only when a certified
Video Plan exists.

----------------------------------------------
*/

if (

    !selection.videoPlan

) {

    return buildWaitingContext({

    capability:

        "video-plan",

    waitingFor: [

        "video-plan"

    ],

    message:

        "Awaiting certified Video Plan."

});

  }

    /*
    ----------------------------------------------
    Build Production Context
    ----------------------------------------------
    */

    const productionContext =

        buildProductionContext(

            selection

        );

    /*
    ----------------------------------------------
    Constitutional Verification
    ----------------------------------------------
    */

    assertProductionContext(

        productionContext

    );

    /*
    ----------------------------------------------
    Runtime Metrics
    ----------------------------------------------
    */

    const metrics =

        buildContextMetrics(

            productionContext

        );

    /*
    ----------------------------------------------
    Department Input
    ----------------------------------------------
    */

    return buildReadyContext({

    context:

        productionContext,

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
Production Manager.

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

            "Invalid Production Department Input."

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
Production Manager.

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

            "Invalid Production Input."

        );

    case STATUS.READY:

        return result.context;

    default:

        throw new Errors.ValidationError(

            "Unknown Production Runtime State."

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

    selectProductionMemory,

    buildProductionContext,

    buildContextMetrics,

    buildDepartmentInput,

    /*
    ----------------------------------------------
    Verification
    ----------------------------------------------
    */

    isProductionSelection,

    assertProductionSelection,

    isProductionContext,

    assertProductionContext,

    isDepartmentInput,

    assertDepartmentInput,

    buildReadyContext,

    buildWaitingContext,

    buildInvalidContext

});

