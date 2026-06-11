function buildCaptions(
  scenes = []
) {

  return scenes.map(
    scene => {

      const narration =
        String(
          scene.narration || ""
        ).trim();

      const words =
        narration.length
          ? narration.split(/\s+/)
          : [];

      const captionDuration =
        words.length
          ? scene.duration /
            Math.max(
              words.length,
              1
            )
          : scene.duration;

      const captions =
        words.map(
          (
            word,
            index
          ) => ({

            id:
              `${scene.id}_caption_${
                index + 1
              }`,

            text:
              word,

            start:
              Number(
                (
                  scene.start +
                  index *
                    captionDuration
                ).toFixed(2)
              ),

            duration:
              Number(
                captionDuration.toFixed(
                  2
                )
              )

          })
        );

      return {

        ...scene,

        captions

      };

    }
  );

}

module.exports = {
  buildCaptions
};