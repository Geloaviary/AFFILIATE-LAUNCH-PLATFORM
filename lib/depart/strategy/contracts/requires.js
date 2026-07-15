"use strict";

/*
==================================================

AFFILIATE LAUNCH PLATFORM V4

Strategy Department

contracts/requires.js

Constitutional Rule SD-009

Strategy Contract Requirements

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
required for the Strategy Department to become
eligible for execution.

Required contracts are capability identities.

They are NEVER

- Department names
- Producer identities
- Consumer relationships
- Runtime routing instructions
- Platform Memory queries

The Strategy Department does not know which
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

    "campaign.intelligence",

    "product.intelligence"

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

            "Strategy required contract catalog must be an array."

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

                "Strategy required contract identity must be a non-empty string."

            );

        }

        if (

            identities.has(

                contractName

            )

        ) {

            throw new TypeError(

                `Duplicate Strategy required contract identity: ${contractName}`

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
Public Strategy Contract Requirement Declaration

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