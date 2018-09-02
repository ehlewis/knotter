// server.js
'use strict';

//=====Setup=====
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var passport = require('passport');
var flash = require('connect-flash');
var envvar = require('envvar');
var moment = require('moment');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var link_functions = require('./app/routes/link_functions');
var cache_functions = require('./app/routes/cache_functions');

//Set up Logging
var colors = require('colors');
/*const winston = require('winston');
winston.level = 'debug';*/
var logger = require('./config/logger');


// We store the access_token in memory - in production, store it in a secure
// persistent data store
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;

var mongo_setup = require('./config/mongo_setup')();


global.redis = require("redis");
var redis_setup = require('./config/redis_setup')();

var plaid_setup = require("./config/plaid_setup");


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

//=====USES=====

//app.use(morgan('dev')); // log every request to the console
app.use(require("morgan")(":method :url :status :response-time ms :remote-addr", { "stream": logger.stream }));


/*var APP_PORT = envvar.number('APP_PORT', 8000);
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY');*/


// set up our express application
app.use(cookieParser()); // read cookies (needed for auth)

//app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'thisissupersecret',
    cookie: {
        maxage: 3600000
    },
    resave: true,
    saveUninitialized: true
})); // session secret and cookie timeout

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static('public')); //Serves resources from public folder


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//=====GETS=====

app.get('/', function(request, response, next) {
    response.render('landing.ejs', {
    });
});

app.get('/dashboard', isLoggedIn, function(request, response, next) {
    response.render('dashboard.ejs', {
        user: request.user, // get the user out of session and pass to template
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,
    });
});

app.get('/accounts.ejs', isLoggedIn, function(request, response, next) {
    response.render('accounts.ejs', {
        user: request.user,
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,
    });
});

app.get('/accounts', function(request, response, next) {

    // Retrieve high-level account information and account and routing numbers
    // for each account associated with the Item.
    link_functions.accounts(request, response, next);
});


app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
        message: req.flash('loginMessage')
    });
});

app.get('/logout', function(req, res) { //todo clear redis cache ***
    req.logout();
    res.redirect('/');
});

app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup.ejs', {
        message: req.flash('signupMessage')
    });
});

// process the signup form
// app.post('/signup', do all our passport stuff here);

// =====================================
// SIGNUP2 =============================
// =====================================
// show the second step of the signup form
app.get('/signup_step2', isLoggedIn, function(req, res) {
    res.render('signup_step2.ejs', {
        user: req.user, // get the user out of session and pass to template
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV
    });
});

// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user: req.user, // get the user out of session and pass to template
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV
    });
});

app.get('/name', function(request, response, next) {
    response.render('name.ejs', {
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,
    });
});


app.get('/old_dash_api', isLoggedIn, function(request, response, next) {
    response.render('old_dash_api.ejs', {
        user: request.user,
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,
    });
});

app.get('/api/user_data', isLoggedIn, function(req, res) {

    if (req.user === undefined) {
        // The user is not logged in
        res.json({});
    } else {
        res.json({
            username: req.user,
            num_of_accounts: req.user.accounts.length
        });
    }
});

app.get('/api/refresh_cache', isLoggedIn, function(request, response, next) {
    cache_functions.refresh_cache(request, response, next);
});

app.get('/api/get_cached_user_accounts', isLoggedIn, function(request, response, next) {
    link_functions.get_cached_user_accounts(request, response, next);
});

app.get('/api/get_cached_items', isLoggedIn, function(request, response, next) {
    link_functions.get_cached_items(request, response, next);
});

app.get('/api/get_cached_transactions', isLoggedIn, function(request, response, next) {
    link_functions.get_cached_transactions(request, response, next);
});

//=====POSTS=====

app.post('/get_access_token', function(request, response, next) {
    link_functions.get_access_token(request, response, next);
});

app.post('/item', function(request, response, next) {
    // Pull the Item - this includes information about available products,
    // billed products, webhook information, and more.
    link_functions.item(request, response, next);
});

app.post('/transactions', function(request, response, next) {
    // Pull transactions for the Item for the last 30 days
    link_functions.transactions(request, response, next);
});


app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    })
);


// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));


app.post('/name', function(req, res, next) {
    logger.debug(req.body.name);
    logger.debug(req.user);

    collection.update({
        '_id': req.user._id
    }, {
        '$set': {
            'name': req.body.name
        }
    });

    logger.debug("inserted username: " + req.body.name + " for user " + req.user);

    res.redirect('/profile');
});


//404
app.get('*', function(req, res){
    res.render('404.ejs');
});

// launch ======================================================================
app.listen(port);
logger.info('The magic happens on port ' + port);
