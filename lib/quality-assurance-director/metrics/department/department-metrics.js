/*
========================================
QUALITY ASSURANCE DIRECTOR

Department Metrics

Tracks performance of every
autonomous department.

Owns:

• Quality Score
• Reputation
• Health
• Streaks
• Failures
• Repairs
• Execution Time
• Department Ranking
• Department Intelligence

========================================
*/

function createDepartmentMetrics() {

  return {};

}

/*
========================================
UPDATE
========================================
*/

function updateDepartmentMetrics({

  metrics = {},

  submission = {},

  qualityReport = {}

} = {}) {

  const department =

    submission.department ||

    "unknown";

  if (

    !metrics[department]

  ) {

    metrics[department] =

      createDepartment(

        department

      );

  }

  const dept =

    metrics[department];

  dept.submissions++;

  dept.lastSubmission =

    new Date()
      .toISOString();

  dept.lastScore =

    qualityReport.score || 0;

  dept.averageScore =

    (

      (

        dept.averageScore *

        (dept.submissions - 1)

      )

      +

      dept.lastScore

    )

    /

    dept.submissions;

  if (

    qualityReport.executionTime

  ) {

    dept.totalExecutionTime +=

      qualityReport.executionTime;

    dept.averageExecutionTime =

      Number(

        (

          dept.totalExecutionTime /

          dept.submissions

        ).toFixed(2)

      );

  }

  updateApprovalStats({

    department: dept,

    qualityReport

  });

  updateRepairStats({

    department: dept,

    qualityReport

  });

  updateReputation(

    dept

  );

  updateHealth(

    dept

  );

  updateViolationIntelligence({

  department: dept,

  qualityReport

});

  updateRanking(

    metrics

  );

  return metrics;

}

/*
========================================
CREATE DEPARTMENT
========================================
*/

function createDepartment(

  name

) {

  return {

    id: name,

    createdAt:

      new Date()
        .toISOString(),

    submissions: 0,

    approved: 0,

    rejected: 0,

    repaired: 0,

    escalated: 0,

    averageScore: 0,

    highestScore: 0,

    lowestScore: 100,

    lastScore: 0,

    reputation: 100,

    health: "excellent",

    ranking: 0,

    streak: 0,

    bestStreak: 0,

    failuresInRow: 0,

    recurringRepairs: 0,

    passRate: 0,

    repairRate: 0,

    escalationRate: 0,

    totalExecutionTime: 0,

    averageExecutionTime: 0,

    lastSubmission: null,

    firstSubmission: null,

    mostCommonViolation: null,

    strongestRule: null,

    weakestRule: null,

    engineeringFlags: [],

    recommendations: [],

    intelligence: {

      maturity: "new",

      confidence: 100,

      stability: "stable",

      trend: "stable"

    }

  };

}

/*
========================================
APPROVAL STATISTICS
========================================
*/

function updateApprovalStats({

  department,

  qualityReport

}) {

  if (

    qualityReport.approved

  ) {

    department.approved++;

    department.streak++;

    department.failuresInRow = 0;

    department.bestStreak =

      Math.max(

        department.bestStreak,

        department.streak

      );

  }

  else {

    department.rejected++;

    department.failuresInRow++;

    department.streak = 0;

  }

  department.highestScore =

    Math.max(

      department.highestScore,

      department.lastScore

    );

  department.lowestScore =

    Math.min(

      department.lowestScore,

      department.lastScore

    );

  department.passRate =

    calculateRate(

      department.approved,

      department.submissions

    );

}

/*
========================================
REPAIR STATISTICS
========================================
*/

function updateRepairStats({

  department,

  qualityReport

}) {

  if (

    qualityReport.repaired

  ) {

    department.repaired++;

    department.recurringRepairs++;

  }

  if (

    qualityReport.escalated

  ) {

    department.escalated++;

  }

  department.repairRate =

    calculateRate(

      department.repaired,

      department.submissions

    );

  department.escalationRate =

    calculateRate(

      department.escalated,

      department.submissions

    );

}

/*
========================================
REPUTATION ENGINE
========================================
*/

function updateReputation(

  department

) {

  let reputation = 100;

  reputation -=

    department.failuresInRow * 5;

  reputation -=

    department.recurringRepairs * 2;

  reputation +=

    Math.min(

      department.bestStreak,

      20

    );

  reputation +=

    department.averageScore / 10;

  department.reputation =

    Math.max(

      0,

      Math.min(

        100,

        Math.round(

          reputation

        )

      )

    );

}

/*
========================================
HEALTH ENGINE
========================================
*/

function updateHealth(

  department

) {

  const score =

    department.averageScore;

  if (

    score >= 95 &&

    department.passRate >= 95

  ) {

    department.health =

      "excellent";

  }

  else if (

    score >= 85

  ) {

    department.health =

      "good";

  }

  else if (

    score >= 70

  ) {

    department.health =

      "fair";

  }

  else {

    department.health =

      "poor";

  }

}

/*
========================================
DEPARTMENT RANKING
========================================
*/

