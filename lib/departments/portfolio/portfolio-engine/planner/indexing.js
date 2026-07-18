"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
indexing.js

Constitutional Rule PTP-002

Normalized Campaign Metrics
        │
        ▼
Lookup Indices

--------------------------------------------------

Constitutional Responsibility

Builds fast lookup indices over the normalized
campaign metrics — by id, niche, offer type,
traffic source, and status — so downstream
workers never have to linear-scan the full
campaign array.

This worker NEVER

• Scores, ranks, or classifies campaigns
• Makes scale/kill/allocation decisions
• Writes Platform Memory
• Calls QAD

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.indexing",
    version: "1.0.0"
});

function indexBy(campaigns, key) {
    const index = {};
    for (const campaign of campaigns) {
        const value = campaign[key];
        if (!index[value]) {
            index[value] = [];
        }
        index[value].push(campaign.id);
    }
    return Object.freeze(index);
}

function execute({ campaignMetrics }) {
    const byId = Object.freeze(
        Object.fromEntries(campaignMetrics.map((c) => [c.id, c]))
    );

    const indices = Object.freeze({
        byId,
        byNiche: indexBy(campaignMetrics, "niche"),
        byOfferType: indexBy(campaignMetrics, "offerType"),
        byTrafficSource: indexBy(campaignMetrics, "trafficSource"),
        byStatus: indexBy(campaignMetrics, "status")
    });

    return Object.freeze({
        runtime: WORKER,
        indices
    });
}

module.exports = Object.freeze({
    identity: WORKER,
    execute
});
