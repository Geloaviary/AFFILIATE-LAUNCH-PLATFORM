const {
  validateRuntime
} = require(
  "./validate-runtime"
);

const {
  validateNarration
} = require(
  "./validate-narration"
);

const {
  validateScenes
} = require(
  "./validate-scenes"
);

const {
  validateCTA
} = require(
  "./validate-cta"
);

const {
  validateAssets
} = require(
  "./validate-assets"
);

const {
  validateVisualRelevance
} = require(
  "./validate-visual-relevance"
);

async function runQC(
  blueprint
) {

  const runtime =
    validateRuntime(
      blueprint
    );

  const narration =
    validateNarration(
      blueprint
    );

  const scenes =
    validateScenes(
      blueprint
    );

  const cta =
    validateCTA(
      blueprint
    );

  const assets =
    validateAssets(
      blueprint
    );

  const visual =
  validateVisualRelevance(
    blueprint
  );

  const violations = [

  ...(runtime?.violations || []),

  ...(narration?.violations || []),

  ...(scenes?.violations || []),

  ...(cta?.violations || []),

  ...(assets?.violations || []),

  ...(visual?.violations || [])

];

  const score =
   Math.max(
    0,
    100 -
    (violations.length * 10)
  );

  const approved =
   score >= 70;

  return {

    approved,

    score,

    runtime,

    narration,

    scenes,

    cta,

    assets,

    visual,

    violations,

    reviewedAt:
      new Date()
        .toISOString()

  };

}

module.exports = {
  runQC
};