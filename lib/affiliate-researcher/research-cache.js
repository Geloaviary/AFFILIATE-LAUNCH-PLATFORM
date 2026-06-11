const { kv } =
  require("@vercel/kv");

const CACHE_TTL =
  60 *
  60 *
  24; // 24 hours

function buildCacheKey(
  niche = ""
) {

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  return (
    "affiliate-research:" +
    niche.toLowerCase() +
    ":" +
    today
  );

}

async function getCachedResearch(
  niche
) {

  const key =
    buildCacheKey(
      niche
    );

  const result =
    await kv.get(key);

  if (result) {

    console.log(
      "CACHE HIT:",
      key
    );

  }

  return result;

}

async function setCachedResearch(
  niche,
  data
) {

  const key =
    buildCacheKey(
      niche
    );

  await kv.set(
    key,
    data,
    {
      ex:
        CACHE_TTL
    }
  );

}

async function deleteCachedResearch(
  niche
) {

  const key =
    buildCacheKey(
      niche
    );

  await kv.del(key);

}

module.exports = {

  getCachedResearch,

  setCachedResearch,

  deleteCachedResearch

};