"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V3

Runtime Department

runtime-engine.js

Runtime Eligibility Authority

--------------------------------------------------

Constitutional Responsibility

The Runtime Engine is the sole authority for
determining Department execution eligibility.

The Runtime Engine evaluates every registered
Department against its declared Runtime contract.

A registered Department SHALL NOT disappear
because required contracts are unavailable.

Missing required contracts produce WAITING.

The Runtime Engine NEVER

- Executes Departments
- Dispatches work
- Writes Platform Memory
- Repairs contracts
- Creates business contracts
- Changes Department declarations
- Hides waiting Departments

The Runtime Engine ONLY

- Reads Runtime Registry registrations
- Resolves required contract availability
- Determines Department Runtime status
- Builds READY-only execution plans
- Reports complete eligibility truth

==================================================
*/

const Events =

    require(

        "../../quality-assurance-director/events"

    );

const Registry =

    require(

        "./registry"

    );

const Contracts =

    require(

        "./contracts"

    );

const Dispatcher =

    require(

        "./dispatcher"

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

const ENGINE =

Object.freeze({

    department:

        "runtime",

    component:

        "runtime-engine",

    version:

        "3.0.0"

});

/*
==================================================
Runtime Status

==================================================
*/

const STATUS =

Object.freeze({

    READY:

        "ready",

    WAITING:

        "waiting",

    DISABLED:

        "disabled"

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
            "object"

    );

}

function deepFreeze(

    target,

    visited = new WeakSet()

) {

    if (

        !isObject(

            target

        )

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

function validateCampaignId(

    campaignId

) {

    if (

        typeof campaignId !==
            "string" ||

        campaignId.trim().length ===
            0

    ) {

        throw new Errors.ValidationError(

            "Campaign ID is required."

        );

    }

    return campaignId.trim();

}

function normalizeRequiredContracts(

    requiredContracts

) {

    if (

        requiredContracts ===
            undefined

    ) {

        return [];

    }

    if (

        !Array.isArray(

            requiredContracts

        )

    ) {

        throw new Errors.ValidationError(

            "Department required contracts must be an array."

        );

    }

    return requiredContracts;

}

/*
==================================================
Missing Contract Resolution

Required Contracts

        │
        ▼

Available Contracts

        │
        ▼

Missing Contract Identities

==================================================
*/

function resolveMissingContracts({

    requiredContracts,

    availableContracts

}) {

    return requiredContracts.filter(

        contractName =>

            !Object.prototype
                .hasOwnProperty.call(

                    availableContracts,

                    contractName

                )

    );

}

/*
==================================================
Department Eligibility Evaluation

Registration

        +

Platform Memory Contract Catalog

        │
        ▼

READY | WAITING | DISABLED

==================================================
*/

async function evaluateDepartment({

    campaignId,

    registration,

    availableContracts

}) {

    if (

        !isObject(

            registration

        )

    ) {

        throw new Errors.ValidationError(

            "Runtime registration is invalid."

        );

    }

    const requiredContracts =

        normalizeRequiredContracts(

            registration.requires

        );

    if (

        registration.enabled ===
            false

    ) {

        return deepFreeze({

            campaignId,

            department:

                registration.department,

            status:

                STATUS.DISABLED,

            ready:

                false,

            requiredContracts:

                [...requiredContracts],

            missingContracts:

                [],

            contracts:

                {},

            reason:

                "Department is disabled."

        });

    }

    const missingContracts =

        resolveMissingContracts({

            requiredContracts,

            availableContracts

        });

    if (

        missingContracts.length >
            0

    ) {

        return deepFreeze({

            campaignId,

            department:

                registration.department,

            status:

                STATUS.WAITING,

            ready:

                false,

            requiredContracts:

                [...requiredContracts],

            missingContracts:

                [...missingContracts],

            contracts:

                {},

            reason:

                "Required certified contracts are not yet available."

        });

    }

    const contracts =

        await Contracts.loadRequired({

            campaignId,

            requiredContracts

        });

    return deepFreeze({

        campaignId,

        department:

            registration.department,

        status:

            STATUS.READY,

        ready:

            true,

        requiredContracts:

            [...requiredContracts],

        missingContracts:

            [],

        contracts,

        reason:

            null

    });

}

/*
==================================================
Runtime Evaluation

Every registered Department is evaluated.

No Department disappears because it is waiting.

==================================================
*/

async function evaluate({

    campaignId

}) {

    campaignId =

        validateCampaignId(

            campaignId

        );

    const registrations =

        Registry.list();

    const availableContracts =

        await Contracts.loadAvailable({

            campaignId

        });

    const departments = [];

    for (

        const registration of registrations

    ) {

        departments.push(

            await evaluateDepartment({

                campaignId,

                registration,

                availableContracts

            })

        );

    }

    return deepFreeze({

        runtime:

            ENGINE,

        campaignId,

        departments,

        totalDepartments:

            departments.length,

        readyDepartments:

            departments.filter(

                department =>

                    department.status ===
                        STATUS.READY

            ).length,

        waitingDepartments:

            departments.filter(

                department =>

                    department.status ===
                        STATUS.WAITING

            ).length,

        disabledDepartments:

            departments.filter(

                department =>

                    department.status ===
                        STATUS.DISABLED

            ).length,

        evaluatedAt:

            new Date()
                .toISOString()

    });

}

async function observe({

    campaignId

}) {

    const observation =

        await evaluate({

            campaignId

        });

    await Dispatcher.dispatch(

         observation.departments

    );

    return observation;

}



/*
==================================================
Runtime Engine

Evaluation

        │
        ├──────────────► Runtime Observation Truth
        │
        ▼

READY Departments

        │
        ▼

Execution Plan

==================================================
*/

async function execute({

    input

}) {

    if (

        !input ||

        !input.campaignId

    ) {

        throw new Errors.ValidationError(

            "Runtime Input is invalid."

        );

    }

    const evaluation =

        await evaluate({

            campaignId:

                input.campaignId

        });

    return deepFreeze({

        runtime:

            ENGINE,

        campaignId:

            input.campaignId,

        command:

            input.command,

        observation:

            evaluation,

        observedAt:

            new Date()

                .toISOString()

    });

}

let initialized = false;

function initialize() {

    if (

        initialized

    ) {

        return;

    }

    initialized = true;

    Events.subscribeRuntime(

        RuntimeEngine

    );

}

/*
==================================================
Public Runtime Engine

==================================================
*/

const RuntimeEngine =

Object.freeze({

    identity:

        ENGINE,

    status:

        STATUS,

    initialize,

    evaluate,

    observe,

    execute

});

module.exports =

    RuntimeEngine;