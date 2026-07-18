"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/

portfolio-package.js

Constitutional Rule PTCP-001

Creates the Portfolio Review Package from the
completed Portfolio Workspace. Tracks the review's
lifecycle as its scale/kill/reallocate decisions
move from "planned" through downstream execution
(e.g. by the Revenue or Publishing departments).

==================================================
*/

const REVIEW_PACKAGE_BUILDER = Object.freeze({
    department: "portfolio",
    component: "portfolio-package",
    version: "1.0.0"
});

function deepFreeze(object, visited = new WeakSet()) {
    if (object === null || typeof object !== "object") {
        return object;
    }
    if (visited.has(object)) {
        return object;
    }
    visited.add(object);
    Object.freeze(object);
    for (const key of Object.keys(object)) {
        deepFreeze(object[key], visited);
    }
    return object;
}

function build({ workspace, reviewId, scope, createdAt }) {
    return deepFreeze({
        builder: REVIEW_PACKAGE_BUILDER,
        version: REVIEW_PACKAGE_BUILDER.version,
        reviewId,
        scope,
        status: "planned",
        createdAt,

        runtime: {
            portfolio: {
                status: "completed",
                workspace: true,
                package: true,
                startedAt: createdAt,
                completedAt: createdAt
            },
            execution: {
                status: "pending",
                actionsApplied: 0,
                startedAt: null,
                completedAt: null
            }
        },

        portfolio: structuredClone(workspace),

        execution: null,
        appliedActions: [],
        pendingActions: [],

        activity: [
            {
                department: "analytics",
                event: "performance-certified",
                timestamp: createdAt
            },
            {
                department: "portfolio",
                event: "workspace-packaged",
                timestamp: createdAt
            }
        ]
    });
}

module.exports = Object.freeze({
    identity: REVIEW_PACKAGE_BUILDER,
    build
});
