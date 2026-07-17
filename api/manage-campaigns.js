const { kv } = require("@vercel/kv");

const {

  createCampaignIndex,

  createCampaignJobs

} = require(
  "../lib/campaign-engine"
);

const {
  getAllJobs
} = require(
  "../lib/job-queue"
);

const {
  markCampaignCreated
} = require(
  "../lib/portfolio-manager"
);

const Runtime =

    require(

        "../lib/departments/runtime"

    );

exports.default = async function handler(req, res) {
try {
const userId =
req.method === "GET"
? req.query.userId
: req.body.userId;

if (!userId) {
  return res.status(400).json({
    error: "Missing userId"
  });
}

// LOAD CAMPAIGNS
if (req.method === "GET") {
  const keys = await kv.keys(
    `${userId}-campaign-*`
  );

  const campaigns = [];

  const allJobs =
  await getAllJobs();

for (const key of keys) {

  const data =
    await kv.get(key);

  if (!data) {
    continue;
  }

  const campaignId =
    key.replace(
      `${userId}-campaign-`,
      ""
    );

  const campaignJobs =
    allJobs.filter(
      job =>
        job.campaignId ===
        campaignId
    );

  data.campaignPackage =
    data.campaignPackage || {};

  data.campaignPackage.productionQueue =
    campaignJobs;

  campaigns.push({

    id: campaignId,

    ...data

  });

}

  campaigns.sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  );

  return res.status(200).json({
    campaigns
  });
}

// CREATE CAMPAIGN
if (req.method === "POST") {

  if (
  req.body?.action ===
  "update-production-asset"
) {

  const {

    campaignId,

    assetId,

    status

  } = req.body;

  const {
    updateProductionAsset
  } = require(
    "../lib/campaign-engine"
  );

  const asset =
    await updateProductionAsset({

      campaignId,

      assetId,

      status

    });

  return res.status(200).json({

    success: true,

    asset

  });

}

  const {

  name,
  productUrl,
  affiliateUrl,
  revenueGoal,
  research

} = req.body;

const {

  niche,
  winner,
  revenueProjection

} = research;

  if (!name || !productUrl) {
    return res.status(400).json({
      error:
        "Campaign name and product URL required"
    });
  }

  const existingKeys =
  await kv.keys(
    `${userId}-campaign-*`
  );

for (
  const key of existingKeys
) {

  const existingCampaign =
    await kv.get(key);

  if (

    existingCampaign?.productUrl ===
    productUrl

  ) {

    return res.status(409).json({

      error:
        "Campaign already exists",

      campaignId:
        key.replace(
          `${userId}-campaign-`,
          ""
        )

    });

  }

}

const campaignId =

    Date.now().toString(36) +

    Math.random()

        .toString(36)

        .substring(2, 8);

const now =

    new Date()

        .toISOString();

const runtimeResult =

    await Runtime.execute({

        command:

            "launch-campaign",

        campaignId,

        requestedBy:

            "api/manage-campaigns",

        options: {

            name,

            productUrl,

            affiliateUrl,

            revenueGoal,

            research,

            createdAt:

                now

        }

    });

const runtimeDepartments =

    Array.isArray(

        runtimeResult?.departments

    )

        ? runtimeResult.departments

        : Array.isArray(

            runtimeResult?.report?.departments

        )

            ? runtimeResult.report.departments

            : [];

const strategyDepartment =

    runtimeDepartments.find(

        department =>

            department?.department ===

                "strategy" ||

            department?.name ===

                "strategy" ||

            department?.id ===

                "strategy"

    ) || null;

const strategyStatus =

    String(

        strategyDepartment?.status ||

        "UNKNOWN"

    ).toUpperCase();

if (

    strategyStatus ===

        "WAITING"

) {

    return res.status(202).json({

        status:

            "waiting",

        department:

            "strategy",

        reason:

            strategyDepartment?.reason ||

            strategyDepartment?.message ||

            "Strategy Department is waiting for required contracts.",

        campaignId,

        runtime:

            runtimeResult

    });

}

const strategyOutput =

    strategyDepartment?.output ||

    strategyDepartment?.result ||

    strategyDepartment?.value ||

    null;

if (

    !strategyOutput ||

    !strategyOutput.strategy ||

    !strategyOutput.campaign

) {

    throw new Error(

        "Runtime completed without executable Strategy campaign output."

    );

}

const {

    strategy,

    campaign

} =

    strategyOutput;

  await kv.set(
    `${userId}-campaign-${campaignId}`,
    campaign
  );

  await createCampaignIndex({

  campaignId,

  userId,

  campaignKey:
    `${userId}-campaign-${campaignId}`

});

console.log(
  "STARTING JOB CREATION",
  campaignId
);

  console.log(
  "STARTING JOB CREATION",
  campaignId
);

const jobs =
  await createCampaignJobs({

    campaignId

  });

console.log(
  "CAMPAIGN JOBS CREATED:",
  jobs.length,
  campaignId
);

console.log(
  "RENDER JOBS QUEUED",
  {
    campaignId,
    count: jobs.length
  }
);

  try {

  await markCampaignCreated({

    niche:
      niche || "",

    productName:
      name,

    campaignId

  });

} catch (e) {

  console.error(
    "Portfolio update failed:",
    e.message
  );

}

  return res.status(200).json({
    campaignId,
    campaign
  });
}

return res.status(405).json({
  error: "Method Not Allowed"
});

} catch (error) {
  console.error(error);
  console.error(error.stack);

  return res.status(500).json({
    error: error.message,
    stack: error.stack
  });
}
};
