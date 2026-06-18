const {
  getJob,
  saveJob
} = require(
  "./job-store"
);

const {
  updateCampaignProduction
} = require(
  "../campaign-engine/update-campaign-production"
);

async function completeJob({

  jobId,

  result = null

} = {}) {

  const job =
    await getJob(
      jobId
    );

  if (!job) {

    throw new Error(
      `Job not found: ${jobId}`
    );

  }

  const now =
    new Date()
      .toISOString();

  job.status =
    "completed";

  job.result =
    result;

  job.completedAt =
    now;

  job.updatedAt =
    now;

  await saveJob(
    job
  );

  if (
    job.campaignId
  ) {

    await updateCampaignProduction({

      campaignId:
        job.campaignId,

      job,

      result

    });

  }

  return job;

}

module.exports = {
  completeJob
};