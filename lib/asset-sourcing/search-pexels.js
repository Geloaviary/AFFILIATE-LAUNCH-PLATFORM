const fetch = require("node-fetch");

const PEXELS_API_KEY =
  process.env.PEXELS_API_KEY;

async function searchPexels(
  keyword,
  options = {}
) {

  const perPage =
    options.perPage || 15;

  if (
    !PEXELS_API_KEY ||
    !keyword
  ) {

    return [];

  }

  try {

    const response =
      await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(
          keyword
        )}&per_page=${perPage}`,
        {
          headers: {
            Authorization:
              PEXELS_API_KEY
          }
        }
      );

    const data =
      await response.json();

    return (
      data.videos || []
    ).map(
      video => ({

        provider:
          "pexels",

        id:
          video.id,

        width:
          video.width,

        height:
          video.height,

        duration:
          video.duration,

        thumbnail:
          video.image,

        url:
          video.video_files?.find(
            file =>
              file.quality ===
              "hd"
          )?.link ||

          video.video_files?.[0]
            ?.link ||

          null

      })
    );

  } catch (e) {

    console.error(
      "Pexels search failed:",
      e.message
    );

    return [];

  }

}

module.exports = {
  searchPexels
};