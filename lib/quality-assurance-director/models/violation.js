const {
  SEVERITY,
  VIOLATION_TYPE
} = require("../quality-types");

class Violation {

  constructor({

    code,

    message,

    type = VIOLATION_TYPE.DEPARTMENT,

    severity = SEVERITY.ERROR,

    rule = null,

    path = null,

    recommendation = null

  }) {

    this.code = code;

    this.message = message;

    this.type = type;

    this.severity = severity;

    this.rule = rule;

    this.path = path;

    this.recommendation =
      recommendation;

    this.createdAt =
      new Date().toISOString();

  }

}

module.exports = Violation;