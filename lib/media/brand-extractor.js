function extractBrand(url = "") {

  try {

    const hostname =
      new URL(url).hostname
        .replace("www.", "");

    const brand =
      hostname.split(".")[0];

    return {
      hostname,
      brand
    };

  } catch {

    return {
      hostname: null,
      brand: null
    };

  }
}

module.exports = {
  extractBrand
};