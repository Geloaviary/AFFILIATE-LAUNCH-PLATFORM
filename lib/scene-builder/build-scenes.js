function buildScenes(
  videoPlan = {}
) {

  const scenes =
    videoPlan.scenes || [];

  let currentTime = 0;

  return scenes.map(
    (scene, index) => {

      const builtScene = {

        id:
          `scene_${index + 1}`,

        start:
          currentTime,

        duration:
          scene.duration || 5,

        purpose:
          scene.purpose ||

          "scene",

        narration:
          scene.narration ||

          "",

        visualType:
          scene.visualType ||

          "stock",

        assets:
          scene.assets || []

      };

      currentTime +=
        builtScene.duration;

      return builtScene;

    }
  );

}

module.exports = {
  buildScenes
};