"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
ranking.js

Constitutional Rule PTP-011

Campaigns Result
        │
        ▼
Portfolio Ranking

--------------------------------------------------

Constitutional Responsibility

Ranks every campaign in the portfolio by its
composite performance score, from best to worst.

This worker NEVER

• Computes scores itself
• Decides to scale, kill, or reallocate
• Writes Platform Memory
• Calls QAD

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.ranking",
    version: "1.0.0"
});

function execute({ campaigns }) {
    const ranking = [...campaigns.list]
        .sort((a, b) => b.score - a.score)
        .map((campaign, index) =>
            Object.freeze({
                rank: index + 1,
                campaignId: campaign.id,
                name: campaign.name,
                score: campaign.score,
                roi: campaign.roi,
                trend: campaign.trend
            })
        );

    return Object.freeze({
        runtime: WORKER,
        ranking: Object.freeze(ranking)
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
