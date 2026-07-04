"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Production Department

learning.js

Constitutional Rule QA-009

Diagnostic Reports

        │
        ▼

Learning Runtime

        │
        ▼

Learning Report

        │
        ▼

Engineering Runtime

--------------------------------------------------

Constitutional Responsibility

This module extracts reusable patterns from
constitutional diagnostic reports.

It NEVER

• Executes Production Workers
• Repairs Artifacts
• Performs Validation
• Writes Platform Memory
• Engineers Solutions
• Mutates Diagnostic Reports

==================================================
*/

const Errors =

    require(

        "../quality-assurance-director/errors"

    );

const {

    assertValidation

} = require(

    "./validator"

);

const {

    assertRepair

} = require(

    "./repair"

);

/*
==================================================
Learning Runtime Identity
==================================================
*/

const LEARNING =

Object.freeze({

    department:

        "production",

    component:

        "learning",

    version:

        "1.0.0"

});

/*
==================================================
Internal Utilities
==================================================
*/

function isObject(

    value

) {

    return (

        value !== null &&

        typeof value ===

            "object"

    );

}

function deepFreeze(

    target,

    visited = new WeakSet()

) {

    if (

        !isObject(

            target

        )

    ) {

        return target;

    }

    if (

        visited.has(

            target

        )

    ) {

        return target;

    }

    visited.add(

        target

    );

    Object.freeze(

        target

    );

    for (

        const key of Object.keys(

            target

        )

    ) {

        deepFreeze(

            target[key],

            visited

        );

    }

    return target;

}

/*
==================================================
Learning Context

Diagnostic Reports

        │

        ▼

Immutable Learning Context

==================================================
*/

