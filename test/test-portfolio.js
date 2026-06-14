const {
  upsertProduct,
  getProduct
} = require(
  "../lib/portfolio-manager"
);

async function run() {

  await upsertProduct({

    niche:
      "cybersecurity",

    productName:
      "CrowdStrike",

    productUrl:
      "https://crowdstrike.com",

    affiliateUrl:
      "https://crowdstrike.com/partners",

    score:
      100,

    commissionType:
      "Recurring",

    commissionValue:
      "40%",

    status:
      "DISCOVERED"

  });

  const product =
    await getProduct(
      "cybersecurity",
      "CrowdStrike"
    );

  console.log(
    JSON.stringify(
      product,
      null,
      2
    )
  );

}

run().catch(
  console.error
);