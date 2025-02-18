try {
  async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
      url: "offscreen.html",
      reasons: ["WORKERS"],
      justification: "Perform OCR",
    });
  }
  chrome.runtime.onMessage.addListener(function (request, _, response) {
    if (request.todo === "showPageAction") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.pageAction.show(tabs[0].id);
      });
    }
    if (request.type === "startOcr") {
      (async () => {
        try {
          await createOffscreen();
          const text = await new Promise((resolve) => {
            chrome.runtime.sendMessage(
              {
                message: "analyze",
                image: request.image,
                offscreen: true,
              },
              (response) => {
                resolve(response);
              }
            );
          });

          console.log("BG: ", text);
          response(text);
        } catch (error) {
          console.error(error);
          response(null);
        }
      })();
      return true; // Keep the message channel open
    }
  });

  chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
  });

  chrome.commands.onCommand.addListener((command) => {
    if (command === "start-crop") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "startCrop" });
      });
    }
  });
} catch (err) {
  console.log(err);
}
