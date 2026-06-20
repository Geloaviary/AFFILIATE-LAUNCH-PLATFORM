// scripts/check-clean.js
require("dotenv").config({
  path: ".env.local"
});

const { kv } = require("@vercel/kv");

(async () => {

  console.log(
    "campaigns",
    (await kv.keys("*-campaign-*")).length
  );

  console.log(
    "jobs",
    (await kv.keys("job:*")).length
  );

})();