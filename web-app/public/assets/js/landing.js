var loginBtn = document.getElementById('login-button');
var loginModal = document.getElementById('login-modal');

var signupBtn = document.getElementById('sign-up-button');
var signupModal = document.getElementById('sign-up-modal');

var alreadyLoginBtn = document.getElementById('already-login');
var alreadySignupBtn = document.getElementById('already-sign-up');

loginBtn.onclick = function() {
  loginModal.style.display = "block";
}

signupBtn.onclick = function() {
  signupModal.style.display = "block";
}

alreadyLoginBtn.onclick = function() {
  signupModal.style.display = "none";
  loginModal.style.display = "block";
  document.getElementById("login-name").value = "";
  document.getElementById("login-pass").value = "";
  document.getElementById("sign-up-email").value = "";
  document.getElementById("sign-up-name").value = "";
  document.getElementById("sign-up-pass").value = "";
}

alreadySignupBtn.onclick = function() {
  loginModal.style.display = "none";
  signupModal.style.display = "block";
  document.getElementById("login-name").value = "";
  document.getElementById("login-pass").value = "";
  document.getElementById("sign-up-email").value = "";
  document.getElementById("sign-up-name").value = "";
  document.getElementById("sign-up-pass").value = "";
}


window.onclick = function(event) {
  if (event.target == loginModal || event.target == signupModal){
    signupModal.style.display = "none";
    loginModal.style.display = "none";
    document.getElementById("login-name").value = "";
    document.getElementById("login-pass").value = "";
    document.getElementById("sign-up-email").value = "";
    document.getElementById("sign-up-name").value = "";
    document.getElementById("sign-up-pass").value = "";
  }
}
