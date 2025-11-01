const form = document.getElementById("uploadForm");
const resultElement = document.getElementById("result");

form?.addEventListener("submit", async event => {
  event.preventDefault();

  resultElement.classList.remove("ok", "error");
  resultElement.classList.add("muted");
  resultElement.textContent = "Загрузка…";

  const formData = new FormData(form);
  try {
    const response = await fetch("http://localhost:3000/files", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || `HTTP ${response.status}`);
    }
    const data = await response.json();
    resultElement.textContent = `ID загрузки: ${data.uploadId}`;
    resultElement.classList.remove("muted");
    resultElement.classList.add("ok");
    form.reset();
  } catch (error) {
    resultElement.textContent = `Ошибка: ${error.message}`;
    resultElement.classList.remove("muted");
    resultElement.classList.add("error");
  }
});
