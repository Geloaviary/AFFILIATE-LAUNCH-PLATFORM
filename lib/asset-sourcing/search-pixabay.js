const fetch = require("node-fetch");

const PIXABAY_API_KEY =
  process.env.PIXABAY_API_KEY;

async function searchPixabay(
  keyword,
  options = {}
) {

  const perPage =
    options.perPage || 15;

  if (
    !PIXABAY_API_KEY ||
    !keyword
  ) {

    return [];

  }

  try {

    const response =
      await fetch(
        `https://pixabay.com/api/videos/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(
          keyword
        )}&per_page=${perPage}`
      );

    const data =
      await response.json();

    return (
      data.hits || []
    ).map(
      video => ({

        provider:
          "pixabay",

        id:
          video.id,

        duration:
          video.duration,

        thumbnail:
          video.videos?.tiny
            ?.thumbnail ||

          null,

        url:
          video.videos?.medium
            ?.url ||

          video.videos?.small
            ?.url ||

          null

      })
    );

  } catch (e) {

    console.error(
      "Pixabay search failed:",
      e.message
    );

    return [];

  }

}

module.exports = {
  searchPixabay
};