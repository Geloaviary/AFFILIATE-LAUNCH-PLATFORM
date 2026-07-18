"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

kill-decisions.js

Constitutional Rule PTCT-005

Kill Decisions Result
        │
        ▼
Kill Decisions Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Kill Decisions Contract
from the Kill Decisions planner worker.

This worker NEVER

• Executes planner workers
• Changes kill decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Kill Decisions Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.killDecisions",
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

function assertKillDecisions(killDecisions) {
    if (!isObject(killDecisions)) {
        throw new Error("Kill Decisions is required.");
    }
}

function buildContract(killDecisions) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "killDecisions",
        payload: structuredClone(killDecisions),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ killDecisions }) {
    assertKillDecisions(killDecisions);
    return deepFreeze({
        runtime: CONTRACT,
        killDecisions: buildContract(killDecisions)
    });
}

module.exports = Object.freeze({
    execute
});
