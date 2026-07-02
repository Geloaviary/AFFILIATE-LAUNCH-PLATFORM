const AuditManager =
    require("./audit-manager");

const AuditArtifact =

    require(

        "./audit-artifact"

    );    

const PlatformMemoryAdapter =
    require("./platform-memory-adapter");

const Events =
    require("./events");

const RuntimeId =

require("../identity/runtime");

/*
========================================
AFFILIATE LAUNCH PLATFORM V3

QUALITY ASSURANCE DIRECTOR

Commit Manager

Constitutional Authority

Constitution

QA-001

Responsibilities

• Coordinate constitutional commits
• Create commit sessions
• Prepare transactions
• Commit Platform Truth
• Coordinate audit creation
• Coordinate audit persistence
• Coordinate event publication
• Return Commit Outcome

The Commit Manager never:

• Creates submissions
• Certifies submissions
• Writes directly to KV
• Creates audit history
• Publishes events directly

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
COMMIT POLICY

========================================
*/

function policy() {

    return (

        Config.commit ||

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
COMMIT CONTEXT

Infrastructure dependencies
are injected.

No direct imports of:

• Audit Manager
• Platform Memory Adapter
• Events

========================================
*/

function createCommitContext({

    platformMemory,

    audit,

    events

} = {}) {

    if (

        !platformMemory

    ) {

        throw new Errors.ServiceError(

            "Platform Memory Adapter is required."

        );

    }

    if (

        !audit

    ) {

        throw new Errors.ServiceError(

            "Audit Manager is required."

        );

    }

    if (

        !events

    ) {

        throw new Errors.ServiceError(

            "Event Bus is required."

        );

    }

    return Object.freeze({

        platformMemory,

        audit,

        events,

        createdAt:

            timestamp()

    });

}

/*
========================================
COMMIT STATE

Operational domain state only.

========================================
*/

const state = {

    sessions:

        new Map(),

    sessionStates:

        new Map(),

    transactions:

        new Map(),

    transactionStates:

        new Map(),

    pending:

        new Set(),

    counters: {

        commits: 0,

        failures: 0,

        rollbacks: 0

    },

    lastCommit:

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

function increment(

    counter

) {

    if (

        Object.prototype.hasOwnProperty.call(

            state.counters,

            counter

        )

    ) {

        state.counters[

            counter

        ]++;

    }

}

function rememberCommit(

    outcome

) {

    state.lastCommit =

        outcome.commitId;

}

/*
========================================
CREATE COMMIT INTENT

Creates the immutable
constitutional request for
a commit transaction.

========================================
*/

function createCommitIntent({

    submission,

    certification,

    artifact

}) {

    if (

        !submission

    ) {

        throw new Errors.ValidationError(

            "Submission is required."

        );

    }

    if (

        !certification ||

        certification.certified !== true

    ) {

        throw new Errors.ValidationError(

            "A certified Certification is required."

        );

    }

    if (

    !artifact

) {

    throw new Errors.ValidationError(

        "Artifact is required."

    );

}

    return Object.freeze({

        id:

            submission.id,

        submission,

        certification,

        artifact,

        createdAt:

            timestamp()

    });

}

/*
========================================
CREATE COMMIT SESSION

Execution state only.

========================================
*/

function createCommitSession(

    intent

) {

    const session =

        Object.freeze({

            id:

                RuntimeId.generateCommitId(),

            intent,

            createdAt:

                timestamp()

        });

    state.sessions.set(

        session.id,

        session

    );

    state.sessionStates.set(

        session.id,

        "created"

    );

    console.log("[CREATE SESSION]", {
    hasIntent: !!intent,
    intent
});

    return session;

}

/*
========================================
PREPARE TRANSACTION

Creates the immutable
transaction from the
commit session.

========================================
*/

function prepareTransaction(

    session

) {

    const transaction = Object.freeze({

    id:
        RuntimeId.generateTransactionId(),

    sessionId:
        session.id,

    submission:
        session.intent.submission,

    certification:
        session.intent.certification,

    artifact:
        session.intent.artifact,

    preparedAt:
        timestamp()

});

    state.transactions.set(

        transaction.id,

        transaction

    );

    state.transactionStates.set(

        transaction.id,

        "prepared"

    );

    state.pending.add(

        transaction.id

    );

    return transaction;

}

/*
========================================
VERIFY TRANSACTION

========================================
*/

function verifyTransaction(

    transaction

) {

    if (

        !transaction

    ) {

        throw new Errors.ValidationError(

            "Commit Transaction is required."

        );

    }

    if (

        !transaction.submission

    ) {

        throw new Errors.ValidationError(

            "Submission missing."

        );

    }

    if (

        !transaction.certification

    ) {

        throw new Errors.ValidationError(

            "Certification missing."

        );

    }

    return transaction;

}

/*
========================================
EXECUTE COMMIT

Coordinates the constitutional
commit transaction.

No persistence is performed
directly by this manager.

========================================
*/

async function executeCommit(

    context,

    transaction

) {

    verifyTransaction(

        transaction

    );

    state.transactionStates.set(

        transaction.id,

        Constants.TRANSACTION_STATE.PERSISTING

    );

    /*
    ----------------------------
    Persist Platform Truth

    ----------------------------
    */

    const commitReceipt =

        await context

            .platformMemory

            .commit(

                transaction

            );

    state.transactionStates.set(

        transaction.id,

        Constants.TRANSACTION_STATE.PERSISTED

    );

    return commitReceipt;

}

/*
========================================
COORDINATE COMMIT

Constitutional pipeline.

Certification

↓

Commit Intent

↓

Session

↓

Transaction

↓

Platform Memory

========================================
*/

async function coordinateCommit(

    context,

    {

        submission,

        validation,

        artifact

    }

) {

    console.log({

    submission: !!submission,

    validation: !!validation,

    artifact: !!artifact

});

    const intent =

        createCommitIntent({

            submission,

            certification:

             validation,

            artifact

        });

    console.log("[INTENT]", intent);    

    const session =

        createCommitSession(

            intent

        );

    console.log("[COMMIT SESSION]", {
    hasSession: !!session,
    hasIntent: !!session?.intent,
    session
    });    

    const transaction =

        prepareTransaction(

            session

        );

    const receipt =

        await executeCommit(

            context,

            transaction

        );

    state.sessionStates.set(

        session.id,

        Constants.COMMIT_SESSION_STATE.COMMITTED

    );

    return receipt;

}

/*
========================================
CREATE AUDIT RECORD

Creates an immutable audit
record from the successful
Persistence Receipt.

========================================
*/

async function createCommitAudit(

    context,

    receipt

) {

    return context

        .audit

        .createAuditRecord(

            receipt

        );

}

/*
========================================
PERSIST AUDIT RECORD

The Commit Manager remains the
only constitutional gateway to
Platform Memory.

========================================
*/

async function persistAuditRecord(

    context,

    auditRecord

) {

    const artifact =

        AuditArtifact

            .buildAuditArtifact(

                auditRecord

            );

    return context

        .platformMemory

        .commit({

            artifact

        });

}

/*
========================================
PUBLISH COMMIT EVENT

Events are published only after
Platform Truth and Audit History
have been successfully persisted.

========================================
*/

async function publishCommitEvent(

    context,

    auditRecord

) {

    return context

        .events

        .publish({

            type:

                Constants.EVENT.COMMIT_COMPLETED,

            auditId:

                auditRecord.auditId,

            timestamp:

                timestamp()

        });

}

/*
========================================
CREATE COMMIT OUTCOME

Converts the Persistence Receipt
into the constitutional result of
a completed Platform Truth commit.

========================================
*/

function createCommitOutcome(

    receipt

) {

    return Object.freeze({

        commitId:

            receipt.commitId,

        submissionId:

            receipt.submissionId,

        certificationId:

            receipt.certificationId,

        committed:

            true,

        committedAt:

            receipt.committedAt

    });

}

/*
========================================
COMPLETE CONSTITUTIONAL COMMIT

Platform Truth

↓

Commit Outcome

↓

Audit Record

↓

Persist Audit

↓

Publish Event

========================================
*/

async function completeCommit(

    context,

    receipt

) {

    const outcome =

        createCommitOutcome(

            receipt

        );

    const auditRecord =
    await createCommitAudit(
        context,
        outcome
    );

await persistAuditRecord(
    context,
    auditRecord
);

await publishCommitEvent(
    context,
    auditRecord
);

increment(
    "commits"
);

rememberCommit(
    outcome
);

return Object.freeze({

    ...outcome,

    auditId:
        auditRecord.auditId,

    audited:
        true,

    eventsPublished:
        true

});

}

/*
========================================
CREATE COMMIT RESULT

Final constitutional artifact
returned by Commit Manager.

========================================
*/

function createCommitResult(

    outcome

) {

    return Object.freeze({

        successful:

            true,

        outcome,

        completedAt:

            timestamp(),

        version:

            "QA-001"

    });

}

const commitContext =

    createCommitContext({

        platformMemory:

            PlatformMemoryAdapter,

        audit:

            AuditManager,

        events:

            Events

    });

/*
========================================
PROCESS CERTIFICATION

Public constitutional entry
point.

Submission

↓

Certification

↓

Commit Transaction

↓

Commit Result

========================================
*/

async function commit({

    submission,

    validation,

    artifact

}) {

    const receipt =

        await coordinateCommit(

            commitContext,

            {

                submission,

                validation,

                artifact

            }

        );

    const outcome =
    await completeCommit(
        commitContext,
        receipt
    );

const submissionOutcome = Object.freeze({

    artifactId:

        artifact.artifactId,

    department:

        artifact.department,

    artifactType:

        artifact.artifactType,

    status:

        "committed",

    certified:

        true,

    committed:

        true,

    commit:

        outcome,

    audit:

        Object.freeze({

            auditId:

                outcome.auditId,

            audited:

                true

        })

});

console.log(

    "[COMMIT RETURN]",

    submissionOutcome

);

return submissionOutcome;

}

/*
========================================
COMMIT MANAGER

QA-001

Constitutional Authority

========================================
*/

const CommitManager =

    Object.freeze({

        commit

    });

/*
========================================
MODULE EXPORT

========================================
*/

module.exports =

    CommitManager;