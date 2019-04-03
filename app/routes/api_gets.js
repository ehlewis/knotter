var middleware = require("./middleware")
var logger = require('../config/logger');
var dataset_functions = require('./dataset_functions');
var cache_functions = require('./cache_functions');

module.exports = function(app){
    app.get('/api/logout', middleware.isLoggedIn, function(request, response) {
        redis_client.del(request.user._id.toString() + "accounts");
        redis_client.del(request.user._id.toString() + "item");
        redis_client.del(request.user._id.toString() + "transactions");
        redis_client.del(request.user._id.toString() + "knotterdata");
        request.logout();
        response.redirect('/');
    }); //Dumps everything in the cache that we store if it exists

    app.get('/api/accounts', middleware.isLoggedIn, function(request, response, next) {
        dataset_functions.get_cached_user_institutions(request, response, next);
    }); // Retrieve high-level account information and account and routing numbers for each account associated with the Item.

    app.get('/api/user_data', middleware.isLoggedIn, function(request, response) {
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

    app.get('/api/refresh_cache', middleware.isLoggedIn, function(request, response, next) {
        console.debug(request.user._id + " Cached Knotter data refreshing");
        cache_functions.refresh_knotterdata_cache(request, response, next);
    }); //This dumps (if there is already data) and repopulates the cached data in the custom format that we convert the Plaid data to to make it useable to the frontend

    app.get('/api/refresh_plaid_cache', middleware.isLoggedIn, function(request, response, next) {
        console.debug(request.user._id + " Cached Plaid data refreshing");
        cache_functions.refresh_all_plaid_cache(request, response, next);
    }); //This dumps (if there is already data) and repopulates all the cached data that comes raw from Plaid (Accounts, Institutions, Items, and Transactions

    app.get('/api/get_cached_user_accounts', middleware.isLoggedIn, function(request, response, next) {
        dataset_functions.get_cached_user_accounts(request, response, next);
    }); //Fetches the raw array of Plaid Accounts endpoint responses from the cache, null if there is no cache hit

    app.get('/api/get_cached_user_institutions', middleware.isLoggedIn, function(request, response, next) {
        dataset_functions.get_cached_user_institutions(request, response, next);
    }); //Fetches the raw array of Plaid Institutions endpoint responses from the cache, null if there is no cache hit

    app.get('/api/get_cached_items', middleware.isLoggedIn, function(request, response, next) {
        dataset_functions.get_cached_items(request, response, next);
    }); //Fetches the raw array of Plaid Items endpoint responses from the cache, null if there is no cache hit

    app.get('/api/get_cached_transactions', middleware.isLoggedIn, function(request, response, next) {
        dataset_functions.get_cached_transactions(request, response, next);
    }); //Fetches the raw array of Plaid Transactions endpoint responses from the cache, null if there is no cache hit

    app.get('/api/get_cached_knotter_data', middleware.isLoggedIn, function(request, response, next) {
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

    app.get('/api/sandbox_reset_login', function(request, response, next) {
        plaid_client.resetLogin('access-sandbox-46a37c35-d5d7-4878-b741-809a06b25ba8', function(err, reset_login_response) {
            // Handle err
            // create a public_token for the Item
            console.log(reset_login_response);
            // Handle err
            // Use the generated public_token to
            // initialize Link in update mode
            response.sendStatus(200);

        });
    });
}
