
// lib/production-quality-director/validate-visual-relevance.js

function validateVisualRelevance(
  blueprint = {}
) {

  const scenes =
    blueprint?.timeline?.scenes || [];

  const brand =
    String(
      blueprint?.title || ""
    ).toLowerCase();

  const violations = [];

  let score = 100;

  scenes.forEach(
    (scene, index) => {

      const sceneNumber =
        index + 1;

      const assets =
        scene.assets || [];

      if (!assets.length) {

        violations.push({

          scene:
            sceneNumber,

          code:
            "NO_ASSETS",

          message:
            "Scene has no assets"

        });

        score -= 25;

        return;

      }

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

      let sceneHasVertical =
        false;

      let sceneHasRelevantAsset =
        false;

      let sceneHasBrandAsset =
        false;

      let sceneHasGenericAsset =
        false;

      assets.forEach(
        asset => {

          const assetText =
            JSON.stringify(
              asset
            ).toLowerCase();

          const orientation =

            String(

              asset?.orientation ||

              asset?.aspectRatio ||

              asset?.ratio ||

              ""

            ).toLowerCase();

          const tags =

            asset?.tags || [];

          const relevanceScore =

            Number(
              asset?.relevanceScore || 0
            );

          const vertical =

            orientation.includes(
              "9:16"
            ) ||

            orientation.includes(
              "vertical"
            ) ||

            orientation.includes(
              "portrait"
            );

          if (
            vertical
          ) {

            sceneHasVertical =
              true;

          }

          const matches =
            keywords.filter(
              keyword =>

                assetText.includes(
                  keyword
                ) ||

                tags.some(
                  tag =>
                    String(tag)
                      .toLowerCase()
                      .includes(
                        keyword
                      )
                )

            ).length;

          const relevanceRatio =
            matches /
            Math.max(
              keywords.length,
              1
            );

          if (

            relevanceRatio >= 0.30 ||

            relevanceScore >= 70

          ) {

            sceneHasRelevantAsset =
              true;

          }

          if (

            brand &&

            assetText.includes(
              brand
            )

          ) {

            sceneHasBrandAsset =
              true;

          }

          const genericTerms = [

            "business meeting",

            "office workers",

            "city skyline",

            "teamwork",

            "corporate",

            "happy people",

            "dancing",

            "lifestyle",

            "coworking"

          ];

          if (

            genericTerms.some(
              term =>
                assetText.includes(
                  term
                )
            )

          ) {

            sceneHasGenericAsset =
              true;

          }

        }
      );

      if (
        !sceneHasVertical
      ) {

        violations.push({

          scene:
            sceneNumber,

          code:
            "NOT_VERTICAL",

          message:
            "No vertical asset detected"

        });

        score -= 5;

      }

      if (
        !sceneHasRelevantAsset
      ) {

        violations.push({

          scene:
            sceneNumber,

          code:
            "LOW_RELEVANCE",

          message:
            "Assets do not match narration"

        });

        score -= 10;

      }

      if (

        brand &&

        !sceneHasBrandAsset

      ) {

        violations.push({

          scene:
            sceneNumber,

          code:
            "LOW_BRAND_RELEVANCE",

          message:
            "Brand not represented in scene assets"

        });

        score -= 3;

      }

      if (
        sceneHasGenericAsset
      ) {

        violations.push({

          scene:
            sceneNumber,

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

    scenesReviewed:
      scenes.length,

    visualViolations:
      violations.length,

    violations

  };

}

module.exports = {
  validateVisualRelevance
};

