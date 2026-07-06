console.log("[Strategy] START");

const {

    execute:

        executeInput

} = require(

    "./input"

);

const {
    buildStrategyArtifact
} = require("./artifact");

const {

    execute: executeOutput

} = require(

    "./output"

);

const StrategyEngine =

    require(

        "./strategy-engine"

    );

async function execute(
  options = {}
) {

/*
========================================
Department Input

Load immutable Strategy Context
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
Strategy Engine

Manager delegates all planning
to the Strategy Engine.

========================================
*/

const strategyResult =

    await StrategyEngine.execute({

        context,

        options

    });

/*
========================================
Strategy Constitutional Artifact
========================================
*/

const artifact =

    buildStrategyArtifact({

        payload:

            strategyResult,

        campaignId:

            options.campaignId ||

            null,

        sessionId:

            options.sessionId ||

            null,

        requestId:

            options.requestId ||

            null

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