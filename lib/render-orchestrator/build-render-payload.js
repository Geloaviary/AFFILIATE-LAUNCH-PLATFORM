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

  typeof scene.visual?.asset ===
  "string"

    ? scene.visual.asset

    : scene.visual?.asset
        ?.thumbnail ||

      scene.visual?.asset
        ?.url ||

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