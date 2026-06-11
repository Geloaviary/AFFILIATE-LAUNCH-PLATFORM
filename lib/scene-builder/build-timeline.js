function buildTimeline(
  scenes = []
) {

  const timeline =
    scenes.map(
      scene => ({

        id:
          scene.id,

        start:
          scene.start || 0,

        duration:
          scene.duration || 0,

        end:
          (scene.start || 0) +
          (scene.duration || 0),

        renderPriority:

         scene.purpose === "hook"
           ? 1

           : scene.purpose === "cta"
           ? 1

           : 2,

        purpose:
          scene.purpose ||

          "scene",

        transition: {

          type:
           "fade",

          duration:
            0.3

        },

        visual: {

          type:
            scene.visualType ||

            "stock",

          asset:
            scene.primaryAsset ||

            scene.assets?.[0] ||

            null

        },

        voiceover:
          scene.voiceover ||

          null,

        captions:
          scene.captions ||

          []

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