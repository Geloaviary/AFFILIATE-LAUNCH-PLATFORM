/*
========================================
QUALITY ASSURANCE DIRECTOR

Learning Engine

Discovers recurring patterns,
generates recommendations,
and proposes optimizations.

========================================
*/

function updateLearning(
  metrics = {}
) {

  metrics.learning.discoveredPatterns =

    Object.entries(
      metrics.violations || {}
    )

    .filter(
      ([, count]) =>
        count >= 3
    )

    .map(
      ([rule]) => rule
    );

  metrics.learning.recurringFailures =

    metrics.learning
      .discoveredPatterns;

  metrics.learning.recommendations =

    metrics.learning
      .discoveredPatterns

      .map(
        rule =>

          `Improve validator for ${rule}`
      );

  metrics.learning.autoOptimizations =

    metrics.learning
      .recommendations

      .map(
        recommendation => ({

          recommendation,

          status:
            "pending",

          createdAt:
            new Date()
              .toISOString()

        })
      );

  metrics.learning.successfulStrategies =

    Object.entries(
      metrics.departments || {}
    )

    .filter(
      ([, dept]) =>
        dept.reputation >= 95
    )

    .map(
      ([name]) => name
    );

  metrics.learning.confidenceScore =

    calculateConfidence(
      metrics
    );

  return metrics;

}

function calculateConfidence(
  metrics = {}
) {

  const pass =
    metrics.passRate || 0;

  const repair =
    metrics.repairRate || 0;

  return Math.max(

    0,

    Math.min(

      100,

      Math.round(

        pass -

        repair / 2

      )

    )

  );

}

module.exports = {

  updateLearning

};