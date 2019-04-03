var middleware = require("./middleware")
var logger = require('../config/logger');
var passport = require('passport');
var dataset_functions = require('./dataset_functions');


module.exports = function(app){
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

    app.post('/get_access_token', function(request, response, next) {
        dataset_functions.get_access_token(request, response, next);
    });

    //== DEPRECIATED
    app.post('/item', function(request, response, next) {
        // Pull the Item - this includes information about available products,
        // billed products, webhook information, and more.
        dataset_functions.item(request, response, next);
    });
    //== DEPRECIATED
    app.post('/transactions', function(request, response, next) {
        // Pull transactions for the Item for the last 30 days
        dataset_functions.transactions(request, response, next);
    });

}
