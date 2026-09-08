const form = document.getElementById("uploadForm");
const submitBtn = form.querySelector("button[type='submit']");
const statusBox = document.getElementById("status");

function setStatus(message, type = "info") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const fileInput = form.querySelector('input[name="file"]');
  const files = Array.from(fileInput.files || []);

  if (files.length === 0) {
    formData.delete("file");
  }

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;
  setStatus(files.length > 0 ? "Uploading your file(s)..." : "Sending your message...", "info");

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();
    let data = {};

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data.message = responseText || `Server returned HTTP ${response.status}.`;
    }

    if (response.ok && data.success) {
      setStatus(files.length > 0 ? "Success! Your file(s) were sent." : "Success! Your message was sent.", "success");
      form.reset();
    } else {
      setStatus(data.message || "There was a problem sending the form.", "error");
    }
  } catch (error) {
    console.error(error);
    const localStaticServer = window.location.hostname === "localhost" && window.location.port === "8000";
    setStatus(
      localStaticServer
        ? "The API is not running. Start this project with npm run dev, then open the Vercel local URL."
        : `Unable to contact the API: ${error.message || "network error"}`,
      "error"
    );
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
