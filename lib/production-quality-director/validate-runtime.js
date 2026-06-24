function validateRuntime(
  blueprint = {}
) {

  const duration =
    blueprint?.timeline?.scenes
      ?.reduce(
        (sum, scene) =>
          sum + (
            scene.duration || 0
          ),
        0
      ) || 0;

  const violations = [];

  if (duration < 30) {

    violations.push(
      `Runtime too short (${duration}s)`
    );

  }

  if (duration > 45) {

    violations.push(
      `Runtime too long (${duration}s)`
    );

  }

  return {

    duration,

    passed:
      violations.length === 0,

    violations

  };

}

module.exports = {
  validateRuntime
};