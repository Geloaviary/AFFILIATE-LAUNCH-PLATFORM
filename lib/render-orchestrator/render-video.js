const axios =
  require("axios");

async function renderVideo(
  payload = {}
) {

  try {

  const response =
    await axios.post(

      "http://140.245.95.15:3000/render-scenes",

      payload,

      {
        timeout: 300000
      }

    );

  return response.data;

} catch (e) {

  console.error(
    "Render Error Status:",
    e.response?.status
  );

  console.error(
    "Render Error Data:",
    e.response?.data
  );

  throw e;

}

}

module.exports = {
  renderVideo
};