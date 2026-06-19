const {
  claimJob,
  completeJob,
  failJob
} = require(
  "../lib/job-queue"
);

const {
  publishAsset
} = require(
  "../lib/campaign-engine"
);

async function processNextPublishJob({

  workerId =
    "publisher-worker-1"

} = {}) {

  const job =
    await claimJob({
      workerId
    });

  if (

    !job ||

    job.type !==
      "publish-content"

  ) {

    return null;

  }

  try {

    const result =
      await publishAsset(
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
  processNextPublishJob
};