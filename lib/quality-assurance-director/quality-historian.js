/*
========================================
QUALITY ASSURANCE DIRECTOR

Quality Historian

Permanent historical memory
for the QA platform.

Acts as the platform Event Store.

Responsible for

• Submission History
• Validation History
• Repair History
• Approval History
• Escalation History
• Workflow History
• Department History
• Constitution History
• Prediction History
• Learning History
• Engineering History
• Dashboard Snapshots

Constitution QA-001

========================================
*/

const crypto = require("crypto");

/*
========================================
CREATE
========================================
*/

function create() {

  return {

    generatedAt:
      new Date().toISOString(),

    version:
      "1.0",

    events: [],

    submissions: {},

    validations: {},

    repairs: {},

    approvals: {},

    escalations: {},

    workflows: {},

    departments: {},

    constitutions: {},

    predictions: {},

    learning: {},

    engineering: {},

    snapshots: {},

    analytics: {},

    timeline: []

  };

}

/*
========================================
RECORD

Master Entry Point

Every historical event
flows through here.

========================================
*/

function record({

  historian = create(),

  type,

  submission = {},

  payload = {}

} = {}) {

  const event =

    createEvent({

      type,

      submission,

      payload

    });

  historian.events.push(

    event

  );

  historian.timeline.push({

    eventId:

      event.eventId,

    timestamp:

      event.timestamp,

    type:

      event.type,

    department:

      event.department,

    workflowStage:

      event.workflowStage

  });

  switch (

    type

  ) {

    case "submission":

      recordSubmission({

        historian,

        event

      });

      break;

    case "validation":

      recordValidation({

        historian,

        event

      });

      break;

    case "repair":

      recordRepair({

        historian,

        event

      });

      break;

    case "approval":

      recordApproval({

        historian,

        event

      });

      break;

    case "escalation":

      recordEscalation({

        historian,

        event

      });

      break;

    case "snapshot":

      recordSnapshot({

        historian,

        event

      });

      break;

  }

  return historian;

}

/*
========================================
EVENT
========================================
*/

function createEvent({

  type,

  submission,

  payload

}) {

  return {

    eventId:

      crypto.randomUUID(),

    historyId:

      crypto.randomUUID(),

    correlationId:

      submission.correlationId ||

      crypto.randomUUID(),

    traceId:

      submission.traceId ||

      crypto.randomUUID(),

    type,

    timestamp:

      new Date().toISOString(),

    submissionId:

      submission.id ||

      null,

    parentSubmissionId:

      submission.parentSubmissionId ||

      null,

    repairTicketId:

      payload.repairTicketId ||

      null,

    auditId:

      payload.auditId ||

      null,

    department:

      submission.department ||

      "unknown",

    workflowStage:

      submission.workflowStage ||

      "unknown",

    reportVersion:

      payload.reportVersion ||

      1,

    departmentVersion:

      payload.departmentVersion ||

      1,

    constitutionVersion:

      payload.constitutionVersion ||

      null,

    predictionVersion:

      payload.predictionVersion ||

      null,

    intelligence: {

      qualityScore:

        payload.qualityScore ||

        0,

      confidence:

        payload.confidence ||

        100,

      trend:

        payload.trend ||

        "stable",

      risk:

        payload.risk ||

        "low",

      repairProbability:

        payload.repairProbability ||

        0,

      predictionAccuracy:

        payload.predictionAccuracy ||

        100

    },

    payload

  };

}

/*
========================================
SUBMISSION
========================================
*/

function recordSubmission({

  historian,

  event

}) {

  historian.submissions[

    event.submissionId

  ] = event;

}

/*
========================================
VALIDATION
========================================
*/

function recordValidation({

  historian,

  event

}) {

  historian.validations[

    event.eventId

  ] = event;

}

/*
========================================
REPAIR
========================================
*/

function recordRepair({

  historian,

  event

}) {

  historian.repairs[

    event.repairTicketId ||

    event.eventId

  ] = event;

}

/*
========================================
APPROVAL
========================================
*/

function recordApproval({

  historian,

  event

}) {

  historian.approvals[

    event.eventId

  ] = event;

}

/*
========================================
ESCALATION
========================================
*/

function recordEscalation({

  historian,

  event

}) {

  historian.escalations[

    event.eventId

  ] = event;

}

/*
========================================
SNAPSHOT
========================================
*/

function recordSnapshot({

  historian,

  event

}) {

  historian.snapshots[

    event.eventId

  ] = event;

}

/*
========================================
DEPARTMENT HISTORY
========================================
*/

