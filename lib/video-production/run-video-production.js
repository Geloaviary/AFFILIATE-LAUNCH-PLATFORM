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