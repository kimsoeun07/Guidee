console.log("Content script loaded!");

// 강조할 키워드
const keyword = "로그인";

function highlightButtons() {
  const buttons = document.querySelectorAll("button, input[type='button'], a");
  for (let btn of buttons) {
    const text = (btn.innerText || btn.value || "").trim().toLowerCase();
    if (text.includes(keyword.toLowerCase())) {
      btn.style.border = "3px solid #4da6ff";
      btn.style.boxShadow = "0 0 10px #4da6ff";
      btn.style.borderRadius = "6px";
      btn.style.transition = "all 0.3s ease-in-out";
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      console.log("강조된 버튼:", text);
      break;
    }
  }
}

// 최초 실행
highlightButtons();

// 동적으로 버튼이 생길 때마다 강조
const observer = new MutationObserver(() => {
  highlightButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

//여기부터 은채가 수정함

console.log("Content script loaded!");
function savePageAsJson() {
  const htmlContent = document.documentElement.outerHTML;
  const data = { html: htmlContent };

  console.log("📦 추출된 HTML JSON 데이터:", data);

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "page_content.json";
  a.click();
  URL.revokeObjectURL(url);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "CRAWL_HTML") {
    savePageAsJson();
    sendResponse({ status: "✅ HTML 전송됨" });
  }
});
