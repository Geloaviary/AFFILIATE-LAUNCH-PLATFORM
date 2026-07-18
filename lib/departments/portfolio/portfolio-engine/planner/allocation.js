"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
allocation.js

Constitutional Rule PTP-014

Scale + Kill Decisions + Budget Pool
        │
        ▼
Portfolio Allocation

--------------------------------------------------

Constitutional Responsibility

Builds the final per-campaign budget allocation
table for the entire portfolio: every campaign's
new proposed spend, plus the reallocation transfers
that fund the scale decisions out of recovered
kill budget and the free reallocatable pool.

This worker NEVER

• Decides who scales or who gets killed
• Writes Platform Memory
• Calls QAD

==================================================
*/

const HoldPlan = require("./decision-types/hold-plan");
const ReallocatePlan = require("./decision-types/reallocate-plan");

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.allocation",
    version: "1.0.0"
});

function execute({ campaigns, scaleDecisions, killDecisions, budgetPool }) {
    const scaledIds = new Set(scaleDecisions.plans.map((p) => p.campaignId));
    const killedIds = new Set(killDecisions.plans.map((p) => p.campaignId));

    const holdPlans = campaigns.list
        .filter((c) => c.status !== "paused" && !scaledIds.has(c.id) && !killedIds.has(c.id))
        .map((campaign) => HoldPlan.build({ campaign }));

    let fundingPool = killDecisions.recoveredBudget + budgetPool.reallocatable;

    const transfers = scaleDecisions.plans.map((plan) => {
        const amount = plan.proposedSpend - plan.currentSpend;
        const drawn = Math.min(amount, Math.max(fundingPool, 0));
        fundingPool -= drawn;

        return ReallocatePlan.build({
            toCampaignId: plan.campaignId,
            amount: drawn,
            reason: "Funded from killed-campaign recovery and the reallocatable budget pool."
        });
    });

    const table = [
        ...scaleDecisions.plans.map((p) => ({
            campaignId: p.campaignId,
            action: "scale",
            currentSpend: p.currentSpend,
            proposedSpend: p.proposedSpend
        })),
        ...killDecisions.plans.map((p) => ({
            campaignId: p.campaignId,
            action: "kill",
            currentSpend: p.recoveredBudget,
            proposedSpend: 0
        })),
        ...holdPlans.map((p) => ({
            campaignId: p.campaignId,
            action: "hold",
            currentSpend: p.currentSpend,
            proposedSpend: p.currentSpend
        }))
    ];

    return Object.freeze({
        runtime: WORKER,
        allocation: Object.freeze({
            table: Object.freeze(table),
            transfers: Object.freeze(transfers),
            holdPlans: Object.freeze(holdPlans),
            unallocatedBudget: Math.round(Math.max(fundingPool, 0) * 100) / 100
        })
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
