function buildTimeline(
  scenes = []
) {

  const timeline =
    scenes.map(
      scene => ({

    ...scene,

    end:
      (scene.start || 0) +
      (scene.duration || 0),

    renderPriority:

      scene.purpose === "hook"
        ? 1
        : scene.purpose === "cta"
        ? 1
        : 2,

    transition: {

      type: "fade",

      duration: 0.3

    },

    visual: {

      ...(scene.visual || {}),

      type:
        scene.visualType ||
        scene.visual?.type ||
        "stock",

      asset:

        scene.primaryAsset ||

        scene.selectedAsset?.asset ||

        scene.assets?.[0] ||

        scene.visual?.asset ||

        null

    }

})
    );

  const totalDuration =
    timeline.reduce(
      (sum, item) =>
        sum +
        (item.duration || 0),
      0
    );

  return {

    version:
      "1.0",

    createdAt:
      new Date()
        .toISOString(),

    totalDuration,

    scenes:
      timeline

  };

}

module.exports = {
  buildTimeline
};