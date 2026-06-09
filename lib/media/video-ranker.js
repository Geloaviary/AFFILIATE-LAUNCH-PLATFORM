function isVertical(video) {
  return video.height > video.width;
}

function scoreVideo(video) {

  let score = 0;

  if (isVertical(video)) {
    score += 100;
  }

  if (
    video.duration >= 10 &&
    video.duration <= 30
  ) {
    score += 25;
  }

  return score;
}

function selectBestVideo(videos = []) {

  return videos
    .map(video => ({
      video,
      score: scoreVideo(video)
    }))
    .sort(
      (a, b) =>
        b.score - a.score
    )[0]?.video || null;
}

module.exports = {
  selectBestVideo
};