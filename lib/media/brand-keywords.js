function getBrandKeywords(brand) {

  const b =
    (brand || "").toLowerCase();

  if (b.includes("convertkit")) {
    return [
      "email marketing",
      "newsletter",
      "creator business",
      "email automation"
    ];
  }

  if (b.includes("clickfunnels")) {
    return [
      "sales funnel",
      "landing page",
      "online business",
      "marketing"
    ];
  }

  return [];
}

module.exports = {
  getBrandKeywords
};