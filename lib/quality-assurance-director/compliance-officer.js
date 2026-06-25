const {

  COMPLIANCE_STATUS,

  SEVERITY,

  AUDIT_ACTION

} = require(
  "./quality-types"
);

const {
  record
} = require(
  "./audit-manager"
);

async function review({

  submission = {},

  violations = [],

  repairTicket = null,

  constitutional = {},

  departmentValidation = {}

} = {}) {

  const result = {

    approved: true,

    status:
      COMPLIANCE_STATUS.APPROVED,

    violations: [],

    warnings: [],

    recommendation:
      "Proceed to next workflow stage."

  };

  /*
   * Constitutional Failure
   */

  if (

    constitutional.approved === false

  ) {

    result.approved = false;

    result.status =
      COMPLIANCE_STATUS.REJECTED;

    result.violations.push(

      ...(constitutional.violations || [])

    );

  }

  /*
   * Department Validation
   */

  if (

    departmentValidation.approved === false

  ) {

    result.approved = false;

    result.status =
      COMPLIANCE_STATUS.REJECTED;

    result.violations.push(

      ...(departmentValidation.violations || [])

    );

  }

  /*
   * QC Violations
   */

  if (

    violations.length

  ) {

    result.approved = false;

    result.status =
      COMPLIANCE_STATUS.REJECTED;

    result.violations.push(

      ...violations

    );

  }

  /*
   * Escalated Repair
   */

  if (

    repairTicket &&

    repairTicket.status ===
    "escalated"

  ) {

    result.approved = false;

    result.status =
      COMPLIANCE_STATUS.ESCALATED;

    result.recommendation =

      "Executive review required.";

  }

  /*
   * High Severity Warning
   */

  const critical =

    result.violations.filter(

      v =>

        v.severity ===
        SEVERITY.CRITICAL

    );

  if (

    critical.length

  ) {

    result.recommendation =

      "Critical violations must be repaired before resubmission.";

  }

  await record({

    submissionId:
      submission.id,

    department:
      submission.department,

    action:

      result.approved

        ? AUDIT_ACTION.APPROVED

        : AUDIT_ACTION.REJECTED,

    data: {

      complianceStatus:
        result.status,

      workflowStage:
        submission.workflowStage,

      violationCount:
        result.violations.length,

      recommendation:
        result.recommendation

    }

  });

  return result;

}

function isCompliant(

  report = {}

) {

  return (

    report.status ===
    COMPLIANCE_STATUS.APPROVED

  );

}

function requiresRepair(

  report = {}

) {

  return (

    report.status ===
    COMPLIANCE_STATUS.REJECTED

  );

}

function requiresEscalation(

  report = {}

) {

  return (

    report.status ===
    COMPLIANCE_STATUS.ESCALATED

  );

}

module.exports = {

  review,

  isCompliant,

  requiresRepair,

  requiresEscalation

};