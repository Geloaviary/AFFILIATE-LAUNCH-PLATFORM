const {
  createJob
} = require(
  "./create-job"
);

const {
  claimJob
} = require(
  "./claim-job"
);

const {
  completeJob
} = require(
  "./complete-job"
);

const {
  failJob
} = require(
  "./fail-job"
);

const {
  getJob,
  getAllJobs,
  saveJob,
  deleteJob
} = require(
  "./job-store"
);

module.exports = {

  createJob,

  claimJob,

  completeJob,

  failJob,

  getJob,

  getAllJobs,

  saveJob,

  deleteJob

};