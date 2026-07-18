"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/decision-types/
kill-plan.js

Constitutional Rule PTDT-002

Builds a single Kill Plan for one campaign.
This worker NEVER decides which campaigns should
be killed; it only formats the plan once a kill
decision has already been made upstream.
==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "decision-types.kill-plan",
    version: "1.0.0"
});

function build({ campaign }) {
    const severity = campaign.roi < -0.3 ? "immediate" : "scheduled";

    return Object.freeze({
        campaignId: campaign.id,
        action: "kill",
        severity,
        recoveredBudget: campaign.spend,
        reason: `Score ${campaign.score}/100 with ROI ${(campaign.roi * 100).toFixed(1)}% and a ${campaign.trend} trend.`,
        effectiveDate: severity === "immediate" ? "now" : "end-of-cycle"
    });
}

module.exports = Object.freeze({ identity: WORKER, build });
