"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
kill-decisions.js

Constitutional Rule PTP-013

Campaigns + Composition
        │
        ▼
Kill Decisions

--------------------------------------------------

Constitutional Responsibility

Decides which underperforming campaigns should be
killed (paused permanently), recovering their spend
back into the reallocatable budget pool. Delegates
plan formatting to decision-types/kill-plan.

This worker NEVER

• Scales or holds campaigns
• Writes Platform Memory
• Calls QAD

==================================================
*/

const KillPlan = require("./decision-types/kill-plan");

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.kill-decisions",
    version: "1.0.0"
});

const KILL_SCORE_THRESHOLD = 30;
const MIN_DAYS_BEFORE_KILL = 5;

function execute({ campaigns }) {
    const candidates = campaigns.list.filter((c) => {
        if (c.status === "paused") {
            return false;
        }
        const matured = c.daysActive >= MIN_DAYS_BEFORE_KILL;
        return matured && (c.score < KILL_SCORE_THRESHOLD || c.roi < -0.3);
    });

    const plans = candidates.map((campaign) => KillPlan.build({ campaign }));

    const recoveredBudget = Math.round(
        plans.reduce((sum, p) => sum + p.recoveredBudget, 0) * 100
    ) / 100;

    return Object.freeze({
        runtime: WORKER,
        killDecisions: Object.freeze({
            plans: Object.freeze(plans),
            candidateCount: plans.length,
            recoveredBudget
        })
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
