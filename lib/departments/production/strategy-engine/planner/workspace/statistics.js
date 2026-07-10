"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/planner/
workspace/

statistics.js

Constitutional Rule STP-028

Workspace Statistics

--------------------------------------------------

Constitutional Responsibility

Builds immutable Workspace Statistics.

This worker NEVER

• Executes planner workers
• Changes contracts
• Writes Platform Memory
• Calls QAD

It ONLY aggregates statistics from the
completed Workspace Contracts.

==================================================
*/

const STATISTICS =

Object.freeze({

    department:

        "strategy",

    component:

        "workspace.statistics",

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

function assertContracts(

    contracts

) {

    if (

        !isObject(

            contracts

        )

    ) {

        throw new Error(

            "Workspace Contracts are required."

        );

    }

}

/*
==================================================
Statistics Builder
==================================================
*/

function buildStatistics({

    contracts

}) {

    return deepFreeze({

        runtime:

            STATISTICS,

        campaigns:

            1,

        positioning:

            1,

        angles:

            contracts.angles

                ?.statistics

                ?.total ?? 0,

        hooks:

            contracts.hooks

                ?.statistics

                ?.total ?? 0,

        scripts:

            contracts.scripts

                ?.statistics

                ?.total ?? 0,

        cta:

            contracts.cta

                ?.statistics

                ?.total ?? 0,

        platforms:

            contracts.platformStrategy

                ?.statistics

                ?.platforms ?? 0,

        calendarEntries:

            contracts.contentCalendar

                ?.statistics

                ?.entries ?? 0,

        postingSteps:

            contracts.postingSequence

                ?.statistics

                ?.steps ?? 0,

        recommendations:

            contracts.optimization

                ?.statistics

                ?.recommendations ?? 0

    });

}

/*
==================================================
Runtime
==================================================
*/

function execute({

    contracts

}) {

    assertContracts(

        contracts

    );

    return deepFreeze({

        runtime:

            STATISTICS,

        statistics:

            buildStatistics({

                contracts

            })

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