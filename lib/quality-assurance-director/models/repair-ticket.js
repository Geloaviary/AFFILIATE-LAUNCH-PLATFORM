const crypto = require("crypto");

const {
  REPAIR_STATUS
} = require("../quality-types");

class RepairTicket {

  constructor({

    submissionId,

    department,

    violations = []

  }) {

    this.id =
      crypto.randomUUID();

    this.submissionId =
      submissionId;

    this.department =
      department;

    this.status =
      REPAIR_STATUS.OPEN;

    this.violations =
      violations;

    this.createdAt =
      new Date().toISOString();

    this.updatedAt =
      this.createdAt;

  }

}

module.exports = RepairTicket;