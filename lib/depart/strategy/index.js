"use strict";

/*
==================================================

AFFILIATE LAUNCH PLATFORM V4

Strategy Department

index.js

Constitutional Public Interface

Department Identity

        |
        v

Contract Requirements + Publications

        |
        v

Runtime Registration

        |
        v

Eligibility Decision

        |
        v

Department Execution

--------------------------------------------------

Constitutional Responsibility

This file is the public constitutional facade
of the Strategy Department.

The public facade must be safe to inspect without
activating Department runtime dependencies.

It declares

- Department identity
- Required contract capabilities
- Published contract capabilities
- Runtime eligibility configuration
- Department execution authority

It NEVER declares

- Producer departments
- Consumer departments
- Department topology
- Cross-department routing
- Platform Memory queries

It NEVER eagerly activates

- Department Manager
- Department Input
- Department workers
- Runtime adapters

Runtime implementation is loaded only when
execute() is invoked.

==================================================
*/

const Requires =

    require(

        "./contracts/requires"

    );

const Publishes =

    require(

        "./contracts/publishes"

    );

/*
==================================================
Department Identity

==================================================
*/

const IDENTITY =

Object.freeze({

    department:

        "strategy",

    name:

        "Strategy Department",

    version:

        "1.0.0"

});

/*
==================================================
Runtime Registration

Contract capability declarations are owned by

contracts/requires.js
contracts/publishes.js

The public facade exposes those declarations to
the Runtime Department without activating the
Strategy execution graph.

==================================================
*/

const REGISTRATION =

Object.freeze({

    requires:

        Requires.requires,

    publishes:

        Publishes.publishes,

    enabled:

        true,

    autoStart:

        true,

    concurrency:

        1

});

/*
==================================================
Department Runtime

Runtime implementation is intentionally loaded
inside execute().

Public facade inspection must never activate the
Department execution graph.

==================================================
*/

async function execute(

    options = {}

) {

    const Manager =

        require(

            "./manager"

        );

    return Manager.execute(

        options

    );

}

/*
==================================================
Public Constitutional Interface

==================================================
*/

module.exports =

Object.freeze({

    identity:

        IDENTITY,

    registration:

        REGISTRATION,

    execute

});