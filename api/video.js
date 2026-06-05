const fetch = require("node-fetch");

const CREATOMATE_KEY = (process.env.CREATOMATE_API_KEY || "").replace(/[^\x20-\x7E]/g, "").trim();

exports.default = async function handler(req, res) {
  const { action } = req.query;
  if (action === "check") return checkVideo(req, res);
  return generateVideo(req, res);
};
                       
async function generateVideo(req, res) {
const { videoConcept } = req.body;
console.log(
  "VIDEO CONCEPT:",
  JSON.stringify(videoConcept, null, 2)
);
if (!videoConcept) {
return res.status(400).json({
error: "Missing videoConcept"
});
}

const scenes = Array.isArray(videoConcept.script)
? videoConcept.script
: [];

console.log("SCENE COUNT:", scenes.length);

 const elements= [];

elements.push({
  type: "shape",
  shape: "rectangle",
  width: "100%",
  height: "100%",
  fill_color: "#111111",
  duration: "30 s"
});

const sceneDuration = 4;

scenes.forEach((scene, index) => {

const start = index * sceneDuration;

elements.push({
    type: "text",
    text: scene.voice,
    x: "50%",
    y: "45%",
    width: "90%",
    font_size: 42,
    fill_color: "#ffffff",
    time: start + " s",
    duration: sceneDuration + " s"
  });

elements.push({
    type: "text",
    text: (scene.keywords || []).join(" • "),
    x: "50%",
    y: "75%",
    width: "80%",
    font_size: 22,
    fill_color: "#cccccc",
    time: start + " s",
    duration: sceneDuration + " s"
  });

});

elements.push({
  type: "text",
  text: videoConcept.cta || "Link in bio",
  x: "50%",
  y: "88%",
  width: "70%",
  font_size: 36,
  fill_color: "#ffffff",
  time: (scenes.length * sceneDuration) + " s",
  duration: "3 s"
});

const body = {
  source: {
    width: 1080,
    height: 1920,
    elements
  }
};

try {
console.log(
  "CREATOMATE BODY:",
  JSON.stringify(body, null, 2)
);
const cr = await fetch(
  "https://api.creatomate.com/v1/renders",
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
      "Authorization":
        "Bearer " +
        CREATOMATE_KEY
    },
    body: JSON.stringify(body)
  }
);

const d = await cr.json();

console.log(
  "CREATOMATE RESPONSE:",
  JSON.stringify(d, null, 2)
);

const result =
  Array.isArray(d)
    ? d[0]
    : d;

if (!result?.id) {
  return res.status(500).json({
    error: "Creatomate failed",
    raw: d
  });
}

return res.status(200).json({
  jobId: result.id
});

} catch (e) {

return res.status(500).json({
  error: e.message
});

}
}

async function checkVideo(req, res) {
  const { jobId } = req.body;
  const r = await fetch("https://api.creatomate.com/v1/renders/" + jobId, {
    headers: { "Authorization": "Bearer " + CREATOMATE_KEY },
  });
  let d = await r.json();
  if (Array.isArray(d)) d = d[0];
  const done = d?.status === "completed" || d?.status === "succeeded";
  return res.status(200).json({
    status: done ? "done" : "processing",
    videoUrl: done ? (d.url || null) : null,
  });
}