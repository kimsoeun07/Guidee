console.log("Popup script loaded!");

const SendMessage = (message) => {
  const responseArea = document.getElementById('questionArea');
  if (questionArea) {
    questionArea.textContent = `나 : ${message}`;
  }
}

// 버튼 클릭 시 input 값을 전달하도록 이벤트 연결
window.onload = () => {
  const input = document.getElementById('userInput');
  const button = document.getElementById('askButton');
  if (button && input) {
    button.onclick = () => {
      SendMessage(input.value);
    };
  }
};