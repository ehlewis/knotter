var modal = document.getElementById('login-modal');
var btn = document.getElementById('login-button');

btn.onclick = function() {
  modal.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == modal){
    modal.style.display = "none";
  }
}
