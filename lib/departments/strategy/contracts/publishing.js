"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Strategy Department

contracts/

publishing.js

Constitutional Rule SD-010

Strategy Artifact

        │
        ▼

Workspace Contracts

        │
        ▼

Publishing Contract

--------------------------------------------------

Constitutional Responsibility

Publishes the immutable Publishing
Department Contract from the Strategy
Workspace.

It NEVER

• Executes Strategy Workers
• Builds Strategy
• Repairs Artifacts
• Validates Artifacts
• Calls QAD
• Writes Platform Memory

It ONLY publishes the Publishing
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

        platformStrategy:

            structuredClone(

                contracts.platformStrategy

            ),

        contentCalendar:

            structuredClone(

                contracts.contentCalendar

            ),

        postingSequence:

            structuredClone(

                contracts.postingSequence

            )

    });

}

/*
==================================================
Publishing Contract
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

            "publishing",

        metadata:

            Metadata.build(

                    artifact,

                  "publishing"

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

function isPublishingContract(

    contract

) {

    return (

        isObject(

            contract

        ) &&

        contract.department ===

            "publishing" &&

        isObject(

            contract.metadata

        ) &&

        isObject(

            contract.payload

        )

    );

}

function assertPublishingContract(

    contract

) {

    if (

        !isPublishingContract(

            contract

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Publishing Contract."

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

    isPublishingContract,

    assertPublishingContract

});