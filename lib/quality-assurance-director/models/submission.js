const crypto = require("crypto");

const {
  SUBMISSION_STATUS
} = require("../quality-types");

class Submission {

  constructor({

    department,

    report,

    version = 1,

    parentId = null

  }) {

    this.id =
      crypto.randomUUID();

    this.department =
      department;

    this.report =
      report;

    this.version =
      version;

    this.parentId =
      parentId;

    this.status =
      SUBMISSION_STATUS.PENDING;

    this.attempts = 0;

    this.createdAt =
      new Date().toISOString();

    this.updatedAt =
      this.createdAt;

  }

}

module.exports = Submission;