"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/decision-types/
hold-plan.js

Constitutional Rule PTDT-003

Builds a single Hold Plan for one campaign.
This worker NEVER decides which campaigns should
hold; it only formats the plan once a hold
decision has already been made upstream.
==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "decision-types.hold-plan",
    version: "1.0.0"
});

function build({ campaign }) {
    return Object.freeze({
        campaignId: campaign.id,
        action: "hold",
        currentSpend: campaign.spend,
        reason: `Score ${campaign.score}/100 is within the neutral band; continue monitoring before acting.`,
        reviewAfterDays: 7
    });
}

module.exports = Object.freeze({ identity: WORKER, build });
