// lib/production-quality-director/validate-visual-relevance.js

function validateVisualRelevance(
  blueprint = {}
) {

  const scenes =
    blueprint?.timeline?.scenes || [];

  const violations = [];

  let score = 100;

  scenes.forEach(
    (scene, index) => {

      const assets =
        scene.assets || [];

      if (!assets.length) {

        violations.push({

          scene:
            index + 1,

          code:
            "NO_ASSETS",

          message:
            "Scene has no assets"

        });

        score -= 25;

        return;

      }

      const assetText =
        JSON.stringify(
          assets
        ).toLowerCase();

      const narration =
        String(
          scene.narration || ""
        ).toLowerCase();

      const keywords =
        narration
          .split(/\W+/)
          .filter(
            word =>
              word.length > 4
          );

      const matched =
        keywords.some(
          keyword =>
            assetText.includes(
              keyword
            )
        );

      if (!matched) {

        violations.push({

          scene:
            index + 1,

          code:
            "LOW_RELEVANCE",

          message:
            "Assets do not appear related to narration"

        });

        score -= 10;

      }

      const verticalMatch =

        assetText.includes(
          "vertical"
        ) ||

        assetText.includes(
          "portrait"
        ) ||

        assetText.includes(
          "9:16"
        );

      if (!verticalMatch) {

        violations.push({

          scene:
            index + 1,

          code:
            "NOT_VERTICAL",

          message:
            "No vertical asset detected"

        });

        score -= 5;

      }

      const genericStockTerms = [

        "business meeting",

        "office workers",

        "city skyline",

        "happy people",

        "teamwork",

        "corporate"

      ];

      const generic =
        genericStockTerms.some(
          term =>
            assetText.includes(
              term
            )
        );

      if (generic) {

        violations.push({

          scene:
            index + 1,

          code:
            "GENERIC_STOCK",

          message:
            "Generic stock footage detected"

        });

        score -= 5;

      }

    }
  );

  score =
    Math.max(
      0,
      score
    );

  return {

    approved:
      score >= 70,

    score,

    violations

  };

}

module.exports = {
  validateVisualRelevance
};