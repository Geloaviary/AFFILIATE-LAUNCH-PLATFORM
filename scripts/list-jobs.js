require("dotenv").config({
  path: ".env.local"
});

const {
  getAllJobs
} = require(
  "../lib/job-queue"
);

async function run() {

  const jobs =
    await getAllJobs();

  console.log(
    JSON.stringify(
      jobs,
      null,
      2
    )
  );

}

run();