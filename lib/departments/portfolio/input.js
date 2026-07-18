"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V3

Portfolio Department

input.js

Platform Memory Adapter

Constitution:
MEM-001
MEM-002
MEM-003
QA-001

--------------------------------------------------

Responsibilities

âœ“ Read Platform Memory
âœ“ Load certified memory
âœ“ Select Portfolio data
âœ“ Normalize data
âœ“ Build immutable Portfolio Context

This module SHALL NEVER

âœ— Know other departments
âœ— Execute business logic
âœ— Build artifacts
âœ— Submit to QAD
âœ— Write Platform Memory

The Portfolio Manager consumes only the
Portfolio Context returned by this module.

==================================================
*/

const PlatformMemory =

    require(
        "../../quality-assurance-director/platform-memory-adapter"
    );

const Errors =

    require(
        "../../quality-assurance-director/errors"
    );

/*
==================================================
Runtime Identity
==================================================
*/

const RUNTIME =

Object.freeze({

    department:
        "portfolio",

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
Load Portfolio Contract

Analytics Department publishes the Portfolio
Contract.

Portfolio consumes ONLY that contract.

==================================================
*/

async function loadPortfolioContract(

    context

) {

    return PlatformMemory.loadContract({

        campaignId:

            context.campaignId,

        department:

            "portfolio"

    });


}

/*
==================================================
Selection Verification

==================================================
*/

function isPortfolioSelection(

    contract

) {

    return Boolean(

        contract &&
        typeof contract === "object" &&
        contract.department === "portfolio" &&
        contract.payload &&
        typeof contract.payload === "object"

    );

}

function assertPortfolioSelection(

    selection

) {

    if (

        !isPortfolioSelection(

            selection

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Portfolio Memory Selection."

        );

    }

    return selection;

}

/*
==================================================
Portfolio Context Builder

Normalize the selected certified memory into
the immutable Portfolio Business Context.

The Portfolio Manager consumes ONLY this
context.

==================================================
*/

function buildPortfolioContext(

    contract

) {

    assertPortfolioSelection(

        contract

    );

    const {

        payload,

        metadata

    } = contract;

    return Object.freeze({

        campaigns:

            payload.campaigns,

        performance:

            payload.performance,

        revenue:

            payload.revenue,

        budget:

            payload.budget,

        constraints:

            payload.constraints ||

            Object.freeze({}),

        previousReview:

            payload.previousReview ||

            null,

        metadata

    });

}

/*
==================================================
Portfolio Context Verification

==================================================
*/

function isPortfolioContext(

    context

) {

    return Boolean(

        context &&
        typeof context === "object" &&
        Array.isArray(context.campaigns) &&
        context.campaigns.length > 0 &&
        context.performance &&
        context.revenue

    );

}

function assertPortfolioContext(

    context

) {

    if (

        !isPortfolioContext(

            context

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Portfolio Context."

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

    campaignCount:

        Array.isArray(context.campaigns) ?

            context.campaigns.length :

            0,

    hasPerformance:

        Boolean(

            context.performance

        ),

    hasRevenue:

        Boolean(

            context.revenue

        ),

    hasBudget:

        Boolean(

            context.budget

        ),

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

Normalize into the immutable Portfolio Context.

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
Load Portfolio Contract
----------------------------------------------
*/

const portfolioContract =

    await loadPortfolioContract(

        context

    );

if (

    !portfolioContract

) {

    return buildWaitingContext({

        capability:

            "portfolio-contract",

        waitingFor: [

            "analytics"

        ],

        message:

            "Awaiting Portfolio Contract."

    });

}

     const contract =

    portfolioContract;

/*
----------------------------------------------
Performance Data Required

Portfolio requires certified campaign
performance data before planning may begin.

----------------------------------------------
*/

if (

    !Array.isArray(contract.payload?.campaigns) ||

    contract.payload.campaigns.length === 0

) {

    return buildWaitingContext({

        capability:

            "portfolio-contract",

        waitingFor: [

            "analytics"

        ],

        message:

            "Awaiting Portfolio Contract."

    });

}

    /*
    ----------------------------------------------
    Build Portfolio Context
    ----------------------------------------------
    */

   const portfolioContext =

    buildPortfolioContext(

        contract

    );

    /*
    ----------------------------------------------
    Constitutional Verification
    ----------------------------------------------
    */

    assertPortfolioContext(

    portfolioContext

    );

    /*
    ----------------------------------------------
    Runtime Metrics
    ----------------------------------------------
    */

    const metrics =

        buildContextMetrics(

    portfolioContext

    );

    /*
    ----------------------------------------------
    Department Input
    ----------------------------------------------
    */

    return buildReadyContext({

    context:

        portfolioContext,

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
Portfolio Manager.

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

            "Invalid Portfolio Department Input."

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
Portfolio Manager.

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

            "Invalid Portfolio Input."

        );

    case STATUS.READY:

        return result.context;

    default:

        throw new Errors.ValidationError(

            "Unknown Portfolio Runtime State."

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

    loadPortfolioContract,

    buildPortfolioContext,

    buildContextMetrics,

    buildDepartmentInput,

    /*
    ----------------------------------------------
    Verification
    ----------------------------------------------
    */

    isPortfolioSelection,

   assertPortfolioSelection,

    isPortfolioContext,

   assertPortfolioContext,

    isDepartmentInput,

    assertDepartmentInput,

    buildReadyContext,

    buildWaitingContext,

    buildInvalidContext

});

