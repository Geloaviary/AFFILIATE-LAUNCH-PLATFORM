"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

campaigns.js

Constitutional Rule PTCT-001

Campaigns Result
        │
        ▼
Campaigns Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Campaigns Contract
from the Campaigns planner worker.

This worker NEVER

• Executes planner workers
• Changes campaigns decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Campaigns Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.campaigns",
    version: "1.0.0"
});

function isObject(value) {
    return value !== null && typeof value === "object";
}

function deepFreeze(target, visited = new WeakSet()) {
    if (!isObject(target)) return target;
    if (visited.has(target)) return target;
    visited.add(target);
    Object.freeze(target);
    for (const key of Object.keys(target)) deepFreeze(target[key], visited);
    return target;
}

function assertCampaigns(campaigns) {
    if (!isObject(campaigns)) {
        throw new Error("Campaigns is required.");
    }
}

function buildContract(campaigns) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "campaigns",
        payload: structuredClone(campaigns),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ campaigns }) {
    assertCampaigns(campaigns);
    return deepFreeze({
        runtime: CONTRACT,
        campaigns: buildContract(campaigns)
    });
}

module.exports = Object.freeze({
    execute
});
