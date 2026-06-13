const {
  processNextRenderJob
} = require(
  "./render-worker"
);

const WORKER_COUNT =
  Number(
    process.env
      .RENDER_WORKERS
  ) || 2;

const POLL_INTERVAL =
  Number(
    process.env
      .QUEUE_POLL_INTERVAL
  ) || 1000;

async function startWorker(
  workerId
) {

  console.log(
    `${workerId} started`
  );

  while (true) {

    try {

      await processNextRenderJob({

        workerId

      });

    } catch (e) {

      console.error(

        workerId,

        e.message

      );

    }

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          POLL_INTERVAL
        )
    );

  }

}

async function startRenderWorkers() {

  const workers = [];

  for (
    let i = 1;
    i <= WORKER_COUNT;
    i++
  ) {

    workers.push(

      startWorker(
        `render-worker-${i}`
      )

    );

  }

  await Promise.all(
    workers
  );

}

if (
  require.main === module
) {

  startRenderWorkers()
    .catch(
      console.error
    );

}

module.exports = {
  startRenderWorkers
};