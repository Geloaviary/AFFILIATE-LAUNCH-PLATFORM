function validateNarration(
  blueprint = {}
) {

  const narration =
    blueprint?.timeline?.scenes
      ?.map(
        s => s.narration || ""
      )
      .join(" ") || "";

  const words =
    narration
      .split(/\s+/)
      .filter(Boolean)
      .length;

  const violations = [];

  if (words < 90) {

    violations.push(
      `Narration too short (${words} words)`
    );

  }

  if (words > 150) {

    violations.push(
      `Narration too long (${words} words)`
    );

  }

  return {

    words,

    passed:
      violations.length === 0,

    violations

  };

}

module.exports = {
  validateNarration
};