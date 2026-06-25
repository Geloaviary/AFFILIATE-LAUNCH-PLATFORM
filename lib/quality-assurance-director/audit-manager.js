const { kv } = require("@vercel/kv");

const AuditEntry =
  require("./models/audit-entry");

const {

  AUDIT_ACTION,

  WORKFLOW_STAGE

} = require(
  "./quality-types"
);

const AUDIT_PREFIX =
  "qa:audit:";

/*
========================================
ADD ENTRY
========================================
*/

async function record({

  submissionId,

  department,

  action,

  actor =
    "quality-assurance-director",

  data = {}

} = {}) {

  data = {

    departmentVersion:
      data.departmentVersion || null,

    reportVersion:
      data.reportVersion || null,

    workflowStage:
      data.workflowStage || null,

    qcScore:
      data.qcScore || null,

    violationCount:
      data.violationCount || 0,

    repairTicketId:
      data.repairTicketId || null,

    parentSubmissionId:
      data.parentSubmissionId || null,

    executionTime:
      data.executionTime || null,

    notes:
      data.notes || null,

    ...data

  };

  const entry =
    new AuditEntry({

      submissionId,

      department,

      action,

      actor,

      data

    });

  const key =

    `${AUDIT_PREFIX}${submissionId}`;

  const history =
    (await kv.get(key))
    || [];

  history.push(
    entry
  );

  await kv.set(

    key,

    history

  );

  return entry;

}

/*
========================================
GET HISTORY
========================================
*/

async function getHistory(
  submissionId
) {

  return (

    await kv.get(

      `${AUDIT_PREFIX}${submissionId}`

    )

  ) || [];

}

/*
========================================
LATEST EVENT
========================================
*/

async function getLatest(
  submissionId
) {

  const history =
    await getHistory(
      submissionId
    );

  return history.at(-1) ||
    null;

}

/*
========================================
CLEAR HISTORY
========================================
*/

async function clearHistory(
  submissionId
) {

  await kv.del(

    `${AUDIT_PREFIX}${submissionId}`

  );

}

/*
========================================
COUNT EVENTS
========================================
*/

async function count(
  submissionId
) {

  const history =
    await getHistory(
      submissionId
    );

  return history.length;

}

module.exports = {

  record,

  getHistory,

  getLatest,

  clearHistory,

  count,

  AUDIT_ACTION

};