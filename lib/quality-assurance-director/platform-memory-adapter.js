const { kv } = require("@vercel/kv");

/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Platform Memory Adapter

Infrastructure Translation Layer

Constitution

PMA-001

Responsibilities

• Translate constitutional artifacts
• Build persistence descriptors
• Execute persistence batches
• Roll back persistence operations

This adapter never:

• Creates submissions
• Certifies submissions
• Creates audit records
• Coordinates commits

========================================
*/

"use strict";

/*
========================================
SHARED INFRASTRUCTURE

========================================
*/

const Config =

    require(

        "./config"

    );

const Constants =

    require(

        "./constants"

    );

const Errors =

    require(

        "./errors"

    );

/*
========================================
ADAPTER POLICY

========================================
*/

function policy() {

    return (

        Config.platformMemory ||

        {}

    );

}

function policyValue(

    key,

    fallback = null

) {

    const configuration =

        policy();

    return Object.prototype

        .hasOwnProperty.call(

            configuration,

            key

        )

        ? configuration[

            key

        ]

        : fallback;

}

/*
========================================
ADAPTER STATE

Infrastructure operational state.

========================================
*/

const state = {

    translations:

        0,

    batches:

        0,

    rollbacks:

        0,

    lastBatchId:

        null

};

/*
========================================
PRIVATE HELPERS

========================================
*/

function timestamp() {

    return (

        new Date()

    ).toISOString();

}

function rememberBatch(

    batchId

) {

    state.batches++;

    state.lastBatchId =

        batchId;

}

function incrementTranslations() {

    state.translations++;

}

/*
========================================
CREATE TRANSLATION REQUEST

Internal immutable translation
request.

========================================
*/

function createTranslationRequest({

    type,

    payload

}) {

    if (

        !type

    ) {

        throw new Errors.ValidationError(

            "Artifact type is required."

        );

    }

    if (

        !payload

    ) {

        throw new Errors.ValidationError(

            "Artifact payload is required."

        );

    }

    return Object.freeze({

        type,

        payload,

        createdAt:

            timestamp()

    });

}

/*
========================================
TRANSLATION STRATEGY REGISTRY

Maps constitutional artifacts
to infrastructure translators.

========================================
*/

const translationStrategies =

    Object.freeze({

        submission:

            translateSubmission,

        audit:

            translateAudit

    });

/*
========================================
TRANSLATE ARTIFACT

Selects the appropriate
translation strategy.

========================================
*/

function translateArtifact(

    request

) {

    const strategy =

        translationStrategies[

            request.type

        ];

    if (

        typeof strategy !==

        "function"

    ) {

        throw new Errors.ValidationError(

            `Unsupported artifact type: ${request.type}`

        );

    }

    return strategy(

        request.payload

    );

}

/*
========================================
TRANSLATE SUBMISSION

Creates a persistence descriptor
for a certified submission.

========================================
*/

function translateSubmission(

    submission

) {

    return Object.freeze({

        operation:

            "SET",

        namespace:

            "submissions",

        key:

            submission.id,

        value:

            submission

    });

}

/*
========================================
TRANSLATE AUDIT

Creates a persistence descriptor
for an immutable audit record.

========================================
*/

function translateAudit(

    auditRecord

) {

    return Object.freeze({

        operation:

            "SET",

        namespace:

            "audit",

        key:

            auditRecord.auditId,

        value:

            auditRecord

    });

}

/*
========================================
TRANSLATION ENGINE

Artifact

↓

Translation Request

↓

Translation Strategy

↓

Persistence Descriptor

========================================
*/

function translate(

    artifact

) {

    incrementTranslations();

    const request =

        createTranslationRequest(

            artifact

        );

    return translateArtifact(

        request

    );

}

/*
========================================
BUILD PERSISTENCE DESCRIPTOR

Creates the immutable
descriptor consumed by the
execution engine.

========================================
*/

function buildDescriptor(

    translation

) {

    const descriptor =

        Object.freeze({

            operation:

                translation.operation,

            namespace:

                translation.namespace,

            key:

                translation.key,

            value:

                translation.value

        });

    verifyDescriptor(

        descriptor

    );

    return descriptor;

}

