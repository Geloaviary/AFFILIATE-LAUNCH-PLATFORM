

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

    console.log("[API] research-products START");

    const options = req.body || {};

    console.log("[API] Request received");

    const niches = getNiches();

    console.log("[API] Niches loaded");

    if (options.niche) {

        const nicheExists = niches.some(

            niche => niche.id === options.niche

        );

        console.log("[API] Niche validated");

        if (!nicheExists) {

            return res.status(400).json({

                error: "Invalid niche selected"

            });

        }

    }

    const {
  runAffiliateResearcher
} = require(
  "../lib/affiliate-researcher/run-affiliate-researcher"
);

console.log("[API] Research module loaded");

    console.log("[API] Calling Research");

    const result = await runAffiliateResearcher(options);

    console.log("[API] Research Finished");

    return res.status(200).json(result);

} catch (e) {

    console.error("[API ERROR]", e);

    return res.status(500).json({

        error: e.message,

        stack: e.stack

    });

  }

}