function buildLearningContext({

    validation,

    repair

}) {

    assertValidation(

        validation

    );

    assertRepair(

        repair

    );

    return deepFreeze({

        runtime:

            LEARNING,

        validation,

        repair,

        learnedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Learning Pattern

Represents one immutable learning pattern
discovered by the Learning Runtime.

==================================================
*/

function buildPattern({

    id,

    category,

    confidence,

    frequency,

    recommendation

}) {

    return deepFreeze({

        id,

        category,

        confidence,

        frequency,

        recommendation

    });

}

/*
==================================================
Pattern Engine

Extracts reusable intelligence from
constitutional diagnostic reports.

==================================================
*/

function extractPatterns(

    context

) {

    const patterns = [];

    /*
    ----------------------------------
    Validation Patterns
    ----------------------------------
    */

    const grouped =

        new Map();

    for (

        const violation of

        context.validation.violations

    ) {

        const key =

            violation.component;

        if (

            !grouped.has(

                key

            )

        ) {

            grouped.set(

                key,

                []

            );

        }

        grouped

            .get(

                key

            )

            .push(

                violation

            );

    }

    /*
    ----------------------------------
    Pattern Extraction
    ----------------------------------
    */

    for (

        const [

            component,

            violations

        ] of grouped

    ) {

        patterns.push(

            buildPattern({

                id:

                    `PATTERN-${component.toUpperCase()}`,

                category:

                    component,

                confidence:

                    calculateConfidence(

                        violations.length

                    ),

                frequency:

                    violations.length,

                recommendation:

                    buildRecommendation(

                        component,

                        violations.length

                    )

            })

        );

    }

    return deepFreeze(

        patterns

    );

}

/*
==================================================
Confidence Engine

Produces a normalized confidence score
between 0 and 100.

==================================================
*/

function calculateConfidence(

    frequency

) {

    return Math.min(

        frequency * 20,

        100

    );

}

/*
==================================================
Recommendation Engine

Transforms observed patterns into
engineering recommendations.

Learning recommends.

Engineering decides.

==================================================
*/

function buildRecommendation(

    component,

    frequency

) {

    if (

        frequency >= 5

    ) {

        return `Repeated ${component} issues detected. Consider engineering improvements.`;

    }

    if (

        frequency >= 2

    ) {

        return `Monitor ${component} for recurring failures.`;

    }

    return `No engineering action currently required for ${component}.`;

}

/*
==================================================
Learning Metrics

Produces immutable runtime statistics for the
current learning session.

==================================================
*/

function buildLearningMetrics(

    context,

    patterns

) {

    const validation =

        context.validation;

    const repair =

        context.repair;

    return deepFreeze({

        validationViolations:

            validation.violations.length,

        repairsApplied:

            repair.statistics

                ?.repairsApplied || 0,

        patternsDiscovered:

            patterns.length,

        averageConfidence:

            patterns.length === 0

                ? 0

                : Math.round(

                    patterns.reduce(

                        (

                            total,

                            pattern

                        ) =>

                            total +

                            pattern.confidence,

                        0

                    ) /

                    patterns.length

                )

    });

}

/*
==================================================
Learning Report

Immutable constitutional intelligence
produced by the Learning Runtime.

==================================================
*/

function buildLearningReport(

    context,

    patterns

) {

    const metrics =

        buildLearningMetrics(

            context,

            patterns

        );

    return deepFreeze({

        runtime:

            LEARNING,

        learnedAt:

            context.learnedAt,

        patterns,

        metrics,

        recommendations:

            patterns.map(

                pattern =>

                    Object.freeze({

                        id:

                            pattern.id,

                        category:

                            pattern.category,

                        confidence:

                            pattern.confidence,

                        recommendation:

                            pattern.recommendation

                    })

            )

    });

}

/*
==================================================
Learning Report Verification

==================================================
*/

function isLearningReport(

    report

) {

    return (

        isObject(

            report

        ) &&

        isObject(

            report.runtime

        ) &&

        Array.isArray(

            report.patterns

        ) &&

        isObject(

            report.metrics

        ) &&

        Array.isArray(

            report.recommendations

        ) &&

        typeof report.learnedAt ===

            "string"

    );

}

/*
==================================================
Learning Report Assertion

==================================================
*/

function assertLearning(

    report

) {

    if (

        !isLearningReport(

            report

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Learning Report."

        );

    }

    return report;

}

/*
==================================================
Learning Runtime

Diagnostic Reports

        │

        ▼

Learning Context

        │

        ▼

Pattern Extraction

        │

        ▼

Learning Report

==================================================
*/

function execute({

    validation,

    repair

}) {

    /*
    ----------------------------------
    Build Immutable Context
    ----------------------------------
    */

    const context =

        buildLearningContext({

            validation,

            repair

        });

    /*
    ----------------------------------
    Extract Learning Patterns
    ----------------------------------
    */

    const patterns =

        extractPatterns(

            context

        );

    /*
    ----------------------------------
    Build Immutable Report
    ----------------------------------
    */

    const report =

        buildLearningReport(

            context,

            patterns

        );

    /*
    ----------------------------------
    Verify Report
    ----------------------------------
    */

    assertLearning(

        report

    );

    return report;

}

/*
==================================================
Learning Summary

Provides a lightweight immutable summary
used by dashboards, QA and Engineering.

==================================================
*/

function summarizeLearning(

    report

) {

    assertLearning(

        report

    );

    return deepFreeze({

        runtime:

            report.runtime,

        learnedAt:

            report.learnedAt,

        patterns:

            report.patterns.length,

        recommendations:

            report.recommendations.length,

        averageConfidence:

            report.metrics.averageConfidence

    });

}

/*
==================================================
Learning Snapshot

Creates a detached mutable snapshot of the
immutable Learning Report.

==================================================
*/

function snapshotLearning(

    report

) {

    assertLearning(

        report

    );

    return structuredClone(

        report

    );

}

/*
==================================================
Learning Serialization

Canonical transport format.

==================================================
*/

function serializeLearning(

    report

) {

    assertLearning(

        report

    );

    return JSON.stringify(

        report,

        null,

        2

    );

}

/*
==================================================
Public Runtime

Constitutional public interface for the
Production Learning Runtime.

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------
    Runtime
    ----------------------------------
    */

    execute,

    /*
    ----------------------------------
    Operations
    ----------------------------------
    */

    summarizeLearning,

    snapshotLearning,

    serializeLearning

});