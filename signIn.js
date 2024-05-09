let form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent the default form submission behavior, which refreshes the page
  console.log("button clicked");
  login();
});

//Login
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Check if email and password are not empty
  if (email === "" || password === "") {
    alert("Email and Password are required fields");
    return;
  }

  // Validate email format
  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailFormat.test(email)) {
    alert("Invalid email format");
    return;
  }

  // Validate password length
  if (password.length < 6) {
    alert("Password must be at least 6 characters long");
    return;
  }

  // localStorage.removeItem("code");

  // Check if email and password match the predefined values
  if (email === "shikha9598@gmail.com" && password === "Shikha9598@123") {
    // console.log("Email and password:", email, password);
    localStorage.setItem("code", "secret");
    window.location.assign("main.html");
    alert("LogIn Successfully");
  } else {
    alert("Login failed. Please check your credentials.");
  }
}


function signIn() {
  let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
  let form = document.createElement('form');
  form.setAttribute('method', 'GET');
  form.setAttribute('action', oauth2Endpoint);

  let params = {
    "client_id": "302030732735-q1guaj6ujtd7b8g7d409vrot73fsn4p0.apps.googleusercontent.com",
    "redirect_uri": "http://127.0.0.1:5501/main.html",
    "response_type": "token",
    "scope": "https://www.googleapis.com/auth/userinfo.profile",
    "include_granted_scopes": 'true',
    "state": "pass-through-value"
  };

  // Set the item in local storage
  localStorage.setItem("code", "secret");

  for (var p in params) {
    let input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', p);
    input.setAttribute('value', params[p]);
    form.appendChild(input);
  }

  document.body.appendChild(form);

  form.submit();
}

