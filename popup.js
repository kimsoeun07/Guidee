console.log('popup.js 실행 시작');

// API 구성 (실제 사용 시 API 키를 안전하게 관리하세요)
const API_CONFIG = {
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
  apiKey: 'AIzaSyDBTqzoQSE9o3B_YMR8yF3bayHdLVeq6bw' // 실제 환경에서는 안전하게 관리하세요
};

// 요청 제한을 위한 간단한 디바운스 함수
let requestTimeout;
const debounce = (func, delay) => {
  return function(...args) {
    clearTimeout(requestTimeout);
    requestTimeout = setTimeout(() => func.apply(this, args), delay);
  };
};

// API 요청 함수
const callGeminiAPI = async (userInput) => {
  if (!userInput.trim()) {
    throw new Error('입력값이 비어있습니다.');
  }

  const url = `${API_CONFIG.baseUrl}?key=${API_CONFIG.apiKey}`;
  const requestBody = {
    contents: [{ 
      parts: [{ text: userInput }] 
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`API 요청 실패: ${response.status} - ${errorData?.error?.message || response.statusText}`);
  }

  return await response.json();
};

// 응답 처리 함수
const handleAPIResponse = (data) => {
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('응답 데이터가 없습니다.');
  }

  const candidate = data.candidates[0];
  
  // 안전성 필터링 확인
  if (candidate.finishReason === 'SAFETY') {
    throw new Error('안전성 필터에 의해 차단된 응답입니다.');
  }

  const result = candidate.content?.parts?.[0]?.text;
  if (!result) {
    throw new Error('응답 텍스트를 찾을 수 없습니다.');
  }

  return result;
};

// UI 업데이트 함수들
const updateQuestionArea = (question) => {
  const questionArea = document.getElementById('questionArea');
  if (questionArea) {
    questionArea.textContent = question;
  }
};

const updateResponseArea = (message, isError = false) => {
  const responseArea = document.getElementById('responseArea');
  if (responseArea) {
    responseArea.textContent = message;
    responseArea.className = isError ? 'response-display error' : 'response-display success';
    
    if (!isError) {
      responseArea.classList.remove('loading');
    }
  }
};

const setLoadingState = (isLoading) => {
  const button = document.getElementById('askButton');
  const input = document.getElementById('userInput');
  const responseArea = document.getElementById('responseArea');
  
  if (button) {
    button.disabled = isLoading;
    button.textContent = isLoading ? '처리 중...' : '질문하기';
  }
  
  if (input) {
    input.disabled = isLoading;
  }
  
  if (responseArea && isLoading) {
    responseArea.classList.add('loading');
  }
};

// 메인 요청 처리 함수
const handleUserRequest = async () => {
  const userInput = document.getElementById('userInput')?.value;
  
  if (!userInput || !userInput.trim()) {
    updateResponseArea('질문을 입력해주세요.', true);
    return;
  }

  // 질문 영역에 사용자 입력 표시
  updateQuestionArea(userInput);
  
  setLoadingState(true);
  updateResponseArea('응답을 기다리는 중...');

  try {
    console.log('API 요청 시작:', userInput);
    const data = await callGeminiAPI(userInput);
    console.log('API 응답:', data);
    
    const result = handleAPIResponse(data);
    updateResponseArea(result);
    
    // 성공적인 요청 후 입력 필드 초기화
    document.getElementById('userInput').value = '';
    
  } catch (error) {
    console.error('요청 처리 중 오류:', error);
    updateResponseArea(`오류 발생: ${error.message}`, true);
  } finally {
    setLoadingState(false);
  }
};

// 디바운스된 요청 함수
const debouncedRequest = debounce(handleUserRequest, 300);

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('askButton');
  const input = document.getElementById('userInput');

  if (button) {
    button.addEventListener('click', debouncedRequest);
  }

  if (input) {
    // Enter 키로도 요청 가능하도록
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        debouncedRequest();
      }
    });
    
    // 포커스 시 placeholder 효과
    input.addEventListener('focus', () => {
      input.style.borderColor = '#667eea';
    });
    
    input.addEventListener('blur', () => {
      input.style.borderColor = '#ddd';
    });
  }

  console.log('popup.js 초기화 완료');
});

// 확장 프로그램 종료 시 정리
window.addEventListener('beforeunload', () => {
  if (requestTimeout) {
    clearTimeout(requestTimeout);
  }
});