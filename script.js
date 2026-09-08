const ACCESS_KEY = "84d7f2c3-5558-4c6a-a757-a41d4ec63fe5";
const form = document.getElementById("uploadForm");
const submitBtn = form.querySelector("button[type='submit']");
const statusBox = document.getElementById("status");

function setStatus(message, type = "info") {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = form.querySelector('input[name="file"]');
  const files = fileInput.files;

  if (files.length === 0) {
    setStatus("Please select at least one file before sending.", "error");
    return;
  }

  const formData = new FormData(form);
  formData.append("access_key", ACCESS_KEY);
  formData.append("subject", form.subject.value || "Upload");
  formData.append("from_name", form.name.value || "Upload");

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;
  setStatus("Sending your files to email...", "info");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setStatus("Success! Your files were sent to your email.", "success");
      form.reset();
    } else {
      setStatus(data.message || "There was a problem sending the files.", "error");
    }
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong. Please check your internet connection and try again.", "error");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
