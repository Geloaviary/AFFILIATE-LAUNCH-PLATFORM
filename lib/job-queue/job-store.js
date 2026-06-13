const crypto = require(
  "crypto"
);

const { kv } = require(
  "@vercel/kv"
);

const JOB_PREFIX =
  "job:";

function generateJobId() {

  return crypto
    .randomUUID();

}

function buildJobKey(
  jobId
) {

  return (
    JOB_PREFIX +
    jobId
  );

}

async function getJob(
  jobId
) {

  return kv.get(
    buildJobKey(
      jobId
    )
  );

}

async function getAllJobs() {

  const keys =
    await kv.keys(
      `${JOB_PREFIX}*`
    );

  if (
    !keys.length
  ) {

    return [];

  }

  const jobs =
    await kv.mget(
      keys
    );

  return jobs.filter(
    Boolean
  );

}

async function saveJob(
  job
) {

  await kv.set(

    buildJobKey(
      job.id
    ),

    job

  );

  return job;

}

async function deleteJob(
  jobId
) {

  await kv.del(

    buildJobKey(
      jobId
    )

  );

}

module.exports = {

  generateJobId,

  getJob,

  getAllJobs,

  saveJob,

  deleteJob

};