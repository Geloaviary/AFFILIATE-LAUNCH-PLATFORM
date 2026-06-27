/*
========================================
QUALITY ASSURANCE DIRECTOR

Severity Intelligence Engine

Single Source of Truth

Responsible for

• Severity Definitions
• Escalation Metadata
• Repair Priority
• SLA
• Prediction Weight
• Learning Weight
• Dashboard Metadata

Consumed by

• Rule Engine
• Constitutional Validator
• Repair Coordinator
• Escalation Manager
• Dashboard
• Prediction Engine
• Learning Engine
• Engineering Director

Constitution QA-001

========================================
*/

/*
========================================
SEVERITY BUILDER
========================================
*/

function severity({

  id,

  name,

  score,

  priority,

  escalationLevel,

  requiresImmediateStop = false,

  requiresEngineering = false,

  requiresManualApproval = false,

  autoRepairAllowed = true,

  retryAllowed = true,

  retryLimit = 3,

  repairPriority = 5,

  notificationLevel = "standard",

  learningWeight = 1,

  predictionWeight = 1,

  dashboardColor = "gray",

  slaMinutes = 1440,

  constitutionImpact = 0,

  businessImpact = 0,

  platformImpact = 0

}) {

  return {

    id,

    name,

    score,

    priority,

    escalationLevel,

    requiresImmediateStop,

    requiresEngineering,

    requiresManualApproval,

    autoRepairAllowed,

    retryAllowed,

    retryLimit,

    repairPriority,

    notificationLevel,

    learningWeight,

    predictionWeight,

    dashboardColor,

    slaMinutes,

    constitutionImpact,

    businessImpact,

    platformImpact

  };

}

/*
========================================
INFO

Informational only.

========================================
*/

const INFO = severity({

  id:

    "INFO",

  name:

    "Info",

  score:

    10,

  priority:

    1,

  escalationLevel:

    0,

  autoRepairAllowed:

    true,

  retryAllowed:

    true,

  retryLimit:

    5,

  repairPriority:

    1,

  notificationLevel:

    "low",

  learningWeight:

    0.25,

  predictionWeight:

    0.25,

  dashboardColor:

    "blue",

  slaMinutes:

    1440,

  constitutionImpact:

    5,

  businessImpact:

    2,

  platformImpact:

    1

});

/*
========================================
WARNING

Requires attention but
does not block workflow.

========================================
*/

const WARNING = severity({

  id:

    "WARNING",

  name:

    "Warning",

  score:

    30,

  priority:

    2,

  escalationLevel:

    1,

  autoRepairAllowed:

    true,

  retryAllowed:

    true,

  retryLimit:

    3,

  repairPriority:

    2,

  notificationLevel:

    "normal",

  learningWeight:

    0.5,

  predictionWeight:

    0.5,

  dashboardColor:

    "yellow",

  slaMinutes:

    480,

  constitutionImpact:

    15,

  businessImpact:

    10,

  platformImpact:

    5

});

/*
========================================
ERROR

Validation failed.

Workflow may continue
after repair.

========================================
*/

const ERROR = severity({

  id:

    "ERROR",

  name:

    "Error",

  score:

    60,

  priority:

    3,

  escalationLevel:

    2,

  requiresManualApproval:

    true,

  autoRepairAllowed:

    true,

  retryAllowed:

    true,

  retryLimit:

    2,

  repairPriority:

    3,

  notificationLevel:

    "high",

  learningWeight:

    0.75,

  predictionWeight:

    0.75,

  dashboardColor:

    "orange",

  slaMinutes:

    120,

  constitutionImpact:

    40,

  businessImpact:

    35,

  platformImpact:

    25

});

/*
========================================
CRITICAL

Workflow halted until
resolved.

========================================
*/

const CRITICAL = severity({

  id:

    "CRITICAL",

  name:

    "Critical",

  score:

    90,

  priority:

    4,

  escalationLevel:

    3,

  requiresImmediateStop:

    true,

  requiresEngineering:

    true,

  requiresManualApproval:

    true,

  autoRepairAllowed:

    false,

  retryAllowed:

    false,

  retryLimit:

    0,

  repairPriority:

    4,

  notificationLevel:

    "critical",

  learningWeight:

    1,

  predictionWeight:

    1,

  dashboardColor:

    "red",

  slaMinutes:

    15,

  constitutionImpact:

    80,

  businessImpact:

    75,

  platformImpact:

    70

});

/*
========================================
BLOCKER

Platform cannot continue.

Requires Engineering.

========================================
*/

