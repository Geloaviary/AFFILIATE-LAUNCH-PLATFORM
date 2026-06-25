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

    console.log(
  "BLUEPRINT COUNTS",
  {
    scenes:
      oracleBlueprint?.timeline?.scenes?.length,

    selectedAssets:
      oracleBlueprint?.timeline?.scenes?.filter(
        s => s.selectedAsset
      ).length,

    assetsArrays:
      oracleBlueprint?.timeline?.scenes?.filter(
        s => s.assets?.length
      ).length
  }
);

    campaign.production = {

  ...(campaign.production || {}),

  status:
    "building_blueprint",

  blueprintVersion:
    oracleBlueprint.version ||
    "v3",

  updatedAt:
    new Date()
      .toISOString()

};

await kv.set(
  index.campaignKey,
  campaign
);

const {
  runQC
} = require(
  "../production-quality-director"
);

campaign.production.status =
  "qc_running";

await kv.set(
  index.campaignKey,
  campaign
);

console.log(
  "BLUEPRINT SCENE 0",
  JSON.stringify(
    oracleBlueprint?.timeline?.scenes?.[0],
    null,
    2
  )
);

console.log(
  "QC ASSET SUMMARY",
  oracleBlueprint?.timeline?.scenes?.map(scene => ({
    id: scene.id,
    selectedAsset: !!scene.selectedAsset,
    assetsArray: scene.assets?.length || 0,
    assetSource:
      scene.selectedAsset?.assetSource
  }))
);

const qc =
  await runQC(
    oracleBlueprint
  );

  if (
  !qc.approved
) {

  campaign.production = {

    status:
      "qc_failed",

    qcApproved:
      false,

    qcScore:
      qc.score,

    qcViolations:
      qc.violations || [],

    failedAt:
      new Date()
        .toISOString()

  };

  campaign.qc = qc;

  await kv.set(
    index.campaignKey,
    campaign
  );

  throw new Error(

    `QC FAILED: ${
      qc.violations
        ?.map(
          v =>
            v.code ||
            v.message
        )
        .join(", ")
    }`

  );

}

campaign.qc = qc;

campaign.production.status =
  "qc_approved";

campaign.production = {

  ...(campaign.production || {}),

  status:
    "qc_approved",

  blueprintVersion:
    oracleBlueprint.version || "v3",

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

campaign.assetIntelligence = {

  generatedAt:
    new Date()
      .toISOString(),

  totalScenes:

    oracleBlueprint
      ?.timeline
      ?.scenes
      ?.length || 0,

  sceneRankings:

    oracleBlueprint
      ?.timeline
      ?.scenes
      ?.map(
        scene => ({

          sceneId:
            scene.id,

          narration:
            scene.narration,

          selectedAssetId:
            scene
              ?.selectedAsset
              ?.assetId || null,

          selectedAssetUrl:
            scene
              ?.selectedAsset
              ?.asset
              ?.url || null,

          assetSource:
            scene
              ?.selectedAsset
              ?.assetSource,

          finalScore:
            scene
              ?.selectedAsset
              ?.assetRanking
              ?.finalScore || 0,

          relevanceScore:
            scene
              ?.selectedAsset
              ?.assetRanking
              ?.relevanceScore || 0,

          qualityScore:
            scene
              ?.selectedAsset
              ?.assetRanking
              ?.qualityScore || 0,

          orientation:
            scene
              ?.selectedAsset
              ?.assetRanking
              ?.orientation ||

            "unknown",

          alternatives:

            scene
              ?.alternativeAssets
              ?.length || 0

        })
      )

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

  let renderResult;

try {

  campaign.production.status =
  "rendering";

await kv.set(
  index.campaignKey,
  campaign
);

  renderResult =
    await renderVideo(
      renderPayload
    );

} catch (error) {

  campaign.production.render = {

    success: false,

    error:
      error.message,

    failedAt:
      new Date()
        .toISOString()

  };

  campaign.production.status =
  "render_failed";

  await kv.set(
    index.campaignKey,
    campaign
  );

  throw error;

}

    if (

  !renderResult ||

  renderResult.success === false

) {

  campaign.production.render = {

    success: false,

    error:
      renderResult?.error ||

      "Video render failed",

    failedAt:
      new Date()
        .toISOString()

  };

  campaign.production.status =
  "render_failed";

  await kv.set(
    index.campaignKey,
    campaign
  );

  throw new Error(

    renderResult?.error ||

    "Video render failed"

  );

}

campaign.production.status =
  "rendered";

campaign.production.render = {

  success: true,

  duration:
    renderResult.duration || 0,

  videoUrl:
    renderResult.videoUrl ||

    renderResult.url ||

    null,

  renderProvider:
    renderResult.provider ||
    "unknown",

  renderJobId:
    renderResult.jobId ||
    null,

  renderedAt:
    new Date()
      .toISOString()

};

await kv.set(
  index.campaignKey,
  campaign
);

    console.log(
  "RENDER RESULT FULL",
  JSON.stringify(
    renderResult,
    null,
    2
  )
);

  return {
    oracleBlueprint,
    renderPayload,
    renderResult
  };

}

module.exports = {
  runVideoProduction
};