/*
========================================
VERIFY DESCRIPTOR

Structural verification.

========================================
*/

function verifyDescriptor(

    descriptor

) {

    if (

        !descriptor.operation

    ) {

        throw new Errors.ValidationError(

            "Persistence operation is required."

        );

    }

    if (

        !descriptor.namespace

    ) {

        throw new Errors.ValidationError(

            "Persistence namespace is required."

        );

    }

    if (

        !descriptor.key

    ) {

        throw new Errors.ValidationError(

            "Persistence key is required."

        );

    }

    if (

        descriptor.value === undefined

    ) {

        throw new Errors.ValidationError(

            "Persistence value is required."

        );

    }

    return descriptor;

}

/*
========================================
CREATE BATCH

Single immutable persistence
batch.

========================================
*/

function createBatch(

    descriptor

) {

    return Object.freeze({

        id:

            Constants.generateId(),

        descriptors:

            Object.freeze([

                descriptor

            ]),

        createdAt:

            timestamp()

    });

}

/*
========================================
TRANSLATION PIPELINE

Artifact

↓

Translation Request

↓

Translation Strategy

↓

Descriptor Builder

↓

Persistence Batch

========================================
*/

function createPersistenceBatch(

    artifact

) {

    const translation =

        translate(

            artifact

        );

    const descriptor =

        buildDescriptor(

            translation

        );

    return createBatch(

        descriptor

    );

}

/*
========================================
CREATE EXECUTION REQUEST

Infrastructure execution
request.

========================================
*/

function createExecutionRequest(

    descriptor

) {

    return Object.freeze({

        id:

            Constants.generateId(),

        descriptor,

        createdAt:

            timestamp()

    });

}

/*
========================================
EXECUTE

Delegates persistence to the
Platform Memory service.

========================================
*/

async function execute(

    request

) {

    const {

        descriptor

    } = request;

    const key =

        `${descriptor.namespace}:${descriptor.key}`;

    await kv.set(

        key,

        descriptor.value

    );

    rememberBatch(

        request.id

    );

    return Object.freeze({

        commitId:

            request.id,

        key,

        namespace:

            descriptor.namespace,

        committedAt:

            timestamp()

    });

}

/*
========================================
COMMIT

Constitutional submission
commit.

========================================
*/
    
    async function commit(

         artifact

    ) {

    const batch =

         createPersistenceBatch(
             artifact
         );

    const request =

         createExecutionRequest(

             batch.descriptors[0]

         );

    return execute(

        request

    );

}

/*
========================================
COMMIT AUDIT

Constitutional audit
commit.

Backward-compatible wrapper.

========================================
*/

async function commitAudit(

    auditRecord

) {

    return commit({

        type: "audit",

        payload: auditRecord

    });

}

/*
========================================
ROLLBACK

Infrastructure rollback.

Delegated to Platform Memory.

========================================
*/

async function rollback(

    receipt

) {

    if (

        !receipt

    ) {

        throw new Errors.ValidationError(

            "Persistence receipt is required."

        );

    }

    await kv.del(

        receipt.key

    );

    state.rollbacks++;

    return Object.freeze({

        rolledBack: true,

        key:

            receipt.key,

        rolledBackAt:

            timestamp()

    });

}

/*
========================================
VALIDATE

Adapter infrastructure
validation.

========================================
*/

function validate() {

    return Object.freeze({

        valid: true,

        adapter:

            "platform-memory-adapter",

        translationStrategies:

            Object.keys(

                translationStrategies

            ),

        timestamp:

            timestamp()

    });

}

/*
========================================
PUBLIC API

Infrastructure Translation Layer

========================================
*/

const PlatformMemoryAdapter =

    Object.freeze({

        commit,

        /*
        ----------------------------
        Compatibility wrapper

        Internally delegates to the
        generic commit translator.

        ----------------------------
        */

        commitAudit,

        rollback,

        validate

    });

/*
========================================
MODULE EXPORT

========================================
*/

module.exports =

    PlatformMemoryAdapter;