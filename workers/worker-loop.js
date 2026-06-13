async function workerLoop({

  workerId,

  pollInterval = 1000,

  processor

}) {

  console.log(
    `${workerId} started`
  );

  while (true) {

    try {

      await processor();

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
          pollInterval
        )
    );

  }

}

module.exports = {
  workerLoop
};