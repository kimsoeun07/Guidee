console.log("popup.js 실행 시작");
// import highlightButtons from './content_heboja.js';

// API 구성 (실제 사용 시 API 키를 안전하게 관리하세요)
const API_CONFIG = {
  baseUrl:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  apiKey: "AIzaSyDBTqzoQSE9o3B_YMR8yF3bayHdLVeq6bw", // 실제 환경에서는 안전하게 관리하세요
};

// 연속적인 함수 호출을 제한하여 성능을 최적화하는 용도
let requestTimeout;
const debounce = (func, delay) => {
  return function (...args) {
    clearTimeout(requestTimeout);
    requestTimeout = setTimeout(() => func.apply(this, args), delay);
  };
};

// API 요청 함수
const callGeminiAPI = async (userInput) => {
  if (!userInput.trim()) {
    throw new Error("입력값이 비어있습니다.");
  }

  const url = `${API_CONFIG.baseUrl}?key=${API_CONFIG.apiKey}`;
  const requestBody = {
    contents: [
      {
        parts: [{ text: `답변 맨 위에 있는 문장은 없애고 숫자로 시작하고, 맨 뒤에 더 필요한거 있는지 질문하지 말아줘, https://hometax.go.kr/ 이 웹에서 할수 있는 방법을 순서대로 간결하게 답변해, 클릭해야 할 요소들을 []안에 넣어줘, [홈텍스 접속]단계는 생략해줘:\n${userInput}` }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      `API 요청 실패: ${response.status} - ${
        errorData?.error?.message || response.statusText
      }`
    );
  }

  return await response.json();
};

// 응답 처리 함수
const handleAPIResponse = (data) => {
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("응답 데이터가 없습니다.");
  }

  const candidate = data.candidates[0];

  // 안전성 필터링 확인
  if (candidate.finishReason === "SAFETY") {
    throw new Error("안전성 필터에 의해 차단된 응답입니다.");
  }

  const result = candidate.content?.parts?.[0]?.text;
  if (!result) {
    throw new Error("응답 텍스트를 찾을 수 없습니다.");
  }

  return result;
};

// UI 업데이트 함수들
const updateQuestionArea = (question) => {
  const questionArea = document.getElementById("questionArea");
  if (questionArea) {
    questionArea.textContent = question;
  }
};

const updateResponseArea = (message, isError = false) => {
  const responseArea = document.getElementById("responseArea");
  if (responseArea) {
    responseArea.textContent = message;
    responseArea.className = isError
      ? "response-display error"
      : "response-display success";

    if (!isError) {
      responseArea.classList.remove("loading");
    }
  }
};

const setLoadingState = (isLoading) => {
  const button = document.getElementById("askButton");
  const input = document.getElementById("userInput");
  const responseArea = document.getElementById("responseArea");

  if (button) {
    button.disabled = isLoading;
    button.textContent = isLoading ? "처리 중..." : "질문하기";
  }

  if (input) {
    input.disabled = isLoading;
  }

  if (responseArea && isLoading) {
    responseArea.classList.add("loading");
  }
};

// 메인 요청 처리 함수
const handleUserRequest = async () => {
  const userInput = document.getElementById("userInput")?.value;

  if (!userInput || !userInput.trim()) {
    updateResponseArea("질문을 입력해주세요.", true);
    return;
  }
  //date 키워드 추출 후 데이터 저장
  const extractKeywords = (text) => {
    const regex = /\[([^\]]+)\]/g;
    const keywords = [];
    let match;
  
    while ((match = regex.exec(text)) !== null) {
      keywords.push(match[1]); // 대괄호 안 내용만 추출
    }
  
    return keywords;
  };

  // 질문 영역에 사용자 입력 표시
  updateQuestionArea(userInput);

  setLoadingState(true);
  updateResponseArea("응답을 기다리는 중...");

  try {
    console.log("API 요청 시작:", userInput);
    const data = await callGeminiAPI(userInput);
    console.log("API 응답:", data);

    const result = handleAPIResponse(data);
    updateResponseArea(result);

    
    //최종 키워드
    const keywords = extractKeywords(result);
    console.log(keywords);
    
    //김소은이 수정한 부분
    // for(i = 0; i < (keywords.length); i++){
    //   console.log("강조할 키워드:", keywords[i]);
    //   if(keywords[i]){
    //     highlightButtons(keywords[i]);
    //   }
      
    // }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    for (let i = 0; i < keywords.length; i++) {
      chrome.tabs.sendMessage(tab.id, {
        type: "HIGHLIGHT_BUTTON",
        keyword: keywords[i],
      });
    }
    // 동적으로 버튼이 생길 때마다 강조
    // const observer = new MutationObserver(() => {  
    //   for(i = 0; i < (keywords.length); i++){
    //     highlightButtons(keywords[i]);
    //   }
    // });
    // observer.observe(document.body, { childList: true, subtree: true });
    

    // 성공적인 요청 후 입력 필드 초기화
    document.getElementById("userInput").value = "";
  } catch (error) {
    console.error("요청 처리 중 오류:", error);
    updateResponseArea(`오류 발생: ${error.message}`, true);
  } finally {
    setLoadingState(false);
  }
};

// 디바운스된 요청 함수
const debouncedRequest = debounce(handleUserRequest, 300);

// 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("askButton");
  const input = document.getElementById("userInput");

  if (button) {
    button.addEventListener("click", debouncedRequest);
  }

  if (input) {
    // Enter 키로도 요청 가능하도록
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        debouncedRequest();
      }
    });

    // 포커스 시 placeholder 효과
    input.addEventListener("focus", () => {
      input.style.borderColor = "#667eea";
    });

    input.addEventListener("blur", () => {
      input.style.borderColor = "#ddd";
    });
  }

  console.log("popup.js 초기화 완료");
});

// 확장 프로그램 종료 시 정리
window.addEventListener("beforeunload", () => {
  if (requestTimeout) {
    clearTimeout(requestTimeout);
  }
});

//html 받아서 처리하기
(async () => {
  console.log("🧠 확장 열림! content script에 HTML 요청 보냄!!");

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // content script 강제 실행
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content_heboja.js"],
  });

  chrome.tabs.sendMessage(tab.id, { type: "CRAWL_HTML" }, async (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "❌ content script 응답 실패:",
        chrome.runtime.lastError.message
      );
      updateResponseArea(
        `❌ HTML 수집 실패: ${chrome.runtime.lastError.message}`,
        true
      );
      setLoadingState(false);
      return;
    }

    console.log("✅ 응답 받음:", response);
    if (!response || !response.html) {
      updateResponseArea("❌ HTML 데이터가 없습니다.", true);
      setLoadingState(false);
      return;
    }

    // 받은 html을 Gemini API 요청 텍스트에 포함시키기
    const userInput = `아래 HTML 내용을 분석해서 요약해줘:\n${response.html}`;

    try {
      setLoadingState(true);
      updateResponseArea("Gemini API 요청 중...");

      const data = await callGeminiAPI(userInput);
      const result = handleAPIResponse(data);

      updateResponseArea(result);

    } catch (error) {
      console.error("API 요청 실패:", error);
      updateResponseArea(`API 요청 오류: ${error.message}`, true);
    } finally {
      setLoadingState(false);
    }
  });
})();