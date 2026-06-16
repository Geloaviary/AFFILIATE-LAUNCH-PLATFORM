function buildRevenueProjection(
  winner = {}
) {

  const score =
    winner.longtermScore?.score || 0;

  let projectedMonthlyRevenue = 1000;

  if (score >= 90)
    projectedMonthlyRevenue = 25000;

  else if (score >= 80)
    projectedMonthlyRevenue = 15000;

  else if (score >= 70)
    projectedMonthlyRevenue = 10000;

  else if (score >= 50)
    projectedMonthlyRevenue = 5000;

  else
    projectedMonthlyRevenue = 2000;

  return {

    projectedMonthlyRevenue,

    conservativeGoal:
      Math.round(
        projectedMonthlyRevenue * 0.4
      ),

    targetGoal:
      Math.round(
        projectedMonthlyRevenue * 0.7
      ),

    aggressiveGoal:
      projectedMonthlyRevenue

  };

}

module.exports = {
  buildRevenueProjection
};