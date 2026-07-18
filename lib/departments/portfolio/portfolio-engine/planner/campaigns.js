"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
campaigns.js

Constitutional Rule PTP-004

Normalized Campaign Metrics + Indices
        │
        ▼
Campaigns Result

--------------------------------------------------

Constitutional Responsibility

Publishes the certified, normalized campaign list
(with composite scores and lookup indices attached)
as the Portfolio Department's base business result.
Every other final worker builds on this result.

This worker NEVER

• Recomputes scores
• Makes scale/kill/allocation decisions
• Writes Platform Memory
• Calls QAD

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.campaigns",
    version: "1.0.0"
});

function execute({ campaignMetrics, indices }) {
    const campaigns = Object.freeze({
        list: campaignMetrics,
        count: campaignMetrics.length,
        indices
    });

    return Object.freeze({
        runtime: WORKER,
        campaigns
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
