chrome.runtime.onInstalled.addListener(() => {
  console.log("run installed");
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
      .then((res) => console.log("res", res))
      .then((data) => console.log("data", data))
      .catch((err) => console.log("err", err));
  }
});
