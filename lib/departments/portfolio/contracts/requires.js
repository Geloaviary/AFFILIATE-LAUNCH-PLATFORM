"use strict";

/*
==================================================

AFFILIATE LAUNCH PLATFORM V4

Portfolio Department

contracts/requires.js

Constitutional Rule PD-009

Portfolio Contract Requirements

Required Contract Identities

        |
        v

Platform Memory Availability

        |
        v

Runtime Eligibility

--------------------------------------------------

Constitutional Responsibility

Declares the certified contract identities
required for the Portfolio Department to become
eligible for execution.

Required contracts are capability identities.

They are NEVER

- Department names
- Producer identities
- Consumer relationships
- Runtime routing instructions
- Platform Memory queries

The Portfolio Department does not know which
department produces a required contract.

It ONLY declares which certified contracts must
be available in Platform Memory.

==================================================
*/

/*
==================================================
Required Contracts

==================================================
*/

const REQUIRED_CONTRACTS =

Object.freeze([

    "campaign.performance",

    "revenue.metrics"

]);

/*
==================================================
Verification

==================================================
*/

function assertRequiredContracts(

    contracts

) {

    if (

        !Array.isArray(

            contracts

        )

    ) {

        throw new TypeError(

            "Portfolio required contract catalog must be an array."

        );

    }

    const identities =

        new Set();

    for (

        const contractName of contracts

    ) {

        if (

            typeof contractName !==

                "string" ||

            contractName.length ===

                0

        ) {

            throw new TypeError(

                "Portfolio required contract identity must be a non-empty string."

            );

        }

        if (

            identities.has(

                contractName

            )

        ) {

            throw new TypeError(

                `Duplicate Portfolio required contract identity: ${contractName}`

            );

        }

        identities.add(

            contractName

        );

    }

    return contracts;

}

/*
==================================================
Public Portfolio Contract Requirement Declaration

==================================================
*/

module.exports =

Object.freeze({

    requires:

        assertRequiredContracts(

            REQUIRED_CONTRACTS

        ),

    assertRequiredContracts

});