const form = document.getElementById("uploadForm");
const resultElement = document.getElementById("result");

form?.addEventListener("submit", async e => {
  e.preventDefault();
  resultElement.classList.remove("ok", "error");
  resultElement.classList.add("muted");
  resultElement.textContent = "Загрузка…";

  const formData = new FormData(form);
  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${response.status}`);
    }
    const data = await response.json();
    resultElement.textContent = `ID загрузки: ${data.uploadId}`;
    resultElement.classList.remove("muted");
    resultElement.classList.add("ok");
    form.reset();
  } catch (err) {
    resultElement.textContent = `Ошибка: ${err.message}`;
    resultElement.classList.remove("muted");
    resultElement.classList.add("error");
  }
});
