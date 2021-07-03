/* eslint-disable no-undef */
// Event page activates the extension on the allowed hosts which is youtube.com in this case
chrome.runtime.onMessage.addListener(function (request) {

  if (request.todo == "showPageAction") {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

      chrome.pageAction.show(tabs[0].id);
      
    });
  }
});
