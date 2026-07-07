"use strict";

/*
==================================================
AFFILIATE LAUNCH PLATFORM V4

Research Department

contracts.js

Constitutional Rule RD-008

Research Artifact

        │
        ▼

Department Business Contracts

        │
        ▼

Department Output Runtime

--------------------------------------------------

Constitutional Responsibility

This module translates an immutable
Research Artifact into immutable
Business Contracts for consuming
departments.

It NEVER

• Executes Research
• Performs Validation
• Calls the Quality Assurance Director
• Writes Platform Memory
• Executes another Department
• Mutates the Research Artifact

Every consuming Department receives
ONLY the information required to
perform its own business logic.

==================================================
*/

const Errors =
require("../quality-assurance-director/errors");

const {

    assertResearchArtifact

} = require("./artifact");

/*
==================================================
Runtime Identity
==================================================
*/

const CONTRACTS =

Object.freeze({

    department:

        "research",

    component:

        "contracts",

    version:

        "1.0.0"

});

/*
==================================================
Internal Utilities
==================================================
*/

function isObject(value) {

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

        !isObject(target)

    ) {

        return target;

    }

    if (

        visited.has(target)

    ) {

        return target;

    }

    visited.add(target);

    Object.freeze(target);

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
Metadata Translation

Shared constitutional metadata used
by every published contract.

==================================================
*/

function buildContractMetadata(

    artifact

) {

    return deepFreeze({

        artifactId:

            artifact.artifactId,

        department:

            artifact.department,

        artifactType:

            artifact.artifactType,

        version:

            artifact.version,

        campaignId:

            artifact.metadata

                .campaignId,

        sessionId:

            artifact.metadata

                .sessionId,

        requestId:

            artifact.metadata

                .requestId,

        createdAt:

            artifact.metadata

                .createdAt,

        publishedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Department Contract

Every published contract follows the
same constitutional structure.

==================================================
*/

function buildDepartmentContract({

    department,

    payload,

    metadata

}) {

    if (

        typeof department !==

        "string" ||

        !department.trim()

    ) {

        throw new Errors.ValidationError(

            "Department Contract requires a valid department."

        );

    }

    if (

        !isObject(payload)

    ) {

        throw new Errors.ValidationError(

            "Department Contract requires an object payload."

        );

    }

    if (

        !isObject(metadata)

    ) {

        throw new Errors.ValidationError(

            "Department Contract requires metadata."

        );

    }

    return deepFreeze({

        department,

        metadata,

        payload

    });

}


/*
==================================================
Production Contract

Research Artifact

        │

        ▼

Production Business Contract

Production receives ONLY the business
context required to manufacture
content assets.

It does NOT receive research
diagnostics, evidence, rankings,
or market analysis.

==================================================
*/

function buildProductionContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const payload =

        deepFreeze({

            winner:

                artifact.payload.winner ?? null,

            assets:

                artifact.payload.assets ?? {},

            plans:

                artifact.payload.plans ?? {},

            campaign:

                artifact.payload
                    .campaignIntelligence ?? {},

            product:

                artifact.payload
                    .productIntelligence ?? {},

            niche:

                artifact.payload
                    .niche ?? null

        });

    return buildDepartmentContract({

        department:

            "production",

        metadata,

        payload

    });

}

/*
==================================================
Strategy Contract

Research Artifact

        │

        ▼

Strategy Business Contract

Strategy receives market knowledge
required to build campaign strategy.

It does NOT receive production
assets or rendering information.

==================================================
*/

function buildStrategyContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const payload =

        deepFreeze({

            niche:

                artifact.payload
                    .niche ?? null,

            winner:

                artifact.payload
                    .winner ?? null,

            competitor:

                artifact.payload
                    .competitor ?? null,

            opportunities:

                artifact.payload
                    .opportunities ?? {},

            marketIntelligence:

                artifact.payload
                    .marketIntelligence ?? {},

            campaignIntelligence:

                artifact.payload
                    .campaignIntelligence ?? {},

            productIntelligence:

                artifact.payload
                    .productIntelligence ?? {}

        });

    return buildDepartmentContract({

        department:

            "strategy",

        metadata,

        payload

    });

}

/*
==================================================
Production Contract Verification

==================================================
*/

function isProductionContract(

    contract

) {

    return (

        isObject(contract) &&

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
Strategy Contract Verification

==================================================
*/

function isStrategyContract(

    contract

) {

    return (

        isObject(contract) &&

        contract.department ===

            "strategy" &&

        isObject(

            contract.metadata

        ) &&

        isObject(

            contract.payload

        )

    );

}

function assertStrategyContract(

    contract

) {

    if (

        !isStrategyContract(

            contract

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Strategy Contract."

        );

    }

    return contract;

}

/*
==================================================
Contract Translation Summary

Useful for telemetry and diagnostics.

==================================================
*/

function summarizeContracts({

    production,

    strategy

}) {

    return deepFreeze({

        production:

            production.department,

        strategy:

            strategy.department,

        generated:

            2,

        generatedAt:

            new Date()

                .toISOString()

    });

}

/*
==================================================
Private Contract Builders

Remaining builders implemented
in Part 3

buildPublishingContract()

buildRevenueContract()

buildAnalyticsContract()

buildComplianceContract()

buildResearchContract()

==================================================
*/

/*
==================================================
Publishing Contract

Research Artifact

        │

        ▼

Publishing Business Contract

Publishing receives ONLY the business
information required to distribute
campaign content.

It does NOT receive research evidence,
competitor analysis or opportunity
scoring.

==================================================
*/

function buildPublishingContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const winner =

        artifact.payload.winner ?? {};

    const payload =

        deepFreeze({

            niche:

                artifact.payload.niche ?? null,

            winner,

            keywords:

                winner.keywords ?? [],

            hashtags:

                winner.hashtags ?? [],

            hooks:

                winner.hooks ?? [],

            contentAngles:

                winner.contentAngles ?? [],

            affiliateUrl:

                winner.affiliateUrl ??

                null

        });

    return buildDepartmentContract({

        department:

            "publishing",

        metadata,

        payload

    });

}

/*
==================================================
Revenue Contract

Research Artifact

        │

        ▼

Revenue Business Contract

Revenue receives ONLY financial and
commercial intelligence.

==================================================
*/

function buildRevenueContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const winner =

        artifact.payload.winner ?? {};

    const payload =

        deepFreeze({

            niche:

                artifact.payload.niche ?? null,

            winner,

            revenueProjection:

                artifact.payload
                    .revenueProjection ?? {},

            opportunities:

                artifact.payload
                    .opportunities ?? {},

            commission:

                winner.commissionValue ??

                null,

            commissionType:

                winner.commissionType ??

                null,

            recurring:

                winner.commissionType ===

                "Recurring"

        });

    return buildDepartmentContract({

        department:

            "revenue",

        metadata,

        payload

    });

}

/*
==================================================
Analytics Contract

Research Artifact

        │

        ▼

Analytics Business Contract

Analytics receives summarized business
information suitable for dashboards,
KPIs and executive reporting.

==================================================
*/

function buildAnalyticsContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const payload =

        deepFreeze({

            niche:

                artifact.payload.niche ?? null,

            winner:

                artifact.payload
                    .winner ?? null,

            competitor:

                artifact.payload
                    .competitor ?? null,

            top5:

                artifact.payload
                    .top5 ?? [],

            validatedProducts:

                artifact.payload
                    .validatedProducts ?? [],

            revenueProjection:

                artifact.payload
                    .revenueProjection ?? {}

        });

    return buildDepartmentContract({

        department:

            "analytics",

        metadata,

        payload

    });

}

