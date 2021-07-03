/* eslint-disable no-undef */
// Send a message to the page's content script which in turns calls a function to start the cropping / reading process
function startCropProcess(e) {

  console.log("Action Button Clicked in popup.js");

  // chrome.tabs.query gives the popup script access to tabs in hte browser. Since we are interested in only the currently active tab, we specify it in the params
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    // The above operation gives us a callback function which has the queried tab as its argument
    // We can then use the chrome.tabs API to talk to the content script on that tab
    chrome.tabs.sendMessage(tabs[0].id, { todo: "startCrop" }, () => {

      // On a response from the client script we disable the crop button for this run of the cropping function
      e.target.disabled = true;

    });
  });
}

//Wrap the DOM manipulation bits inside the DOMContentLoaded callback
document.addEventListener("DOMContentLoaded", () => {

  // Add a listener to catch messages from the content script
  chrome.runtime.onMessage.addListener(function (
    request,
  ) {

    //We can re-enable the crop button once the reading process is complete
    if (request.todo === "readImageData") {
      document.getElementById("btn").disabled = false;
    }

  });

  //Get references to action button and the root div
  const button = document.getElementById("btn");
  const root = document.getElementById("root");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    // On the first Document load, send a message to the content script asking for the current page uri and some other info like the video container's classnames.
    chrome.tabs.sendMessage(tabs[0].id, { todo: "sendPageInfo" }, (res) => {

      //Match the uri against this regex. It matches youtube video pages only.
      const regex =
        /^(?:https?:)?(?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch|v|embed)(?:\.php)?(?:\?.*v=|\/))([a-zA-Z0-9_-]{7,15})(?:[?&][a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*$/;

      const result = regex.test(res.uri);

      if (!result) {

        // We disable the cropping process for any page which isn't a youtube video page and display a message telling the user the same.
        button.disabled = true;
        root.innerHTML +=
          "<div>Not a youtube video page. Extension won't work</div>";

      } else {

        // If the uri matches then we add an event listener on the button which when fired calls the function which tells the content script to start the cropping process.
        button.disabled = false;
        document.getElementById("btn").addEventListener("click", startCropProcess);

      }
    });
  });
});
