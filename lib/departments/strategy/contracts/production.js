"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

contracts/

production.js

Constitutional Rule SD-009

Strategy Artifact

        │
        ▼

Workspace Contracts

        │
        ▼

Production Contract

--------------------------------------------------

Constitutional Responsibility

Publishes the immutable Production
Department Contract from the Strategy
Workspace.

It NEVER

• Executes Strategy Workers
• Builds Strategy
• Repairs Artifacts
• Validates Artifacts
• Calls QAD
• Writes Platform Memory

It ONLY publishes the Production
Contract.

==================================================
*/

const Metadata =
    require("./metadata");

const Errors =

    require(

        "../../quality-assurance-director/errors"

    );

const {

    assertStrategyArtifact

} =

    require(

        "../artifact"

    );

/*
==================================================
Utilities
==================================================
*/

function isObject(

    value

) {

    return (

        value !== null &&

        typeof value ===

            "object"

    );

}

function deepFreeze(

    target,

    visited = new WeakSet()

) {

    if (

        !isObject(

            target

        )

    ) {

        return target;

    }

    if (

        visited.has(

            target

        )

    ) {

        return target;

    }

    visited.add(

        target

    );

    Object.freeze(

        target

    );

    for (

        const key of Object.keys(

            target

        )

    ) {

        deepFreeze(

            target[key],

            visited

        );

    }

    return target;

}

/*
==================================================
Payload
==================================================
*/

function buildPayload(

    artifact

) {

    const contracts =

        artifact
            .payload
            .workspace
            .contracts;

    return deepFreeze({

        campaign:

            structuredClone(

                contracts.campaign

            ),

        angles:

            structuredClone(

                contracts.angles

            ),

        hooks:

            structuredClone(

                contracts.hooks

            ),

        scripts:

            structuredClone(

                contracts.scripts

            ),

        cta:

            structuredClone(

                contracts.cta

            ),

        postingSequence:

            structuredClone(

                contracts.postingSequence

            )

    });

}

/*
==================================================
Production Contract
==================================================
*/

function build(

    artifact

) {

    assertStrategyArtifact(

        artifact

    );

    return deepFreeze({

        department:

            "production",

        metadata:

            Metadata.build(

                    artifact,

                   "production"

            ),

        payload:

            buildPayload(

                artifact

            )

    });

}

/*
==================================================
Verification
==================================================
*/

function isProductionContract(

    contract

) {

    return (

        isObject(

            contract

        ) &&

        contract.department ===

            "production" &&

        isObject(

            contract.metadata

        ) &&

        isObject(

            contract.payload

        )

    );

}

function assertProductionContract(

    contract

) {

    if (

        !isProductionContract(

            contract

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Production Contract."

        );

    }

    return contract;

}

/*
==================================================
Public Runtime
==================================================
*/

module.exports =

Object.freeze({

    build,

    isProductionContract,

    assertProductionContract

});