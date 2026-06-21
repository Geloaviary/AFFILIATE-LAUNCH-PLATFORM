function validatePlaceholders(
  research = {}
) {

  const errors = [];

  const banned = [

    "product a",

    "product b",

    "placeholder",

    "todo",

    "tbd",

    "lorem ipsum",

    "sample",

    "example product"

  ];

  const json =
    JSON.stringify(
      research
    ).toLowerCase();

  for (
    const word
    of banned
  ) {

    if (
      json.includes(word)
    ) {

      errors.push(
        `Placeholder detected: ${word}`
      );

    }

  }

  return {

    approved:
      errors.length === 0,

    errors

  };

}

module.exports = {
  validatePlaceholders
};