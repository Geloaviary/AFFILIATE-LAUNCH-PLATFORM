function execute({
  title = "",
  items = [],
  assets = {}
} = {}) {

  if (
    !Array.isArray(items) ||
    items.length < 3
  ) {

    throw new Error(
      "LISTICLE PLAN FAILED: minimum 3 ranked products required"
    );

  }

  const rankedItems =
    items.slice(0, 3);

  const scenes = [

    {
      scene: 1,

      purpose:
        "hook",

      duration:
        6,

      narration:
        title,

      visualType:
        "listicle-cover",

      assets: []
    }

  ];

  rankedItems.forEach(
    (item, index) => {

      scenes.push({

        scene:
          scenes.length + 1,

        purpose:
          "ranked-item",

        duration:
          8,

        narration:
          `Number ${index + 1}: ${item.name}. ${item.reason || item.description || ""}`,

        visualType:
          "product",

        assets:
          item.assets?.screenshots ||

          item.assets?.logos ||

          []

      });

    }
  );

  scenes.push({

    scene:
      scenes.length + 1,

    purpose:
      "winner",

    duration:
      8,

    narration:
      `${rankedItems[0].name} ranked highest based on overall opportunity score and long-term potential.`,

    visualType:
      "winner",

    assets:
      rankedItems[0]?.assets?.logos ||

      []

  });

  scenes.push({

    scene:
      scenes.length + 1,

    purpose:
      "cta",

    duration:
      6,

    narration:
      `Learn more about ${rankedItems[0].name} using the link below.`,

    visualType:
      "cta",

    assets:
      rankedItems[0]?.assets?.logos ||

      []

  });

  return {

    title,

    videoType:
      "listicle",

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