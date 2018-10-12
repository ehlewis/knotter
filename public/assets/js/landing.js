var loginBtn = document.getElementById('login-button');
var loginModal = document.getElementById('login-modal');

var signupBtn = document.getElementById('sign-up-button');
var signupModal = document.getElementById('sign-up-modal');

var alreadyLoginBtn = document.getElementById('already-login');
var alreadySignupBtn = document.getElementById('already-sign-up');

var signupName = document.getElementById('sign-up-name');
var signupPass = document.getElementById('sign-up-pass');
var signupEmail = document.getElementById('sign-up-email');
var loginName = document.getElementById('login-name');
var loginPass = document.getElementById('login-pass');
var loginForm = document.getElementById('login-form');
var signupForm = document.getElementById('sign-up-form');

var createButton = document.getElementById('create-button');
var showPassButton = document.getElementById('showbtn');

var hideIcon = document.getElementById('hide-icon');

function showPass(){
  if (signupPass.type == "password"){
    signupPass.type = "text";
    hideIcon.src = "assets/graphics/hidden.svg";
  }else {
    signupPass.type = "password";
    hideIcon.src = "assets/graphics/hide.svg";
  }
}



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
    signupEmail.style.border = "0px";
    signupName.style.border = "0px";
    signupPass.style.border = "0px";
    loginName.style.border = "0px";
    loginPass.style.border = "0px";
  }
}
