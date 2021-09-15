const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(
    "https://www.youtube.com/c/RoyaltyFreeMusicNoCopyrightMusic/videos"
  );
  await page.setViewport({
    width: 1200,
    height: 800,
  });
  await page.waitForTimeout(4000);
  await autoScroll(page);

  await page.screenshot({
    path: "yoursite.png",
    fullPage: true,
  });

  //   await browser.close();
})();

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
