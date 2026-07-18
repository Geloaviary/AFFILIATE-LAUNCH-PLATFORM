"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
scale-decisions.js

Constitutional Rule PTP-012

Campaigns + Composition + Budget Pool
        │
        ▼
Scale Decisions

--------------------------------------------------

Constitutional Responsibility

Decides which winning campaigns should be scaled
and by how much, within the available budget pool.
Delegates plan formatting to decision-types/scale-plan.

This worker NEVER

• Kills or holds campaigns
• Writes Platform Memory
• Calls QAD

==================================================
*/

const ScalePlan = require("./decision-types/scale-plan");

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.scale-decisions",
    version: "1.0.0"
});

const SCALE_SCORE_THRESHOLD = 70;

function execute({ campaigns, budgetPool }) {
    const winners = campaigns.list
        .filter((c) => c.status !== "paused" && c.score >= SCALE_SCORE_THRESHOLD)
        .sort((a, b) => b.score - a.score);

    let remainingPool = budgetPool.reallocatable;
    const plans = [];

    for (const campaign of winners) {
        const plan = ScalePlan.build({
            campaign,
            budgetPool: {
                ...budgetPool,
                maxCampaignBudget: Math.min(
                    budgetPool.maxCampaignBudget || Infinity,
                    campaign.spend + Math.max(remainingPool, 0)
                )
            }
        });

        const additionalSpend = plan.proposedSpend - plan.currentSpend;
        remainingPool -= additionalSpend;
        plans.push(plan);
    }

    return Object.freeze({
        runtime: WORKER,
        scaleDecisions: Object.freeze({
            plans: Object.freeze(plans),
            candidateCount: winners.length,
            approvedCount: plans.length
        })
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
