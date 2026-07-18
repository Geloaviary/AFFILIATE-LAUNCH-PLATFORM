"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/

planner/

planner.js

Constitutional Rule PTP-017

Portfolio Planner Orchestrator

The Planner ONLY coordinates the
planner workers.

It NEVER performs business logic.

==================================================
*/

const Assembler =
    require("./assembler");

const CampaignMetrics =
    require("./campaign-metrics");

const Indexing =
    require("./indexing");

const BudgetPool =
    require("./budget-pool");

const Campaigns =
    require("./campaigns");

const Composition =
    require("./composition");

const Ranking =
    require("./ranking");

const ScaleDecisions =
    require("./scale-decisions");

const KillDecisions =
    require("./kill-decisions");

const Allocation =
    require("./allocation");

const Statistics =
    require("./statistics");

const Health =
    require("./health");

const History =
    require("./history");

async function execute({

    portfolio

}) {

    /*
    ==============================================
    Phase 1

    Performance Interpretation
    ==============================================
    */

    const {

        campaignMetrics

    } =

        CampaignMetrics.execute({

            portfolio

        });

    const {

        indices

    } =

        Indexing.execute({

            campaignMetrics

        });

    const {

        budgetPool

    } =

        BudgetPool.execute({

            portfolio,

            campaignMetrics

        });

    /*
    ==============================================
    Phase 2

    Portfolio Decisions
    ==============================================
    */

    const {

        campaigns

    } =

        Campaigns.execute({

            campaignMetrics,

            indices

        });

    const {

        composition

    } =

        Composition.execute({

            campaigns

        });

    const {

        ranking

    } =

        Ranking.execute({

            campaigns

        });

    /*
    ==============================================
    Phase 3

    Rebalancing
    ==============================================
    */

    const {

        scaleDecisions

    } =

        ScaleDecisions.execute({

            campaigns,

            budgetPool

        });

    const {

        killDecisions

    } =

        KillDecisions.execute({

            campaigns

        });

    const {

        allocation

    } =

        Allocation.execute({

            campaigns,

            scaleDecisions,

            killDecisions,

            budgetPool

        });

    /*
    ==============================================
    Phase 4

    Portfolio QA
    ==============================================
    */

    const {

        statistics

    } =

        Statistics.execute({

            campaigns

        });

    const {

        health

    } =

        Health.execute({

            statistics,

            composition

        });

    const {

        history

    } =

        History.execute({

            statistics,

            health,

            previous:

                portfolio.previousReview ||

                null

        });

/*
==============================================
Phase 5

Workspace Assembly
==============================================
*/

const {

    workspace

} =

    await Assembler.execute({

        campaigns,

        composition,

        ranking,

        scaleDecisions,

        killDecisions,

        allocation,

        statistics,

        health,

        history

    });

    return workspace;

}

module.exports =

Object.freeze({

    execute

});
