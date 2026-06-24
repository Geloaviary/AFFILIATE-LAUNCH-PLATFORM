const CTA_PATTERNS = [

  "check the link below",

  "start your free trial",

  "learn more today",

  "follow for more",

  "follow for daily ai business tips",

  "comment below",

  "save this for later",

  "share this with a friend",

  "which platform would you choose",

  "let us know below"

];

function validateCTA(
  blueprint = {}
) {

  const text =
    blueprint?.timeline?.scenes
      ?.map(
        s => s.narration || ""
      )
      .join(" ")
      .toLowerCase();

  const found =
    CTA_PATTERNS.some(
      cta =>
        text.includes(cta)
    );

  return {

    passed: found,

    violations:
      found
        ? []
        : [
            "Missing CTA"
          ]

  };

}

module.exports = {
  validateCTA
};