const crypto = require("crypto");

const jobs =
  new Map();

function generateJobId() {

  return crypto
    .randomUUID();

}

function getJob(
  jobId
) {

  return (
    jobs.get(jobId)
    || null
  );

}

function getAllJobs() {

  return Array.from(
    jobs.values()
  );

}

function saveJob(
  job
) {

  jobs.set(
    job.id,
    job
  );

  return job;

}

function deleteJob(
  jobId
) {

  return jobs.delete(
    jobId
  );

}

module.exports = {

  generateJobId,

  getJob,

  getAllJobs,

  saveJob,

  deleteJob

};