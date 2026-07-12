"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

execution-ledger.js

Constitutional Rule RTL-001

Execution Ledger

Execution Context

        │
        ▼

Execution Fingerprint

        │
        ▼

Execution State

        │
        ▼

Runtime Eligibility

--------------------------------------------------

Constitutional Responsibility

The Execution Ledger is the sole
Runtime authority responsible for tracking
department execution state against deterministic
execution fingerprints.

The Execution Ledger NEVER

• Reads certified Platform Memory contracts
• Determines contract availability
• Executes departments
• Performs department business logic
• Certifies Department Output
• Commits Department Output

The Execution Ledger ONLY

• Builds deterministic execution fingerprints
• Reads execution state
• Determines execution-state eligibility
• Reserves department executions
• Marks executions completed
• Marks executions failed

==================================================
*/

const crypto =

    require(

        "crypto"

    );

const { kv } =

    require(

        "@vercel/kv"

    );

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

/*
==================================================
Ledger Identity

==================================================
*/

const LEDGER =

Object.freeze({

    department:

        "runtime",

    component:

        "execution-ledger",

    version:

        "1.0.0"

});

/*
==================================================
Execution States

==================================================
*/

const STATUS =

Object.freeze({

    RUNNING:

        "running",

    COMPLETED:

        "completed",

    FAILED:

        "failed"

});

/*
==================================================
Internal Utilities

==================================================
*/

function isObject(

    value

) {

    return (

        value !== null &&

        typeof value ===

            "object" &&

        !Array.isArray(

            value

        )

    );

}

function deepFreeze(

    target,

    visited = new WeakSet()

) {

    if (

        target === null ||

        typeof target !==

            "object"

    ) {

        return target;

    }

    if (

        visited.has(

            target

        )

    ) {

        return target;

    }

    visited.add(

        target

    );

    Object.freeze(

        target

    );

    for (

        const key of Object.keys(

            target

        )

    ) {

        deepFreeze(

            target[key],

            visited

        );

    }

    return target;

}

/*
==================================================
Canonicalize Value

Deterministic object ordering is required
before execution fingerprint hashing.

==================================================
*/

function canonicalize(

    value

) {

    if (

        Array.isArray(

            value

        )

    ) {

        return value.map(

            item =>

                canonicalize(

                    item

                )

        );

    }

    if (

        isObject(

            value

        )

    ) {

        const normalized = {};

        const keys =

            Object.keys(

                value

            )

                .sort();

        for (

            const key of keys

        ) {

            normalized[key] =

                canonicalize(

                    value[key]

                );

        }

        return normalized;

    }

    return value;

}

/*
==================================================
Validate Execution Identity

==================================================
*/

