"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

history.js

Constitutional Rule PTCT-009

History Result
        │
        ▼
History Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable History Contract
from the History planner worker.

This worker NEVER

• Executes planner workers
• Changes history decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
History Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.history",
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

function assertHistory(history) {
    if (!isObject(history)) {
        throw new Error("History is required.");
    }
}

function buildContract(history) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "history",
        payload: structuredClone(history),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ history }) {
    assertHistory(history);
    return deepFreeze({
        runtime: CONTRACT,
        history: buildContract(history)
    });
}

module.exports = Object.freeze({
    execute
});
