const {
  createJob
} = require(
  "../job-queue"
);

async function createCampaignJobs({

  campaignId = null,

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

  const jobs = [];

  for (
    const plan of plans
  ) {

    const job =
      await createJob({

        type:
          "video-render",

        campaignId,

        priority:
          1,

        payload: {

          winner,

          assets,

          campaignIntelligence,

          productIntelligence,

          plan

        }

      });

    jobs.push(job);

  }

  return jobs;

}

module.exports = {
  createCampaignJobs
};