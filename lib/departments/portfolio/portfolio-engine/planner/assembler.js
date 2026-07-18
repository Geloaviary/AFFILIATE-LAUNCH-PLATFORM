"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/

planner/

assembler.js

Constitutional Rule PTP-031

Portfolio Workspace Assembler

--------------------------------------------------

Constitutional Responsibility

Coordinates the construction of the
Portfolio Workspace.

It NEVER

• Executes planner workers
• Performs business decisions
• Modifies planner results
• Calls QAD
• Writes Platform Memory

It ONLY assembles the completed planner
results into the immutable Portfolio
Workspace.

==================================================
*/

const CampaignsContract =
    require("./workspace/contracts/campaigns");

const CompositionContract =
    require("./workspace/contracts/composition");

const RankingContract =
    require("./workspace/contracts/ranking");

const ScaleDecisionsContract =
    require("./workspace/contracts/scale-decisions");

const KillDecisionsContract =
    require("./workspace/contracts/kill-decisions");

const AllocationContract =
    require("./workspace/contracts/allocation");

const StatisticsContract =
    require("./workspace/contracts/statistics");

const HealthContract =
    require("./workspace/contracts/health");

const HistoryContract =
    require("./workspace/contracts/history");

const Metadata =
    require("./workspace/metadata");

const Statistics =
    require("./workspace/statistics");

const Completion =
    require("./workspace/completion");

const Workspace =
    require("./workspace/workspace");

async function execute({

    campaigns,

    composition,

    ranking,

    scaleDecisions,

    killDecisions,

    allocation,

    statistics,

    health,

    history

}) {

    /*
    ==============================================
    Build Workspace Contracts
    ==============================================
    */

    const {

        campaigns:

            campaignsContract

    } =

        CampaignsContract.execute({

            campaigns

        });

    const {

        composition:

            compositionContract

    } =

        CompositionContract.execute({

            composition

        });

    const {

        ranking:

            rankingContract

    } =

        RankingContract.execute({

            ranking

        });

    const {

        scaleDecisions:

            scaleDecisionsContract

    } =

        ScaleDecisionsContract.execute({

            scaleDecisions

        });

    const {

        killDecisions:

            killDecisionsContract

    } =

        KillDecisionsContract.execute({

            killDecisions

        });

    const {

        allocation:

            allocationContract

    } =

        AllocationContract.execute({

            allocation

        });

    const {

        statistics:

            statisticsContract

    } =

        StatisticsContract.execute({

            statistics

        });

    const {

        health:

            healthContract

    } =

        HealthContract.execute({

            health

        });

    const {

        history:

            historyContract

    } =

        HistoryContract.execute({

            history

        });

    /*
    ==============================================
    Build Contract Catalog
    ==============================================
    */

    const contracts =

        Object.freeze({

            campaigns:

                campaignsContract,

            composition:

                compositionContract,

            ranking:

                rankingContract,

            scaleDecisions:

                scaleDecisionsContract,

            killDecisions:

                killDecisionsContract,

            allocation:

                allocationContract,

            statistics:

                statisticsContract,

            health:

                healthContract,

            history:

                historyContract

        });

    /*
    ==============================================
    Build Workspace Components
    ==============================================
    */

    const {

        metadata:

            workspaceMetadata

    } =

        Metadata.execute({

            campaigns:

                campaignsContract

        });

    const {

        statistics:

            workspaceStatistics

    } =

        Statistics.execute({

            contracts

        });

    const {

        completion

    } =

        Completion.execute({

            contracts,

            statistics:

                workspaceStatistics

        });

    /*
    ==============================================
    Assemble Workspace
    ==============================================
    */

    const {

        workspace

    } =

        Workspace.execute({

            metadata:

                workspaceMetadata,

            contracts,

            statistics:

                workspaceStatistics,

            completion

        });

    return Object.freeze({

        workspace

    });

}

module.exports =

Object.freeze({

    execute

});
