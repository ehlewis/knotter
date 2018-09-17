// server.js
'use strict';

//=====Setup=====
// get all the tools we need
var express = require('express');
var app = express();
//var port = process.env.PORT || 443;
var passport = require('passport');
var flash = require('connect-flash');
var envvar = require('envvar');
var moment = require('moment');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var redis_store = require('connect-redis')(session);

var link_functions = require('./app/routes/link_functions');
var cache_functions = require('./app/routes/cache_functions');
var front_end_functions = require('./app/routes/front_end_functions');


//Set up Logging
var colors = require('colors');
var logger = require('./config/logger');

//Set up HTTPS
var https = require('https');
var helmet = require("helmet");
var fs = require("fs");
const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

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
function isLoggedIn(request, response, next) {
    // if user is authenticated in the session, carry on
    if (request.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    response.redirect('/');
}

//=====USES=====

//app.use(morgan('dev')); // log every request to the console
app.use(require("morgan")(":method :url :status :response-time ms :remote-addr", {
    "stream": logger.stream
}));


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
    store: new redis_store({
        client: redis_client
        }),
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

//Don't let the user go back
app.use(function(request, response, next) {
    response.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

//Protects against some header attacks
app.use(helmet());
app.use(helmet.noCache());


//=====GETS=====

app.get('/', function(request, response, next) {
    response.render('landing.ejs', {});
});

app.get('/dashboard', isLoggedIn, function(request, response, next) {
    response.render('dashboard.ejs', {
        user: request.user, // get the user out of session and pass to template
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,
    });
});

app.get('/admin', isLoggedIn, function(request, response, next) {
    response.render('admin_panel.ejs', {
        user: request.user,
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

app.get('/loginbuffer', isLoggedIn, function(request, response, next) {
    response.render('loginbuffer.ejs', {
        user: request.user,
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV,
    });
});

app.get('/workinprogress', function(request, response, next) {
    response.render('workinprogress.ejs', {});
});


/*app.get('/login', function(request, response) {
    // render the page and pass in any flash data if it exists
    response.render('login.ejs', {
        message: request.flash('loginMessage')
    });
});
app.get('/signup', function(request, response) {
    // render the page and pass in any flash data if it exists
    response.render('signup.ejs', {
        message: request.flash('signupMessage')
    });
});*/


// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile', isLoggedIn, function(request, response) {
    response.render('profile.ejs', {
        user: request.user, // get the user out of session and pass to template
        PLAID_PUBLIC_KEY: PLAID_PUBLIC_KEY,
        PLAID_ENV: PLAID_ENV
    });
});

//=====API GETS=====
app.get('/api/logout', isLoggedIn, function(request, response) { //todo clear redis cache ***
    redis_client.del(request.user._id.toString() + "accounts");
    redis_client.del(request.user._id.toString() + "item");
    redis_client.del(request.user._id.toString() + "transactions");
    request.logout();
    response.redirect('/');
});

app.get('/api/accounts', isLoggedIn, function(request, response, next) {
    // Retrieve high-level account information and account and routing numbers
    // for each account associated with the Item.
    link_functions.get_cached_user_accounts(request, response, next);
});

app.get('/api/user_data', isLoggedIn, function(request, response) {
    if (request.user === undefined) {
        // The user is not logged in
        response.json({});
    } else {
        response.json({
            username: request.user,
            num_of_accounts: request.user.accounts.length
        });
    }
});

app.get('/api/refresh_cache', isLoggedIn, function(request, response, next) {
    console.debug(request.user._id + " Cache refreshing");
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

app.get('/api/get_graph_data', isLoggedIn, function(request, response, next) {
    front_end_functions.create_transaction_graph_data(request, response, next);
});

//=====API Post=====

app.post('/api/name', function(request, response, next) {
    logger.debug(request.body.name);
    logger.debug(request.user);

    collection.update({
        '_id': request.user._id
    }, {
        '$set': {
            'name': request.body.name
        }
    });

    logger.debug("inserted username: " + request.body.name + " for user " + request.user._id);

    response.redirect('/profile');
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
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));


// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/loginbuffer', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

//404
app.get('*', function(request, response) {
    response.render('404.ejs');
});

// launch ======================================================================

const server = https.createServer(httpsOptions, app).listen(443, function() {
    logger.info('HTTPS server started on port 443');
});

var http = require('http');
http.createServer(function(request, response) {
    response.writeHead(301, {
        "Location": "https://" + request.headers['host'] + request.url
    });
    response.end();
}).listen(80, function() {
    logger.info('HTTP server started on port 80');
});
