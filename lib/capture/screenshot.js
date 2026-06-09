const playwright = require("playwright");

async function captureWebsite(url) {

  const browser =
    await playwright.chromium.launch({
      headless: true
    });

  const page =
    await browser.newPage({
      viewport: {
        width: 1440,
        height: 3000
      }
    });

  await page.goto(url, {
    waitUntil: "networkidle"
  });

  await page.screenshot({
    path: "website-full.png",
    fullPage: true
  });

  await browser.close();

  return {
    screenshot: "website-full.png"
  };
}

module.exports = {
  captureWebsite
};