function validateResearch(
  research = {}
) {

  const errors = [];

  const winner =
    research.winner || {};

  if (!winner.name) {

    errors.push(
      "winner.name missing"
    );

  }

  if (!winner.productUrl) {

    errors.push(
      "winner.productUrl missing"
    );

  }

  if (!winner.affiliateUrl) {

    errors.push(
      "winner.affiliateUrl missing"
    );

  }

  if (!winner.description) {

    errors.push(
      "winner.description missing"
    );

  }

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validateResearch
};