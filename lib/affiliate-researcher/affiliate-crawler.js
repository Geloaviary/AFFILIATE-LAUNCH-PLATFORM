const cheerio = require("cheerio");
const fetch = require("node-fetch");

async function crawlPage(url) {

  try {

    const controller =
      new AbortController();

    const timeout =
      setTimeout(
        () => controller.abort(),
        3000
      );

    const response =
      await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
          "Accept":
            "text/html,application/xhtml+xml"
        },
        signal:
          controller.signal
      });

    clearTimeout(timeout);

    const html =
      await response.text();

    if (!html) {

      throw new Error(
        "Empty response"
      );

    }

    const $ =
      cheerio.load(html);

    const title =
      $("title")
        .text()
        .trim();

    const text =
      $("body")
        .text()
        .replace(/\s+/g, " ")
        .trim();

    return {
      url,
      title,
      text,
      html
    };

  } catch (e) {

    console.error(
      "Affiliate crawl failed:",
      e.message
    );

    return {
      url,
      title: "",
      text: "",
      html: ""
    };

  }

}

module.exports = {
  crawlPage
};