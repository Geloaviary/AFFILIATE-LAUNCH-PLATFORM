const {
  getAllJobs,
  saveJob
} = require(
  "./job-store"
);

const {
  updateCampaignProduction
} = require(
  "../campaign-engine/update-campaign-production"
);

async function claimJob({

  workerId = "worker"

} = {}) {

  const queuedJobs =

    (await getAllJobs())

      .filter(
        job =>
          job.status ===
          "queued"
      )

      .sort(
        (a, b) => {

          if (
            a.priority !==
            b.priority
          ) {

            return (
              a.priority -
              b.priority
            );

          }

          return (
            new Date(
              a.createdAt
            ) -

            new Date(
              b.createdAt
            )
          );

        }
      );

  const job =
    queuedJobs[0];

  if (!job) {

    return null;

  }

  const now =
    new Date()
      .toISOString();

  job.status =
    "processing";

  job.workerId =
    workerId;

  job.startedAt =
    now;

  job.updatedAt =
    now;

  job.attempts += 1;

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

    result: {

      state:
        "processing"

    }

  });

}

return job;

}

module.exports = {
  claimJob
};