"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

statistics.js

Constitutional Rule PTCT-007

Statistics Result
        │
        ▼
Statistics Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Statistics Contract
from the Statistics planner worker.

This worker NEVER

• Executes planner workers
• Changes statistics decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Statistics Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.statistics",
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

function assertStatistics(statistics) {
    if (!isObject(statistics)) {
        throw new Error("Statistics is required.");
    }
}

function buildContract(statistics) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "statistics",
        payload: structuredClone(statistics),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ statistics }) {
    assertStatistics(statistics);
    return deepFreeze({
        runtime: CONTRACT,
        statistics: buildContract(statistics)
    });
}

module.exports = Object.freeze({
    execute
});