function updateDepartmentHistory({

  historian,

  event

}) {

  const department =

    event.department ||

    "unknown";

  if (

    !historian.departments[department]

  ) {

    historian.departments[department] = {

      firstSeen:

        event.timestamp,

      lastSeen:

        event.timestamp,

      events: [],

      submissions: 0,

      validations: 0,

      repairs: 0,

      approvals: 0,

      escalations: 0,

      snapshots: 0,

      qualityHistory: [],

      workflowHistory: [],

      violationHistory: [],

      repairHistory: [],

      intelligenceHistory: []

    };

  }

  const dept =

    historian.departments[
      department
    ];

  dept.lastSeen =

    event.timestamp;

  dept.events.push(

    event.eventId

  );

  switch (

    event.type

  ) {

    case "submission":

      dept.submissions++;

      break;

    case "validation":

      dept.validations++;

      break;

    case "repair":

      dept.repairs++;

      break;

    case "approval":

      dept.approvals++;

      break;

    case "escalation":

      dept.escalations++;

      break;

    case "snapshot":

      dept.snapshots++;

      break;

  }

  dept.qualityHistory.push({

    timestamp:

      event.timestamp,

    score:

      event.intelligence
        .qualityScore

  });

  dept.workflowHistory.push({

    timestamp:

      event.timestamp,

    workflowStage:

      event.workflowStage

  });

  dept.intelligenceHistory.push({

    timestamp:

      event.timestamp,

    confidence:

      event.intelligence
        .confidence,

    trend:

      event.intelligence
        .trend,

    risk:

      event.intelligence
        .risk

  });

}

/*
========================================
WORKFLOW HISTORY
========================================
*/

function updateWorkflowHistory({

  historian,

  event

}) {

  const stage =

    event.workflowStage ||

    "unknown";

  if (

    !historian.workflows[stage]

  ) {

    historian.workflows[stage] = {

      firstSeen:

        event.timestamp,

      lastSeen:

        event.timestamp,

      events: [],

      transitions: 0,

      departments: {},

      qualityHistory: []

    };

  }

  const workflow =

    historian.workflows[
      stage
    ];

  workflow.lastSeen =

    event.timestamp;

  workflow.transitions++;

  workflow.events.push(

    event.eventId

  );

  workflow.departments[

    event.department

  ] =

    (

      workflow.departments[
        event.department
      ] ||

      0

    ) + 1;

  workflow.qualityHistory.push({

    timestamp:

      event.timestamp,

    score:

      event.intelligence
        .qualityScore

  });

}

/*
========================================
CONSTITUTION HISTORY
========================================
*/

function updateConstitutionHistory({

  historian,

  event

}) {

  const version =

    event.constitutionVersion ||

    "unknown";

  if (

    !historian.constitutions[version]

  ) {

    historian.constitutions[version] = {

      firstSeen:

        event.timestamp,

      lastSeen:

        event.timestamp,

      events: [],

      violations: 0,

      approvals: 0,

      confidenceHistory: []

    };

  }

  const constitution =

    historian.constitutions[
      version
    ];

  constitution.lastSeen =

    event.timestamp;

  constitution.events.push(

    event.eventId

  );

  if (

    event.type ===

    "approval"

  ) {

    constitution.approvals++;

  }

  if (

    event.payload

      ?.violations

  ) {

    constitution.violations +=

      event.payload
        .violations.length;

  }

  constitution.confidenceHistory.push({

    timestamp:

      event.timestamp,

    confidence:

      event.intelligence
        .confidence

  });

}

/*
========================================
PREDICTION HISTORY
========================================
*/

function updatePredictionHistory({

  historian,

  event

}) {

  const version =

    event.predictionVersion ||

    "default";

  if (

    !historian.predictions[version]

  ) {

    historian.predictions[version] = {

      history: [],

      averageAccuracy: 0,

      predictions: 0

    };

  }

  const prediction =

    historian.predictions[
      version
    ];

  prediction.predictions++;

  prediction.history.push({

    timestamp:

      event.timestamp,

    accuracy:

      event.intelligence
        .predictionAccuracy,

    repairProbability:

      event.intelligence
        .repairProbability,

    risk:

      event.intelligence
        .risk

  });

  prediction.averageAccuracy =

    prediction.history.reduce(

      (

        sum,

        item

      ) =>

        sum +

        item.accuracy,

      0

    )

    /

    prediction.history.length;

}

/*
========================================
LEARNING HISTORY
========================================
*/

function updateLearningHistory({

  historian,

  event

}) {

  const key =

    event.department;

  if (

    !historian.learning[key]

  ) {

    historian.learning[key] = {

      events: [],

      recommendations: [],

      improvements: [],

      confidenceHistory: []

    };

  }

  const learning =

    historian.learning[key];

  learning.events.push(

    event.eventId

  );

  learning.confidenceHistory.push({

    timestamp:

      event.timestamp,

    confidence:

      event.intelligence
        .confidence

  });

  if (

    event.payload

      ?.recommendation

  ) {

    learning.recommendations.push(

      event.payload
        .recommendation

    );

  }

}

