class QualityReport {

  constructor({

    submission,

    approved,

    score,

    violations = []

  }) {

    this.submissionId =
      submission.id;

    this.department =
      submission.department;

    this.approved =
      approved;

    this.score =
      score;

    this.totalViolations =
      violations.length;

    this.violations =
      violations;

    this.reviewedAt =
      new Date().toISOString();

  }

}

module.exports = QualityReport;