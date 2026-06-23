const axios =
  require("axios");

async function renderVideo(
  payload = {}
) {

  try {

    console.log(
  "FULL PAYLOAD TO RENDERER",
  JSON.stringify(
    payload,
    null,
    2
  )
);

    const response =
  await axios.post(
    "http://140.245.95.15:3000/render-scenes",
    payload,
    {
      timeout: 300000
    }
  );

console.log(
  "RAW RENDER RESPONSE",
  JSON.stringify(
    response.data,
    null,
    2
  )
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