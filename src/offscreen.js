import Tesseract from "tesseract.js";

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (!req.offscreen) {
    return;
  }

  if (req.message === "analyze") {
    (async () => {
      try {
        const text = await performOCR(req.image);
        console.log("Offscreen text: ", text);
        sendResponse(text);
      } catch (error) {
        console.error(error);
        sendResponse(null);
      }
    })();
    return true; // Keep the message channel open
  }
});

async function performOCR(image) {
  const worker = await Tesseract.createWorker({
    workerPath: chrome.runtime.getURL("worker.min.js"),
    corePath: chrome.runtime.getURL("tesseract-core.wasm.js"),
    workerBlobURL: false,
  });
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text },
  } = await worker.recognize(image);
  console.log(text);
  await worker.terminate();
  return text;
}
