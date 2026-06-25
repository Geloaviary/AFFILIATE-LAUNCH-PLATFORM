class AuditEntry {

  constructor({

    submissionId,

    department,

    action,

    actor = "quality-assurance-director",

    data = {}

  }) {

    this.timestamp =
      new Date().toISOString();

    this.submissionId =
      submissionId;

    this.department =
      department;

    this.action =
      action;

    this.actor =
      actor;

    this.data =
      data;

  }

}

module.exports = AuditEntry;