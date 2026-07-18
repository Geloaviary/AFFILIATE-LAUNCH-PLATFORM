"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
composition.js

Constitutional Rule PTP-010

Campaigns Result
        │
        ▼
Portfolio Composition

--------------------------------------------------

Constitutional Responsibility

Categorizes every campaign into a composition
tier: winner, testing, underperforming, or paused.
This is the portfolio's shape at a glance.

This worker NEVER

• Decides to scale, kill, or reallocate
• Writes Platform Memory
• Calls QAD

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.composition",
    version: "1.0.0"
});

const TIER_THRESHOLDS = Object.freeze({ winner: 70, testing: 45 });

function classify(campaign) {
    if (campaign.status === "paused") return "paused";
    if (campaign.score >= TIER_THRESHOLDS.winner) return "winner";
    if (campaign.score >= TIER_THRESHOLDS.testing) return "testing";
    return "underperforming";
}

function summarizeTier(campaigns) {
    return Object.freeze({
        count: campaigns.length,
        totalSpend: Math.round(campaigns.reduce((s, c) => s + c.spend, 0) * 100) / 100,
        totalRevenue: Math.round(campaigns.reduce((s, c) => s + c.revenue, 0) * 100) / 100,
        campaignIds: campaigns.map((c) => c.id)
    });
}

function execute({ campaigns }) {
    const tiers = { winner: [], testing: [], underperforming: [], paused: [] };
    for (const campaign of campaigns.list) {
        tiers[classify(campaign)].push(campaign);
    }

    const composition = Object.freeze({
        winner: summarizeTier(tiers.winner),
        testing: summarizeTier(tiers.testing),
        underperforming: summarizeTier(tiers.underperforming),
        paused: summarizeTier(tiers.paused),
        totalCampaigns: campaigns.count
    });

    return Object.freeze({
        runtime: WORKER,
        composition
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
