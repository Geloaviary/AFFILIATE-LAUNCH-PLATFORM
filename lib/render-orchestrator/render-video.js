const axios =
  require("axios");

async function renderVideo(
  payload = {}
) {

  try {

  console.log(
  "PAYLOAD TO RENDERER",
  JSON.stringify(
    payload?.plan?.scenes?.[0],
    null,
    2
  )
);

  console.error(
  "PAYLOAD SENT TO RENDERER",
  JSON.stringify(
    payload?.plan?.scenes?.[0],
    null,
    2
  )
);

throw new Error(
  "STOP BEFORE REMOTE RENDER"
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