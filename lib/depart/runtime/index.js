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

â€¢ Accept executive commands
â€¢ Coordinate department execution
â€¢ Never execute business logic
â€¢ Never access Platform Memory directly
â€¢ Never bypass Department Managers

Department Flow

Executive Command

        â”‚
        â–¼

Runtime Manager

        â”‚
        â–¼

Runtime Engine

        â”‚
        â–¼

Dispatcher

        â”‚
        â–¼

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

        â”‚

        â–¼

Runtime Manager

==================================================
*/

async function execute(

    request

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