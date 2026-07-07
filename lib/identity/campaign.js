/*
========================================
AFFILIATE LAUNCH PLATFORM V3

CAMPAIGN IDENTITY AUTHORITY

Constitution

ID-002

Business Identity Authority

Responsible for

• Campaign IDs

Runtime identities belong to

runtime.js

========================================
*/

"use strict";

const crypto =

    require(

        "crypto"

    );

/*
========================================
BUILD ID

========================================
*/

function buildId(

    prefix

) {

    return Object.freeze(

        `${prefix}_${crypto.randomUUID()}`

    );

}

/*
========================================
CAMPAIGN IDENTITY

Business identity.

Not a runtime identity.

========================================
*/

function generateCampaignId() {

    return buildId(

        "CMP"

    );

}

/*
========================================
VALIDATION

========================================
*/

function isCampaignId(

    value

) {

    return (

        typeof value ===

            "string" &&

        value.startsWith(

            "CMP_"

        )

    );

}

/*
========================================
ASSERTION

========================================
*/

function assertCampaignId(

    campaignId

) {

    if (

        !isCampaignId(

            campaignId

        )

    ) {

        throw new Error(

            "Invalid Campaign ID."

        );

    }

    return campaignId;

}

/*
========================================
NORMALIZATION

Accepts an existing Campaign ID
or generates a new one.

========================================
*/

function normalizeCampaignId(

    campaignId

) {

    if (

        campaignId == null

    ) {

        return generateCampaignId();

    }

    return assertCampaignId(

        campaignId

    );

}

/*
========================================
OPERATIONAL STATE

Identity authority diagnostics.

No business data.

========================================
*/

const state = {

    generated:

        0,

    lastCampaignId:

        null

};

function rememberCampaignId(

    campaignId

) {

    state.generated++;

    state.lastCampaignId =

        campaignId;
}

/*
========================================
PUBLIC GENERATOR

Constitutional entry point.

========================================
*/

function createCampaignId(

    campaignId = null

) {

    const id =

        normalizeCampaignId(

            campaignId

        );

    rememberCampaignId(

        id

    );

    return id;

}

/*
========================================
OPERATIONAL STATE

========================================
*/

function operationalState() {

    return Object.freeze({

        generated:

            state.generated,

        lastCampaignId:

            state.lastCampaignId

    });

}

/*
========================================
CAMPAIGN IDENTITY AUTHORITY

ID-002

========================================
*/

const CampaignIdentity =

    Object.freeze({

        createCampaignId,

        generateCampaignId,

        normalizeCampaignId,

        assertCampaignId,

        isCampaignId,

        operationalState

    });

/*
========================================
MODULE EXPORT

========================================
*/

module.exports =

    CampaignIdentity;