"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V3

Runtime Department

index.js

Public Runtime Department Interface

--------------------------------------------------

Responsibilities

- Accept executive commands
- Coordinate department execution
- Never execute business logic
- Never access Platform Memory directly
- Never bypass Department Managers
- Expose read-only Runtime observation

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

Observation Flow

Runtime Engine Evaluation

        │
        ▼

Runtime Observation

==================================================
*/

const manager =

    require(

        "./manager"

    );

const RuntimeEngine =

    require(

        "./runtime-engine"

    );

const Observation =

    require(

        "./observation"

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

    component:

        "department",

    version:

        "3.0.0"

});

/*
==================================================
Department Execution

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
Runtime Observation

Observation does not execute Departments.

It asks the Runtime Engine for current eligibility
truth and transforms that truth into a read-only
dashboard snapshot.

==================================================
*/

async function observe({

    campaignId

} = {}) {

    const evaluation =

        await RuntimeEngine.evaluate({

            campaignId

        });

    return Observation.build(

        evaluation

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

    execute,

    observe

});