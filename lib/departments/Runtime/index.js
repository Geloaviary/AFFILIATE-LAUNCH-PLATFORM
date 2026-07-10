"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Runtime Department

index.js

Constitutional Rule RT-001

The Runtime Department is the Executive Office
of the Autonomous Business Operating System.

Responsibilities

• Accept executive commands
• Coordinate department execution
• Never execute business logic
• Never access Platform Memory directly
• Never bypass Department Managers

Department Flow

Executive Command

        │
        ▼

Runtime Manager

        │
        ▼

Runtime Engine

        │
        ▼

Dispatcher

        │
        ▼

Department Manager

==================================================
*/

const manager =

    require(

        "./manager"

    );

/*
==================================================
Department Identity

==================================================
*/

const identity =

Object.freeze({

    department:

        "runtime",

    name:

        "Runtime Department",

    version:

        "1.0.0",

    constitutionalRule:

        "RT-001"

});

/*
==================================================
Public Runtime

Executive Command

        │

        ▼

Runtime Manager

==================================================
*/

async function execute(

    request = {}

) {

    return manager.execute(

        request

    );

}

/*
==================================================
Public Department Interface

==================================================
*/

module.exports =

Object.freeze({

    identity,

    execute

});