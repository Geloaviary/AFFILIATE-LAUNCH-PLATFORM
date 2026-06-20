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
  plan,
  assets
} = {}) {

  const oracleBlueprint =
    await buildOracleBlueprint(
      plan,
      {
        assets,
        platform: "shorts"
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