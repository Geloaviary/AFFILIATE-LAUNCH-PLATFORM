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

        "4.0.0"

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

function buildDepartmentsRoot(

    campaignId

) {

    return (

        `${buildCampaignRoot(

            campaignId

        )}/departments`

    );

}

function buildDepartmentRoot(

    campaignId,

    department

) {

    return (

        `${buildDepartmentsRoot(

            campaignId

        )}/${department}`

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

function buildDepartmentArtifactPath(

    campaignId,

    department

) {

    return (

        `${buildDepartmentRoot(

            campaignId,

            department

        )}/artifact`

    );

}

function buildDepartmentHistoryPath(

    campaignId,

    department,

    artifactId

) {

    return (

        `${buildDepartmentRoot(

            campaignId,

            department

        )}/history/${artifactId}`

    );

}

function buildContractPath(

    campaignId,

    contractName

) {

    return (

        `${buildContractsRoot(

            campaignId

        )}/${contractName}`

    );

}

function buildContractIndexPath(

    campaignId

) {

    return (

        `${buildContractsRoot(

            campaignId

        )}/index`

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

    department,

    artifact

) {

    return deepFreeze({

        operation:

            "SET",

        path:

            buildDepartmentArtifactPath(

                campaignId,

                department

            ),

        value:

            artifact

    });

}

function buildArtifactHistoryDescriptor(

    campaignId,

    department,

    artifact

) {

    return deepFreeze({

        operation:

            "SET",

        path:

            buildDepartmentHistoryPath(

                campaignId,

                department,

                artifact.artifactId

            ),

        value:

            artifact

    });

}

function buildContractDescriptor(

    campaignId,

    contractName,

    contract

) {

    return deepFreeze({

        operation:

            "SET",

        path:

            buildContractPath(

                campaignId,

                contractName

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

    submission,

    artifact,

    contracts

} = transaction;

const department =

    submission.department;

if (

    typeof department !== "string" ||

    department.length === 0

) {

    throw new Errors.ValidationError(

        "Submission department is required."

    );

}

    const descriptors = [];

    /*
    ----------------------------------
    Current Certified Department Artifact
    ----------------------------------
    */

    descriptors.push(

    buildArtifactDescriptor(

        campaignId,

        department,

        artifact

    )

);

    /*
    ----------------------------------
    Immutable Department Artifact History
    ----------------------------------
    */

    descriptors.push(

    buildArtifactHistoryDescriptor(

        campaignId,

        department,

        artifact

    )

);

    /*
    ----------------------------------
    Certified Contract Catalog

    Certified contracts become
    Campaign Platform Memory.

    Contracts may be consumed by
    any department whose declared
    requirements reference them.

    */

    for (

        const [

            contractName,

            contract

        ]

        of Object.entries(

            contracts

        )

    ) {

        descriptors.push(

             buildContractDescriptor(

               campaignId,

               contractName,

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

    const previousValues = {};

    const contractIndexPath =

        buildContractIndexPath(

            batch.campaignId

        );

    const previousContractIndex =

        await kv.get(

            contractIndexPath

        ) || [];

    try {

        /*
        ----------------------------------
        Capture Previous State

        Required for constitutional
        rollback restoration.

        ----------------------------------
        */

        for (

            const descriptor

            of batch.descriptors

        ) {

            previousValues[

                descriptor.path

            ] =

                await kv.get(

                    descriptor.path

                );

        }

        /*
        ----------------------------------
        Persist Descriptors
        ----------------------------------
        */

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

        /*
        ----------------------------------
        Update Contract Index
        ----------------------------------
        */

        const updated =

            new Set(

                previousContractIndex

            );

        const contractsRoot =

            buildContractsRoot(

                batch.campaignId

            );

        for (

            const descriptor

            of batch.descriptors

        ) {

            if (

                descriptor.path.startsWith(

                    contractsRoot + "/"

                )

            ) {

                const contractName =

                    descriptor.path.substring(

                        contractsRoot.length + 1

                    );

                if (

                    contractName !== "index"

                ) {

                    updated.add(

                        contractName

                    );

                }

            }

        }

        await kv.set(

            contractIndexPath,

            [...updated]

        );

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

            rollbackSnapshot:

                {

                    previousValues,

                    previousContractIndex

                },

            committedAt:

                timestamp()

        });

    }

    catch (

        error

    ) {

        /*
        ----------------------------------
        Failed Commit Restoration

        Restore every value modified
        before the failure occurred.

        ----------------------------------
        */

        for (

            const path

            of committed

        ) {

            try {

                const previousValue =

                    previousValues[

                        path

                    ];

                if (

                    previousValue === null ||

                    previousValue === undefined

                ) {

                    await kv.del(

                        path

                    );

                }

                else {

                    await kv.set(

                        path,

                        previousValue

                    );

                }

            }

            catch (_) {}

        }

        /*
        ----------------------------------
        Restore Contract Index
        ----------------------------------
        */

        try {

            await kv.set(

                contractIndexPath,

                previousContractIndex

            );

        }

        catch (_) {}

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

        ) ||

        !isObject(

            receipt.rollbackSnapshot

        )

    ) {

        throw new Errors.ValidationError(

            "Persistence Receipt with rollback snapshot is required."

        );

    }

    const {

        previousValues,

        previousContractIndex

    } = receipt.rollbackSnapshot;

    /*
    ----------------------------------
    Restore Previous Values
    ----------------------------------
    */

    for (

        const path

        of receipt.paths

    ) {

        const previousValue =

            previousValues[

                path

            ];

        if (

            previousValue === null ||

            previousValue === undefined

        ) {

            await kv.del(

                path

            );

        }

        else {

            await kv.set(

                path,

                previousValue

            );

        }

    }

    /*
    ----------------------------------
    Restore Previous Contract Index
    ----------------------------------
    */

    await kv.set(

        buildContractIndexPath(

            receipt.campaignId

        ),

        previousContractIndex

    );

    state.rollbacks++;

    return deepFreeze({

        campaignId:

            receipt.campaignId,

        rolledBack:

            true,

        restored:

            receipt.paths.length,

        contractIndexRestored:

            true,

        rolledBackAt:

            timestamp()

    });

}

/*
==================================================
Read Runtime

Campaign Contract

↓

Platform Memory

↓

Certified Contract

==================================================
*/

async function loadContract({

    campaignId,

    contract

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    if (

    !contract

) {

    throw new Errors.ValidationError(

        "Contract is required."

    );

}

    return kv.get(

       buildContractPath(

           campaignId,

            contract

        )

    );

}

async function loadContracts({

    campaignId

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

        const index =

           await kv.get(

        buildContractIndexPath(

            campaignId

        )

    ) || [];

    const contracts = {};

    for (

    const contractName of index

) {

    contracts[

        contractName

    ] =

        await kv.get(

            buildContractPath(

                campaignId,

                contractName

            )

        );

}

    return deepFreeze(

        contracts

    );

}

async function hasContracts({

    campaignId,

    contracts = []

}) {

    const available =

        await loadContracts({

            campaignId

        });

    return contracts.every(

        contract =>

            contract in available

    );

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

    /*
    -------------------------
    Write Runtime
    -------------------------
    */

    commit,

    rollback,

    /*
    -------------------------
    Read Runtime
    -------------------------
    */

    loadContracts,

     loadContract,

    hasContracts,

    /*
    -------------------------
    Diagnostics
    -------------------------
    */

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