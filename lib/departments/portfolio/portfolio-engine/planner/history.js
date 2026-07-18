"use strict";

/*
==================================================
AFFILIATE AI OPERATING SYSTEM
Portfolio Department
portfolio-engine/planner/
history.js

Constitutional Rule PTP-017

This Review's Statistics + Health
        │
        ▼
Trend vs. Previous Review

--------------------------------------------------

Constitutional Responsibility

Compares this review's statistics and health score
against the previous review (when one is available
in the Portfolio Context) to surface whether the
portfolio is trending up, flat, or down.

When no previous review is available, this worker
records the current run as the new baseline instead
of failing — Portfolio must still be able to run on
its very first execution.

This worker NEVER makes scale/kill/allocation
decisions, writes Platform Memory, or calls QAD.

==================================================
*/

const WORKER = Object.freeze({
    department: "portfolio",
    component: "planner.history",
    version: "1.0.0"
});

function diff(current, previous) {
    return Math.round((current - previous) * 100) / 100;
}

function execute({ statistics, health, previous }) {
    if (!previous) {
        return Object.freeze({
            runtime: WORKER,
            history: Object.freeze({
                hasPrevious: false,
                trend: "baseline",
                deltas: null
            })
        });
    }

    const revenueDelta = diff(statistics.totalRevenue, previous.statistics?.totalRevenue ?? 0);
    const profitDelta = diff(statistics.netProfit, previous.statistics?.netProfit ?? 0);
    const healthDelta = diff(health.score, previous.health?.score ?? 0);

    const trend = healthDelta > 2 ? "improving" : healthDelta < -2 ? "declining" : "stable";

    const history = Object.freeze({
        hasPrevious: true,
        trend,
        deltas: Object.freeze({
            revenue: revenueDelta,
            profit: profitDelta,
            health: healthDelta
        })
    });

    return Object.freeze({
        runtime: WORKER,
        history
    });
}

module.exports = Object.freeze({ identity: WORKER, execute });
