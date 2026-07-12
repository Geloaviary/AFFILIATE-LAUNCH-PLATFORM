"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/contracts/

content-calendar.js

Constitutional Rule STP-024

Content Calendar Result

        │
        ▼

Content Calendar Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Content Calendar
Contract from the Content Calendar worker.

This worker NEVER

• Executes planner workers
• Changes the content calendar
• Generates strategy
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Content Calendar Contract for the
Strategy Workspace.

==================================================
*/

const CONTRACT =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.contracts.content-calendar",

    version:

        "1.0.0"

});

/*
==================================================
Utilities
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

/*
==================================================
Verification
==================================================
*/

function assertContentCalendar(

    contentCalendar

) {

    if (

        !isObject(

            contentCalendar

        )

    ) {

        throw new Error(

            "Content Calendar is required."

        );

    }

}

/*
==================================================
Content Calendar Contract
==================================================
*/

function buildContract(

    contentCalendar

) {

    return deepFreeze({

        runtime:

            CONTRACT,

        contract:

            "contentCalendar",

        payload:

            structuredClone(

                contentCalendar

            ),

        certified:

            false,

        statistics:

            Object.freeze({

                entries:

                    Array.isArray(

                        contentCalendar.entries

                    )

                        ? contentCalendar.entries.length

                        : 0

            }),

        createdAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Runtime
==================================================
*/

function execute({

    contentCalendar

}) {

    assertContentCalendar(

        contentCalendar

    );

    return deepFreeze({

        runtime:

            CONTRACT,

        contentCalendar:

            buildContract(

                contentCalendar

            )

    });

}

/*
==================================================
Public API
==================================================
*/

module.exports =

Object.freeze({

    execute

});