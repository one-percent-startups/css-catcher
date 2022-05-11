const button = document.getElementById("select_button");
const login = document.getElementById("login-button");
const cookie = document.cookie
  .split("; ")
  .find((row) => row.startsWith("css_catcher="));

button.addEventListener("click", function () {
  chrome.storage.local.set({ selected: true });
});

login.addEventListener("click", function () {
  chrome.runtime.sendMessage({
    login: true,
  });
});
