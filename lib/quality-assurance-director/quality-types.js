/*
========================================
QUALITY ASSURANCE DIRECTOR
Shared Types
========================================
*/

const DEPARTMENTS = {

  RESEARCH:
    "research",

  STRATEGY:
    "strategy",

  CONTENT:
    "content",

  ASSET_INTELLIGENCE:
    "asset-intelligence",

  PRODUCTION:
    "production",

  RENDERING:
    "rendering",

  WORKSPACE:
    "workspace"

};

const SUBMISSION_STATUS = {

  PENDING:
    "pending",

  VALIDATING:
    "validating",

  FAILED:
    "failed",

  REPAIRING:
    "repairing",

  APPROVED:
    "approved",

  REJECTED:
    "rejected"

};

const REPAIR_STATUS = {

  OPEN:
    "open",

  ASSIGNED:
    "assigned",

  IN_PROGRESS:
    "in_progress",

  RESUBMITTED:
    "resubmitted",

  COMPLETED:
    "completed",

  ESCALATED:
    "escalated"

};

const ESCALATION_LEVEL = {

  NONE:
    0,

  DIRECTOR:
    1,

  EXECUTIVE:
    2,

  SYSTEM:
    3

};

const SEVERITY = {

  INFO:
    "info",

  WARNING:
    "warning",

  ERROR:
    "error",

  CRITICAL:
    "critical"

};

const QUALITY_RESULT = {

  PASSED:
    "passed",

  FAILED:
    "failed"

};

const VIOLATION_TYPE = {

  CONSTITUTION:
    "constitution",

  DEPARTMENT:
    "department",

  SCHEMA:
    "schema",

  DATA:
    "data",

  PLACEHOLDER:
    "placeholder",

  BUSINESS_RULE:
    "business-rule",

  ASSET:
    "asset",

  RENDER:
    "render"

};

const AUDIT_ACTION = {

  SUBMITTED:
    "submitted",

  VALIDATED:
    "validated",

  FAILED:
    "failed",

  REPAIR_CREATED:
    "repair-created",

  REPAIR_ASSIGNED:
    "repair-assigned",

  REPAIRED:
    "repaired",

  RESUBMITTED:
    "resubmitted",

  APPROVED:
    "approved",

  ESCALATED:
    "escalated"

};

const WORKFLOW_STAGE = {

  RESEARCH:
    "research",

  RESEARCH_QC:
    "research-qc",

  RESEARCH_REPAIR:
    "research-repair",

  STRATEGY:
    "strategy",

  STRATEGY_QC:
    "strategy-qc",

  CONTENT:
    "content",

  CONTENT_QC:
    "content-qc",

  ASSET_INTELLIGENCE:
    "asset-intelligence",

  ASSET_QC:
    "asset-qc",

  PRODUCTION:
    "production",

  PRODUCTION_QC:
    "production-qc",

  RENDERING:
    "rendering",

  RENDER_QC:
    "render-qc",

  APPROVAL:
    "approval",

  PUBLISHED:
    "published"

};

const COMPLIANCE_STATUS = {

  APPROVED:
    "approved",

  REJECTED:
    "rejected",

  ESCALATED:
    "escalated",

  PENDING:
    "pending"

};

const ESCALATION_TARGET = {

  RESEARCH_DIRECTOR:
    "research-director",

  STRATEGY_DIRECTOR:
    "strategy-director",

  CONTENT_DIRECTOR:
    "content-director",

  ASSET_INTELLIGENCE_DIRECTOR:
    "asset-intelligence-director",

  PRODUCTION_DIRECTOR:
    "production-director",

  RENDERING_DIRECTOR:
    "rendering-director",

  EXECUTIVE_DIRECTOR:
    "executive-director",

  SYSTEM:
    "system"

};

const QUALITY_SCORE = {

  PERFECT:
    100,

  PASSING:
    90,

  WARNING:
    80,

  MINIMUM:
    70,

  FAIL:
    69

};

module.exports = {

  DEPARTMENTS,

  SUBMISSION_STATUS,

  REPAIR_STATUS,

  ESCALATION_LEVEL,

  SEVERITY,

  QUALITY_RESULT,

  VIOLATION_TYPE,

  AUDIT_ACTION,

  WORKFLOW_STAGE,

  COMPLIANCE_STATUS,

  ESCALATION_TARGET,

  QUALITY_SCORE

};