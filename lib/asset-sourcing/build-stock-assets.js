const {
  searchPexels
} = require(
  "./search-pexels"
);

const {
  searchPixabay
} = require(
  "./search-pixabay"
);

async function buildStockAssets(
  keywords = []
) {

  const results = [];

  for (
    const keyword of keywords
  ) {

    const [
  pexelsVideos,
  pixabayVideos
] = await Promise.all([

  searchPexels(
    keyword
  ),

  searchPixabay(
    keyword
  )

]);

    results.push({

      keyword,

      pexelsVideos,

      pixabayVideos

    });

  }

  return results;

}

module.exports = {
  buildStockAssets
};