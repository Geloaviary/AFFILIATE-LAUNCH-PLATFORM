"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

knowledge-acquisition.js

Platform Knowledge Acquisition Service

Constitution

MEM-004
MEM-005
MEM-006
MEM-007
QA-001

--------------------------------------------------

Responsibilities

✓ Acquire external knowledge
✓ Normalize provider responses
✓ Submit candidates to QAD
✓ Retry until certification succeeds

This module SHALL NEVER

✗ Execute Research
✗ Write Platform Memory
✗ Build Research Artifacts
✗ Know other departments

==================================================
*/

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

const QAD =

    require(

        "../quality-assurance-director"

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

        "knowledge-acquisition",

    version:

        "1.0.0"

});

/*
==================================================
Knowledge Providers

Provider priority determines the acquisition
order.

==================================================
*/

const PROVIDERS =

Object.freeze({

    PLATFORM:

        "platform-memory",

    OPENAI:

        "openai",

    INTERNET:

        "internet",

    MCP:

        "mcp"

});

/*
==================================================
Acquisition Context

==================================================
*/

function buildAcquisitionContext(

    request = {}

) {

    return Object.freeze({

        runtime:

            RUNTIME,

        niche:

            request.niche ||

            null,

        campaignId:

            request.campaignId ||

            null,

        sessionId:

            request.sessionId ||

            null,

        requestId:

            request.requestId ||

            null

    });

}

/*
==================================================
Acquisition Candidate

Raw external knowledge.

This object is NEVER trusted.

==================================================
*/

function buildCandidate({

    provider,

    payload,

    metadata = {}

}) {

    return Object.freeze({

        provider,

        payload,

        metadata,

        acquiredAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Provider Acquisition

Attempts to acquire knowledge from a single
provider.

Each provider implements the same contract.

==================================================
*/

async function acquireFromProvider(

    provider,

    context

) {

    switch (

        provider

    ) {

        case PROVIDERS.OPENAI:

            return acquireFromOpenAI(

                context

            );

        case PROVIDERS.INTERNET:

            return acquireFromInternet(

                context

            );

        case PROVIDERS.MCP:

            return acquireFromMCP(

                context

            );

        default:

            throw new Errors.ValidationError(

                `Unknown provider: ${provider}`

            );

    }

}

/*
==================================================
Candidate Acquisition

Attempts providers in constitutional order
until a valid candidate is acquired.

==================================================
*/

async function acquireCandidate(

    context

) {

    const priority = [

        PROVIDERS.OPENAI,

        PROVIDERS.INTERNET,

        PROVIDERS.MCP

    ];

    for (

        const provider of priority

    ) {

        const candidate =

            await acquireFromProvider(

                provider,

                context

            );

        if (

            candidate

        ) {

            return buildCandidate({

                provider,

                payload:

                    candidate

            });

        }

    }

    throw new Errors.ValidationError(

        "Unable to acquire external knowledge."

    );

}

/*
==================================================
Submit Candidate

Knowledge Acquisition never validates,
repairs or certifies.

QAD owns the entire certification process.

==================================================
*/

async function submitCandidate(

    candidate

) {

    return QAD.submit({

        type:

            "research-package",

        source:

            "external",

        candidate

    });

}

/*
==================================================
Certified Research Package Check

Platform Memory is the constitutional
source of operational knowledge.

==================================================
*/

async function hasCertifiedResearchPackage(

    context

) {

    const memory =

        await PlatformMemory.load(

            context

        );

    if (

        !Array.isArray(

            memory

        )

    ) {

        return false;

    }

    return memory.some(

        record =>

            record &&

            record.type ===

                "research-package" &&

            record.certified === true

    );

}

/*
==================================================
Knowledge Acquisition Runtime

Continues acquiring knowledge until a
certified Research Package exists.

==================================================
*/

async function acquire(

    request = {}

) {

    const context =

        buildAcquisitionContext(

            request

        );

    let attempts = 0;

    while (

        true

    ) {

        attempts++;

        /*
        ------------------------------------------
        Acquire Candidate
        ------------------------------------------
        */

        const candidate =

            await acquireCandidate(

                context

            );

        /*
        ------------------------------------------
        Submit to QAD
        ------------------------------------------
        */

        await submitCandidate(

            candidate

        );

        /*
        ------------------------------------------
        Platform Memory Verification
        ------------------------------------------
        */

        const certified =

            await hasCertifiedResearchPackage(

                context

            );

        if (

            certified

        ) {

            return Object.freeze({

                success:

                    true,

                attempts,

                runtime:

                    RUNTIME

            });

        }

    }

}

/*
==================================================
Acquisition Metrics

==================================================
*/

function buildAcquisitionMetrics({

    attempts

}) {

    return Object.freeze({

        attempts,

        runtime:

            RUNTIME.runtime,

        version:

            RUNTIME.version,

        acquiredAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Provider Registry

Constitutional provider execution order.

Engineering may modify provider order without
changing the acquisition runtime.

==================================================
*/

function getProviders() {

    return Object.freeze([

        PROVIDERS.OPENAI,

        PROVIDERS.INTERNET,

        PROVIDERS.MCP

    ]);

}

/*
==================================================
Provider Pipeline

Executes providers according to the
constitutional provider registry.

==================================================
*/

async function executeProviderPipeline(

    context

) {

    const providers =

        getProviders();

    for (

        const provider of providers

    ) {

        const candidate =

            await acquireFromProvider(

                provider,

                context

            );

        if (

            candidate

        ) {

            return buildCandidate({

                provider,

                payload:

                    candidate

            });

        }

    }

    return null;

}

/*
==================================================
Acquisition Report

Immutable acquisition report returned to
Research Input.

==================================================
*/

function buildAcquisitionReport({

    attempts,

    success,

    provider = null

}) {

    return Object.freeze({

        runtime:

            RUNTIME,

        success,

        attempts,

        provider,

        metrics:

            buildAcquisitionMetrics({

                attempts

            })

    });

}

/*
==================================================
Acquisition Verification

==================================================
*/

function assertAcquisitionReport(

    report

) {

    if (

        !report ||

        typeof report !==

            "object"

    ) {

        throw new Errors.ValidationError(

            "Invalid Knowledge Acquisition Report."

        );

    }

    return report;

}

/*
==================================================
Public Service API

Platform Service

This module is intentionally exposed as a
service rather than a Department Runtime.

The only constitutional responsibility is
to ensure that a certified Research Package
exists in Platform Memory.

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------------------
    Primary Service
    ----------------------------------------------
    */

    acquire,

    /*
    ----------------------------------------------
    Context
    ----------------------------------------------
    */

    buildAcquisitionContext,

    /*
    ----------------------------------------------
    Candidate
    ----------------------------------------------
    */

    buildCandidate,

    /*
    ----------------------------------------------
    Reports
    ----------------------------------------------
    */

    buildAcquisitionReport,

    buildAcquisitionMetrics,

    /*
    ----------------------------------------------
    Providers
    ----------------------------------------------
    */

    getProviders,

    /*
    ----------------------------------------------
    Verification
    ----------------------------------------------
    */

    assertAcquisitionReport

});