const BLOCKER = severity({

  id:

    "BLOCKER",

  name:

    "Blocker",

  score:

    100,

  priority:

    5,

  escalationLevel:

    4,

  requiresImmediateStop:

    true,

  requiresEngineering:

    true,

  requiresManualApproval:

    true,

  autoRepairAllowed:

    false,

  retryAllowed:

    false,

  retryLimit:

    0,

  repairPriority:

    5,

  notificationLevel:

    "emergency",

  learningWeight:

    1,

  predictionWeight:

    1,

  dashboardColor:

    "darkred",

  slaMinutes:

    0,

  constitutionImpact:

    100,

  businessImpact:

    100,

  platformImpact:

    100

});

/*
========================================
ALL SEVERITIES

========================================
*/

const ALL_SEVERITIES = [

  INFO,

  WARNING,

  ERROR,

  CRITICAL,

  BLOCKER

];

/*
========================================
INDEXES

Fast O(1) lookups.

========================================
*/

const SEVERITY_INDEX =

  new Map();

const SCORE_INDEX =

  new Map();

const PRIORITY_INDEX =

  new Map();

ALL_SEVERITIES.forEach(

  severity => {

    SEVERITY_INDEX.set(

      severity.id,

      severity

    );

    SCORE_INDEX.set(

      severity.score,

      severity

    );

    PRIORITY_INDEX.set(

      severity.priority,

      severity

    );

  }

);

/*
========================================
ESCALATION INDEX

========================================
*/

const ESCALATION_INDEX =

  new Map();

ALL_SEVERITIES.forEach(

  severity => {

    ESCALATION_INDEX.set(

      severity.escalationLevel,

      severity

    );

  }

);

/*
========================================
AUTO REPAIR LEVELS

========================================
*/

const AUTO_REPAIR_LEVELS =

  ALL_SEVERITIES.filter(

    severity =>

      severity.autoRepairAllowed

  );

/*
========================================
ENGINEERING LEVELS

========================================
*/

const ENGINEERING_LEVELS =

  ALL_SEVERITIES.filter(

    severity =>

      severity.requiresEngineering

  );

  /*
========================================
LOOKUP

O(1)

========================================
*/

function getSeverity(

  severityId

) {

  return (

    SEVERITY_INDEX.get(

      String(

        severityId

      ).toUpperCase()

    )

    ||

    null

  );

}

/*
========================================
LOOKUP BY SCORE

========================================
*/

function getByScore(

  score = 0

) {

  if (

    score >= 100

  ) {

    return BLOCKER;

  }

  if (

    score >= 90

  ) {

    return CRITICAL;

  }

  if (

    score >= 60

  ) {

    return ERROR;

  }

  if (

    score >= 30

  ) {

    return WARNING;

  }

  return INFO;

}

/*
========================================
LOOKUP BY PRIORITY

========================================
*/

function getByPriority(

  priority

) {

  return (

    PRIORITY_INDEX.get(

      priority

    )

    ||

    null

  );

}

/*
========================================
LOOKUP BY ESCALATION

========================================
*/

function getByEscalation(

  level

) {

  return (

    ESCALATION_INDEX.get(

      level

    )

    ||

    null

  );

}

/*
========================================
COMPARISON

========================================
*/

function compare(

  left,

  right

) {

  const a =

    typeof left ===

    "string"

      ? getSeverity(

          left

        )

      : left;

  const b =

    typeof right ===

    "string"

      ? getSeverity(

          right

        )

      : right;

  if (

    !a ||

    !b

  ) {

    return 0;

  }

  return (

    a.priority -

    b.priority

  );

}

/*
========================================
MAX SEVERITY

========================================
*/

function highest(

  severities = []

) {

  if (

    severities.length === 0

  ) {

    return INFO;

  }

  return severities

    .map(

      severity =>

        typeof severity ===

        "string"

          ? getSeverity(

              severity

            )

          : severity

    )

    .filter(Boolean)

    .sort(

      (

        a,

        b

      ) =>

        b.priority -

        a.priority

    )[0];

}

/*
========================================
SORT

Highest first.

========================================
*/

function sort(

  severities = []

) {

  return [

    ...severities

  ].sort(

    (

      a,

      b

    ) => {

      const left =

        typeof a ===

        "string"

          ? getSeverity(

              a

            )

          : a;

      const right =

        typeof b ===

        "string"

          ? getSeverity(

              b

            )

          : b;

      return (

        right.priority -

        left.priority

      );

    }

  );

}

/*
========================================
FILTER

========================================
*/

