"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

ranking.js

Constitutional Rule PTCT-003

Ranking Result
        │
        ▼
Ranking Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Ranking Contract
from the Ranking planner worker.

This worker NEVER

• Executes planner workers
• Changes ranking decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Ranking Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.ranking",
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

function assertRanking(ranking) {
    if (!isObject(ranking)) {
        throw new Error("Ranking is required.");
    }
}

function buildContract(ranking) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "ranking",
        payload: structuredClone(ranking),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ ranking }) {
    assertRanking(ranking);
    return deepFreeze({
        runtime: CONTRACT,
        ranking: buildContract(ranking)
    });
}

module.exports = Object.freeze({
    execute
});
