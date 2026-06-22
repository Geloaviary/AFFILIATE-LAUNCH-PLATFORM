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

  const firstSceneHooks =
    [];

  for (
    const planType
    of requiredPlans
  ) {

    const plan =
      plans[planType];

    if (!plan) {

      errors.push(
        `${planType} plan missing`
      );

      continue;

    }

    const scenes =
      plan.scenes || [];

    if (
      !scenes.length
    ) {

      errors.push(
        `${planType} has no scenes`
      );

      continue;

    }

    /*
     * DURATION
     */

    const totalDuration =
      scenes.reduce(

        (
          total,
          scene
        ) =>

          total +
          (
            scene.duration ||
            0
          ),

        0

      );

    if (
      totalDuration < 30
    ) {

      errors.push(
        `${planType} duration below 30s`
      );

    }

    if (
      totalDuration > 45
    ) {

      errors.push(
        `${planType} duration above 45s`
      );

    }

    /*
     * HOOK
     */

    const firstScene =
      scenes[0];

    if (
      !firstScene?.narration
    ) {

      errors.push(
        `${planType} missing hook`
      );

    } else {

      firstSceneHooks.push(
        firstScene.narration
      );

    }

    /*
     * CTA
     */

    const lastScene =
      scenes[
        scenes.length - 1
      ];

    const ctaText =

      (
        lastScene
          ?.narration ||
        ""
      )
      .toLowerCase();

    if (

      !ctaText.includes(
        "link"
      ) &&

      !ctaText.includes(
        "check"
      ) &&

      !ctaText.includes(
        "try"
      ) &&

      !ctaText.includes(
        "visit"
      ) &&

      !ctaText.includes(
        "learn"
      )

    ) {

      errors.push(
        `${planType} missing CTA`
      );

    }

    /*
     * SCENES
     */

    scenes.forEach(
      (
        scene,
        index
      ) => {

        if (
          !scene.narration
        ) {

          errors.push(
            `${planType} scene ${index} narration missing`
          );

        }

        if (
          !scene.visualType
        ) {

          errors.push(
            `${planType} scene ${index} visualType missing`
          );

        }

        if (
          !scene.duration
        ) {

          errors.push(
            `${planType} scene ${index} duration missing`
          );

        }

        const text =
          JSON.stringify(
            scene
          ).toLowerCase();

        const banned = [

          "product a",
          "product b",
          "placeholder",
          "tbd",
          "coming soon",
          "lorem ipsum"

        ];

        for (
          const word
          of banned
        ) {

          if (
            text.includes(
              word
            )
          ) {

            errors.push(
              `${planType} scene ${index} contains placeholder: ${word}`
            );

          }

        }

      }
    );

  }

  /*
   * ANGLE DIVERSITY
   */

  if (

    new Set(
      firstSceneHooks
    ).size !==
    firstSceneHooks.length

  ) {

    errors.push(
      "duplicate content angles detected"
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