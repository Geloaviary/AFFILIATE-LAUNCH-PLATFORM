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

  const job =
    await createJob({

      type:
        "video-render",

      payload: {

        plan: {

          title:
            "Queue Test",

          videoType:
            "short",

          scenes: []

        },

        assets: {}

      }

    });

  console.log(
    "Created:",
    job.id
  );

  try {

    await processNextRenderJob({

      workerId:
        "test-worker"

    });

  } catch (e) {

    console.error(
      e.message
    );

  }

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

run();