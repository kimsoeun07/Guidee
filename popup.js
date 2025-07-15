console.log("Popup script loaded!");

document.getElementById("runCrawler").addEventListener("click", async () => {
  console.log("🧠 버튼 클릭됨! content script에 HTML 요청 보냄!!");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { type: "CRAWL_HTML" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "❌ content script 응답 실패:",
        chrome.runtime.lastError.message
      );
    } else {
      console.log("✅ 응답 받음:", response);
    }
  });
});
