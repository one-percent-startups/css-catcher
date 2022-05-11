const login = document.getElementById("login");
const email = login.querySelector("#email");
const password = login.querySelector("#password");
const error = login.querySelector("#error-span");
// const submit = login.querySelector("#login_submit");

login.addEventListener("submit", function (e) {
  e.preventDefault();
  let data = {
    email: email.value,
    password: password.value,
  };
  fetch("http://localhost:3000/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if ("access_token" in data) {
        error.textContent = "";
        // Create cookie css catcher
        document.cookie = `css_catcher=${data.access_token}; SameSite=lax; max-age=31536000`;
      } else {
        error.textContent = data.message;
      }
    })
    .catch((err) => console.log("err", data));
});
