require("dotenv").config({
  path: ".env.local"
});

const { kv } = require("@vercel/kv");

async function reset() {

  const campaignKeys =
    await kv.keys(
      "*-campaign-*"
    );

  const jobKeys =
    await kv.keys(
      "job:*"
    );

  const indexKeys =
    await kv.keys(
      "campaign-index:*"
    );

  console.log(
    `Campaigns: ${campaignKeys.length}`
  );

  console.log(
    `Jobs: ${jobKeys.length}`
  );

  console.log(
    `Indexes: ${indexKeys.length}`
  );

  for (const key of campaignKeys) {

    await kv.del(key);

    console.log(
      `Deleted ${key}`
    );

  }

  for (const key of jobKeys) {

    await kv.del(key);

    console.log(
      `Deleted ${key}`
    );

  }

  for (const key of indexKeys) {

    await kv.del(key);

    console.log(
      `Deleted ${key}`
    );

  }

  console.log(
    "RESET COMPLETE"
  );

}

reset()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });