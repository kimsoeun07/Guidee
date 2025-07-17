// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

//여기부터 은채가 수정함
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_HTML") {
    const data = {
      url: message.url,
      html: message.html,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url,
      filename: "page_content.json",
      saveAs: false,
    });

    console.log("✅ HTML 저장됨 (page_content.json)");
    sendResponse({ status: "다운로드 시작됨" });
  }
});
