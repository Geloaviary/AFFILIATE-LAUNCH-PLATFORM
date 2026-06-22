function buildAudiencePackage(
  winner = {}
) {

  return {

    primaryAudience:
      winner?.category ||

      "General Audience",

    painPoints: [

      "Lack of time",

      "Need better results",

      "Manual workflows"

    ],

    motivations: [

      "Save time",

      "Increase revenue",

      "Work smarter"

    ],

    objections: [

      "Price",

      "Learning curve",

      "Trust"

    ]

  };

}

module.exports = {
  buildAudiencePackage
};