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

const elements = [
  {
    type: "text",
    text: "HELLO WORLD",
    x: "50%",
    y: "50%",
    width: "90%",
    fontSize: 80,
    fillColor: "#ffffff",
    alignment: "center",
    duration: 10
  }
];

const sceneDuration = 4;

scenes.forEach((scene, index) => {

const start = index * sceneDuration;

elements.push({
  type: "shape",
  shape: "rectangle",
  x: "0%",
  y: "0%",
  width: "100%",
  height: "100%",
  fillColor:
    index % 2 === 0
      ? "#0f172a"
      : "#1e293b",
  time: start + " s",
  duration: sceneDuration + " s"
});

elements.push({
  type: "text",
  text: scene.voice,
  x: "50%",
  y: "45%",
  width: "90%",
  fontSize: 34,
  fontWeight: 800,
  fillColor: "#ffffff",
  backgroundColor: "rgba(0,0,0,0.45)",
  alignment: "center",
  time: start + " s",
  duration: sceneDuration + " s"
});

elements.push({
  type: "text",
  text:
    (scene.keywords || [])
      .join(" • "),
  x: "50%",
  y: "75%",
  width: "80%",
  fontSize: 18,
  fillColor: "#cbd5e1",
  alignment: "center",
  time: start + " s",
  duration: sceneDuration + " s"
});

});

elements.push({
type: "text",
text:
videoConcept.cta ||
"Link in bio",
x: "50%",
y: "88%",
width: "70%",
fontSize: 28,
fontWeight: 800,
fillColor: "#ffffff",
backgroundColor: "#2563eb",
alignment: "center",
time: (scenes.length * sceneDuration) + " s",
duration: "3 s"
});

const body = {
  source: {
    width: 1080,
    height: 1920,
    elements: [
      {
        type: "text",
        text: "HELLO WORLD",
        fill_color: "#ffffff",
        font_size: 80
      }
    ]
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