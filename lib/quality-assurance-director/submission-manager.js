const { kv } = require("@vercel/kv");

const Submission = require(
  "./models/submission"
);

const {
  SUBMISSION_STATUS
} = require(
  "./quality-types"
);

const SUBMISSION_PREFIX =
  "qa:submission:";

const DEPARTMENT_PREFIX =
  "qa:department:";

/*
========================================
CREATE SUBMISSION
========================================
*/

async function submit({

  department,

  report,

  version = 1,

  parentId = null

} = {}) {

  const submission =
    new Submission({

      department,

      report,

      version,

      parentId

    });

  await saveSubmission(
    submission
  );

  await indexSubmission(
    submission
  );
const audit =
  require("./audit-manager");

const {

  AUDIT_ACTION,

  WORKFLOW_STAGE

} = require(
  "./quality-types"
);

await audit.record({

  submissionId:
    submission.id,

  department:
    submission.department,

  action:
    AUDIT_ACTION.SUBMITTED,

  data: {

    workflowStage:
      WORKFLOW_STAGE.RESEARCH,

    reportVersion:
      submission.version

  }

});


  return submission;

}

/*
========================================
SAVE
========================================
*/

async function saveSubmission(
  submission
) {

  submission.updatedAt =
    new Date()
      .toISOString();

  await kv.set(

    `${SUBMISSION_PREFIX}${submission.id}`,

    submission

  );

  return submission;

}

/*
========================================
LOAD
========================================
*/

async function getSubmission(
  submissionId
) {

  return kv.get(

    `${SUBMISSION_PREFIX}${submissionId}`

  );

}

/*
========================================
UPDATE STATUS
========================================
*/

async function updateStatus(

  submissionId,

  status

) {

  const submission =
    await getSubmission(
      submissionId
    );

  if (
    !submission
  ) {

    return null;

  }

  submission.status =
    status;

  submission.updatedAt =
    new Date()
      .toISOString();

  await saveSubmission(
    submission
  );

  return submission;

}

/*
========================================
RESUBMIT
========================================
*/

async function resubmit(

  submissionId,

  report

) {

  const submission =
    await getSubmission(
      submissionId
    );

  if (
    !submission
  ) {

    return null;

  }

  submission.report =
    report;

  submission.attempts += 1;

  submission.status =
    SUBMISSION_STATUS.PENDING;

  submission.updatedAt =
    new Date()
      .toISOString();

  await saveSubmission(
    submission
  );

  return submission;

}

/*
========================================
INDEX
========================================
*/

async function indexSubmission(
  submission
) {

  const key =

    `${DEPARTMENT_PREFIX}${submission.department}`;

  const ids =
    (await kv.get(key))
    || [];

  ids.unshift(
    submission.id
  );

  await kv.set(

    key,

    ids.slice(0, 500)

  );

}

/*
========================================
LIST
========================================
*/

async function listDepartmentSubmissions(
  department
) {

  const ids =
    (await kv.get(

      `${DEPARTMENT_PREFIX}${department}`

    )) || [];

  const submissions =
    await Promise.all(

      ids.map(
        getSubmission
      )

    );

  return submissions.filter(
    Boolean
  );

}

module.exports = {

  submit,

  saveSubmission,

  getSubmission,

  updateStatus,

  resubmit,

  listDepartmentSubmissions

};