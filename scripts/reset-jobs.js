require("dotenv").config({
  path: ".env.local"
});

const { kv } = require("@vercel/kv");

async function resetJobs() {

  try {

    const keys =
      await kv.keys(
        "job:*"
      );

    console.log(
      `Found ${keys.length} jobs`
    );

    for (const key of keys) {

      await kv.del(key);

      console.log(
        `Deleted: ${key}`
      );

    }

    console.log(
      `Finished. Deleted ${keys.length} jobs.`
    );

    process.exit(0);

  } catch (e) {

    console.error(e);

    process.exit(1);

  }

}

resetJobs();