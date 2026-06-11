function buildListiclePlan({
  title = "",
  items = [],
  assets = {}
} = {}) {

  const rankedItems =
    Array.isArray(items)
      ? items.slice(0, 10)
      : [];

  const scenes = [];

  scenes.push({

    scene: 1,

    purpose:
      "hook",

    duration:
      8,

    narration:
      title ||
      `Here are the best tools you should know about.`,

    visualType:
      "listicle-cover",

    assets: []

  });

  rankedItems.forEach(
    (item, index) => {

      const rank =
        rankedItems.length -
        index;

      scenes.push({

        scene:
          scenes.length + 1,

        purpose:
          "ranked-item",

        duration:
          10,

        narration:
          `Number ${rank}: ${item.name}. ${item.reason || ""}`,

        visualType:
          "product",

        assets:
          item.assets || []

      });

    }
  );

  scenes.push({

    scene:
      scenes.length + 1,

    purpose:
      "winner",

    duration:
      10,

    narration:
      rankedItems[0]
        ? `${rankedItems[0].name} is our top recommendation.`
        : "Choose the tool that best fits your needs.",

    visualType:
      "winner",

    assets:
      rankedItems[0]?.assets || []

  });

  scenes.push({

    scene:
      scenes.length + 1,

    purpose:
      "cta",

    duration:
      5,

    narration:
      "Check the links below to learn more.",

    visualType:
      "cta",

    assets: []

  });

  return {

    title:
      title ||
      "Best Tools",

    videoType:
      "listicle",

    duration:
      scenes.reduce(
        (total, scene) =>
          total +
          scene.duration,
        0
      ),

    themeColor:
      assets.themeColor ||
      null,

    scenes

  };

}

module.exports = {
  buildListiclePlan
};