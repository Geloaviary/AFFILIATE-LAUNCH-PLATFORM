"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/planner/
workspace/contracts/

composition.js

Constitutional Rule PTCT-002

Composition Result
        │
        ▼
Composition Contract

--------------------------------------------------

Constitutional Responsibility

Builds the immutable Composition Contract
from the Composition planner worker.

This worker NEVER

• Executes planner workers
• Changes composition decisions
• Generates portfolio business logic
• Writes Platform Memory
• Calls QAD

It ONLY publishes the internal
Composition Contract for the Portfolio
Workspace.

==================================================
*/

const CONTRACT = Object.freeze({
    department: "portfolio",
    component: "workspace.contracts.composition",
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

function assertComposition(composition) {
    if (!isObject(composition)) {
        throw new Error("Composition is required.");
    }
}

function buildContract(composition) {
    return deepFreeze({
        runtime: CONTRACT,
        contract: "composition",
        payload: structuredClone(composition),
        certified: false,
        createdAt: new Date().toISOString()
    });
}

function execute({ composition }) {
    assertComposition(composition);
    return deepFreeze({
        runtime: CONTRACT,
        composition: buildContract(composition)
    });
}

module.exports = Object.freeze({
    execute
});
