"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/

planner/

assembler.js

Constitutional Rule STP-031

Strategy Workspace Assembler

--------------------------------------------------

Constitutional Responsibility

Coordinates the construction of the
Strategy Workspace.

It NEVER

• Executes planner workers
• Performs business decisions
• Modifies planner results
• Calls QAD
• Writes Platform Memory

It ONLY assembles the completed planner
results into the immutable Strategy
Workspace.

==================================================
*/

const CampaignContract =
    require("./workspace/contracts/campaign");

const PositioningContract =
    require("./workspace/contracts/positioning");

const AnglesContract =
    require("./workspace/contracts/angles");

const HooksContract =
    require("./workspace/contracts/hooks");

const ScriptsContract =
    require("./workspace/contracts/scripts");

const CTAContract =
    require("./workspace/contracts/cta");

const PlatformStrategyContract =
    require("./workspace/contracts/platform-strategy");

const ContentCalendarContract =
    require("./workspace/contracts/content-calendar");

const PostingSequenceContract =
    require("./workspace/contracts/posting-sequence");

const OptimizationContract =
    require("./workspace/contracts/optimization");

const Metadata =
    require("./workspace/metadata");

const Statistics =
    require("./workspace/statistics");

const Completion =
    require("./workspace/completion");

const Workspace =
    require("./workspace/workspace");

async function execute({

    campaign,

    positioning,

    angles,

    hooks,

    scripts,

    cta,

    platformStrategy,

    contentCalendar,

    postingSequence,

    optimization

}) {

    /*
    ==============================================
    Build Workspace Contracts
    ==============================================
    */

    const {

        campaign:

            campaignContract

    } =

        CampaignContract.execute({

            campaign

        });

    const {

        positioning:

            positioningContract

    } =

        PositioningContract.execute({

            positioning

        });

    const {

        angles:

            anglesContract

    } =

        AnglesContract.execute({

            angles

        });

    const {

        hooks:

            hooksContract

    } =

        HooksContract.execute({

            hooks

        });

    const {

        scripts:

            scriptsContract

    } =

        ScriptsContract.execute({

            scripts

        });

    const {

        cta:

            ctaContract

    } =

        CTAContract.execute({

            cta

        });

    const {

        platformStrategy:

            platformStrategyContract

    } =

        PlatformStrategyContract.execute({

            platformStrategy

        });

    const {

        contentCalendar:

            contentCalendarContract

    } =

        ContentCalendarContract.execute({

            contentCalendar

        });

    const {

        postingSequence:

            postingSequenceContract

    } =

        PostingSequenceContract.execute({

            postingSequence

        });

    const {

        optimization:

            optimizationContract

    } =

        OptimizationContract.execute({

            optimization

        });

    /*
    ==============================================
    Build Contract Catalog
    ==============================================
    */

    const contracts =

        Object.freeze({

            campaign:

                campaignContract,

            positioning:

                positioningContract,

            angles:

                anglesContract,

            hooks:

                hooksContract,

            scripts:

                scriptsContract,

            cta:

                ctaContract,

            platformStrategy:

                platformStrategyContract,

            contentCalendar:

                contentCalendarContract,

            postingSequence:

                postingSequenceContract,

            optimization:

                optimizationContract

        });

    /*
    ==============================================
    Build Workspace Components
    ==============================================
    */

    const {

        metadata

    } =

        Metadata.execute({

            campaign:

                campaignContract

        });

    const {

        statistics

    } =

        Statistics.execute({

            contracts

        });

    const {

        completion

    } =

        Completion.execute({

            contracts,

            statistics

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

            metadata,

            contracts,

            statistics,

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