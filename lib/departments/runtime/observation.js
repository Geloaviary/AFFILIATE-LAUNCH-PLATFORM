"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V3

Runtime Department

observation.js

Read-Only Runtime Observation Boundary

--------------------------------------------------

Constitutional Responsibility

Observation transforms Runtime Engine evaluation
truth into a dashboard-safe immutable snapshot.

Observation NEVER

- Reads Platform Memory
- Reads Department business files
- Recalculates eligibility
- Executes Departments
- Dispatches work
- Writes Runtime state
- Writes Platform Memory
- Repairs Runtime results

Runtime Engine owns eligibility truth.

Observation only reports that truth.

==================================================
*/

/*
==================================================
Observation Identity

==================================================
*/

const OBSERVATION =

Object.freeze({

    department:

        "runtime",

    component:

        "observation",

    version:

        "1.0.0"

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

/*
==================================================
Build Department Observation

==================================================
*/

function buildDepartmentObservation(

    department

) {

    if (

        !isObject(

            department

        )

    ) {

        throw new TypeError(

            "Runtime Department evaluation is required."

        );

    }

    return deepFreeze({

        department:

            department.department,

        status:

            department.status,

        ready:

            Boolean(

                department.ready

            ),

        requiredContracts:

            Array.isArray(

                department.requiredContracts

            )

                ? [...department.requiredContracts]

                : [],

        missingContracts:

            Array.isArray(

                department.missingContracts

            )

                ? [...department.missingContracts]

                : [],

        reason:

            department.reason ??

            null

    });

}

/*
==================================================
Build Runtime Observation

Runtime Engine Evaluation

        │
        ▼

Dashboard-Safe Snapshot

==================================================
*/

function build(

    evaluation

) {

    if (

        !isObject(

            evaluation

        ) ||

        !Array.isArray(

            evaluation.departments

        )

    ) {

        throw new TypeError(

            "Runtime evaluation is required."

        );

    }

    const departments =

        evaluation.departments.map(

            buildDepartmentObservation

        );

    return deepFreeze({

        runtime:

            OBSERVATION,

        campaignId:

            evaluation.campaignId,

        summary:

            deepFreeze({

                registered:

                    evaluation.totalDepartments,

                ready:

                    evaluation.readyDepartments,

                waiting:

                    evaluation.waitingDepartments,

                disabled:

                    evaluation.disabledDepartments

            }),

        departments,

        observedAt:

            new Date()
                .toISOString()

    });

}

/*
==================================================
Public Observation API

==================================================
*/

module.exports =

Object.freeze({

    identity:

        OBSERVATION,

    build

});