const Research =

    require(
        "../lib/affiliate-researcher"
    );

const {
  createJob,
  getJob
} = require(
  "../lib/job-queue"
);

const {
  processNextRenderJob
} = require(
  "../workers/render-worker"
);

async function run() {

  const research =
    await Research.execute({

      niche:
        "crm software"

    });

  const job =
    await createJob({

      type:
        "video-render",

      payload: {

        plan:
          research.videoPlan,

        assets:
          research.assets

      }

    });

  console.log(
    "Created Job:",
    job.id
  );

  await processNextRenderJob({

    workerId:
      "campaign-test-worker"

  });

  const updatedJob =
    getJob(
      job.id
    );

  console.log(

    JSON.stringify(
      updatedJob,
      null,
      2
    )

  );

}

run()
  .catch(
    console.error
  );