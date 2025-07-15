const { chromium } = require("playwright");
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&tmIdx=10&tm2lIdx=1006000000&tm3lIdx="
  );

  await page.waitForTimeout(7000);

  const frame = page.frameLocator('iframe[src*="index_pp.xml"]');
  await frame.locator("a").first().waitFor();

  const data = await frame.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("a"));
    return {
      count: elements.length,
      links: elements.map((el) => ({
        text: el.innerText,
        href: el.href,
      }))
    };
  });

  console.log("찾은 링크 개수:", data.count);
  fs.writeFileSync("hometax_data.json", JSON.stringify(data.links, null, 2), "utf-8");

  console.log("hometax_data.json 으로 저장 완료");
  await browser.close();
})();
