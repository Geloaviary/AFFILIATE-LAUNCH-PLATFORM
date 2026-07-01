/*
========================================
AFFILIATE LAUNCH PLATFORM V3

IDENTITY RUNTIME

Constitution

ID-001

Runtime Identity Authority

Responsible for

• Runtime IDs
• Execution IDs
• Session IDs
• Transaction IDs
• Commit IDs
• Audit IDs

Business Artifact IDs
are NOT generated here.

artifact.js owns
constitutional identities.

========================================
*/

const crypto = require("crypto");

/*
========================================
BUILD

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
RUNTIME IDS

========================================
*/

function generateExecutionId() {

    return buildId("EXE");

}

function generateSessionId() {

    return buildId("SES");

}

function generateTransactionId() {

    return buildId("TRN");

}

function generateSubmissionId() {

    return buildId("SUB");

}

function generateValidationId() {

    return buildId("VAL");

}

function generateCommitId() {

    return buildId("COM");

}

function generateAuditId() {

    return buildId("AUD");

}

function generateEventId() {

    return buildId("EVT");

}

function generateWorkflowId() {

    return buildId("WRK");

}

function generateServiceId() {

    return buildId("SRV");

}

function generateRegistryId() {

    return buildId("REG");

}

function generateConfigurationId() {

    return buildId("CFG");

}

function generateRepairId() {

    return buildId("REP");

}

function generateMiddlewareId() {

    return buildId("MID");

}

function generateHookId() {

    return buildId("HOK");

}

function generateIntegrationId() {

    return buildId("INT");

}

function generateMetricsId() {

    return buildId("MET");

}

/*
========================================
PUBLIC API

========================================
*/

module.exports = Object.freeze({

    generateExecutionId,

    generateSessionId,

    generateTransactionId,

    generateSubmissionId,

    generateValidationId,

    generateCommitId,

    generateAuditId,

    generateEventId,

    generateWorkflowId,

    generateServiceId,

    generateRegistryId,

    generateConfigurationId,

    generateRepairId,

    generateMiddlewareId,

    generateHookId,

    generateIntegrationId,

    generateMetricsId

});