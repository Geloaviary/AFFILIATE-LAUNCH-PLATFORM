

const {

    execute:

        executeInput

} = require(

    "./input"

);

const {

    publishContracts

} = require(

    "./contracts/publishes"

);

const {
    buildPortfolioArtifact
} = require("./artifact");

const {

    execute: executeOutput

} = require(

    "./output"

);

const PortfolioEngine =

    require(

        "./portfolio-engine/engine"

    );

async function execute(
  options = {}
) {

/*
========================================
Department Input

Load immutable Portfolio Context
from Platform Memory.

========================================
*/

const portfolioContext =

    await executeInput(

        options

    );

if (

    portfolioContext.status === "waiting"

) {

    return portfolioContext;

}

/*
========================================
Portfolio Engine

Manager delegates all planning
to the Portfolio Engine.

========================================
*/

const portfolioResult =

    await PortfolioEngine.execute({

        campaignId:

            options.campaignId ||

            null,

        portfolio:

            portfolioContext,

        createdAt:

            options.createdAt ||

            new Date().toISOString()

    });

/*
========================================
Portfolio Constitutional Artifact
========================================
*/

const artifact =

    buildPortfolioArtifact({

        payload:

            portfolioResult,

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

    const contracts =

    publishContracts(

        artifact

    );

/*
========================================
Department Output

Return Department Output.

========================================
*/

return await executeOutput({

    artifact,

    contracts,

    options

});
 
}



module.exports = Object.freeze({

    execute

});