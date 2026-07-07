"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

QUALITY ASSURANCE DIRECTOR

Platform Memory Adapter

PMA-003

Campaign Platform Memory

--------------------------------------------------

Constitution

Platform Memory SHALL organize all
persistent state around Campaigns.

Platform Memory SHALL receive only
Campaign Commit Transactions.

Platform Memory SHALL NEVER inspect
department schemas.

Platform Memory SHALL NEVER construct
business objects.

Platform Memory SHALL only translate
Campaign Commit Transactions into
Persistence Descriptors.

Only Platform Memory Adapter owns
physical storage paths.

==================================================
*/

const { kv } = require("@vercel/kv");

const Errors =
    require("./errors");

const RuntimeId =
    require("../identity/runtime");

/*
==================================================
Runtime Identity

==================================================
*/

const ADAPTER =

Object.freeze({

    component:

        "platform-memory-adapter",

    version:

        "3.1.0"

});

/*
==================================================
Runtime State

Infrastructure only.

==================================================
*/

const state = {

    translations: 0,

    batches: 0,

    commits: 0,

    rollbacks: 0,

    lastCommit: null

};

/*
==================================================
Utilities

==================================================
*/

function timestamp() {

    return (

        new Date()

    ).toISOString();

}

function isObject(

    value

) {

    return (

        value !== null &&

        typeof value ===

            "object"

    );

}

function deepFreeze(

    object,

    visited = new WeakSet()

) {

    if (

        !isObject(

            object

        )

    ) {

        return object;

    }

    if (

        visited.has(

            object

        )

    ) {

        return object;

    }

    visited.add(

        object

    );

    Object.freeze(

        object

    );

    for (

        const key

        of Object.keys(

            object

        )

    ) {

        deepFreeze(

            object[key],

            visited

        );

    }

    return object;

}

/*
==================================================
Campaign Commit Transaction

Campaign Identity

↓

Certified Platform Truth

↓

Submission

Certification

Artifact

Contracts

==================================================
*/

function isCommitTransaction(

    transaction

) {

    return (

        isObject(

            transaction

        )

        &&

        typeof

            transaction.campaignId

            ===

            "string"

        &&

        transaction.campaignId

            .length > 0

        &&

        isObject(

            transaction.submission

        )

        &&

        isObject(

            transaction.certification

        )

        &&

        isObject(

            transaction.artifact

        )

        &&

        isObject(

            transaction.contracts

        )

    );

}

function assertCommitTransaction(

    transaction

) {

    if (

        !isCommitTransaction(

            transaction

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Campaign Commit Transaction."

        );

    }

    return transaction;

}

/*
==================================================
Canonical Storage Paths

Only Platform Memory Adapter
understands storage paths.

==================================================
*/

function buildCampaignRoot(

    campaignId

) {

    return (

        `campaigns/${campaignId}`

    );

}

function buildResearchRoot(

    campaignId

) {

    return (

        `${buildCampaignRoot(

            campaignId

        )}/research`

    );

}

function buildContractsRoot(

    campaignId

) {

    return (

        `${buildCampaignRoot(

            campaignId

        )}/contracts`

    );

}

function buildAuditRoot(

    campaignId

) {

    return (

        `${buildCampaignRoot(

            campaignId

        )}/audits`

    );

}

function buildEventsRoot(

    campaignId

) {

    return (

        `${buildCampaignRoot(

            campaignId

        )}/events`

    );

}

/*
==================================================
Canonical Business Paths

==================================================
*/

function buildResearchArtifactPath(

    campaignId

) {

    return (

        `${buildResearchRoot(

            campaignId

        )}/artifact`

    );

}

function buildResearchHistoryPath(

    campaignId,

    artifactId

) {

    return (

        `${buildResearchRoot(

            campaignId

        )}/history/${artifactId}`

    );

}

function buildDepartmentContractPath(

    campaignId,

    department

) {

    return (

        `${buildContractsRoot(

            campaignId

        )}/${department}`

    );

}

/*
==================================================
Translation Request

Campaign Commit Transaction

↓

Translation Request

==================================================
*/

function createTranslationRequest(

    transaction

) {

    assertCommitTransaction(

        transaction

    );

    return deepFreeze({

        campaignId:

            transaction.campaignId,

        transaction,

        createdAt:

            timestamp()

    });

}

/*
==================================================
Part 2

Descriptor Builders

Campaign Commit Transaction

↓

Persistence Descriptors

==================================================
*/

/*
==================================================
Descriptor Builders

Campaign Commit Transaction

↓

Persistence Descriptors

Platform Memory never builds
business objects.

It only builds immutable
Persistence Descriptors.

==================================================
*/

function buildArtifactDescriptor(

    campaignId,

    artifact

) {

    return deepFreeze({

        operation:

            "SET",

        path:

            buildResearchArtifactPath(

                campaignId

            ),

        value:

            artifact

    });

}

function buildArtifactHistoryDescriptor(

    campaignId,

    artifact

) {

    return deepFreeze({

        operation:

            "SET",

        path:

            buildResearchHistoryPath(

                campaignId,

                artifact.artifactId

            ),

        value:

            artifact

    });

}

