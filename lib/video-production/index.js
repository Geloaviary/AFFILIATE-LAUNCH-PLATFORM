"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Production Department

index.js

Constitutional Public Interface

Platform
        │
        ▼
Production Department
        │
        ▼
execute()

--------------------------------------------------

Constitutional Responsibility

This file is the ONLY public interface of the
Production Department.

It exposes the department identity and the
constitutional execution entry point.

All internal implementation details remain
private to the department.

==================================================
*/

const Manager =

    require(

        "./manager"

    );

/*
==================================================
Department Identity

Provides immutable runtime information for
department discovery, diagnostics and future
registry integration.

==================================================
*/

const IDENTITY =

Object.freeze({

    department:

        "production",

    name:

        "Production Department",

    version:

        1,

    runtimeVersion:

        "1.0.0"

});

/*
==================================================
Department Runtime

Constitutional public execution entry point.

Platform
        │
        ▼
Production.execute()
        │
        ▼
manager.js

==================================================
*/

async function execute(

    options = {}

) {

    return Manager.execute(

        options

    );

}

/*
==================================================
Public Interface

==================================================
*/

module.exports =

Object.freeze({

    identity:

        IDENTITY,

    execute

});