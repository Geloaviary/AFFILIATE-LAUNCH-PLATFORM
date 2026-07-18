"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
campaign-metrics.js

Constitutional Rule PTP-001

Raw Campaign Performance
        │
        ▼
Normalized Campaign Metrics + Scores

--------------------------------------------------

Constitutional Responsibility

Normalizes the raw campaign performance array
from the certified Portfolio Contract and computes
a composite performance score (0-100) for each
campaign. This is the base dataset every other
planner worker reads from.

This worker NEVER

• Ranks campaigns against each other
• Makes scale/kill/allocation decisions
• Writes Platform Memory
• Calls QAD

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.campaign-metrics",
    version: "1.0.0"
});

const SCORE_WEIGHTS = Object.freeze({
    roi: 0.45,
    conversionRate: 0.2,
    trend: 0.2,
    volume: 0.15
});

const TREND_SCORE = Object.freeze({
    rising: 100,
    flat: 55,
    falling: 15
});

function toNumber(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function computeRoi(revenue, spend) {
    if (spend <= 0) {
        return revenue > 0 ? Infinity : 0;
    }
    return (revenue - spend) / spend;
}

function scoreRoi(roi) {
    if (!Number.isFinite(roi)) {
        return 100;
    }
    return clamp(50 + roi * 50, 0, 100);
}

function scoreConversionRate(rate) {
    return clamp(rate * 1000, 0, 100);
}

function scoreTrend(trend) {
    return TREND_SCORE[trend] ?? TREND_SCORE.flat;
}

function scoreVolume(spend) {
    if (spend <= 0) {
        return 0;
    }
    return clamp(Math.log10(spend + 1) * 25, 0, 100);
}

function normalizeCampaign(raw) {
    const spend = toNumber(raw.spend);
    const revenue = toNumber(raw.revenue);
    const clicks = toNumber(raw.clicks);
    const impressions = toNumber(raw.impressions);
    const conversions = toNumber(raw.conversions);

    const roi = computeRoi(revenue, spend);
    const conversionRate = clicks > 0 ? conversions / clicks : 0;
    const ctr = impressions > 0 ? clicks / impressions : 0;
    const trend = raw.trend || "flat";

    const score =
        scoreRoi(roi) * SCORE_WEIGHTS.roi +
        scoreConversionRate(conversionRate) * SCORE_WEIGHTS.conversionRate +
        scoreTrend(trend) * SCORE_WEIGHTS.trend +
        scoreVolume(spend) * SCORE_WEIGHTS.volume;

    return Object.freeze({
        id: raw.id || raw.campaignId,
        name: raw.name || "Untitled Campaign",
        niche: raw.niche || "unspecified",
        offerType: raw.offerType || "unspecified",
        trafficSource: raw.trafficSource || "unspecified",
        status: raw.status || "active",
        spend,
        revenue,
        profit: Math.round((revenue - spend) * 100) / 100,
        roi,
        clicks,
        impressions,
        conversions,
        ctr,
        conversionRate,
        trend,
        daysActive: toNumber(raw.daysActive, 1),
        score: Math.round(score * 10) / 10
    });
}

function execute({ portfolio }) {
    const raw = Array.isArray(portfolio.campaigns) ? portfolio.campaigns : [];
    const campaignMetrics = Object.freeze(raw.map(normalizeCampaign));

    return Object.freeze({
        runtime: WORKER,
        campaignMetrics
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
