function buildWinnerPackage({

  winner,

  niche

} = {}) {

  return {

    ...winner,

    name:
      winner?.name || null,

    brandName:
      winner?.name || null,

    category:
      niche || null,

    productUrl:
      winner?.productUrl || null,

    affiliateUrl:
      winner?.affiliateUrl || null,

    description:
      winner?.description || null,

    validation:
      winner?.validation || null,

    longtermScore:
      winner?.longtermScore || null,

    socialAccounts: {

      facebook: null,
      instagram: null,
      tiktok: null,
      youtube: null,
      x: null,
      linkedin: null

    },

    publishingProfile:
      null,

    audience:
      null,

    keywords: [],

    hashtags: [],

    hooks: [],

    contentAngles: [],

    brandKit:
      null

  };

}

module.exports = {
  buildWinnerPackage
};