var dataset_functions = require('./dataset_functions');
var logger = require('../config/logger');
var BPromise = require('bluebird');

module.exports = {
    //Deletes existing keys and replaces them, does NOT fail if they keys don't exist
    refresh_knotterdata_cache : function(request, response, next){
        redis_client.del(request.user._id.toString() + "knotterdata");
        logger.debug(request.user._id + " knotterdata was emptied");
        cache_user_knotter_data(request, response, next);
    },

    refresh_all_plaid_cache : function(request, response, next){
        redis_client.del(request.user._id.toString() + "institutions");
        redis_client.del(request.user._id.toString() + "accounts");
        redis_client.del(request.user._id.toString() + "item");
        redis_client.del(request.user._id.toString() + "transactions");
        logger.debug(request.user._id + " Cache was emptied");
        cache_all_user_plaid_data(request, response, next);
    },



};

// Helper function that caches all the users data
async function cache_user_knotter_data(request, response, next) {
    return new Promise(function (resolve, reject) {
        var myPromises = [];
        myPromises.push(dataset_functions.plaid_to_knotter_json(request, response, function(){
            return;
        }));

        BPromise.all(myPromises).then(function() {
            next();
            logger.debug(request.user._id + " Knotterdata was populated");
        });
    });
}

// Helper function that caches all the users data
async function cache_all_user_plaid_data(request, response, next) {
    return new Promise(function (resolve, reject) {
        var myPromises = [];
        myPromises.push(dataset_functions.cache_user_institutions(request, response, function(){
            return;
        }));
        myPromises.push(dataset_functions.cache_user_accounts(request, response, function(){
            return;
        }));
        myPromises.push(dataset_functions.cache_transactions(request, response, function(){
            return;
        }));

        BPromise.all(myPromises).then(function() {
            next();
            logger.debug(request.user._id + " User data from Plaid cache was populated");
        });
    });
}
