"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

strategy-engine/

planner/

planner.js

Constitutional Rule STP-017

Strategy Planner Orchestrator

The Planner ONLY coordinates the
planner workers.

It NEVER performs business logic.

==================================================
*/

const Assembler =
    require("./assembler");

const OpportunitySelection =
    require("./opportunity-selection");

const NichePositioning =
    require("./niche-positioning");

const CampaignIntelligence =
    require("./campaign-intelligence");

const ProductIntelligence =
    require("./product-intelligence");

const CampaignSelection =
    require("./campaign-selection");

const Positioning =
    require("./positioning");

const MarketingAngles =
    require("./marketing-angles");

const Hooks =
    require("./hooks");

const Scripts =
    require("./scripts");

const CTA =
    require("./cta");

const PlatformStrategy =
    require("./platform-strategy");

const ContentCalendar =
    require("./content-calendar");

const PostingSequence =
    require("./posting-sequence");

const Optimization =
    require("./optimization");

async function execute({

    research

}) {

    /*
    ==============================================
    Phase 1

    Intelligence Interpretation
    ==============================================
    */

    const {

        opportunityAnalysis

    } =

        OpportunitySelection.execute({

            winner:

                research.winner

        });

    const {

        nicheAnalysis

    } =

        NichePositioning.execute({

            niche:

                research.niche

        });

    const {

        campaignAnalysis

    } =

        CampaignIntelligence.execute({

            campaignIntelligence:

                research.campaignIntelligence

        });

    const {

        productAnalysis

    } =

        ProductIntelligence.execute({

            productIntelligence:

                research.productIntelligence

        });

    /*
    ==============================================
    Phase 2

    Strategy Decisions
    ==============================================
    */

    const {

        campaign

    } =

        CampaignSelection.execute({

            opportunityAnalysis,

            campaignAnalysis

        });

    const {

        positioning

    } =

        Positioning.execute({

            nicheAnalysis,

            productAnalysis

        });

    /*
    ==============================================
    Phase 3

    Campaign Design
    ==============================================
    */

    const {

        angles

    } =

        MarketingAngles.execute({

            campaign,

            positioning

        });

    const {

        hooks

    } =

        Hooks.execute({

            angles

        });

    const {

        scripts

    } =

        Scripts.execute({

            campaign,

            positioning,

            hooks

        });

    const {

        cta

    } =

        CTA.execute({

            campaign,

            positioning,

            scripts

        });

    /*
    ==============================================
    Phase 4

    Distribution Planning
    ==============================================
    */

    const {

        platformStrategy

    } =

        PlatformStrategy.execute({

            campaign,

            positioning,

            scripts,

            cta

        });

    const {

        contentCalendar

    } =

        ContentCalendar.execute({

            platformStrategy

        });

    const {

        postingSequence

    } =

        PostingSequence.execute({

            contentCalendar

        });

    /*
    ==============================================
    Phase 5

    Planner QA
    ==============================================
    */

    const {

        optimization

    } =

        Optimization.execute({

            postingSequence

        });

/*
==============================================
Phase 6

Workspace Assembly
==============================================
*/

const {

    workspace

} =

    await Assembler.execute({

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

    });

    return workspace;

}

module.exports =

Object.freeze({

    execute

});