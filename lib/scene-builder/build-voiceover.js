function buildVoiceover(
  scenes = [],
  options = {}
) {

  const provider =
    options.provider ||
    "openai";

  const voiceMap = {

  shorts:
    "alloy",

  tiktok:
    "nova",

  youtube:
    "echo"

};

const voice =
  options.voice ||

  voiceMap[
    options.platform
  ] ||

  "alloy";

  return scenes.map(
    scene => {

      const narration =
        String(
          scene.narration || ""
        ).trim();

      const estimatedWords =
        narration
          .split(/\s+/)
          .filter(Boolean)
          .length;

      const estimatedDuration =
        Number(
          (
            estimatedWords /
            (
              options.wordsPerSecond ||
              2.5
            )
          ).toFixed(2)
        );

      return {

        ...scene,

        voiceover: {

          voiceoverId:
        `${scene.id}_voiceover`,

          provider,

          fallbackProvider:
            "elevenlabs",

          voice,

          text:
            narration,

          estimatedWords,

          estimatedDuration,

          status:
            "pending"

        }

      };

    }
  );

}

module.exports = {
  buildVoiceover
};