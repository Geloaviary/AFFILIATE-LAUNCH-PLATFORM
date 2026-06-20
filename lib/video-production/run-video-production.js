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

  const renderPayload =
    buildRenderPayload(
      oracleBlueprint
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