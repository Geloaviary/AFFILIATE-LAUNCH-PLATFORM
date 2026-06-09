const {
  extractBrand
} = require("./lib/media/brand-extractor");

console.log(
  extractBrand(
    "https://convertkit.com?affiliate=123"
  )
);