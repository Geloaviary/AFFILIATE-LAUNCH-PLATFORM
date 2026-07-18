"use strict";

/*
==================================================

AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

contracts/

index.js

Constitutional Rule PD-008

Portfolio Artifact

        │
        ▼

Portfolio Capability Publisher

        │
        ▼

Published Contract Catalog

--------------------------------------------------

Constitutional Responsibility

Publishes certified Portfolio capabilities
from the immutable Portfolio Workspace.

The Portfolio Contract Publisher NEVER

• Executes Portfolio Workers
• Builds Portfolio business results
• Repairs Portfolio Artifacts
• Writes Platform Memory
• Calls QAD
• Targets downstream departments
• Declares consumer relationships

The Portfolio Contract Publisher ONLY

• Reads the immutable Portfolio Artifact
• Resolves certified Workspace contracts
• Maps Workspace capabilities to immutable
  Portfolio contract identities
• Publishes the Portfolio contract catalog

==================================================
*/

const Errors =

    require(

        "../../../quality-assurance-director/errors"

    );

const {

    assertPortfolioArtifact

} =

    require(

        "../artifact"

    );

/*
==================================================
Published Portfolio Capabilities

Every published contract must correspond to
a real Portfolio capability represented in the
certified Portfolio Workspace.

Contract identities are Platform Memory
capability identities.

They are NEVER downstream department names.

==================================================
*/

const PUBLISHED_CONTRACTS =

Object.freeze([

    "portfolio.campaigns",

    "portfolio.composition",

    "portfolio.ranking",

    "portfolio.scaleDecisions",

    "portfolio.killDecisions",

    "portfolio.allocation",

    "portfolio.statistics",

    "portfolio.health",

    "portfolio.history"

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
Resolve Portfolio Workspace Contracts

Portfolio Artifact

        │
        ▼

Portfolio Workspace

        │
        ▼

Workspace Contracts

==================================================
*/

function resolveWorkspaceContracts(

    artifact

) {

    assertPortfolioArtifact(

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

            "Portfolio Artifact payload is required for contract publication."

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

            "Portfolio Workspace is required for contract publication."

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

            "Portfolio Workspace contracts are required for publication."

        );

    }

    return contracts;

}

/*
==================================================
Resolve Workspace Capability

A declared Portfolio capability must exist as
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

            `Missing Portfolio Workspace capability: ${capability}`

        );

    }

    const value =

        contracts[capability];

    if (

        value === undefined

    ) {

        throw new Errors.ValidationError(

            `Portfolio Workspace capability is undefined: ${capability}`

        );

    }

    return value;

}

/*
==================================================
Contract Publication

Portfolio Artifact

        │
        ▼

Workspace Contract Catalog

        │
        ▼

Portfolio Capability Mapping

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

        "portfolio.campaigns":

            resolveCapability(

                contracts,

                "campaigns"

            ),

        "portfolio.composition":

            resolveCapability(

                contracts,

                "composition"

            ),

        "portfolio.ranking":

            resolveCapability(

                contracts,

                "ranking"

            ),

        "portfolio.scaleDecisions":

            resolveCapability(

                contracts,

                "scaleDecisions"

            ),

        "portfolio.killDecisions":

            resolveCapability(

                contracts,

                "killDecisions"

            ),

        "portfolio.allocation":

            resolveCapability(

                contracts,

                "allocation"

            ),

        "portfolio.statistics":

            resolveCapability(

                contracts,

                "statistics"

            ),

        "portfolio.health":

            resolveCapability(

                contracts,

                "health"

            ),

        "portfolio.history":

            resolveCapability(

                contracts,

                "history"

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
declared Portfolio capabilities.

No undeclared contract may leave the Portfolio
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

            "Invalid published Portfolio contract catalog."

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

            "Published Portfolio contract catalog does not match declared capabilities."

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

                `Missing published Portfolio contract: ${contractName}`

            );

        }

        if (

            contracts[contractName] ===

            undefined

        ) {

            throw new Errors.ValidationError(

                `Published Portfolio contract is undefined: ${contractName}`

            );

        }

    }

    return contracts;

}

/*
==================================================
Public Portfolio Contract Publisher

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