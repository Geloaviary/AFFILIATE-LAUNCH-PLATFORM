"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

portfolio-engine/planner/
workspace/

statistics.js

Constitutional Rule PTP-028

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

        "portfolio",

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

            contracts.campaigns

                ?.payload

                ?.count ?? 0,

        composition:

            contracts.composition

                ?.payload

                ?.totalCampaigns ?? 0,

        ranking:

            contracts.ranking

                ?.payload

                ?.length ?? 0,

        scaleDecisions:

            contracts.scaleDecisions

                ?.payload

                ?.approvedCount ?? 0,

        killDecisions:

            contracts.killDecisions

                ?.payload

                ?.candidateCount ?? 0,

        allocation:

            contracts.allocation

                ?.payload

                ?.table

                ?.length ?? 0,

        statistics:

            contracts.statistics

                ?.payload

                ?.totalCampaigns ?? 0,

        health:

            contracts.health

                ?.payload

                ?.score ?? 0,

        history:

            contracts.history

                ?.payload

                ?.hasPrevious ?

                    1 : 0

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