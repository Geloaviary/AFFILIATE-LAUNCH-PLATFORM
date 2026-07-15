"use strict";

/*
==================================================

AFFILIATE LAUNCH PLATFORM V4

Strategy Department

contracts/

index.js

Constitutional Rule SD-008

Strategy Artifact

        │
        ▼

Strategy Capability Publisher

        │
        ▼

Published Contract Catalog

--------------------------------------------------

Constitutional Responsibility

Publishes certified Strategy capabilities
from the immutable Strategy Workspace.

The Strategy Contract Publisher NEVER

• Executes Strategy Workers
• Builds Strategy business results
• Repairs Strategy Artifacts
• Writes Platform Memory
• Calls QAD
• Targets downstream departments
• Declares consumer relationships

The Strategy Contract Publisher ONLY

• Reads the immutable Strategy Artifact
• Resolves certified Workspace contracts
• Maps Workspace capabilities to immutable
  Strategy contract identities
• Publishes the Strategy contract catalog

==================================================
*/

const Errors =

    require(

        "../../../quality-assurance-director/errors"

    );

const {

    assertStrategyArtifact

} =

    require(

        "../artifact"

    );

/*
==================================================
Published Strategy Capabilities

Every published contract must correspond to
a real Strategy capability represented in the
certified Strategy Workspace.

Contract identities are Platform Memory
capability identities.

They are NEVER downstream department names.

==================================================
*/

const PUBLISHED_CONTRACTS =

Object.freeze([

    "strategy.campaign",

    "strategy.positioning",

    "strategy.angles",

    "strategy.hooks",

    "strategy.scripts",

    "strategy.cta",

    "strategy.platformStrategy",

    "strategy.contentCalendar",

    "strategy.postingSequence",

    "strategy.optimization"

]);

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

function isRecord(

    value

) {

    return (

        isObject(

            value

        ) &&

        !Array.isArray(

            value

        )

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
Resolve Strategy Workspace Contracts

Strategy Artifact

        │
        ▼

Strategy Workspace

        │
        ▼

Workspace Contracts

==================================================
*/

function resolveWorkspaceContracts(

    artifact

) {

    assertStrategyArtifact(

        artifact

    );

    const payload =

        artifact.payload;

    if (

        !isRecord(

            payload

        )

    ) {

        throw new Errors.ValidationError(

            "Strategy Artifact payload is required for contract publication."

        );

    }

    const workspace =

        payload.workspace;

    if (

        !isRecord(

            workspace

        )

    ) {

        throw new Errors.ValidationError(

            "Strategy Workspace is required for contract publication."

        );

    }

    const contracts =

        workspace.contracts;

    if (

        !isRecord(

            contracts

        )

    ) {

        throw new Errors.ValidationError(

            "Strategy Workspace contracts are required for publication."

        );

    }

    return contracts;

}

/*
==================================================
Resolve Workspace Capability

A declared Strategy capability must exist as
an own property of the certified Workspace
contract catalog.

Inherited properties are never capabilities.

==================================================
*/

function resolveCapability(

    contracts,

    capability

) {

    if (

        !Object.prototype.hasOwnProperty.call(

            contracts,

            capability

        )

    ) {

        throw new Errors.ValidationError(

            `Missing Strategy Workspace capability: ${capability}`

        );

    }

    const value =

        contracts[capability];

    if (

        value === undefined

    ) {

        throw new Errors.ValidationError(

            `Strategy Workspace capability is undefined: ${capability}`

        );

    }

    return value;

}

/*
==================================================
Contract Publication

Strategy Artifact

        │
        ▼

Workspace Contract Catalog

        │
        ▼

Strategy Capability Mapping

        │
        ▼

Published Contract Catalog

==================================================
*/

function publishContracts(

    artifact

) {

    const contracts =

        resolveWorkspaceContracts(

            artifact

        );

    const published = {

        "strategy.campaign":

            resolveCapability(

                contracts,

                "campaign"

            ),

        "strategy.positioning":

            resolveCapability(

                contracts,

                "positioning"

            ),

        "strategy.angles":

            resolveCapability(

                contracts,

                "angles"

            ),

        "strategy.hooks":

            resolveCapability(

                contracts,

                "hooks"

            ),

        "strategy.scripts":

            resolveCapability(

                contracts,

                "scripts"

            ),

        "strategy.cta":

            resolveCapability(

                contracts,

                "cta"

            ),

        "strategy.platformStrategy":

            resolveCapability(

                contracts,

                "platformStrategy"

            ),

        "strategy.contentCalendar":

            resolveCapability(

                contracts,

                "contentCalendar"

            ),

        "strategy.postingSequence":

            resolveCapability(

                contracts,

                "postingSequence"

            ),

        "strategy.optimization":

            resolveCapability(

                contracts,

                "optimization"

            )

    };

    return assertPublishedContracts(

        deepFreeze(

            published

        )

    );

}

/*
==================================================
Summary

==================================================
*/

function summarizeContracts(

    contracts

) {

    assertPublishedContracts(

        contracts

    );

    return deepFreeze({

        generated:

            Object.keys(

                contracts

            ).length,

        contracts:

            Object.keys(

                contracts

            ),

        generatedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Verification

The published catalog must contain exactly the
declared Strategy capabilities.

No undeclared contract may leave the Strategy
Department through this publisher.

==================================================
*/

function assertPublishedContracts(

    contracts

) {

    if (

        !isRecord(

            contracts

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid published Strategy contract catalog."

        );

    }

    const publishedNames =

        Object.keys(

            contracts

        );

    if (

        publishedNames.length !==

        PUBLISHED_CONTRACTS.length

    ) {

        throw new Errors.ValidationError(

            "Published Strategy contract catalog does not match declared capabilities."

        );

    }

    for (

        const contractName of PUBLISHED_CONTRACTS

    ) {

        if (

            !Object.prototype.hasOwnProperty.call(

                contracts,

                contractName

            )

        ) {

            throw new Errors.ValidationError(

                `Missing published Strategy contract: ${contractName}`

            );

        }

        if (

            contracts[contractName] ===

            undefined

        ) {

            throw new Errors.ValidationError(

                `Published Strategy contract is undefined: ${contractName}`

            );

        }

    }

    return contracts;

}

/*
==================================================
Public Strategy Contract Publisher

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------
    Capability Declaration
    ----------------------------------
    */

    publishes:

        PUBLISHED_CONTRACTS,

    /*
    ----------------------------------
    Publication
    ----------------------------------
    */

    publishContracts,

    summarizeContracts,

    /*
    ----------------------------------
    Verification
    ----------------------------------
    */

    assertPublishedContracts

});