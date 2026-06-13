const {
  getJob,
  saveJob
} = require(
  "./job-store"
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

  return job;

}

module.exports = {
  completeJob
};