const {
  generateJobId,
  saveJob
} = require(
  "./job-store"
);

async function createJob({

  type,

  payload = {},

  priority = 5,

  campaignId = null,

  userId = null

} = {}) {

  const now =
    new Date()
      .toISOString();

  const job = {

    id:
      generateJobId(),

    type,

    status:
      "queued",

    priority,

    campaignId,

    userId,

    payload,

    createdAt:
      now,

    updatedAt:
      now,

    startedAt:
      null,

    completedAt:
      null,

    failedAt:
      null,

    attempts:
      0,

    maxAttempts:
      3,

    error:
      null,

    result:
      null

  };

  await saveJob(
  job
);

 return job;

}

module.exports = {
  createJob
};