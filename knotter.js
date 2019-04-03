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


logger.info("Running on Node " + process.version);
if((process.version).substring(0, 2) !== "v8"){
    logger.error('Incorrect Node version\nExiting...');
    process.exit();
}
//Set up environment variables
var fs = require("fs");
var envvar = require('envvar');
var dotenv = require('dotenv').config();
if (dotenv.error) {
  throw dotenv.error;
}
logger.info("Loaded env file!");
logger.info("Starting in " + process.env.SERVICE_CONNECTION + " mode");


global.PLAID_SECRET = process.env.PLAID_SECRET;
global.PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
global.PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
global.PLAID_ENV = process.env.PLAID_ENV;


//Set up our services (mongo and redis)
var mongo_setup = require('./app/config/mongo_setup')();
global.redis = require("redis");
var redis_setup = require('./app/config/redis_setup')();
var plaid_setup = require("./app/config/plaid_setup");

//Set up HTTPS and use HTTP2
var spdy = require('spdy');
var helmet = require("helmet");

var ssl_key = fs.readFileSync('./ssl/localhost.key');
var ssl_cert = fs.readFileSync('./ssl/localhost.crt');

const spdyOptions = {
    key: ssl_key,
    cert: ssl_cert,
    spdy: {
        protocols: [ 'h2', 'http/1.1' ]
    }
};


var middleware = require("./app/routes/middleware");

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
        maxAge: 300000 //5 minute cookie in ms
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



require('./app/routes/page_gets')(app);
require('./app/routes/page_posts')(app);
require('./app/routes/api_gets')(app);
require('./app/routes/api_posts')(app);

//404
app.get('*', function(request, response) {
    response.render('404.ejs');
}); //If NOTHING hits then we render the 404 page


// =====launch=====

const server = spdy.createServer(spdyOptions, app).listen(process.env.SSL_PORT, function() {
    logger.info('HTTPS server started on port 443');
});

var http = require('http');
http.createServer(function(request, response) {
    response.writeHead(301, {
        "Location": "https://" + request.headers['host'] + request.url
    });
    response.end();
}).listen(process.env.HTTP_PORT, function() {
    logger.info('HTTP server started on port 80');
});
