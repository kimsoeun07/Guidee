const { chromium } = require("playwright");
const fs = require("fs");

async function waitForFrame(page, urlPart, timeout = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const frame = page.frames().find((f) => f.url().includes(urlPart));
    if (frame) return frame;
    await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "https://hometax.go.kr/websquare/websquare.html?w2xPath=/ui/pp/index_pp.xml&tmIdx=10&tm2lIdx=1006000000&tm3lIdx="
  );

  const innerFrame = await waitForFrame(page, "index_pp.xml");

  if (!innerFrame) {
    console.error("innerFrame 못 찾음,,");
    await browser.close();
    return;
  }

  const data = await innerFrame.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("a"));
    return elements.map((el) => ({
      text: el.innerText,
      href: el.href,
    }));
  });

  fs.writeFileSync("hometax_data.json", JSON.stringify(data, null, 2), "utf-8");

  console.log("hometax_data.json 으로 저장 완료");
  await browser.close();
})();
