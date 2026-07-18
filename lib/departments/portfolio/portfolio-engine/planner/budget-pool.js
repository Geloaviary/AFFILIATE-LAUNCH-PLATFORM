"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
budget-pool.js

Constitutional Rule PTP-003

Revenue + Budget Context
        │
        ▼
Available Budget Pool

--------------------------------------------------

Constitutional Responsibility

Derives the total reallocatable budget pool and
per-campaign spend constraints from the certified
Portfolio Contract's revenue and budget data.

This worker NEVER

• Allocates budget to specific campaigns
• Makes scale/kill decisions
• Writes Platform Memory
• Calls QAD

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.budget-pool",
    version: "1.0.0"
});

function toNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function execute({ portfolio, campaignMetrics }) {
    const budget = portfolio.budget || {};
    const constraints = portfolio.constraints || {};

    const totalSpend = campaignMetrics.reduce((sum, c) => sum + c.spend, 0);

    const dailyBudgetCap = toNumber(budget.dailyCap, totalSpend);
    const monthlyBudgetCap = toNumber(budget.monthlyCap, dailyBudgetCap * 30);
    const reserveRatio = toNumber(constraints.reserveRatio, 0.15);

    const reallocatable = Math.max(
        0,
        monthlyBudgetCap * (1 - reserveRatio) - totalSpend
    );

    return Object.freeze({
        runtime: WORKER,
        budgetPool: Object.freeze({
            totalSpend,
            dailyBudgetCap,
            monthlyBudgetCap,
            reserveRatio,
            reallocatable,
            minCampaignBudget: toNumber(constraints.minCampaignBudget, 0),
            maxCampaignBudget: toNumber(
                constraints.maxCampaignBudget,
                monthlyBudgetCap
            )
        })
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
