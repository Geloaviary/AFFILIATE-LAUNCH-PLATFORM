"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
health.js

Constitutional Rule PTP-016

Statistics + Composition
        │
        ▼
Portfolio Health Score

--------------------------------------------------

Constitutional Responsibility

Combines composition balance, concentration risk,
and profitability into a single 0-100 portfolio
health score with a short diagnosis, so the score
can be scanned at a glance without reading every
underlying contract.

This worker NEVER makes scale/kill/allocation
decisions itself, writes Platform Memory, or calls
QAD.

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.health",
    version: "1.0.0"
});

const RISK_PENALTY = Object.freeze({ healthy: 0, warning: 15, critical: 35 });

function execute({ statistics, composition }) {
    const { totalCampaigns, netProfit, totalSpend, diversification } = statistics;

    const profitabilityScore = totalSpend > 0
        ? Math.max(0, Math.min(100, 50 + (netProfit / totalSpend) * 100))
        : 50;

    const winnerShare = totalCampaigns > 0 ? composition.winner.count / totalCampaigns : 0;
    const underperformingShare = totalCampaigns > 0 ? composition.underperforming.count / totalCampaigns : 0;
    const balanceScore = Math.max(0, 100 * winnerShare - 60 * underperformingShare + 30);

    const riskPenalty = RISK_PENALTY[diversification.overallRiskFlag] ?? 0;

    const score = Math.round(
        Math.max(0, Math.min(100, profitabilityScore * 0.5 + balanceScore * 0.5 - riskPenalty)) * 10
    ) / 10;

    const status = score >= 70 ? "healthy" : score >= 45 ? "watch" : "at-risk";

    const notes = [];
    if (diversification.overallRiskFlag !== "healthy") {
        notes.push(`Concentration risk is ${diversification.overallRiskFlag}.`);
    }
    if (underperformingShare > 0.3) {
        notes.push("Over 30% of campaigns are underperforming.");
    }
    if (netProfit < 0) {
        notes.push("Portfolio is currently unprofitable overall.");
    }
    if (notes.length === 0) {
        notes.push("Portfolio is balanced and profitable.");
    }

    const health = Object.freeze({
        score,
        status,
        notes: Object.freeze(notes)
    });

    return Object.freeze({
        runtime: WORKER,
        health
    });
}

module.exports = Object.freeze({ identity: WORKER, execute });
