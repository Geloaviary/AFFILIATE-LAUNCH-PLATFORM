const {
  processNextRenderJob
} = require(
  "../workers/render-worker"
);

const {
  processNextPublishJob
} = require(
  "../workers/publisher-worker"
);

exports.default = async function handler(
  req,
  res
) {

  const { action } =
    req.query;

  if (
  action ===
  "process-render-jobs"
) {

  try {

    const processed = [];

    for (
      let i = 0;
      i < 5;
      i++
    ) {

      const result =
        await processNextRenderJob({

          workerId:
            "vercel-worker"

        });

      if (!result) {

        break;

      }

      processed.push(
        result
      );

    }

    return res.status(200).json({

      success: true,

      processed:
        processed.length

    });

  } catch (e) {

    console.error(
      "Render worker failed:",
      e
    );

    return res.status(500).json({

      success: false,

      error:
        e.message

    });

  }

}

if (
  action ===
  "process-publish-jobs"
) {

  try {

    const processed = [];

    for (
      let i = 0;
      i < 5;
      i++
    ) {

      const result =
        await processNextPublishJob({

          workerId:
            "vercel-publisher"

        });

      if (!result) {

        break;

      }

      processed.push(
        result
      );

    }

    return res.status(200).json({

      success: true,

      processed:
        processed.length

    });

  } catch (e) {

    console.error(
      "Publisher worker failed:",
      e
    );

    return res.status(500).json({

      success: false,

      error:
        e.message

    });

  }

}

return res
  .status(400)
  .json({

    error:
      "Unknown action"

  });

  

  try {

    const processed = [];

    for (
      let i = 0;
      i < 5;
      i++
    ) {

      const result =
        await processNextRenderJob({

          workerId:
            "vercel-worker"

        });

      if (!result) {

        break;

      }

      processed.push(
        result
      );

    }

    return res.status(200).json({

      success: true,

      processed:
        processed.length

    });

  } catch (e) {

    console.error(
      "Render worker failed:",
      e
    );

    return res.status(500).json({

      success: false,

      error:
        e.message

    });

  }

};