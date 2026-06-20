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

  console.log(
  "CAMPAIGN JOBS CREATED",
  {
    campaignId,
    count: plans.length,
    plans: plans.map(
      p => p.videoType
    )
  }
);

  const jobs = [];

for (
  const plan of plans
) {

  console.log(
    "CREATING JOB:",
    plan.videoType,
    plan.title
  );

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

  console.log(
    "JOB CREATED:",
    job.id,
    plan.videoType
  );

  jobs.push(job);

}

  return jobs;

}

module.exports = {
  createCampaignJobs
};