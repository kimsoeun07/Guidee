
console.log("Content script loaded!");

// 강조할 키워드
// const keyword = "전자";

function highlightButtons(keyword) {
  const buttons = document.querySelectorAll("button, input[type='button'], a");  
  for (let btn of buttons) {    
    const text = (btn.textContent  || btn.value || '').trim().toLowerCase();    

    if (keyword && text.includes(keyword.toLowerCase())) {
      if(keyword === "조회") return;
      Object.assign(btn.style, {
        border: "10px solid #ff4d4d",
        padding: "50px",
        boxShadow: "0 0 10px #ff4d4d",
        borderRadius: "6px",
        fontSize: "30px",
        fontWeight: "bold",
        background: "#fff",
        position: "relative",
        zIndex: "10",
        transition: "all 0.3s ease-in-out",
        flexWrap: "wrap",
      });
      console.log("강조된 버튼:", text); 
      btn.scrollIntoView({ behavior: "smooth", block: "center" });
      

      setTimeout(() => {
        //   console.log("스타일 적용 확인:", computed.border);


        // // 스타일 적용 확인
        const computed = window.getComputedStyle(btn);
        console.log("스타일 적용 확인1:", computed.border);
  
        if (!computed.border || !computed.border.includes("rgb(255, 77, 77)")) {

            console.log("스타일 적용 확인2:", computed.border);
  
            showCustomAlert("강조 실패, 버튼 자동 클릭됨!");
            setTimeout(() => {
                btn.click();
            }, 5000);
  
        } else {
            // 스타일 적용 성공
            btn.scrollIntoView({ behavior: "smooth", block: "center" });
            console.log("강조 성공:", text);
        }


      }, 500); // 1초 후 스타일 확인


        // 강조 실패 시 실험 코드
        // const computed = window.getComputedStyle(btn);
        // console.log("스타일 적용 확인1:", computed.border);
  
        // if (!computed.border || !computed.border.includes("rgb(255, 77, 77)")) {
        //     // // 스타일 적용 실패 → 버튼 자동 클릭
        //     // btn.click();
        //     // console.log("강조 실패, 버튼 자동 클릭:", text);
        //     // // 사용 예시
        //     // showCustomAlert("강조 실패, 버튼 자동 클릭됨!");
        //     console.log("스타일 적용 확인2:", computed.border);
  
        //     showCustomAlert("강조 실패, 버튼 자동 클릭됨!");
        //     setTimeout(() => {
        //         btn.click();
        //     }, 5000);
  
        // } else {
        //     // 스타일 적용 성공
        //     btn.scrollIntoView({ behavior: "smooth", block: "center" });
        //     console.log("강조 성공:", text);
        // }


      // break;
      // return;
    }

    function showCustomAlert(message) {
        const alertDiv = document.createElement("div");
        alertDiv.textContent = message;
        alertDiv.style.position = "fixed";
        alertDiv.style.top = "30px";
        alertDiv.style.left = "50%";
        alertDiv.style.transform = "translateX(-50%)";
        alertDiv.style.background = "#ff4d4d";
        alertDiv.style.color = "#fff";
        alertDiv.style.padding = "20px 40px";
        alertDiv.style.borderRadius = "10px";
        alertDiv.style.fontSize = "20px";
        alertDiv.style.zIndex = "9999";
        alertDiv.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
        document.body.appendChild(alertDiv);;

        setTimeout(() => {
            alertDiv.remove();
        }, 2000); // 2초 후 자동 제거
        }

}}

// 최초 실행

// highlightButtons();


// 동적으로 버튼이 생길 때마다 강조
// const observer = new MutationObserver(() => {  
//     highlightButtons();
// });
// observer.observe(document.body, { childList: true, subtree: true });

// 여기부터 변경된 부분 긔~ 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CRAWL_HTML") {
        const htmlContent = document.documentElement.outerHTML;
        sendResponse({ status: "✅ HTML 전송됨", html: htmlContent });
    }

    if (message.type === "HIGHLIGHT_BUTTON") {
      highlightButtons(message.keyword); // 전달받은 키워드로 함수 실행
    }
    return true; // 비동기 sendResponse 보장용
});