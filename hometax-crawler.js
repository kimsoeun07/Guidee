const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&tmIdx=10&tm2lIdx=1006000000&tm3lIdx="
  );

  await page.waitForTimeout(5000);

  const frames = page.frames();
  const innerFrame = frames.find((f) => f.url().includes("index_pp.xml"));

  const data = await innerFrame.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("a"));
    const list = elements.map((el) => ({
      text: el.innerText,
      href: el.href,
    }));
    return list;
  });

  fs.writeFileSync("hometax_data.json", JSON.stringify(data, null, 2), "utf-8");

  console.log("hometax_data.json 으로 저장 완료");
  await browser.close();
})();
