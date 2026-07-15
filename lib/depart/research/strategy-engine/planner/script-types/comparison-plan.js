function execute({
  winner = {},
  competitor = {},
  assets = {}
} = {}) {

  if (
    !winner?.name ||
    !competitor?.name
  ) {

    throw new Error(
      "COMPARISON PLAN FAILED: winner or competitor missing"
    );

  }

  const nameA =
    winner.name;

  const nameB =
    competitor.name;

  const logoA =

    winner.assets?.logos?.[0] ||

    assets.logos?.[0] ||

    null;

  const logoB =

    competitor.assets?.logos?.[0] ||

    null;

  const screenshotA =

    winner.assets?.screenshots?.[0] ||

    assets.screenshots?.[0] ||

    null;

  const screenshotB =

    competitor.assets?.screenshots?.[0] ||

    null;

    const scenes = [

  {
    scene: 1,

    purpose:
      "hook",

    duration:
      6,

    narration:
      `${nameA} vs ${nameB}. Which is the better choice this year?`,

    visualType:
      "comparison-cover",

    assets: [
      logoA,
      logoB
    ].filter(Boolean)
  },

  {
    scene: 2,

    purpose:
      "overview",

    duration:
      8,

    narration:
      `${nameA} and ${nameB} are both popular options, but they serve different audiences and use cases.`,

    visualType:
      "side-by-side",

    assets: [
      screenshotA,
      screenshotB
    ].filter(Boolean)
  },

  {
    scene: 3,

    purpose:
      "advantage",

    duration:
      8,

    narration:
  `${nameA} achieved an opportunity score of ${
    winner.longtermScore?.score || "N/A"
  }, making it the strongest opportunity among the researched products.`,

    visualType:
      "feature-comparison",

    assets: [
      screenshotA
    ].filter(Boolean)
  },

  {
    scene: 4,

    purpose:
      "recommendation",

    duration:
      8,

    narration:
      `${nameA} is the recommended choice for most users looking for long-term value and growth.`,

    visualType:
      "winner",

    assets: [
      logoA
    ].filter(Boolean)
  },

  {
    scene: 5,

    purpose:
      "cta",

    duration:
      6,

    narration:
      `Learn more about ${nameA} using the link below.`,

    visualType:
      "cta",

    assets: [
      logoA
    ].filter(Boolean)
  }

];

return {

  title:
    `${nameA} vs ${nameB}`,

  videoType:
    "comparison",

  duration:
    36,

  themeColor:
    assets.themeColor || null,

  scenes

};

}

module.exports =

Object.freeze({

    execute

});