function validateExecutionIdentity({

    campaignId,

    department

}) {

    if (

        !campaignId

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    if (

        typeof department !== "string" ||

        department.length === 0

    ) {

        throw new Errors.ValidationError(

            "Department identity is required."

        );

    }

}

/*
==================================================
Build Execution Fingerprint

Campaign

        │

        ▼

Department

        │

        ▼

Approved Contract Context

        │

        ▼

Deterministic Fingerprint

==================================================
*/

function buildFingerprint({

    campaignId,

    department,

    contracts = {}

}) {

    validateExecutionIdentity({

        campaignId,

        department

    });

    if (

        !isObject(

            contracts

        )

    ) {

        throw new Errors.ValidationError(

            "Execution contracts must be an object."

        );

    }

    const payload =

        canonicalize({

            campaignId,

            department,

            contracts

        });

    const serialized =

        JSON.stringify(

            payload

        );

    return crypto

        .createHash(

            "sha256"

        )

        .update(

            serialized

        )

        .digest(

            "hex"

        );

}

/*
==================================================
Build Ledger Path

==================================================
*/

function buildLedgerPath({

    campaignId,

    department,

    fingerprint

}) {

    validateExecutionIdentity({

        campaignId,

        department

    });

    if (

        typeof fingerprint !== "string" ||

        fingerprint.length === 0

    ) {

        throw new Errors.ValidationError(

            "Execution fingerprint is required."

        );

    }

    return (

        `runtime:${campaignId}:executions:${department}:${fingerprint}`

    );

}

/*
==================================================
Load Execution State

==================================================
*/

async function load({

    campaignId,

    department,

    fingerprint

}) {

    const path =

        buildLedgerPath({

            campaignId,

            department,

            fingerprint

        });

    const state =

        await kv.get(

            path

        );

    return deepFreeze(

        state ||

        null

    );

}

/*
==================================================
Determine Execution Eligibility

No Record

        │
        ▼

Executable

Running / Completed

        │
        ▼

Not Executable

Failed

        │
        ▼

Executable Retry

==================================================
*/

async function canExecute({

    campaignId,

    department,

    fingerprint

}) {

    const state =

        await load({

            campaignId,

            department,

            fingerprint

        });

    if (

        !state

    ) {

        return true;

    }

    if (

        state.status ===

        STATUS.FAILED

    ) {

        return true;

    }

    return false;

}

/*
==================================================
Reserve Execution

Execution reservation occurs before
department dispatch.

==================================================
*/

async function reserve({

    campaignId,

    department,

    fingerprint

}) {

    const path =

        buildLedgerPath({

            campaignId,

            department,

            fingerprint

        });

    const now =

        new Date()

            .toISOString();

    const script = `

        local current = redis.call(

            "GET",

            KEYS[1]

        )

        local attempt = 1

        if current then

            local decoded = cjson.decode(

                current

            )

            if decoded.status ~= "failed" then

                return nil

            end

            attempt = (

                tonumber(

                    decoded.attempt

                ) or 0

            ) + 1

        end

        local state = {

            campaignId = ARGV[1],

            department = ARGV[2],

            fingerprint = ARGV[3],

            status = "running",

            attempt = attempt,

            startedAt = ARGV[4],

            completedAt = cjson.null,

            failedAt = cjson.null,

            error = cjson.null

        }

        local encoded =

            cjson.encode(

                state

            )

        redis.call(

            "SET",

            KEYS[1],

            encoded

        )

        return encoded

    `;

    const reserved =

        await kv.eval(

            script,

            [

                path

            ],

            [

                campaignId,

                department,

                fingerprint,

                now

            ]

        );

    if (

        !reserved

    ) {

        throw new Errors.ValidationError(

            `Execution is not eligible: ${department}`

        );

    }

    const state =

        typeof reserved === "string"

            ? JSON.parse(

                reserved

            )

            : reserved;

    return deepFreeze(

        state

    );

}

/*
==================================================
Complete Execution

==================================================
*/

async function complete({

    campaignId,

    department,

    fingerprint

}) {

    const path =

        buildLedgerPath({

            campaignId,

            department,

            fingerprint

        });

    const current =

        await kv.get(

            path

        );

    if (

        !current ||

        current.status !==

            STATUS.RUNNING

    ) {

        throw new Errors.ValidationError(

            `Execution is not running: ${department}`

        );

    }

    const state =

        deepFreeze({

            ...current,

            status:

                STATUS.COMPLETED,

            completedAt:

                new Date()

                    .toISOString(),

            failedAt:

                null,

            error:

                null

        });

    await kv.set(

        path,

        state

    );

    return state;

}

/*
==================================================
Fail Execution

==================================================
*/

async function fail({

    campaignId,

    department,

    fingerprint,

    error

}) {

    const path =

        buildLedgerPath({

            campaignId,

            department,

            fingerprint

        });

    const current =

        await kv.get(

            path

        );

    if (

        !current ||

        current.status !==

            STATUS.RUNNING

    ) {

        throw new Errors.ValidationError(

            `Execution is not running: ${department}`

        );

    }

    const failure =

        deepFreeze({

            name:

                error &&

                typeof error.name === "string"

                    ? error.name

                    : "Error",

            message:

                error &&

                typeof error.message === "string"

                    ? error.message

                    : "Department execution failed."

        });

    const state =

        deepFreeze({

            ...current,

            status:

                STATUS.FAILED,

            completedAt:

                null,

            failedAt:

                new Date()

                    .toISOString(),

            error:

                failure

        });

    await kv.set(

        path,

        state

    );

    return state;

}

/*
==================================================
Public Execution Ledger

==================================================
*/

module.exports =

Object.freeze({

    identity:

        LEDGER,

    status:

        STATUS,

    buildFingerprint,

    load,

    canExecute,

    reserve,

    complete,

    fail

});