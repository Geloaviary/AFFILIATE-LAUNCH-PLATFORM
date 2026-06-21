const {

  claimJob,

  completeJob,

  failJob

} = require(
  "../lib/job-queue"
);

const {
  processVideoRender
} = require(
  "./job-processors"
);

async function processNextRenderJob({

  workerId =
    "render-worker-1"

} = {}) {

  console.log(
  "RENDER WORKER START",
  workerId
);

  const job =
    await claimJob({

      workerId

    });

    console.log(
  "RENDER WORKER CLAIMED",
  {
    id: job?.id,
    campaignId: job?.campaignId,
    type: job?.type,
    status: job?.status
  }
);

  if (

    !job ||

    job.type !==
      "video-render"

  ) {

    return null;

  }

  console.log(
    "PROCESSING RENDER JOB",
    job.id,
    job.campaignId
  );

  try {

    const result =
      await processVideoRender(
              job.payload
           );

    await completeJob({

      jobId:
        job.id,

      result

    });

    return result;

  } catch (e) {

    await failJob({

      jobId:
        job.id,

      error:
        e

    });

    throw e;

  }

}

module.exports = {

  processNextRenderJob

};