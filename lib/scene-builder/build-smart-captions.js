function buildSmartCaptions(
  scenes = [],
  options = {}
) {

  const platform =
  options.platform ||
  "shorts";

  const wordsPerCaption = {

  tiktok: 3,

  reels: 4,

  shorts: 4,

  youtube: 6

}[platform] || 4;

  return scenes.map(
    scene => {

      const narration =
        String(
          scene.narration || ""
        ).trim();

      if (!narration) {

        return {

          ...scene,

          captions: []

        };

      }

      const words =
        narration.split(/\s+/);

      const chunks = [];

      for (
        let i = 0;
        i < words.length;
        i += wordsPerCaption
      ) {

        chunks.push(

          words
            .slice(
              i,
              i +
              wordsPerCaption
            )
            .join(" ")

        );

      }

      const chunkDuration =
        scene.duration /
        Math.max(
          chunks.length,
          1
        );

      const captions =
  chunks.map(
    (
      text,
      index
    ) => {

      const emphasis =

        /\b\d+\b/.test(text) ||

        /\b(save|free|best|faster|easy|instant|hours|days|weeks)\b/i
          .test(text);

      return {

        id:
          `${scene.id}_caption_${
            index + 1
          }`,

        text,

        emphasis,

        start:
          Number(
            (
              scene.start +
              index *
                chunkDuration
            ).toFixed(2)
          ),

        duration:
          Number(
            chunkDuration.toFixed(
              2
            )
          )

      };

    }
  );
      

      return {

        ...scene,

        captions

      };

    }
  );

}

module.exports = {
  buildSmartCaptions
};