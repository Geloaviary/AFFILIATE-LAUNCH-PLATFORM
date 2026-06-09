const {
  inferNiche
} = require("./lib/media/niche-inference");

(async () => {

  try {

    const result =
      await inferNiche({
        brand: "convertkit",
        url: "https://convertkit.com",
        title: "Email Marketing Platform",
        description:
          "Email marketing automation platform for creators and online businesses."
      });

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

  } catch (e) {

    console.error(
      "Inference failed:",
      e.message
    );

  }

})();