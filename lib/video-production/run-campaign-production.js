const {
  runVideoProduction
} = require(
  "./run-video-production"
);

const {
  buildContentStrategy
} = require(
  "../content-strategist/build-content-strategy"
);

async function runCampaignProduction({

  winner,

  assets,

  campaignIntelligence,

  productIntelligence,

  videoPlan,

  tutorialPlan,

  reviewPlan,

  comparisonPlan,

  listiclePlan

} = {}) {

  const plans = [

    videoPlan,

    tutorialPlan,

    reviewPlan,

    comparisonPlan,

    listiclePlan

  ].filter(Boolean);

  const videos = await Promise.all(

  plans.map(
    async plan => {

      try {

        const result =
          await runVideoProduction({

            plan,

            assets

          });

        return {

          type:
            plan.videoType,

          title:
            plan.title,

          videoUrl:
            result
              .renderResult
              ?.url || null,

          oracleBlueprint:
            result
              .oracleBlueprint,

          renderPayload:
            result
              .renderPayload

        };

      } catch (e) {

        console.error(

          "Campaign Production:",

          plan.videoType,

          e.message

        );

        return null;

      }

    }
  )

);

const successfulVideos =
  videos.filter(Boolean);

  const strategy =
    buildContentStrategy({

      winner,

      campaignIntelligence,

      productIntelligence,

      videos:
         successfulVideos

    });

  return {

    winner,

    videos:

      strategy.videos,

    recommendedPostingOrder:

      strategy
        .recommendedPostingOrder,

    platformRecommendations:

      strategy
        .platformRecommendations,

    dailySchedule:

      strategy
        .dailySchedule

  };

}

module.exports = {
  runCampaignProduction
};