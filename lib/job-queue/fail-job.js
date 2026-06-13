const {
  getJob,
  saveJob
} = require(
  "./job-store"
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
  await saveJob(
  job
);

  return job;

}

module.exports = {
  failJob
};