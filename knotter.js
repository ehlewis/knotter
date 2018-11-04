// server.js
'use strict';

//=====Setup=====
// get all the tools we need
var express = require('express');
var app = express();
var passport = require('passport');
var flash = require('connect-flash');
var moment = require('moment');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


//Set up services
var redis_store = require('connect-redis')(session);
var dataset_functions = require('./app/routes/dataset_functions');
var cache_functions = require('./app/routes/cache_functions');

//Set up Logging
var colors = require('colors');
var logger = require('./app/config/logger');


//Check our ennvars so we know what to connect to
/*global.SERVICE_CONNECTION = envvar.oneOf('SERVICE_CONNECTION', ['local-sandbox', 'remote-staging', 'production'], 'local-sandbox');
logger.info("Starting with " + SERVICE_CONNECTION);*/

//Set up environment variables
var fs = require("fs");
var envvar = require('envvar');
var dotenv = require('dotenv').config();
if (dotenv.error) {
  throw dotenv.error;
}
logger.info("Loaded env file!");
logger.info("Starting in " + process.env.SERVICE_CONNECTION + " mode");

if(process.env.SERVICE_CONNECTION === "local-sandbox"){
    global.PLAID_SECRET = process.env.SANDBOX_PLAID_SECRET;
    global.PLAID_PUBLIC_KEY = process.env.SANDBOX_PLAID_PUBLIC_KEY;
    global.PLAID_CLIENT_ID = process.env.SANDBOX_PLAID_CLIENT_ID;
    global.PLAID_ENV = process.env.SANDBOX_PLAID_ENV;

    var SSL_PORT = 443;
    var HTTP_PORT = 80;

}
else if(process.env.SERVICE_CONNECTION === "remote-sandbox"){
    global.PLAID_SECRET = process.env.SANDBOX_PLAID_SECRET;
    global.PLAID_PUBLIC_KEY = process.env.SANDBOX_PLAID_PUBLIC_KEY;
    global.PLAID_CLIENT_ID = process.env.SANDBOX_PLAID_CLIENT_ID;
    global.PLAID_ENV = process.env.SANDBOX_PLAID_ENV;

    var SSL_PORT = 8443;
    var HTTP_PORT = 8080;

}
else if(process.env.SERVICE_CONNECTION === "remote-dev"){
    global.PLAID_SECRET = process.env.DEV_PLAID_SECRET;
    global.PLAID_PUBLIC_KEY = process.env.DEV_PLAID_PUBLIC_KEY;
    global.PLAID_CLIENT_ID = process.env.DEV_PLAID_CLIENT_ID;
    global.PLAID_ENV = process.env.DEV_PLAID_ENV;

    var SSL_PORT = 8443;
    var HTTP_PORT = 8080;
}
else{
    logger.error("Not a valid service connection mode");
    throw new Error();
}

//Set up our services (mongo and redis)
var mongo_setup = require('./app/config/mongo_setup')();
global.redis = require("redis");
var redis_setup = require('./app/config/redis_setup')();
var plaid_setup = require("./app/config/plaid_setup");

//Set up HTTPS
var https = require('https');
var helmet = require("helmet");

var ssl_key = fs.readFileSync('./ssl/localhost.key');
var ssl_cert = fs.readFileSync('./ssl/localhost.crt');

const httpsOptions = {
    key: ssl_key,
    cert: ssl_cert
};


// route middleware to make sure a user is logged in
function isLoggedIn(request, response, next) {
    // if user is authenticated in the session, carry on
    if (request.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    response.redirect('/landing');
}

//=====USES=====

// set up our logger
app.use(require("morgan")(":method :url :status :response-time ms :remote-addr", {
    "stream": logger.stream
}));

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
        maxAge: 3600000 //1 hour cookie
    },
    resave: true,
    saveUninitialized: true
})); // session secret and cookie timeout

