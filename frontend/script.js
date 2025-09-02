const form = document.getElementById("uploadForm");
const resultEl = document.getElementById("result");

form?.addEventListener("submit", async e => {
  e.preventDefault();
  resultEl.classList.remove("ok", "error");
  resultEl.classList.add("muted");
  resultEl.textContent = "Загрузка…";

  const formData = new FormData(form);
  try {
    const resp = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${resp.status}`);
    }
    const data = await resp.json();
    resultEl.textContent = `ID загрузки: ${data.uploadId}`;
    resultEl.classList.remove("muted");
    resultEl.classList.add("ok");
    form.reset();
  } catch (err) {
    resultEl.textContent = `Ошибка: ${err.message}`;
    resultEl.classList.remove("muted");
    resultEl.classList.add("error");
  }
});
