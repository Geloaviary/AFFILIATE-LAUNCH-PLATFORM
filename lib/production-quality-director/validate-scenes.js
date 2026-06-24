function validateScenes(
  blueprint = {}
) {

  const count =
    blueprint?.timeline?.scenes
      ?.length || 0;

  const violations = [];

  if (count < 6) {

    violations.push(
      `Too few scenes (${count})`
    );

  }

  if (count > 9) {

    violations.push(
      `Too many scenes (${count})`
    );

  }

  return {

    count,

    passed:
      violations.length === 0,

    violations

  };

}

module.exports = {
  validateScenes
};