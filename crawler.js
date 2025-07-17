function savePageAsJson() {
  const htmlContent = document.documentElement.outerHTML;
  const data = { html: htmlContent };

  console.log("📦 추출된 HTML JSON 데이터:", data); // 👈 콘솔에 찍힘!!

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

export { savePageAsJson };
