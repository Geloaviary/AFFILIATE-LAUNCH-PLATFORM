function extractCommission(text = "") {

  const evidence = [];

  let commissionValue = null;
  let cookieDuration = null;

  const recurring =
  /(recurring|lifetime|for life|revenue share|revshare)/i
    .test(text);

  const commissionMatch =
  text.match(
    /(\d+)\s?(%|percent)\s?(recurring|commission|revenue share|revshare|for life)?/i
  );

  if (commissionMatch) {

    commissionValue =
      commissionMatch[1] + "%";

    evidence.push(
      commissionMatch[0]
    );

  }

  let cpaAmount = null;

const cpaMatch =
  text.match(
    /\$(\d+)\s?(CPA|per sale|per referral)/i
  );

if (cpaMatch) {

  cpaAmount =
    "$" + cpaMatch[1];

  evidence.push(
    cpaMatch[0]
  );

}

  const cookieMatch =
  text.match(
    /(\d+)\s?[- ]?(day|days)\s?(cookie|referral cookie)?/i
  );

  if (cookieMatch) {

    cookieDuration =
      cookieMatch[1] +
      " days";

    evidence.push(
      cookieMatch[0]
    );

  }

  return {

  commissionType:
    recurring
      ? "Recurring"
      : cpaAmount
        ? "CPA"
        : "One-Time",

  commissionValue,

  cpaAmount,

  cookieDuration,

  evidence

};

}

module.exports = {
  extractCommission
};