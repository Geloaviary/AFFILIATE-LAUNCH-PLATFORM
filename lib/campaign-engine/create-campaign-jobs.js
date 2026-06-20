const { kv } = require("@vercel/kv");

const {
  getCampaignIndex
} = require(
  "./campaign-index"
);

const {
  createJob
} = require(
  "../job-queue"
);

async function createCampaignJobs({

  campaignId

} = {}) {

  const index =
  await getCampaignIndex(
    campaignId
  );

if (!index) {

  throw new Error(
    `Campaign index not found: ${campaignId}`
  );

}

const campaign =
  await kv.get(
    index.campaignKey
  );

if (!campaign) {

  throw new Error(
    `Campaign not found: ${campaignId}`
  );

}

const research =
  campaign
    ?.campaignPackage
    ?.research;

  const plans = [

  research?.plans?.short,

  research?.plans?.tutorial,

  research?.plans?.review,

  research?.plans?.comparison,

  research?.plans?.listicle

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

         campaignId,

         planType:
           plan.videoType

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