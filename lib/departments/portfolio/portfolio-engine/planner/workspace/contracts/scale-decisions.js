"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

scale-decisions.js

Constitutional Rule PTCT-004

Scale Decisions Result
        │
        ▼
Scale Decisions Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Scale Decisions Contract
from the Scale Decisions planner worker.

This worker NEVER

• Executes planner workers
• Changes scale decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Scale Decisions Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.scaleDecisions",
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

function assertScaleDecisions(scaleDecisions) {
    if (!isObject(scaleDecisions)) {
        throw new Error("Scale Decisions is required.");
    }
}

function buildContract(scaleDecisions) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "scaleDecisions",
        payload: structuredClone(scaleDecisions),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ scaleDecisions }) {
    assertScaleDecisions(scaleDecisions);
    return deepFreeze({
        runtime: CONTRACT,
        scaleDecisions: buildContract(scaleDecisions)
    });
}

module.exports = Object.freeze({
    execute
});
