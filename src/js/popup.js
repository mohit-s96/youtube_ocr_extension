function testfn(e) {
  console.log("Working???");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "startCrop" }, (res) => {
      e.target.disabled = true;
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.todo === "readImageData") {
      document.getElementById("btn").disabled = false;
    }
  });
  const button = document.getElementById("btn");
  const root = document.getElementById("root");
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "sendPageInfo" }, (res) => {
      console.log(res);
      const regex =
        /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9\_-]{7,15})(?:[\?&][a-zA-Z0-9\_-]+=[a-zA-Z0-9\_-]+)*$/;
      const result = regex.test(res.uri);
      if (!result) {
        button.disabled = true;
        root.innerHTML +=
          "<div>Not a youtube video page. Extension won't work</div>";
      } else {
        button.disabled = false;
        document.getElementById("btn").addEventListener("click", testfn);
      }
    });
  });
});
