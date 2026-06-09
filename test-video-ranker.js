const {
  selectBestVideo
} = require("./lib/media/video-ranker");

const videos = [
  {
    width: 1920,
    height: 1080,
    duration: 15,
    name: "horizontal"
  },
  {
    width: 1080,
    height: 1920,
    duration: 28,
    name: "vertical-good"
  },
  {
    width: 1080,
    height: 1920,
    duration: 120,
    name: "vertical-too-long"
  }
];

console.log(
  selectBestVideo(videos)
);