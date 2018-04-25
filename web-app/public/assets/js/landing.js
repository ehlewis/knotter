var loginBtn = document.getElementById('login-button');
var loginModal = document.getElementById('login-modal');

var signupBtn = document.getElementById('sign-up-button');
var signupModal = document.getElementById('sign-up-modal');

var alreadyLoginBtn = document.getElementById('already-login');
var alreadySignupBtn = document.getElementById('already-sign-up');

var signupName = document.getElementById('sign-up-name');
var signupPass = document.getElementById('sign-up-pass');
var signupEmail = document.getElementById('sign-up-email');
var loginForm = document.getElementById('login-form');
var signupForm = document.getElementById('sign-up-form');

var createButton = document.getElementById('create-button')

function enableButton(){
  var reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var rePassword = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  var reName = /^[a-zA-Z '-]+$/;

  if(reName.test(String(signupName.value).toLowerCase()) && reEmail.test(String(signupEmail.value).toLowerCase()) && rePassword.test(String(signupPass.value).toLowerCase())){
    createButton.disabled = false;
  }
}

function validateName() {
    var re = /^[a-zA-Z '-]+$/;
    if (!(re.test(String(signupName.value).toLowerCase()))){
      signupName.style.border = "1px solid red";
    }
    else if(re.test(String(signupName.value).toLowerCase())){
      signupName.style.border = "0px";
    }
    enableButton();
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!(re.test(String(signupEmail.value).toLowerCase()))){
      signupEmail.style.border = "1px solid red";
    }
    else if(re.test(String(signupEmail.value).toLowerCase())){
      signupEmail.style.border = "0px";
    }
    enableButton();
}

function validatePassword() {
    var re = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (!(re.test(String(signupPass.value).toLowerCase()))){
      signupPass.style.border = "1px solid red";
    }
    else if(re.test(String(signupPass.value).toLowerCase())){
      signupPass.style.border = "0px";
    }
    enableButton();
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
  }
}