/*
========================================
ENGINEERING HISTORY
========================================
*/

function updateEngineeringHistory({

  historian,

  event

}) {

  const key =

    event.department ||

    "unknown";

  if (

    !historian.engineering[key]

  ) {

    historian.engineering[key] = {

      firstSeen:

        event.timestamp,

      lastSeen:

        event.timestamp,

      repairTickets: [],

      escalations: [],

      recurringFailures: [],

      recommendations: [],

      maintenanceHistory: [],

      confidenceHistory: []

    };

  }

  const engineering =

    historian.engineering[key];

  engineering.lastSeen =

    event.timestamp;

  if (

    event.repairTicketId

  ) {

    engineering.repairTickets.push(

      event.repairTicketId

    );

  }

  if (

    event.type ===

    "escalation"

  ) {

    engineering.escalations.push(

      event.eventId

    );

  }

  if (

    event.payload

      ?.recommendation

  ) {

    engineering.recommendations.push(

      event.payload
        .recommendation

    );

  }

  engineering.maintenanceHistory.push({

    timestamp:

      event.timestamp,

    eventType:

      event.type,

    risk:

      event.intelligence
        .risk

  });

  engineering.confidenceHistory.push({

    timestamp:

      event.timestamp,

    confidence:

      event.intelligence
        .confidence

  });

}

/*
========================================
VIOLATION HISTORY
========================================
*/

function updateViolationHistory({

  historian,

  event

}) {

  const violations =

    event.payload

      ?.violations ||

    [];

  violations.forEach(

    violation => {

      const code =

        violation.code ||

        "UNKNOWN";

      if (

        !historian.analytics[code]

      ) {

        historian.analytics[code] = {

          code,

          firstSeen:

            event.timestamp,

          lastSeen:

            event.timestamp,

          occurrences: 0,

          departments: {},

          workflowStages: {},

          timeline: [],

          repairTickets: [],

          resolved: 0,

          unresolved: 0

        };

      }

      const history =

        historian.analytics[
          code
        ];

      history.lastSeen =

        event.timestamp;

      history.occurrences++;

      history.departments[

        event.department

      ] =

        (

          history.departments[
            event.department
          ] ||

          0

        ) + 1;

      history.workflowStages[

        event.workflowStage

      ] =

        (

          history.workflowStages[
            event.workflowStage
          ] ||

          0

        ) + 1;

      history.timeline.push({

        timestamp:

          event.timestamp,

        submissionId:

          event.submissionId,

        department:

          event.department,

        severity:

          violation.severity,

        type:

          violation.type

      });

      if (

        event.repairTicketId

      ) {

        history.repairTickets.push(

          event.repairTicketId

        );

      }

      if (

        violation.resolved

      ) {

        history.resolved++;

      }

      else {

        history.unresolved++;

      }

    }

  );

}

/*
========================================
TIMELINE INDEX
========================================
*/

function buildTimeline(

  historian

) {

  historian.timeline.sort(

    (

      a,

      b

    ) =>

      new Date(

        a.timestamp

      ) -

      new Date(

        b.timestamp

      )

  );

  return historian.timeline;

}

/*
========================================
SEARCH

Supports searching by

submission

department

workflow

event

correlation

trace

========================================
*/

function search({

  historian,

  submissionId,

  department,

  workflowStage,

  type,

  correlationId,

  traceId

} = {}) {

  return historian.events.filter(

    event => {

      if (

        submissionId &&

        event.submissionId !==

        submissionId

      ) {

        return false;

      }

      if (

        department &&

        event.department !==

        department

      ) {

        return false;

      }

      if (

        workflowStage &&

        event.workflowStage !==

        workflowStage

      ) {

        return false;

      }

      if (

        type &&

        event.type !==

        type

      ) {

        return false;

      }

      if (

        correlationId &&

        event.correlationId !==

        correlationId

      ) {

        return false;

      }

      if (

        traceId &&

        event.traceId !==

        traceId

      ) {

        return false;

      }

      return true;

    }

  );

}

/*
========================================
ANALYTICS
========================================
*/

