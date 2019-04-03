var middleware = require("./middleware")
var logger = require('../config/logger');

module.exports = function(app){
    app.get('/', middleware.isLoggedIn, function(request, response, next) {
        response.render('dashboard.ejs', {});
    });

    app.get('/landing', function(request, response, next) {
        response.render('landing.ejs', {});
    });

    app.get('/about', function(request, response, next) {
        response.render('about.ejs', {});
    });

    app.get('/help', function(request, response, next) {
        response.render('help.ejs', {});
    });

    app.get('/dashboard', middleware.isLoggedIn, function(request, response, next) {
        response.render('dashboard.ejs', {
            user: request.user, // get the user out of session and pass to template
            PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
            PLAID_ENV: PLAID_ENV,
        });
    });

    app.get('/admin', middleware.isLoggedIn, function(request, response, next) {
        response.render('admin_panel.ejs', {
            user: request.user,
            PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
            PLAID_ENV: PLAID_ENV,
        });
    });

    app.get('/accounts', middleware.isLoggedIn, function(request, response, next) {
        response.render('accounts.ejs', {
            user: request.user,
            PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
            PLAID_ENV: PLAID_ENV,
        });
    });
    
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', middleware.isLoggedIn, function(request, response) {
        response.render('profile.ejs', {
            user: request.user, // get the user out of session and pass to template
            PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
            PLAID_ENV: PLAID_ENV
        });
    });


    app.get('/workinprogress', function(request, response, next) {
        response.render('workinprogress.ejs', {});
    });

}
