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

âœ“ Read Platform Memory
âœ“ Load certified memory
âœ“ Select Strategy data
âœ“ Normalize data
âœ“ Build immutable Strategy Context

This module SHALL NEVER

âœ— Know other departments
âœ— Execute business logic
âœ— Build artifacts
âœ— Submit to QAD
âœ— Write Platform Memory

The Strategy Manager consumes only the
Strategy Context returned by this module.

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
Load Strategy Contract

Research Department publishes the Strategy
Contract.

Strategy consumes ONLY that contract.

==================================================
*/

async function loadStrategyContract(

    context

) {

    return PlatformMemory.loadContract({

        campaignId:

            context.campaignId,

        department:

            "strategy"

    });


}

/*
==================================================
Selection Verification

==================================================
*/

function isStrategySelection(

    contract

) {

    return Boolean(

        contract &&
        typeof contract === "object" &&
        contract.department === "strategy" &&
        contract.payload &&
        typeof contract.payload === "object"

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

function buildStrategyContext(

    contract

) {

    assertStrategySelection(

        contract

    );

    const {

        payload,

        metadata

    } = contract;

    return Object.freeze({

        niche:

            payload.niche,

        winner:

            payload.winner,

        competitor:

            payload.competitor,

        opportunities:

            payload.opportunities,

        marketIntelligence:

            payload.marketIntelligence,

        campaignIntelligence:

            payload.campaignIntelligence,

        productIntelligence:

            payload.productIntelligence,

        metadata

    });

}

/*
==================================================
Strategy Context Verification

==================================================
*/

function isStrategyContext(

    context

) {

    return Boolean(

        context &&
        typeof context === "object" &&
        context.winner &&
        context.marketIntelligence &&
        context.productIntelligence

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

        Boolean(

            context.winner

        ),

    hasCompetitor:

        Boolean(

            context.competitor

        ),

    hasMarketIntelligence:

        Boolean(

            context.marketIntelligence

        ),

    hasCampaignIntelligence:

        Boolean(

            context.campaignIntelligence

        ),

    hasProductIntelligence:

        Boolean(

            context.productIntelligence

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
Load Strategy Contract
----------------------------------------------
*/

const strategyContract =

    await loadStrategyContract(

        context

    );

if (

    !strategyContract

) {

    return buildWaitingContext({

        capability:

            "strategy-contract",

        waitingFor: [

            "research"

        ],

        message:

            "Awaiting Strategy Contract."

    });

}

     const contract =

    strategyContract;

/*
----------------------------------------------
Research Required

Strategy requires certified Research
artifacts before planning may begin.

----------------------------------------------
*/

if (

    !contract.payload?.winner

) {

    return buildWaitingContext({

        capability:

            "strategy-contract",

        waitingFor: [

            "research"

        ],

        message:

            "Awaiting Strategy Contract."

    });

}

    /*
    ----------------------------------------------
    Build Strategy Context
    ----------------------------------------------
    */

   const strategyContext =

    buildStrategyContext(

        contract

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

    loadStrategyContract,

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