function buildAnalytics(

  historian

) {

  return {

    totalEvents:

      historian.events.length,

    totalDepartments:

      Object.keys(

        historian.departments

      ).length,

    totalWorkflows:

      Object.keys(

        historian.workflows

      ).length,

    totalPredictions:

      Object.keys(

        historian.predictions

      ).length,

    totalLearningProfiles:

      Object.keys(

        historian.learning

      ).length,

    totalEngineeringProfiles:

      Object.keys(

        historian.engineering

      ).length,

    totalSnapshots:

      Object.keys(

        historian.snapshots

      ).length,

    totalViolationTypes:

      Object.keys(

        historian.analytics

      ).length

  };

}

/*
========================================
STATISTICS
========================================
*/

function statistics(

  historian

) {

  return {

    firstEvent:

      historian.events[0]

        ?.timestamp ||

      null,

    lastEvent:

      historian.events.at(

        -1

      )?.timestamp ||

      null,

    totalEvents:

      historian.events.length,

    timelineEntries:

      historian.timeline.length,

    retentionSize:

      JSON.stringify(

        historian

      ).length

  };

}

/*
========================================
RETENTION

Keeps the historian
within configured limits.

========================================
*/

function applyRetention({

  historian,

  maxEvents = 100000

}) {

  while (

    historian.events.length >

    maxEvents

  ) {

    historian.events.shift();

  }

  return historian;

}

/*
========================================
FINALIZE

Rebuilds indexes and analytics
before returning historian.

========================================
*/

function finalize(

  historian

) {

  buildTimeline(

    historian

  );

  historian.analyticsSummary =

    buildAnalytics(

      historian

    );

  historian.statistics =

    statistics(

      historian

    );

  historian.lastUpdated =

    new Date()
      .toISOString();

  return historian;

}

/*
========================================
TIMELINE REPLAY

Reconstructs complete history
for a correlation id or trace id.

========================================
*/

function replay({

  historian,

  correlationId,

  traceId

} = {}) {

  return historian.events

    .filter(

      event =>

        (

          correlationId &&

          event.correlationId ===

          correlationId

        )

        ||

        (

          traceId &&

          event.traceId ===

          traceId

        )

    )

    .sort(

      (

        a,

        b

      ) =>

        new Date(

          a.timestamp

        ) -

        new Date(

          b.timestamp

        )

    );

}

/*
========================================
EXPORT HISTORY

========================================
*/

function exportHistory(

  historian

) {

  return JSON.stringify(

    historian,

    null,

    2

  );

}

/*
========================================
IMPORT HISTORY

========================================
*/

function importHistory(

  json

) {

  if (

    typeof json ===

    "string"

  ) {

    return JSON.parse(

      json

    );

  }

  return json;

}

/*
========================================
VALIDATE

========================================
*/

function validate(

  historian = {}

) {

  const required = [

    "events",

    "timeline",

    "submissions",

    "validations",

    "repairs",

    "approvals",

    "escalations",

    "workflows",

    "departments",

    "constitutions",

    "predictions",

    "learning",

    "engineering",

    "snapshots"

  ];

  const missing =

    required.filter(

      property =>

        historian[property] ===

        undefined

    );

  return {

    valid:

      missing.length ===

      0,

    missing,

    totalEvents:

      historian.events

        ?.length ||

      0

  };

}

/*
========================================
RESET

========================================
*/

function reset() {

  return create();

}

/*
========================================
CLONE

========================================
*/

function clone(

  historian

) {

  return JSON.parse(

    JSON.stringify(

      historian

    )

  );

}

/*
========================================
FREEZE

Deep immutable historian.

========================================
*/

function freeze(

  historian

) {

  function deepFreeze(

    object

  ) {

    Object.keys(

      object

    ).forEach(

      key => {

        if (

          object[key] &&

          typeof object[key] ===

          "object"

        ) {

          deepFreeze(

            object[key]

          );

        }

      }

    );

    return Object.freeze(

      object

    );

  }

  return deepFreeze(

    historian

  );

}

/*
========================================
CHECKSUM

Detects accidental
history modification.

========================================
*/

function checksum(

  historian

) {

  return crypto

    .createHash(

      "sha256"

    )

    .update(

      JSON.stringify(

        historian.events

      )

    )

    .digest(

      "hex"

    );

}

/*
========================================
INTEGRITY CHECK

========================================
*/

function verifyIntegrity(

  historian

) {

  return {

    valid:

      validate(

        historian

      ).valid,

    checksum:

      checksum(

        historian

      ),

    events:

      historian.events

        ?.length ||

      0,

    timeline:

      historian.timeline

        ?.length ||

      0

  };

}

/*
========================================
EXPORTS

Universal Module Contract

QA-001

========================================
*/

module.exports = {

  create,

  record,

  finalize,

  replay,

  search,

  exportHistory,

  importHistory,

  buildAnalytics,

  statistics,

  applyRetention,

  validate,

  verifyIntegrity,

  checksum,

  clone,

  freeze,

  reset

};