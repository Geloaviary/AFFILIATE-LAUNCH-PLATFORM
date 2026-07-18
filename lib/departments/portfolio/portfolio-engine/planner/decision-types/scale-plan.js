"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/decision-types/
scale-plan.js

Constitutional Rule PTDT-001

Builds a single Scale Plan for one campaign.
This worker NEVER decides which campaigns should
scale; it only formats the plan once a scale
decision has already been made upstream.
==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "decision-types.scale-plan",
    version: "1.0.0"
});

function build({ campaign, budgetPool }) {
    const confidence = campaign.score >= 85 ? "high" : "medium";
    const increasePct = confidence === "high" ? 0.5 : 0.25;

    const proposedSpend = Math.min(
        campaign.spend * (1 + increasePct),
        budgetPool.maxCampaignBudget || Infinity
    );

    return Object.freeze({
        campaignId: campaign.id,
        action: "scale",
        confidence,
        currentSpend: campaign.spend,
        proposedSpend: Math.round(proposedSpend * 100) / 100,
        increasePct,
        reason: `Score ${campaign.score}/100 with ROI ${(campaign.roi * 100).toFixed(1)}% and a ${campaign.trend} trend.`
    });
}

module.exports = Object.freeze({ identity: WORKER, build });