function filter({

  requiresEngineering,

  autoRepairAllowed,

  minimumPriority

} = {}) {

  return ALL_SEVERITIES.filter(

    severity => {

      if (

        requiresEngineering !==

        undefined &&

        severity.requiresEngineering !==

        requiresEngineering

      ) {

        return false;

      }

      if (

        autoRepairAllowed !==

        undefined &&

        severity.autoRepairAllowed !==

        autoRepairAllowed

      ) {

        return false;

      }

      if (

        minimumPriority &&

        severity.priority <

        minimumPriority

      ) {

        return false;

      }

      return true;

    }

  );

}

/*
========================================
SLA

========================================
*/

function getSLA(

  severity

) {

  const rule =

    typeof severity ===

    "string"

      ? getSeverity(

          severity

        )

      : severity;

  return rule

    ?.slaMinutes ??

    null;

}

/*
========================================
RISK SCORE

========================================
*/

function riskScore(

  severity

) {

  const rule =

    typeof severity ===

    "string"

      ? getSeverity(

          severity

        )

      : severity;

  if (

    !rule

  ) {

    return 0;

  }

  return Number(

    (

      (

        rule.constitutionImpact +

        rule.businessImpact +

        rule.platformImpact

      ) / 3

    ).toFixed(

      2

    )

  );

}

/*
========================================
RECOMMENDATION

========================================
*/

function recommendation(

  severity

) {

  const rule =

    typeof severity ===

    "string"

      ? getSeverity(

          severity

        )

      : severity;

  if (

    !rule

  ) {

    return

      "Unknown severity.";

  }

  if (

    rule.requiresImmediateStop

  ) {

    return

      "Stop workflow immediately and escalate.";

  }

  if (

    rule.requiresEngineering

  ) {

    return

      "Assign to Engineering.";

  }

  if (

    rule.autoRepairAllowed

  ) {

    return

      "Attempt automatic repair.";

  }

  return

    "Manual review required.";

}

/*
========================================
VALIDATION

Verifies severity definitions
and index integrity.

========================================
*/

function validate() {

  const errors = [];

  ALL_SEVERITIES.forEach(

    severity => {

      if (

        !severity.id

      ) {

        errors.push(

          "Severity missing id."

        );

      }

      if (

        !severity.name

      ) {

        errors.push(

          `Severity ${severity.id} missing name.`

        );

      }

      if (

        severity.priority < 1

      ) {

        errors.push(

          `Severity ${severity.id} has invalid priority.`

        );

      }

      if (

        severity.score < 0 ||

        severity.score > 100

      ) {

        errors.push(

          `Severity ${severity.id} has invalid score.`

        );

      }

    }

  );

  return {

    valid:

      errors.length === 0,

    totalLevels:

      ALL_SEVERITIES.length,

    errors

  };

}

/*
========================================
STATISTICS

========================================
*/

function statistics() {

  return {

    totalLevels:

      ALL_SEVERITIES.length,

    engineeringLevels:

      ENGINEERING_LEVELS.length,

    autoRepairLevels:

      AUTO_REPAIR_LEVELS.length,

    highestPriority:

      BLOCKER.priority,

    highestScore:

      BLOCKER.score,

    lowestPriority:

      INFO.priority,

    lowestScore:

      INFO.score

  };

}

/*
========================================
METADATA

========================================
*/

function metadata() {

  return {

    engine:

      "Severity Intelligence Engine",

    version:

      "1.0.0",

    constitution:

      "QA-001",

    generatedAt:

      new Date()

        .toISOString()

  };

}

/*
========================================
HELPERS

========================================
*/

function exists(

  severityId

) {

  return SEVERITY_INDEX.has(

    String(

      severityId

    ).toUpperCase()

  );

}

function getAll() {

  return [

    ...ALL_SEVERITIES

  ];

}

function getAutoRepairLevels() {

  return [

    ...AUTO_REPAIR_LEVELS

  ];

}

function getEngineeringLevels() {

  return [

    ...ENGINEERING_LEVELS

  ];

}

/*
========================================
EXPORTS

Universal Module Contract

QA-001

========================================
*/

module.exports = {

  INFO,

  WARNING,

  ERROR,

  CRITICAL,

  BLOCKER,

  ALL_SEVERITIES,

  AUTO_REPAIR_LEVELS,

  ENGINEERING_LEVELS,

  SEVERITY_INDEX,

  PRIORITY_INDEX,

  SCORE_INDEX,

  ESCALATION_INDEX,

  getSeverity,

  getByScore,

  getByPriority,

  getByEscalation,

  highest,

  compare,

  sort,

  filter,

  getSLA,

  riskScore,

  recommendation,

  exists,

  getAll,

  getAutoRepairLevels,

  getEngineeringLevels,

  validate,

  statistics,

  metadata

};