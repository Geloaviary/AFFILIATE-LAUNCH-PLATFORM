"use strict";

/*
==================================================

AFFILIATE AI OPERATING SYSTEM

Portfolio Department

portfolio-engine/

builder.js

Constitutional Rule PTBD-001

Review Builder

Builds the immutable Portfolio Review record
from the completed Portfolio Workspace.

The Builder NEVER

• Writes Platform Memory
• Executes Runtime
• Creates Production Jobs
• Updates Portfolio Memory
• Performs HTTP operations

The Builder ONLY

• Creates the Review record
• Initializes the Review Package
• Attaches the certified Workspace
• Produces an immutable Review model

Unlike a single-campaign department, a Portfolio
Review is not scoped to one campaign. `campaignId`
is optional: when present, the review is scoped to
that campaign's standing inside the portfolio; when
absent, the review covers the entire portfolio and
a generated `reviewId` identifies the run instead.

==================================================
*/

const Errors =
    require("../../../quality-assurance-director/errors");

const ReviewPackage =
    require("./portfolio-package");

/*
==================================================
Builder Identity
==================================================
*/

const BUILDER = Object.freeze({
    department: "portfolio",
    engine: "portfolio-engine",
    component: "builder",
    version: "1.0.0"
});

/*
==================================================
Internal Utilities
==================================================
*/

function isObject(value) {
    return value !== null && typeof value === "object";
}

function deepFreeze(object, visited = new WeakSet()) {
    if (!isObject(object)) {
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

function generateReviewId() {
    return (
        "review_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 10)
    );
}

/*
==================================================
Assemble Review Model

Portfolio Workspace
        │
        ▼
Review Package
        │
        ▼
Review Model
==================================================
*/

function build({ campaignId = null, workspace, createdAt }) {
    if (!workspace) {
        throw new Errors.ValidationError(
            "Portfolio Workspace is required."
        );
    }

    const scope = campaignId ? "campaign" : "portfolio";
    const reviewId = campaignId || generateReviewId();

    const reviewPackage = ReviewPackage.build({
        workspace,
        reviewId,
        scope,
        createdAt
    });

    const review = {
        id: reviewId,
        scope,
        campaignId: campaignId || null,
        status: "planned",
        portfolio: structuredClone(workspace),
        reviewPackage,
        createdAt
    };

    return deepFreeze(review);
}

/*
==================================================
Public Review Builder
==================================================
*/

module.exports = Object.freeze({
    identity: BUILDER,
    build
});
