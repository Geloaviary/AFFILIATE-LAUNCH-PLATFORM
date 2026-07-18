"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

allocation.js

Constitutional Rule PTCT-006

Allocation Result
        │
        ▼
Allocation Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Allocation Contract
from the Allocation planner worker.

This worker NEVER

• Executes planner workers
• Changes allocation decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Allocation Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.allocation",
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

function assertAllocation(allocation) {
    if (!isObject(allocation)) {
        throw new Error("Allocation is required.");
    }
}

function buildContract(allocation) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "allocation",
        payload: structuredClone(allocation),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ allocation }) {
    assertAllocation(allocation);
    return deepFreeze({
        runtime: CONTRACT,
        allocation: buildContract(allocation)
    });
}

module.exports = Object.freeze({
    execute
});