function buildDepartmentContractDescriptor(

    campaignId,

    department,

    contract

) {

    return deepFreeze({

        operation:

            "SET",

        path:

            buildDepartmentContractPath(

                campaignId,

                department

            ),

        value:

            contract

    });

}

/*
==================================================
Descriptor Translation

Campaign Commit Transaction

↓

Persistence Descriptors

==================================================
*/

function buildPersistenceDescriptors(

    request

) {

    const {

        campaignId,

        transaction

    } = request;

    const {

        artifact,

        contracts

    } = transaction;

    const descriptors = [];

    /*
    ----------------------------------
    Current Certified Research
    ----------------------------------
    */

    descriptors.push(

        buildArtifactDescriptor(

            campaignId,

            artifact

        )

    );

    /*
    ----------------------------------
    Immutable Research History
    ----------------------------------
    */

    descriptors.push(

        buildArtifactHistoryDescriptor(

            campaignId,

            artifact

        )

    );

    /*
    ----------------------------------
    Department Contracts

    Every department receives
    only its own bounded context.

    ----------------------------------
    */

    for (

        const [

            department,

            contract

        ]

        of Object.entries(

            contracts

        )

    ) {

        descriptors.push(

            buildDepartmentContractDescriptor(

                campaignId,

                department,

                contract

            )

        );

    }

    state.translations++;

    return deepFreeze(

        descriptors

    );

}

/*
==================================================
Persistence Batch

Campaign Commit Transaction

↓

Translation

↓

Persistence Batch

==================================================
*/

function createPersistenceBatch(

    transaction

) {

    const request =

        createTranslationRequest(

            transaction

        );

    const descriptors =

        buildPersistenceDescriptors(

            request

        );

    const batch =

        deepFreeze({

            id:

                RuntimeId.generateSessionId(),

            campaignId:

                request.campaignId,

            descriptors,

            descriptorCount:

                descriptors.length,

            createdAt:

                timestamp()

        });

    state.batches++;

    return batch;

}

/*
==================================================
Batch Summary

Operational diagnostics only.

==================================================
*/

function summarizeBatch(

    batch

) {

    return deepFreeze({

        batchId:

            batch.id,

        campaignId:

            batch.campaignId,

        descriptorCount:

            batch.descriptorCount,

        createdAt:

            batch.createdAt

    });

}

/*
==================================================
Part 3

Persistence Engine

↓

Commit Receipt

==================================================
*/

/*
==================================================
Persistence Engine

Persistence Batch

↓

Platform Memory

↓

Commit Receipt

==================================================
*/

async function executePersistenceBatch(

    batch

) {

    if (

        !batch ||

        !Array.isArray(

            batch.descriptors

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Persistence Batch."

        );

    }

    const committed = [];

    try {

        for (

            const descriptor

            of batch.descriptors

        ) {

            await kv.set(

                descriptor.path,

                descriptor.value

            );

            committed.push(

                descriptor.path

            );

        }

        state.commits++;

        state.lastCommit =

            batch.id;

        return deepFreeze({

            commitId:

                batch.id,

            campaignId:

                batch.campaignId,

            committed:

                committed.length,

            paths:

                committed,

            committedAt:

                timestamp()

        });

    }

    catch (

        error

    ) {

        /*
        ----------------------------------
        Best Effort Rollback

        Remove every successfully
        persisted descriptor.

        ----------------------------------
        */

        for (

            const path

            of committed

        ) {

            try {

                await kv.del(

                    path

                );

            }

            catch (_) {}

        }

        state.rollbacks++;

        throw error;

    }

}

/*
==================================================
Commit

Campaign Commit Transaction

↓

Persistence Batch

↓

Platform Memory

↓

Commit Receipt

==================================================
*/

async function commit(

    transaction

) {

    assertCommitTransaction(

        transaction

    );

    const batch =

        createPersistenceBatch(

            transaction

        );

    return executePersistenceBatch(

        batch

    );

}

/*
==================================================
Rollback

Rollback previously committed
Persistence Receipt.

==================================================
*/

async function rollback(

    receipt

) {

    if (

        !receipt ||

        !Array.isArray(

            receipt.paths

        )

    ) {

        throw new Errors.ValidationError(

            "Persistence Receipt is required."

        );

    }

    for (

        const path

        of receipt.paths

    ) {

        await kv.del(

            path

        );

    }

    state.rollbacks++;

    return deepFreeze({

        campaignId:

            receipt.campaignId,

        rolledBack:

            true,

        entries:

            receipt.paths.length,

        rolledBackAt:

            timestamp()

    });

}

/*
==================================================
Infrastructure Validation

Operational diagnostics only.

==================================================
*/

function validate() {

    return deepFreeze({

        adapter:

            ADAPTER.component,

        version:

            ADAPTER.version,

        valid:

            true,

        translations:

            state.translations,

        batches:

            state.batches,

        commits:

            state.commits,

        rollbacks:

            state.rollbacks,

        timestamp:

            timestamp()

    });

}

/*
==================================================
Platform Memory Adapter

Public Runtime

==================================================
*/

const PlatformMemoryAdapter =

Object.freeze({

    commit,

    rollback,

    validate,

    summarizeBatch

});

/*
==================================================
Module Export

==================================================
*/

module.exports =

    PlatformMemoryAdapter;