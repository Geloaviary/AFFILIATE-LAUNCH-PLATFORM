const { enrichScenes } =
require("./lib/media/enrich-scenes");

async function run() {

  const scenes = [
    {
      voice: "Need a website fast?",
      keywords: [
        "website",
        "business",
        "laptop"
      ]
    },
    {
      voice: "This software makes setup easy.",
      keywords: [
        "dashboard",
        "software"
      ]
    }
  ];

  const result =
    await enrichScenes(scenes);

  console.log(
    JSON.stringify(result, null, 2)
  );
}

run();