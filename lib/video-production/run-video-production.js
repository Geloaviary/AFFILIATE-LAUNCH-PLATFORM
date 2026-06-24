const { kv } = require("@vercel/kv");

const {
  getCampaignIndex
} = require(
  "../campaign-engine/campaign-index"
);

const {
  buildOracleBlueprint
} = require(
  "../scene-builder"
);

const {
  buildRenderPayload
} = require(
  "../render-orchestrator/build-render-payload"
);

const {
  renderVideo
} = require(
  "../render-orchestrator/render-video"
);

async function runVideoProduction({

  campaignId,

  planType

} = {}) {

  console.log(
  "RUN VIDEO PRODUCTION",
  campaignId,
  planType
);

  const index =
  await getCampaignIndex(
    campaignId
  );

const campaign =
  await kv.get(
    index.campaignKey
  );

if (!campaign) {

  throw new Error(
    `Campaign not found: ${campaignId}`
  );

}

const research =
  campaign
    ?.campaignPackage
    ?.research;

  const plan =

  planType === "short"
    ? research?.plans?.short

  : planType === "tutorial"
    ? research?.plans?.tutorial

  : planType === "review"
    ? research?.plans?.review

  : planType === "comparison"
    ? research?.plans?.comparison

  : research?.plans?.listicle;

  if (!plan) {

  throw new Error(
    `Video plan not found: ${planType}`
  );

}

const oracleBlueprint =
  await buildOracleBlueprint(
    plan,
      {
        assets:
           research?.assets,

        platform:
          "shorts"
     }
    );

const {
  runQC
} = require(
  "../production-quality-director"
);

const qc =
  await runQC(
    oracleBlueprint
  );

campaign.qc = qc;

campaign.production = {

  blueprintDuration:
  oracleBlueprint
    ?.timeline
    ?.scenes
    ?.reduce(
      (sum, scene) =>
        sum +
        (scene.duration || 0),
      0
    ) || 0,

  lastPlanType:
    planType,

  lastBlueprint:
    oracleBlueprint.title,

  blueprintType:
    oracleBlueprint.videoType,

  qcApproved:
    qc.approved,

  qcScore:
    qc.score,

  qcViolations:
    qc.violations || [],

  sceneCount:
    oracleBlueprint
      ?.timeline
      ?.scenes
      ?.length || 0,

  lastRunAt:
    new Date()
      .toISOString()

};

campaign.debug = {

  assetCounts: {

    websiteImages:
      research?.assets?.websiteImages?.length || 0,

    screenshots:
      research?.assets?.screenshots?.length || 0,

    logos:
      research?.assets?.logos?.length || 0

  },

  firstScene:
    oracleBlueprint
      ?.timeline
      ?.scenes?.[0]

};

await kv.set(
  index.campaignKey,
  campaign
);

console.log(
  "QC REPORT",
  JSON.stringify(
    qc,
    null,
    2
  )
);

    console.log(
  "BLUEPRINT SCENE 0",
  JSON.stringify(
    oracleBlueprint
      ?.timeline
      ?.scenes?.[0],
    null,
    2
  )
);

  const renderPayload =
    buildRenderPayload(
      oracleBlueprint
    );

    if (
  !renderPayload?.plan?.scenes?.[0]?.assets?.length
) {

  throw new Error(
    "LOCAL CHECK FAILED: scene 0 has no assets"
  );

}

console.log(
  "LOCAL SCENE 0 ASSETS",
  renderPayload.plan.scenes[0].assets
);

console.log(
  "BLUEPRINT SCENE 0",
  JSON.stringify(
    oracleBlueprint
      ?.timeline
      ?.scenes?.[0],
    null,
    2
  )
);

console.log(
  "RENDER SCENE 0",
  JSON.stringify(
    renderPayload
      ?.plan
      ?.scenes?.[0],
    null,
    2
  )
);

  const renderResult =
    await renderVideo(
      renderPayload
    );

    console.log(
  "RENDER RESULT FULL",
  JSON.stringify(
    renderResult,
    null,
    2
  )
);

   if (

  !renderResult ||

  renderResult.success ===
    false

) {

  throw new Error(

    renderResult?.error ||

    "Video render failed"

  );

} 

  return {
    oracleBlueprint,
    renderPayload,
    renderResult
  };

}

module.exports = {
  runVideoProduction
};