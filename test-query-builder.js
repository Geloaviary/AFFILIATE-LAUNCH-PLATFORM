const {
  buildQueries
} = require("./lib/media/query-builder");

console.log(
  buildQueries({
    keywords: [
      "website",
      "business",
      "laptop"
    ]
  })
);