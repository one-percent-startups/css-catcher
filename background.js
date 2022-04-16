chrome.runtime.onInstalled.addListener(() => {
  console.log("run installed");
});

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
  console.log("request", req);
});