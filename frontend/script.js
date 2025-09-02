const statusElement = document.getElementById("status");
const timeElement = document.getElementById("time");

async function fetchStatus() {
  try {
    const response = await fetch("http://localhost:3000/status");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    statusElement.textContent = data.status;
    statusElement.classList.remove("muted", "error");
    statusElement.classList.add("ok");
    timeElement.textContent = `Server time: ${data.time}`;
  } catch (error) {
    statusElement.textContent = `Error: ${error.message}`;
    statusElement.classList.remove("muted", "ok");
    statusElement.classList.add("error");
  }
}

fetchStatus();
setInterval(fetchStatus, 5000);
