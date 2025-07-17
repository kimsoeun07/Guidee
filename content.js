// // const keyword = "소득금액증명";


// // id로만 스타일을 적용하는 함수
// // function highlightElementById(targetId) {
// //   console.log(targetId);
// //   const el = document.getElementById(targetId);
// //   console.log(el);
// //   if (el) {
// //     console.log("🔍 강조된 요소:", {
// //       tagName: el.tagName,
// //       className: el.className,
// //       id: el.id,
// //       outerHTML: el.outerHTML
// //     });
// //     const style = document.createElement('style');
// //     style.innerHTML = `#${targetId} {\n  border: 10px solid #ff4d4d !important;\n  padding: 50px !important;\n  box-shadow: 0 0 10px #ff4d4d !important;\n  border-radius: 6px !important;\n  font-size: 30px !important;\n  font-weight: bold !important;\n  background: #fff !important;\n  position: relative !important;\n  z-index: 10 !important;\n  transition: all 0.3s ease-in-out !important;\n}`;
// //     document.head.appendChild(style);
// //     el.scrollIntoView({ behavior: "smooth", block: "center" });
// //   } else {
// //     console.log("❌ 해당 id의 요소를 찾을 수 없습니다:", targetId);
// //   }
// // }

// // highlightElementById("mf_txppWframe_wq_uuid_780");


// // // // 키워드로 id를 찾고, 그 id로 highlightElementById를 호출하는 테스트 코드
// // // // const testKeyword = "로그인"; // 원하는 키워드 입력
// // // // let foundId = null;
// // // // const candidates = document.querySelectorAll("button, input[type='button'], a, span, div, label");
// // // // for (let el of candidates) {
// // // //   const text = (el.textContent || el.value || "").trim();
// // // //   if (text.includes(testKeyword)) {
// // // //     foundId = el.id;
// // // //     console.log("테스트용 id 탐지:", foundId, el);
// // // //     break;
// // // //   }
// // // // }
// // // // if (foundId) {
// // // //   // highlightElementById(foundId);
// // // // } else {
// // // //   console.log("❌ 키워드로 id를 찾지 못했습니다.");
// // // // }


// // // highlightElementById("mf_txppWframe_wq_uuid_780");

// // // //여기부터 은채가 수정함

// // // console.log("Content script loaded!");
// // // function savePageAsJson() {
// // //   const htmlContent = document.documentElement.outerHTML;
// // //   const data = { html: htmlContent };

// // //   console.log("📦 추출된 HTML JSON 데이터:", data);

// // //   const blob = new Blob([JSON.stringify(data, null, 2)], {
// // //     type: "application/json",
// // //   });
// // //   const url = URL.createObjectURL(blob);
// // //   const a = document.createElement("a");
// // //   a.href = url;
// // //   a.download = "page_content.json";
// // //   a.click();
// // //   URL.revokeObjectURL(url);
// // // }

// // // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// // //   if (message.type === "CRAWL_HTML") {
// // //     savePageAsJson();
// // //     sendResponse({ status: "✅ HTML 전송됨" });
// // //   }
// // // });


// // function highlightInFrame(doc, keyword) {
// //   const elements = doc.querySelectorAll("*");

// //   for (let el of elements) {
// //     if (el.innerText && el.innerText.includes(keyword)) {
// //       el.style.border = "3px solid red";
// //       el.style.padding = "10px";
// //       el.style.backgroundColor = "#ffebcd";
// //       el.scrollIntoView({ behavior: "smooth", block: "center" });
// //       console.log("강조 완료:", el);
// //       break;
// //     }
// //   }
// // }

// // // iframe이 포함된 페이지에서 실행
// // function highlightKeyword(keyword) {
// //   const iframes = document.querySelectorAll("iframe");

// //   if (iframes.length === 0) {
// //     console.warn("iframe 없음. 현재 문서에서 직접 검색.");
// //     highlightInFrame(document, keyword);
// //     return;
// //   }

// //   for (let iframe of iframes) {
// //     try {
// //       const doc = iframe.contentDocument || iframe.contentWindow.document;
// //       if (doc && doc.body) {
// //         console.log("iframe 내부 탐색 중:", iframe);
// //         highlightInFrame(doc, keyword);
// //       }
// //     } catch (e) {
// //       console.warn("iframe 접근 불가 (cross-origin):", e);
// //     }
// //   }
// // }

// // const keyword = "소득금액증명";
// // setTimeout(() => highlightKeyword(keyword), 2000);  // iframe 로딩 시간 고려


// console.log("Content script loaded!");

// const keyword = "공지사항"; // 강조할 키워드

// function highlightButtons() {
//   const buttons = document.querySelectorAll("button, input[type='button'], a, span");
//   console.log("🔍 버튼 탐색 시작:", buttons.length, "개 요소");

//   for (let btn of buttons) {
//     const text = (btn.textContent || btn.value || "").trim().toLowerCase();

//     if (text.includes(keyword.toLowerCase())) {
//       Object.assign(btn.style, {
//         border: "10px solid #ff4d4d !!!!important",
//         padding: "50px !!!!!important",
//         boxShadow: "0 0 10px #ff4d4d !!!!!important",
//         borderRadius: "6px !!!!!important",
//         fontSize: "30px !!!!!important",
//         fontWeight: "bold !!!!!important",
//         background: "#fff !!!!!important",
//         position: "relative !!!!!!important",
//         zIndex: "10 !!!!!!important",
//         transition: "all 0.3s ease-in-out !!!!!!important"
//       });
//       console.log("🔍 강조된 요소:", {
//         text,
//         tagName: btn.tagName,
//         className: btn.className,
//         id: btn.id,
//         outerHTML: btn.outerHTML
//       });
//       btn.scrollIntoView({ behavior: "smooth", block: "center" });
//       break;
//     }
//   }
// }

// // 초기 실행
// highlightButtons();

// // 동적 요소 탐지
// const observer = new MutationObserver(() => {
//   highlightButtons();
// });
// observer.observe(document.body, { childList: true, subtree: true });




// // 여기부터 변경된 부분 긔~

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.type === "CRAWL_HTML") {
//     const htmlContent = document.documentElement.outerHTML;
//     sendResponse({ status: "✅ HTML 전송됨", html: htmlContent });
//   }
//   return true; // 비동기 sendResponse 보장용
// });


const keyword = "로그인";

function highlightButtons() {
  const buttons = document.querySelectorAll("button, input[type='button'], a, span");
  for (let btn of buttons) {
    const text = (btn.textContent || btn.value || "").trim().toLowerCase();
    if (text.includes(keyword.toLowerCase())) {
      Object.assign(btn.style, {
        border: "10px solid #ff4d4d !important",
        padding: "50px !important",
        boxShadow: "0 0 10px #ff4d4d !important",
        borderRadius: "6px !important",
        fontSize: "30px !important",
        fontWeight: "bold !important",
        background: "#fff !important",
        position: "relative !important",
        zIndex: "10 !important",
        transition: "all 0.3s ease-in-out !important"
      });
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      console.log("🔍 강조된 요소:", text);
      // console.log("🔍 강조된 요소:", {
      //   text,
      //   tagName: btn.tagName,
      //   className: btn.className,
      //   id: btn.id,
      //   outerHTML: btn.outerHTML
      // });
      break;
    }
  }
}

// 초기 실행
highlightButtons();

// 동적 요소 탐지
const observer = new MutationObserver(() => {
  highlightButtons();
});