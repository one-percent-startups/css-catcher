chrome.runtime.onInstalled.addListener((reason) => {
  if (reason.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: "onboarding.html",
    });
  }
});

chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
  if ("data" in req) {
    fetch("http://localhost:3000/elements", {
      method: "POST",
      body: JSON.stringify(req.data),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => console.log("data", data))
      .catch((err) => console.log("err", err));
  } else if ("login" in req && req.login) {
    chrome.tabs.create({
      url: "onboarding.html",
    });
  }
});
