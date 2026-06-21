function validateVideoPlans(
  research = {}
) {

  const errors = [];

  const plans =
    research.plans || {};

  const requiredPlans = [

    "short",

    "tutorial",

    "review",

    "comparison",

    "listicle"

  ];

  for (
    const type
    of requiredPlans
  ) {

    const plan =
      plans[type];

    if (!plan) {

      errors.push(
        `${type} plan missing`
      );

      continue;

    }

    if (
      !Array.isArray(
        plan.scenes
      ) ||

      !plan.scenes.length
    ) {

      errors.push(
        `${type} has no scenes`
      );

      continue;

    }

    plan.scenes.forEach(
      (
        scene,
        index
      ) => {

        if (
          !scene.narration
        ) {

          errors.push(
            `${type} scene ${index} narration missing`
          );

        }

        if (
          !scene.visualType
        ) {

          errors.push(
            `${type} scene ${index} visualType missing`
          );

        }

      }
    );

  }

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validateVideoPlans
};