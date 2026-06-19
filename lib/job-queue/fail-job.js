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

async function failJob({

  jobId,

  error

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

  job.error =

    error instanceof Error

      ? error.message

      : String(error);

  job.updatedAt =
    now;

  if (

  job.attempts <
  job.maxAttempts

) {

  job.status =
    "queued";

  job.workerId =
    null;

  job.startedAt =
    null;

} else {

  job.status =
    "failed";

  job.failedAt =
    now;

}

console.error(
  "JOB FAILED",
  {
    jobId: job.id,
    campaignId: job.campaignId,
    attempts: job.attempts,
    maxAttempts: job.maxAttempts,
    status: job.status,
    error: job.error
  }
);
  
await saveJob(
  job
);

if (

  job.status ===
  "failed" &&

  job.campaignId

) {

  await updateCampaignProduction({

    campaignId:
      job.campaignId,

    job,

    result: {

      state:
        "failed",

      error:
        job.error

    }

  });

}

return job;

}

module.exports = {
  failJob
};