function updateRanking(

  metrics

) {

  const ranking =

    Object.values(

      metrics

    )

    .sort(

      (a, b) =>

        b.reputation -

        a.reputation

    );

  ranking.forEach(

    (

      department,

      index

    ) => {

      department.ranking =

        index + 1;

    }

  );

}

/*
========================================
COMMON VIOLATION
========================================
*/

function updateViolationIntelligence({

  department,

  qualityReport

}) {

  if (

    !(qualityReport.violations || []).length

  ) {

    return;

  }

  department.violationCounts ||= {};

  qualityReport.violations.forEach(

    violation => {

      const code =

        violation.code ||

        "UNKNOWN";

      department.violationCounts[code] =

        (

          department.violationCounts[code] ||

          0

        ) + 1;

    }

  );

  department.mostCommonViolation =

    Object.entries(

      department.violationCounts

    )

    .sort(

      (a, b) =>

        b[1] - a[1]

    )[0]?.[0] || null;

}

/*
========================================
RATE CALCULATOR
========================================
*/

function calculateRate(

  value,

  total

) {

  if (

    total === 0

  ) {

    return 0;

  }

  return Number(

    (

      (

        value /

        total

      ) * 100

    ).toFixed(2)

  );

}

/*
========================================
DEPARTMENT SUMMARY

Used by Dashboard Builder
and Executive Summary.
========================================
*/

function buildDepartmentSummary(

  metrics = {}

) {

  return Object.values(

    metrics

  ).map(

    department => ({

      id:

        department.id,

      ranking:

        department.ranking,

      health:

        department.health,

      reputation:

        department.reputation,

      averageScore:

        Number(

          department.averageScore
            .toFixed(2)

        ),

      passRate:

        department.passRate,

      repairRate:

        department.repairRate,

      escalationRate:

        department.escalationRate,

      streak:

        department.streak,

      bestStreak:

        department.bestStreak,

      failuresInRow:

        department.failuresInRow,

      recurringRepairs:

        department.recurringRepairs,

      averageExecutionTime:

        Number(

          department
            .averageExecutionTime
            .toFixed(2)

        ),

      mostCommonViolation:

        department
          .mostCommonViolation,

      maturity:

        department
          .intelligence
          .maturity,

      confidence:

        department
          .intelligence
          .confidence,

      stability:

        department
          .intelligence
          .stability

    })

  );

}

/*
========================================
LEADERBOARD
========================================
*/

function buildLeaderboard(

  metrics = {}

) {

  return Object.values(

    metrics

  )

  .sort(

    (a, b) =>

      a.ranking -

      b.ranking

  )

  .map(

    department => ({

      rank:

        department.ranking,

      department:

        department.id,

      reputation:

        department.reputation,

      health:

        department.health,

      score:

        Number(

          department.averageScore
            .toFixed(2)

        )

    })

  );

}

/*
========================================
VALIDATION

Future Engineering Director
will call this automatically.
========================================
*/

function validateDepartmentMetrics(

  metrics = {}

) {

  const missing = [];

  Object.values(

    metrics

  ).forEach(

    department => {

      [

        "submissions",

        "approved",

        "rejected",

        "averageScore",

        "reputation",

        "health",

        "ranking"

      ].forEach(

        property => {

          if (

            department[property] ===

            undefined

          ) {

            missing.push({

              department:

                department.id,

              property

            });

          }

        }

      );

    }

  );

  return {

    valid:

      missing.length === 0,

    missing

  };

}

/*
========================================
RESET
========================================
*/

function resetDepartmentMetrics() {

  return {};

}

/*
========================================
CLONE
========================================
*/

function cloneDepartmentMetrics(

  metrics = {}

) {

  return JSON.parse(

    JSON.stringify(

      metrics

    )

  );

}

/*
========================================
INTELLIGENCE REPORT

Provides autonomous
quality insights.
========================================
*/

function buildDepartmentIntelligence(

  metrics = {}

) {

  const departments =

    Object.values(

      metrics

    );

  return {

    generatedAt:

      new Date()
        .toISOString(),

    strongestDepartment:

      departments[0]?.id ||

      null,

    weakestDepartment:

      departments

        .slice()

        .sort(

          (a, b) =>

            a.ranking -

            b.ranking

        )

        .at(-1)?.id ||

      null,

    healthiestDepartments:

      departments

        .filter(

          department =>

            department.health ===

            "excellent"

        )

        .map(

          department =>

            department.id

        ),

    departmentsAtRisk:

      departments

        .filter(

          department =>

            department.health ===

            "poor"

        )

        .map(

          department =>

            department.id

        ),

    engineeringAttention:

      departments

        .filter(

          department =>

            department.failuresInRow >= 3 ||

            department.reputation < 70

        )

        .map(

          department => ({

            department:

              department.id,

            reason:

              department.reputation < 70

                ? "Low Reputation"

                : "Repeated Failures"

          })

        )

  };

}

/*
========================================
EXPORTS
========================================
*/

module.exports = {

  createDepartmentMetrics,

  updateDepartmentMetrics,

  buildDepartmentSummary,

  buildLeaderboard,

  buildDepartmentIntelligence,

  validateDepartmentMetrics,

  resetDepartmentMetrics,

  cloneDepartmentMetrics

};