//Set up passport
require('./app/config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


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

app.get('/', isLoggedIn, function(request, response, next) {
    response.render('dashboard.ejs', {});
});

app.get('/landing', function(request, response, next) {
    response.render('landing.ejs', {});
});


app.get('/views/landing.ejs', function(request, response, next) {
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


app.get('/workinprogress', function(request, response, next) {
    response.render('workinprogress.ejs', {});
});


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
    redis_client.del(request.user._id.toString() + "knotterdata");
    request.logout();
    response.redirect('/');
}); //Dumps everything in the cache that we store if it exists

app.get('/api/accounts', isLoggedIn, function(request, response, next) {
    dataset_functions.get_cached_user_institutions(request, response, next);
}); // Retrieve high-level account information and account and routing numbers for each account associated with the Item.

app.get('/api/user_data', isLoggedIn, function(request, response) {
    if (request.user === undefined) {
        // The user is not logged in
        response.json({});
    } else {
        response.json({
            user: request.user
            //num_of_accounts: request.user.items.length
        });
    }
}); //Returns the user object to the browser. Used mostly for debugging

app.get('/api/refresh_cache', isLoggedIn, function(request, response, next) {
    console.debug(request.user._id + " Cached Knotter data refreshing");
    cache_functions.refresh_knotterdata_cache(request, response, next);
}); //This dumps (if there is already data) and repopulates the cached data in the custom format that we convert the Plaid data to to make it useable to the frontend

app.get('/api/refresh_plaid_cache', isLoggedIn, function(request, response, next) {
    console.debug(request.user._id + " Cached Plaid data refreshing");
    cache_functions.refresh_all_plaid_cache(request, response, next);
}); //This dumps (if there is already data) and repopulates all the cached data that comes raw from Plaid (Accounts, Institutions, Items, and Transactions

app.get('/api/get_cached_user_accounts', isLoggedIn, function(request, response, next) {
    dataset_functions.get_cached_user_accounts(request, response, next);
}); //Fetches the raw array of Plaid Accounts endpoint responses from the cache, null if there is no cache hit

app.get('/api/get_cached_user_institutions', isLoggedIn, function(request, response, next) {
    dataset_functions.get_cached_user_institutions(request, response, next);
}); //Fetches the raw array of Plaid Institutions endpoint responses from the cache, null if there is no cache hit

app.get('/api/get_cached_items', isLoggedIn, function(request, response, next) {
    dataset_functions.get_cached_items(request, response, next);
}); //Fetches the raw array of Plaid Items endpoint responses from the cache, null if there is no cache hit

app.get('/api/get_cached_transactions', isLoggedIn, function(request, response, next) {
    dataset_functions.get_cached_transactions(request, response, next);
}); //Fetches the raw array of Plaid Transactions endpoint responses from the cache, null if there is no cache hit

app.get('/api/get_cached_knotter_data', isLoggedIn, function(request, response, next) {
    dataset_functions.get_knotter_data(request, response, next);
}); //Fetches the raw array of Knotterdata in custom format from the cache, null if there is no cache hit


app.get('/api/env',  function(request, response) {
    response.json({
      env : process.env.SERVICE_CONNECTION
    });
}); //Returns the version that we are running in (local-sandbox, remote-sandbox, remote-dev, or remote-productions)

app.get('/api/health_check', function(request, response, next) {
    response.sendStatus(200);
}); //Returns status code 200 if the server is alive

//=====API Post=====

app.post('/api/remove_item', function(request, response, next) {
    dataset_functions.remove_item(request, response, next).then(function(isRemoved){
        cache_functions.refresh_knotterdata_cache(request, response, next);
        response.sendStatus(200);
    });
}); //Takes the item_id from the POST request and removes the item_id|access_token pair that includes the passed item_id DB under the user's entry

app.post('/api/name', function(request, response, next) {
    logger.debug(request.body.name);
    logger.debug(request.user);

    collection.updateOne({
        '_id': request.user._id
    }, {
        '$set': {
            'name': request.body.name
        }
    });

    logger.debug("inserted username: " + request.body.name + " for user " + request.user._id);

    response.redirect('/profile');
}); //Takes the name from the POST request and inserts it in the DB under the user's entry

//=====POSTS=====


//THE FOLLOWING ARE DEPRECIATED
app.post('/get_access_token', function(request, response, next) {
    dataset_functions.get_access_token(request, response, next);
});

app.post('/item', function(request, response, next) {
    // Pull the Item - this includes information about available products,
    // billed products, webhook information, and more.
    dataset_functions.item(request, response, next);
});

app.post('/transactions', function(request, response, next) {
    // Pull transactions for the Item for the last 30 days
    dataset_functions.transactions(request, response, next);
});
//THE ABOVE ARE DEPRECIATED

app.post('/signup', function (request, response){
    passport.authenticate('local-signup', function(err, user, info){
    if (err){
        return response.send({ response: "Error" });
    }
    if (!user){
        return response.send({ response: "User exists" });
    }
    else {
        request.login(user, function(err) {
          if (err){
              return response.send({ response: "Login failed" });
              //return next(err);
          }
          return response.send({ response: "authd" });
        });

    }
    })(request, response);}
); //Takes the POST data and passes it through the passport.authenticate function defined in ./app/config/passport.js which will pass back a user object representing the user if it does not exist yet in our DB, or no user if the requested email already exists in our DB. If the user does not exist in the DB then it is created and that new user object is passed back and passed to request.login which will log in the user.


// process the login form
app.post('/login', function (request, response){
    passport.authenticate('local-login', function(err, user, info){
        if (err){
            return response.send({ response: "Error" });
        }
        if (!user){
            return response.send({ response: "Login failed" });
        }

        else {
            request.login(user, function(err) {
              if (err){
                  return response.send({ response: "Login failed" });
                  //return next(err);
              }
              return response.send({ response: "authd" });
            });
        }
    })(request, response);}
); //Takes the POST data and passes it through the passport.authenticate function defined in ./app/config/passport.js which will pass back a user object representing the user exists in our DB, or no user if the requested email does not exist in our DB. If the user exists in the DB then the user object for that email is passed back and passed to request.login which will log in the user if the password validates.

//404
app.get('*', function(request, response) {
    response.render('404.ejs');
}); //If NOTHING hits then we render the 404 page

// =====launch=====

const server = https.createServer(httpsOptions, app).listen(SSL_PORT, function() {
    logger.info('HTTPS server started on port 443');
});

var http = require('http');
http.createServer(function(request, response) {
    response.writeHead(301, {
        "Location": "https://" + request.headers['host'] + request.url
    });
    response.end();
}).listen(HTTP_PORT, function() {
    logger.info('HTTP server started on port 80');
});
