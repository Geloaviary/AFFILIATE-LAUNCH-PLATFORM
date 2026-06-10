const {
  runAffiliateResearcher
} = require(
  "../lib/affiliate-researcher/run-affiliate-researcher"
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

    const result =
      await runAffiliateResearcher(
        req.body || {}
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