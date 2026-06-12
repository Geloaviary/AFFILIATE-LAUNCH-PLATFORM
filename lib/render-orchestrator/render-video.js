const axios =
  require("axios");

async function renderVideo(
  payload = {}
) {

  const response =
    await axios.post(

      "http://140.245.95.15:3000/render-scenes",

      payload,

      {
        timeout:
          300000
      }

    );

  return response.data;

}

module.exports = {
  renderVideo
};