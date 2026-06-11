function buildRenderPayload(
  oracleBlueprint = {}
) {

  const scenes =
    oracleBlueprint
      ?.timeline
      ?.scenes || [];

  const narration =
    scenes
      .map(
        scene =>
          scene.voiceover?.text || ""
      )
      .join(". ");

  return {

    narration,

    scenes:

      scenes.map(
        scene => ({

          image:
            scene.visual?.asset ||

            null,

          text:
            scene.voiceover?.text ||

            ""

        })
      )

  };

}

module.exports = {
  buildRenderPayload
};