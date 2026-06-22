function buildContentPackage(
  winner = {}
) {

  const name =
    winner?.name || "Product";

  return {

    keywords: [

      name,

      `${name} review`,

      `${name} tutorial`,

      `${name} comparison`

    ],

    hashtags: [

      `#${name.replace(/\s/g,"")}`,

      "#AffiliateMarketing",

      "#OnlineBusiness",

      "#Automation"

    ],

    hooks: [

      `Most people use ${name} incorrectly.`,

      `${name} changed how I work.`,

      `Before buying ${name}, watch this.`,

      `This feature makes ${name} different.`,

      `The truth about ${name}.`

    ],

    contentAngles: [

      "problem-solution",

      "tutorial",

      "review",

      "comparison",

      "listicle"

    ]

  };

}

module.exports = {
  buildContentPackage
};