document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startCrop").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "startCrop" });
      window.close();
    });
  });
});
