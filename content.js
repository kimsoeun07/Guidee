// const keyword = "소득금액증명";

// function highlightButtons() {
//   const buttons = document.querySelectorAll("button, input[type='button'], a, span");

//   for (let btn of buttons) {
//     const text = (btn.textContent || btn.value || "").trim().toLowerCase();
//     if (text.includes(keyword.toLowerCase())) {
//       Object.assign(btn.style, {
//         border: "10px solid #ff4d4d",
//         padding: "50px",
//         boxShadow: "0 0 10px #ff4d4d",
//         borderRadius: "6px",
//         fontSize: "30px",
//         fontWeight: "bold",
//         background: "#fff",
//         position: "relative",
//         zIndex: "10",
//         transition: "all 0.3s ease-in-out",
//       });
//       btn.scrollIntoView({ behavior: "smooth", block: "center" });
//       console.log("🔍 강조된 요소:", text);
//       // console.log("🔍 강조된 요소:", {
//       //   text,
//       //   tagName: btn.tagName,
//       //   className: btn.className,
//       //   id: btn.id,
//       //   outerHTML: btn.outerHTML
//       // });
//       break;
//     }
//   }
// }

// // 초기 실행
// highlightButtons();
// const observer = new MutationObserver(() => {
//   highlightButtons();
// });
// observer.observe(document.body, { childList: true, subtree: true });

// //여기부터 은채가 수정함

// console.log("Content script loaded!");
// function savePageAsJson() {
//   const htmlContent = document.documentElement.outerHTML;
//   const data = { html: htmlContent };

//   console.log("📦 추출된 HTML JSON 데이터:", data);

//   const blob = new Blob([JSON.stringify(data, null, 2)], {
//     type: "application/json",
//   });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "page_content.json";
//   a.click();
//   URL.revokeObjectURL(url);
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "CRAWL_HTML") {
//     savePageAsJson();
//     sendResponse({ status: "✅ HTML 전송됨" });
//   }
// });
