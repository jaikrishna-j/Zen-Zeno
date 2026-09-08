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

    const data = await response.json();

    if (response.ok && data.success) {
      setStatus(files.length > 0 ? "Success! Your file(s) were sent." : "Success! Your message was sent.", "success");
      form.reset();
    } else {
      setStatus(data.message || "There was a problem sending the form.", "error");
    }
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong while contacting the server.", "error");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
