"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
statistics.js

Constitutional Rule PTP-015

Campaigns Result
        │
        ▼
Portfolio Statistics (totals + concentration risk)

--------------------------------------------------

Constitutional Responsibility

Aggregates portfolio-wide totals (spend, revenue,
profit, average score) and measures concentration
risk across niche, offer type, and traffic source.

This worker NEVER makes scale/kill/allocation
decisions, writes Platform Memory, or calls QAD.

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.statistics",
    version: "1.0.0"
});

const CONCENTRATION_WARNING = 0.4;
const CONCENTRATION_CRITICAL = 0.6;

function groupSpend(campaigns, key) {
    const groups = new Map();
    for (const c of campaigns) {
        groups.set(c[key], (groups.get(c[key]) || 0) + c.spend);
    }
    return groups;
}

function buildBreakdown(campaigns, key, totalSpend) {
    const groups = groupSpend(campaigns, key);
    const breakdown = [...groups.entries()]
        .map(([label, spend]) => ({
            label,
            spend: Math.round(spend * 100) / 100,
            share: totalSpend > 0 ? Math.round((spend / totalSpend) * 1000) / 1000 : 0
        }))
        .sort((a, b) => b.share - a.share);

    const topShare = breakdown[0]?.share ?? 0;
    const flag =
        topShare >= CONCENTRATION_CRITICAL ? "critical" :
        topShare >= CONCENTRATION_WARNING ? "warning" : "healthy";

    return Object.freeze({ breakdown: Object.freeze(breakdown), topShare, flag });
}

function execute({ campaigns }) {
    const list = campaigns.list;
    const totalSpend = list.reduce((s, c) => s + c.spend, 0);
    const totalRevenue = list.reduce((s, c) => s + c.revenue, 0);
    const averageScore = list.length
        ? list.reduce((s, c) => s + c.score, 0) / list.length
        : 0;

    const byNiche = buildBreakdown(list, "niche", totalSpend);
    const byOfferType = buildBreakdown(list, "offerType", totalSpend);
    const byTrafficSource = buildBreakdown(list, "trafficSource", totalSpend);

    const flags = [byNiche.flag, byOfferType.flag, byTrafficSource.flag];
    const overallRiskFlag = flags.includes("critical") ? "critical" : flags.includes("warning") ? "warning" : "healthy";

    const statistics = Object.freeze({
        totalCampaigns: list.length,
        totalSpend: Math.round(totalSpend * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        netProfit: Math.round((totalRevenue - totalSpend) * 100) / 100,
        averageScore: Math.round(averageScore * 10) / 10,
        diversification: Object.freeze({ byNiche, byOfferType, byTrafficSource, overallRiskFlag })
    });

    return Object.freeze({
        runtime: WORKER,
        statistics
    });
}

module.exports = Object.freeze({ identity: WORKER, execute });
