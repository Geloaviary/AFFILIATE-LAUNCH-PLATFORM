function validateRevenue(
  research = {}
) {

  const errors = [];

  const revenue =
    research.revenueProjection || {};

  const required = [

    "projectedMonthlyRevenue",

    "conservativeGoal",

    "targetGoal",

    "aggressiveGoal"

  ];

  for (
    const field
    of required
  ) {

    const value =
      revenue[field];

    if (

      typeof value !==
      "number" ||

      value <= 0

    ) {

      errors.push(
        `${field} invalid`
      );

    }

  }

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validateRevenue
};