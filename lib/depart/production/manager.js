

const {

    execute:

        executeInput

} = require(

    "./input"

);

const {

    publishContracts

} = require(

    "./contracts"

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

const strategyContext =

    await executeInput(

        options

    );

if (

    strategyContext.status === "waiting"

) {

    return strategyContext;

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

        campaignId:

            strategyContext.campaignId,

        name:

            strategyContext.name,

        productUrl:

            strategyContext.productUrl,

        affiliateUrl:

            strategyContext.affiliateUrl,

        revenueGoal:

            strategyContext.revenueGoal,

        research:

            strategyContext.research,

        createdAt:

            strategyContext.createdAt

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