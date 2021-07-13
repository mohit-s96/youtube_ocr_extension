/* eslint-disable no-undef */
import { createWorker } from "tesseract.js";

chrome.runtime.sendMessage({ todo: "showPageAction" });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.todo === "sendPageInfo") {
    sendResponse({ todo: "pageInfo", uri: window.location.href });
  }

  if (request.todo === "startCrop") {
    cropInit();
    sendResponse({ todo: "started" });
  }
});

function renderResultsOverlay() {
  const template = `
  <div class="ocr_box">
	<h2 class="ocr_welcome" >Processing your crop</h2>
  <p class="ocr_tip"><small>*Click Outside the box to exit</small></p>
  <p class="ocr_tip ocr_warning">Processing the text can sometimes take a little longer depending on text quantity, quality and your system</p>
  <textarea class="ocr_text" cols="30" rows="10"></textarea>
</div>
  `;
  const div = document.createElement("div");
  div.className = "ocr_main_overlay";
  div.innerHTML = template;
  document.body.appendChild(div);
  document
    .querySelector(".ocr_main_overlay")
    .addEventListener(
      "click",
      (e) => e.target.className === "ocr_main_overlay" && e.target.remove()
    );
}

function cropInit() {
  const screenshotTarget = document.querySelector(
    ".video-stream.html5-main-video"
  );

  screenshotTarget.style.cursor = "crosshair";

  const containerDimensions = screenshotTarget.getBoundingClientRect();
  let pX = containerDimensions.x;
  let pY = containerDimensions.y;
  const box = document.createElement("div");
  let flag = false;
  box.id = "ocr_testDiv";
  box.style.border = "2px solid cyan";
  box.style.position = "absolute";
  document.body.appendChild(box);
  let div = document.getElementById("ocr_testDiv"),
    x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0;
  div.hidden = 1;

  function reCalc() {
    const x3 = Math.min(x1, x2);
    const x4 = Math.max(x1, x2);
    const y3 = Math.min(y1, y2);
    const y4 = Math.max(y1, y2);
    div.style.left = x3 + "px";
    div.style.top = y3 + "px";
    div.style.width = x4 - x3 + "px";
    div.style.height = y4 - y3 + "px";
  }
  window.addEventListener("mousedown", downFunction);
  window.addEventListener("mousemove", moveFunction);
  window.addEventListener("mouseup", cropOnMouseDown);
  function downFunction(e) {
    flag = false;
    if (!flag) {
      div.hidden = 0;
      x1 = e.clientX;
      y1 = e.clientY;
      reCalc();
    }
  }
  function moveFunction(e) {
    if (!flag) {
      x2 = e.clientX;
      y2 = e.clientY;
      reCalc();
    }
  }
  function cropOnMouseDown() {
    screenshotTarget.style.cursor = "pointer";
    sendLoadingMessage();
    renderResultsOverlay();
    const boxDimensions = div.getBoundingClientRect();

    console.log("cropFigures => ", {
      width: boxDimensions.width,
      height: boxDimensions.height,
      x: boxDimensions.x - pX,
      y: boxDimensions.y - pY,
    });

    try {
      const uri = screenshot({
        width: boxDimensions.width,
        height: boxDimensions.height,
        x: boxDimensions.x - pX,
        y: boxDimensions.y - pY,
        useCORS: true,
      });
      // const img = document.createElement("img");
      // img.src = uri;
      // window.open().document.body.appendChild(img);
      readImage(uri);
    } catch (error) {
      console.trace("Trace");
      console.log(error);
    }

    window.removeEventListener("mousemove", moveFunction);
    window.removeEventListener("mousedown", downFunction);
    window.removeEventListener("mouseup", cropOnMouseDown);
    flag = true;
    div.hidden = 1;
  }
  function screenshot(options = {}) {
    const canvas = document.createElement("canvas");
    const video = screenshotTarget;
    const ctx = canvas.getContext("2d");

    canvas.width = parseInt(video.offsetWidth);
    canvas.height = parseInt(video.offsetHeight);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let h = options.height;
    let w = options.width;
    const imageData = ctx.getImageData(options.x, options.y, w, h);
    const canvas1 = document.createElement("canvas");
    const ctx_ = canvas1.getContext("2d");
    canvas1.width = w;
    canvas1.height = h;
    ctx_.rect(0, 0, w, h);
    ctx_.putImageData(imageData, 0, 0);
    return canvas1.toDataURL("image/png");
  }
  // eslint-disable-next-line no-unused-vars
  const readImage = (uri) => {
    (async () => {
      const worker = createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(uri);
      console.log(text);
      sendMessage(text);
      document.querySelector(".ocr_welcome").textContent = "Scan complete";
      document.querySelector(".ocr_text").value = text;
      await worker.terminate();
    })();
  };
}
function sendMessage(text) {
  chrome.runtime.sendMessage({ todo: "readImageData", data: text });
}
function sendLoadingMessage() {
  chrome.runtime.sendMessage({ todo: "readingImageData" });
}