/*
==================================================
Compliance Contract

Research Artifact

        │

        ▼

Compliance Business Contract

Compliance receives only constitutional
metadata and affiliate compliance
information.

==================================================
*/

function buildComplianceContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const winner =

        artifact.payload.winner ?? {};

    const payload =

        deepFreeze({

            niche:

                artifact.payload.niche ?? null,

            winner:

                winner.name ??

                null,

            affiliateProgram:

                winner.affiliateUrl ??

                null,

            commissionType:

                winner.commissionType ??

                null,

            evidence:

                artifact.payload
                    .evidence ?? {},

            metadata

        });

    return buildDepartmentContract({

        department:

            "compliance",

        metadata,

        payload

    });

}

/*
==================================================
Research Contract

Research consumes its own business
context through a stable contract
rather than directly reading the
Research Artifact.

==================================================
*/

function buildResearchContract(

    artifact

) {

    const metadata =

        buildContractMetadata(

            artifact

        );

    const payload =

        deepFreeze({

            niche:

                artifact.payload.niche ?? null,

            winner:

                artifact.payload.winner ?? null,

            opportunities:

                artifact.payload
                    .opportunities ?? {},

            marketIntelligence:

                artifact.payload
                    .marketIntelligence ?? {},

            campaignIntelligence:

                artifact.payload
                    .campaignIntelligence ?? {},

            productIntelligence:

                artifact.payload
                    .productIntelligence ?? {},

            revenueProjection:

                artifact.payload
                    .revenueProjection ?? {}

        });

    return buildDepartmentContract({

        department:

            "research",

        metadata,

        payload

    });

}

/*
==================================================
Contract Verification

==================================================
*/

function isDepartmentContract(

    contract

) {

    return (

        isObject(contract) &&

        typeof contract.department ===

            "string" &&

        isObject(

            contract.metadata

        ) &&

        isObject(

            contract.payload

        )

    );

}

function assertDepartmentContract(

    contract

) {

    if (

        !isDepartmentContract(

            contract

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Department Contract."

        );

    }

    return contract;

}

/*
==================================================
Contract Collection Verification

==================================================
*/

function assertContracts(

    contracts

) {

    if (

        !isObject(

            contracts

        )

    ) {

        throw new Errors.ValidationError(

            "Invalid Contract Collection."

        );

    }

    Object.values(

        contracts

    ).forEach(

        assertDepartmentContract

    );

    return contracts;

}


/*
==================================================
Research Contract Publisher

Research Artifact


        │

        ▼

Department Contracts

==================================================
*/

function publishContracts(

    artifact

) {

    assertResearchArtifact(

        artifact

    );

    return deepFreeze({

        production:

            buildProductionContract(

                artifact

            ),

        strategy:

            buildStrategyContract(

                artifact

            ),

        publishing:

            buildPublishingContract(

                artifact

            ),

        revenue:

            buildRevenueContract(

                artifact

            ),

        analytics:

            buildAnalyticsContract(

                artifact

            ),

        compliance:

            buildComplianceContract(

                artifact

            ),

        research:

            buildResearchContract(

                artifact

            )

    });

}

/*
==================================================
Public Constitutional API

==================================================
*/

module.exports =

Object.freeze({

    /*
    ----------------------------------
    Runtime
    ----------------------------------
    */

    publishContracts,

    /*
    ----------------------------------
    Builders
    ----------------------------------
    */

    buildProductionContract,

    buildStrategyContract,

    buildPublishingContract,

    buildRevenueContract,

    buildAnalyticsContract,

    buildComplianceContract,

    buildResearchContract,

    /*
    ----------------------------------
    Assertions
    ----------------------------------
    */

    assertDepartmentContract,

    assertContracts

});