function buildTutorialPlan({
  winner = {},
  campaignIntelligence = {},
  productIntelligence = {},
  assets = {}
} = {}) {

  const name =
    winner.name ||
    "This Tool";

  const logo =
    assets.logos?.[0] ||
    null;

  const screenshot1 =
    assets.screenshots?.[0] ||
    null;

  const screenshot2 =
    assets.screenshots?.[1] ||
    screenshot1;

  const screenshot3 =
    assets.screenshots?.[2] ||
    screenshot2;

  const tutorialSteps = [

  productIntelligence.useCases?.[0],

  productIntelligence.useCases?.[1],

  productIntelligence.useCases?.[2]

].filter(Boolean);

const fallbackSteps = [

  "Create your account",

  "Configure your settings",

  "Launch your first project"

];

while (
  tutorialSteps.length < 3
) {

  tutorialSteps.push(
    fallbackSteps[
      tutorialSteps.length
    ]
  );

}

  const scenes = [

    {
      scene: 1,

      purpose:
        "hook",

      duration:
        8,

      narration:

         productIntelligence.videoHooks?.[0]

        ||

        `Here's how to get started with ${name} in just a few minutes.`,

      visualType:
        "logo",

      assets:
        logo
          ? [logo]
          : []
    },

    {
      scene: 2,

      purpose:
        "overview",

      duration:
        10,

      narration:

        productIntelligence.painPoints?.[0]

        ||  

       `${name} helps users save time and improve productivity.`,

      visualType:
        "dashboard",

      assets:
        screenshot1
          ? [screenshot1]
          : []
    },

    {
      scene: 3,

      purpose:
        "step",

      duration:
        15,

      narration:
        `Step 1. ${tutorialSteps[0]}`,

      visualType:
        "tutorial",

      assets:
        screenshot1
          ? [screenshot1]
          : []
    },

    {
      scene: 4,

      purpose:
        "step",

      duration:
        15,

      narration:
        `Step 2. ${tutorialSteps[1]}`,

      visualType:
        "tutorial",

      assets:
        screenshot2
          ? [screenshot2]
          : []
    },

    {
      scene: 5,

      purpose:
        "step",

      duration:
        15,

      narration:
        `Step 3. ${tutorialSteps[2]}`,

      visualType:
        "tutorial",

      assets:
        screenshot3
          ? [screenshot3]
          : []
    },

    {
      scene: 6,

      purpose:
        "result",

      duration:
        12,

      narration:

        productIntelligence.benefits?.[0]

        ||

       `You now have a working setup inside ${name}.`,

      visualType:
        "dashboard",

      assets:
        screenshot1
          ? [screenshot1]
          : []
    },

    {
      scene: 7,

      purpose:
        "benefit",

      duration:
        10,

      narration:
        productIntelligence.desires?.[0]

        ||

        campaignIntelligence.desires?.[0] ||
        `Start getting results faster with ${name}.`,

      visualType:
        "screenshot",

      assets:
        screenshot2
          ? [screenshot2]
          : []
    },

    {
      scene: 8,

      purpose:
        "cta",

      duration:
        5,

      narration:
        `Try ${name} using the link below.`,

      visualType:
        "logo",

      assets:
        logo
          ? [logo]
          : []
    }

  ];

  return {

    title:
      `How To Use ${name}`,

    videoType:
      "tutorial",

    duration:
      scenes.reduce(
        (sum, scene) =>
          sum + scene.duration,
        0
      ),

    themeColor:
      assets.themeColor ||
      null,

    scenes

  };

}

module.exports = {
  buildTutorialPlan
};