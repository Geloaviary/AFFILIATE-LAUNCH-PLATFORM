require("dotenv").config({
  path: ".env.local"
});

console.log(
  "KV URL:",
  !!process.env.KV_REST_API_URL
);

console.log(
  "KV TOKEN:",
  !!process.env.KV_REST_API_TOKEN
);

const { kv } = require("@vercel/kv");

async function reset() {

  try {

    const keys =
      await kv.keys(
        "admin-campaign-*"
      );

    console.log(
      `Found ${keys.length} campaigns`
    );

    for (const key of keys) {

      await kv.del(key);

      console.log(
        `Deleted: ${key}`
      );

    }

    console.log(
      `Finished. Deleted ${keys.length} campaigns.`
    );

    process.exit(0);

  } catch (e) {

    console.error(e);

    process.exit(1);

  }

}

reset();