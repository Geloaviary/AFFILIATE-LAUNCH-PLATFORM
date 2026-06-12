const {
  buildTutorialPlan
} = require(
  "./lib/video-planner/build-tutorial-plan"
);

const plan =
  buildTutorialPlan({

    winner: {
      name: "Ahrefs"
    },

    productIntelligence: {

      videoHooks: [
        "A walkthrough of Ahrefs features"
      ],

      painPoints: [
        "Low website traffic"
      ],

      useCases: [
        "Keyword research",
        "Backlink analysis",
        "Competitor analysis"
      ],

      benefits: [
        "Improve SEO performance"
      ],

      desires: [
        "Increase website visibility"
      ]

    }

  });

console.log(
  JSON.stringify(
    plan,
    null,
    2
  )
);