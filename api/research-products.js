const {
  runAffiliateResearcher
} = require(
  "../lib/affiliate-researcher/run-affiliate-researcher"
);

const {
  getNiches
} = require(
  "../lib/niche-catalog/get-niches"
);

exports.default =
async function handler(
  req,
  res
) {

  if (
    req.method !== "POST"
  ) {

    return res.status(405).json({
      error:
        "Method Not Allowed"
    });

  }

  try {

    const options =
  req.body || {};

const niches =
  getNiches();

if (
  options.niche
) {

  const nicheExists =
    niches.some(
      niche =>
        niche.id ===
        options.niche
    );

  if (
    !nicheExists
  ) {

    return res.status(400).json({

      error:
        "Invalid niche selected"

    });

  }

}

const result =
  await runAffiliateResearcher(
    options
  );

    return res.status(200).json(
      result
    );

  } catch (e) {

    console.error(
      "Affiliate Researcher failed:",
      e.message
    );

    return res.status(500).json({
      error:
        e.message
    });

  }

};