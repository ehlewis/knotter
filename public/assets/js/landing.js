var loginBtn = document.getElementById('login-button');
var loginModal = document.getElementById('login-modal');

var signupBtn = document.getElementById('sign-up-button');
var signupModal = document.getElementById('sign-up-modal');

loginBtn.onclick = function() {
  loginModal.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == loginModal || event.target == signupModal){
    signupModal.style.display = "none";
    loginModal.style.display = "none";
  }
}

signupBtn.onclick = function() {
  signupModal.style.display = "block";
}
