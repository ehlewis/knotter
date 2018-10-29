var loginBtn = document.getElementById('login-button');
var signupBtn = document.getElementById('sign-up-button');

var email = document.getElementById('email');
var pass = document.getElementById('pass');

var hideIcon = document.getElementById('hide-icon');

function showPass(){
  if (pass.type == "password"){
    pass.type = "text";
    hideIcon.src = "assets/graphics/hidden.svg";
  }else {
    pass.type = "password";
    hideIcon.src = "assets/graphics/hide.svg";
  }
}

$('#login-form').keyup(function(e) {
        if (e.keyCode == 13) {
            login();
        }
    });


function login() {
    $.ajax({
        url: "/login",
        type: "POST",
        dataType: "html",
        data: {
            email: $('#email').val(),
            password: $('#pass').val()
        },
        cache: false,
        timeout: 5000,
        success: function(data) {
            console.log(data);
            var email = document.getElementById("email");
            var password = document.getElementById("passbox");
            if (data === '{"response":"authd"}') {
                window.location.replace("/");
            } else if (data === '{"response":"Login failed"}') {
                email.style.border = "1px solid red";
                password.style.border = "1px solid red";
            }
            /*else if (data === '{"response":"Password is incorrect"}') {
                password.style.border = "1px solid red";
                email.style.border = "none";
                console.log("maybe");
            }*/
        },

        error: function() {
            console.log('process error');
        },
    });
}

function signup() {
    $.ajax({
        url: "/signup",
        type: "POST",
        dataType: "html",
        data: {
            email: $('#email').val(),
            password: $('#pass').val(),
        },
        cache: false,
        timeout: 5000,
        success: function(data) {
            console.log(data);
            var email = document.getElementById("email");
            var password = document.getElementById("passbox");
            if (data === '{"response":"authd"}') {
                window.location.replace("/");
            } else if (data === '{"response":"Login failed"}') {
                email.style.border = "1px solid red";
                password.style.border = "1px solid red";
            }
            else if (data === '{"response":"User exists"}') {
                email.style.border = "1px solid red";
                password.style.border = "1px solid red";
            }
            /*else if (data === '{"response":"Password is incorrect"}') {
                password.style.border = "1px solid red";
                email.style.border = "none";
                console.log("maybe");
            }*/
        },

        error: function() {
            console.log('process error');
        },
    });
}

function clearLoginEmail(elem) {
    var input = document.getElementById(elem);
    input.style.border = "none";
    input.value = "";
}

function clearLoginPass(elem) {
    var input = document.getElementById(elem);
    input.style.border = "none";
    input.value = "";
}
