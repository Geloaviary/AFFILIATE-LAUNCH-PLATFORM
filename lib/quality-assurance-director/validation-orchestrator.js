const audit = require(
  "./audit-manager"
);

const {
  AUDIT_ACTION,
  WORKFLOW_STAGE,
  SUBMISSION_STATUS
} = require(
  "./quality-types"
);

const {
  updateStatus
} = require(
  "./submission-manager"
);

const {
  validate: validateConstitution
} = require(
  "./constitutional-validator"
);

const {
  validate: validateDepartment
} = require(
  "./department-validator"
);

const QualityReport =
  require(
    "./models/quality-report"
  );

/*
========================================
VALIDATION ORCHESTRATOR

Pipeline

Submission

↓

Constitution

↓

Department

↓

Quality Report

========================================
*/

async function validate({

  submission

} = {}) {

  if (!submission) {

    throw new Error(
      "Submission required."
    );

  }

  /*
  ========================================
  VALIDATING
  ========================================
  */

  await updateStatus(

    submission.id,

    SUBMISSION_STATUS.VALIDATING

  );

  await audit.record({

    submissionId:
      submission.id,

    department:
      submission.department,

    action:
      AUDIT_ACTION.VALIDATED,

    data: {

      workflowStage:
        WORKFLOW_STAGE.RESEARCH_QC,

      reportVersion:
        submission.version

    }

  });

  /*
  ========================================
  CONSTITUTION
  ========================================
  */

  const constitutional =
    await validateConstitution({

      submission

    });

  if (
    !constitutional.approved
  ) {

    await updateStatus(

      submission.id,

      SUBMISSION_STATUS.FAILED

    );

    await audit.record({

      submissionId:
        submission.id,

      department:
        submission.department,

      action:
        AUDIT_ACTION.FAILED,

      data: {

        workflowStage:
          WORKFLOW_STAGE.RESEARCH_QC,

        qcScore:
          constitutional.score,

        violationCount:
          constitutional.violations.length,

        notes:
          "Constitutional validation failed."

      }

    });

    return new QualityReport({

      submission,

      approved: false,

      score:
        constitutional.score,

      violations:
        constitutional.violations

    });

  }

  /*
  ========================================
  DEPARTMENT
  ========================================
  */

  const department =
    await validateDepartment({

      submission

    });

  if (
    !department.approved
  ) {

    await updateStatus(

      submission.id,

      SUBMISSION_STATUS.FAILED

    );

    await audit.record({

      submissionId:
        submission.id,

      department:
        submission.department,

      action:
        AUDIT_ACTION.FAILED,

      data: {

        workflowStage:
          WORKFLOW_STAGE.RESEARCH_QC,

        qcScore:
          department.score,

        violationCount:
          department.violations.length,

        notes:
          "Department validation failed."

      }

    });

    return new QualityReport({

      submission,

      approved: false,

      score:
        department.score,

      violations:
        department.violations

    });

  }

  /*
  ========================================
  APPROVED
  ========================================
  */

  await updateStatus(

    submission.id,

    SUBMISSION_STATUS.APPROVED

  );

  await audit.record({

    submissionId:
      submission.id,

    department:
      submission.department,

    action:
      AUDIT_ACTION.APPROVED,

    data: {

      workflowStage:
        WORKFLOW_STAGE.APPROVAL,

      qcScore:
        department.score,

      violationCount: 0,

      notes:
        "Submission approved."

    }

  });

  return new QualityReport({

    submission,

    approved: true,

    score:
      department.score,

    violations: []

  });

}

module.exports = {

  validate

};