const {
  runVideoProduction
} = require(
  "../lib/video-production"
);

async function processVideoRender(
  payload
) {

  return runVideoProduction(
    payload
  );

}

module.exports = {

  processVideoRender

};