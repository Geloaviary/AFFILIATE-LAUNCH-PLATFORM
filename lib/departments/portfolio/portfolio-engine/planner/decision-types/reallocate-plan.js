"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/decision-types/
reallocate-plan.js

Constitutional Rule PTDT-004

Builds a single Reallocation Plan moving budget
from the recovered/free pool to a scaled campaign.
This worker NEVER decides the amounts; it only
formats the transfer once amounts have been
determined upstream.
==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "decision-types.reallocate-plan",
    version: "1.0.0"
});

function build({ toCampaignId, amount, reason }) {
    return Object.freeze({
        action: "reallocate",
        from: "recovered-and-pool-budget",
        to: toCampaignId,
        amount: Math.round(amount * 100) / 100,
        reason
    });
}

module.exports = Object.freeze({ identity: WORKER, build });
