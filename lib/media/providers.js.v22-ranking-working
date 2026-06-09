const fetch = require("node-fetch");

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

const {
  selectBestVideo
} = require("./video-ranker");

async function searchPexelsVideo(query) {
  try {
    const r = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5`,
      {
        headers: {
          Authorization: PEXELS_KEY
        }
      }
    );

    const d = await r.json();
       
    console.log(
       "PEXELS RESULTS:",
       d.videos?.length || 0
    );

    if (!d.videos?.length) return null;

const bestVideo =
  selectBestVideo(d.videos);

if (!bestVideo) {
  return null;
}

return {
  provider: "pexels",
  type: "video",
  url: bestVideo.video_files[0].link,

  width: bestVideo.width,
  height: bestVideo.height,
  duration: bestVideo.duration,

  sourceUrl: bestVideo.url,
  previewImage: bestVideo.image,

  assetId: bestVideo.id
};
  } catch {
    return null;
  }
}

async function searchPixabayVideo(query) {
  try {
    const r = await fetch(
      `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}`
    );

    const d = await r.json();

    if (!d.hits?.length) return null;

    return {
      provider: "pixabay",
      type: "video",
      url: d.hits[0].videos.medium.url
    };
  } catch {
    return null;
  }
}

module.exports = {
  searchPexelsVideo,
  searchPixabayVideo
};