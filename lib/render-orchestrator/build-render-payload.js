function buildRenderPayload(
  oracleBlueprint = {}
) {

  const scenes =
    oracleBlueprint
      ?.timeline
      ?.scenes || [];

  return {

    plan: {

      scenes:

        scenes.map(
          scene => ({

            voiceover: {

              text:
                scene.voiceover?.text ||
                ""

            },

            assets: [

              typeof scene.visual?.asset ===
              "string"

                ? scene.visual.asset

                : scene.visual?.asset
                    ?.thumbnail ||

                  scene.visual?.asset
                    ?.url ||

                  null

            ].filter(Boolean)

          })
        )

    }

  };

}

module.exports = {
  buildRenderPayload
};