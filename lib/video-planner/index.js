const {
  buildShortPlan
} = require(
  "./build-short-plan"
);

const {
  buildReviewPlan
} = require(
  "./build-review-plan"
);

const {
  buildComparisonPlan
} = require(
  "./build-comparison-plan"
);

const {
  buildTutorialPlan
} = require(
  "./build-tutorial-plan"
);

const {
  buildListiclePlan
} = require(
  "./build-listicle-plan"
);

function buildVideoPlan(
  type = "short",
  payload = {}
) {

  switch (
    String(type)
      .toLowerCase()
  ) {

    case "short":

      return buildShortPlan(
        payload
      );

    case "review":

      return buildReviewPlan(
        payload
      );

    case "comparison":

      return buildComparisonPlan(
        payload
      );

    case "tutorial":

      return buildTutorialPlan(
        payload
      );

    case "listicle":

      return buildListiclePlan(
        payload
      );

    default:

      console.warn(
        "Unknown video type:",
        type
      );

      return buildShortPlan(
        payload
      );

  }

}

module.exports = {

  buildVideoPlan,

  buildShortPlan,

  buildReviewPlan,

  buildComparisonPlan,

  buildTutorialPlan,

  buildListiclePlan

};