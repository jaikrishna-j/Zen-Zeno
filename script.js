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
  const files = Array.from(fileInput.files || []);

  const formData = new FormData(form);
  formData.append("access_key", ACCESS_KEY);
  formData.append("subject", form.subject.value.trim() || "Upload");
  formData.append("from_name", form.name.value.trim() || "Website User");

  if (files.length > 0) {
    files.forEach((file) => formData.append("file", file));
  }

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;
  setStatus(files.length > 0 ? "Sending your file(s)..." : "Sending your message...", "info");

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setStatus(
        files.length > 0 ? "Success! Your file(s) were sent." : "Success! Your message was sent.",
        "success"
      );
      form.reset();
    } else {
      const msg = (data.message || "").toLowerCase();
      const isFileUpgradeIssue = files.length > 0 && (msg.includes("pro") || msg.includes("upgrade") || msg.includes("file upload"));

      if (isFileUpgradeIssue) {
        setStatus("File upload is not enabled for this Web3Forms key. Upgrade the plan to allow file uploads, or send a message without attachments.", "error");
      } else {
        setStatus(data.message || "There was a problem sending the form.", "error");
      }
    }
  } catch (error) {
    console.error(error);
    setStatus("Something went wrong. Please check your internet connection and try again.", "error");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
