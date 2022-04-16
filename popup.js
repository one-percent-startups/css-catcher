const button = document.getElementById("select_button");

button.addEventListener("click", function onButtonClick() {
  chrome.storage.local.set({ selected: true });
});