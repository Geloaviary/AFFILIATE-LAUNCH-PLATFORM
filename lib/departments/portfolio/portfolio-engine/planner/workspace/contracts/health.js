"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

health.js

Constitutional Rule PTCT-008

Health Result
        │
        ▼
Health Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Health Contract
from the Health planner worker.

This worker NEVER

• Executes planner workers
• Changes health decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Health Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.health",
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

function assertHealth(health) {
    if (!isObject(health)) {
        throw new Error("Health is required.");
    }
}

function buildContract(health) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "health",
        payload: structuredClone(health),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ health }) {
    assertHealth(health);
    return deepFreeze({
        runtime: CONTRACT,
        health: buildContract(health)
    });
}

module.exports = Object.freeze({
    execute
});
