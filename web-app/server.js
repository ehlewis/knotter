// server.js
'use strict';
// set up ======================================================================
// get all the tools we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var envvar = require('envvar');
var moment = require('moment');
var plaid = require('plaid');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var Schema = mongoose.Schema;
//var User = mongoose.model('User');
var mongo_url = "mongodb://localhost:27017/link";

var colors = require('colors');

var redis = require("redis"),
    redis_client = redis.createClient();
console.log("Connected to " + "redis".green);

var plaid_functions = require('./app/routes/plaid_functions');
var on_login = require('./app/routes/on_login');



/*var APP_PORT = envvar.number('APP_PORT', 8000);
var PLAID_CLIENT_ID = envvar.string('PLAID_CLIENT_ID');
var PLAID_SECRET = envvar.string('PLAID_SECRET');
var PLAID_PUBLIC_KEY = envvar.string('PLAID_PUBLIC_KEY');*/
var PLAID_CLIENT_ID = '5ac8108bbdc6a40eb40cb093';
var PLAID_SECRET = '786c67f3c3dd820f2bf7dd37ec5bb1';
var PLAID_PUBLIC_KEY = '201d391154bbd55ef3725c4e6baed3';
var PLAID_ENV = 'sandbox';

// We store the access_token in memory - in production, store it in a secure
// persistent data store
var ACCESS_TOKEN = null;
var PUBLIC_TOKEN = null;
var ITEM_ID = null;


var db = null;
var collection = null;

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

MongoClient.connect(mongo_url, function(err, client) {
    if (err) throw err;

    db = client.db('link');
    collection = db.collection('users');

    console.log("Connected to " + "db!".green);
});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'fun',
    cookie: {
        _expires: 3600000
    }
})); // session secret and cookie timeout

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./config/passport')(passport);

app.use(flash()); // use connect-flash for flash messages stored in session

app.use(express.static('public')); //Serves resources from public folder

//************************************BEGIN PLAID API**********************************
// Initialize the Plaid client
var plaid_client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV]
);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.get('/', function(request, response, next) {
    response.render('landing.ejs', {
        /*PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,*/
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

app.post('/get_access_token', function(request, response, next) {
    plaid_manip.get_access_token(request, response, next, plaid_client);
});

app.get('/accounts', function(request, response, next) {

    // Retrieve high-level account information and account and routing numbers
    // for each account associated with the Item.
    plaid_manip.accounts(request, response, next, plaid_client);
});

app.post('/item', function(request, response, next) {
    // Pull the Item - this includes information about available products,
    // billed products, webhook information, and more.
    plaid_manip.item(request, response, next, plaid_client);
});

app.post('/transactions', function(request, response, next) {
    // Pull transactions for the Item for the last 30 days
    plaid_manip.transactions(request, response, next, plaid_client);
});

//**************************************END PLAID API**********************************
// =====================================
// HOME PAGE (with login links) ========
// =====================================
app.get('/', function(req, res) {
    res.render('login.ejs'); // load the index.ejs file
});

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login.ejs', {
        message: req.flash('loginMessage')
    });
});

// process the login form
// app.post('/login', do all our passport stuff here);

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
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

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user: req.user, // get the user out of session and pass to template
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV
    });
});

// =====================================
// DASHBOARD ==============================
// =====================================
// show the signup form
// app.get('/dashboard', function(req, res) {
//     // render the page and pass in api keys
//     res.render('dashboard.ejs', {
//         user : req.user, // get the user out of session and pass to template
//         PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
//         PLAID_ENV: PLAID_ENV});
// });

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) { //todo clear redis cache ***
    req.logout();
    res.redirect('/');
});

//??
//Create blank name and accounts field on signup so we can append and not create later on
/*app.post('/signup', function(req, res) {
    passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    });
    collection.update({'_id' : req.user._id}, {'$set' : {'accounts' : []}});
    collection.update({'_id' : req.user._id}, {'$set' : {'name' : ""}});
});*/


app.post('/signup', function(request, response, next) {

    passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    });

});


// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}




//!!!!!!!API IMPLEMENT!!!!!!!!!!!!!!!!!!!!

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



app.post('/name', function(req, res, next) {

    /* var product = {  name: "A" };

       collection.insert(product, function(err, result) {

       if(err) { throw err; }

         client.close();
     });*/ //Inserts new attribute

    console.log(req.body.name);
    console.log(req.user);

    collection.update({
        '_id': req.user._id
    }, {
        '$set': {
            'name': req.body.name
        }
    });

    console.log("inserted username: " + req.body.name + " for user " + req.user);

    res.redirect('/profile');
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
    on_login.refresh_cache(request, response, next, plaid_client, redis_client, redis);
});

app.get('/api/get_cached_user_accounts', isLoggedIn, function(request, response, next) {
    plaid_functions.get_cached_user_accounts(request, response, next, redis_client, redis);
});

app.get('/api/get_cached_items', isLoggedIn, function(request, response, next) {
    plaid_functions.get_cached_items(request, response, next, redis_client, redis);
});

app.get('/api/get_cached_transactions', isLoggedIn, function(request, response, next) {
    plaid_functions.get_cached_transactions(request, response, next, redis_client, redis);
});


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
