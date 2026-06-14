const {
  getNiches
} = require(
  "./get-niches"
);

function getFeaturedNiches() {

  return getNiches()
    .filter(
      niche =>
        niche.featured === true
    );

}

module.exports = {
  getFeaturedNiches
};