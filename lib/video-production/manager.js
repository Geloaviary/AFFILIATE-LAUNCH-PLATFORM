console.log("[PRODUCTION] START");

const {

    execute:

        executeInput

} = require(

    "./input"

);

const {

    buildProductionArtifact

} = require("./artifact");

const {

    execute: executeOutput

} = require(

    "./output"

);

const {

    buildScenes

} = require(

    "../scene-builder"

);

const {

    buildSceneAssets

} = require(

    "../asset-matcher"

);

const {

    buildAssets

} = require(

    "../scene-builder"

);

const {

    buildSmartCaptions

} = require(

    "../scene-builder"

);

const {

    buildVoiceover

} = require(

    "../scene-builder"

);

const {

    buildTimeline

} = require(

    "../scene-builder"

);

const {

    buildStockAssets

} = require(

    "../asset-sourcing"

);

async function execute(
  options = {}
) {

/*
========================================
Department Input

Load immutable Production Context
from Platform Memory.

========================================
*/

const context =

    await executeInput(

        options

    );

if (

    context.status === "waiting"

) {

    return context;

}

/*
========================================
Production Context

Manager knows only Business Context.

========================================
*/

const {

    videoPlan,

    assets,

    metadata

} = context;

const stockAssets =

    await buildStockAssets(

        assets.fallbackKeywords || []

    );

let scenes =

    buildScenes(

        videoPlan

    );

    scenes =

    buildSceneAssets(

        scenes,

        assets,

        stockAssets

    );

    scenes =

    buildAssets(

        scenes

    );

    scenes =

    buildSmartCaptions(

        scenes

    );

    scenes =

    buildVoiceover(

        scenes

    );

    const timeline =

    buildTimeline(

        scenes

    );



const productionResult = {

    videoPlan,

    scenes,

    timeline,

    metadata

};

/*
========================================
Production Constitutional Artifact
========================================
*/

const artifact =

    buildProductionArtifact({

        payload:

            productionResult,

        campaignId:

            options.campaignId || null,

        sessionId:

            options.sessionId || null,

        requestId:

            options.requestId || null

    });



/*
========================================
Department Exit

Return Department Output.

========================================
*/

 return await executeOutput(

        artifact,

        options

    );

}



module.exports = Object.freeze({

    execute

});