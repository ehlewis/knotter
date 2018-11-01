var dataset_functions = require('./dataset_functions');
var logger = require('../config/logger');
var BPromise = require('bluebird');

module.exports = {
    //Deletes existing keys and replaces them, does NOT fail if they keys don't exist
    refresh_cache : function(request, response, next){
        redis_client.del(request.user._id.toString() + "institutions");
        redis_client.del(request.user._id.toString() + "accounts");
        redis_client.del(request.user._id.toString() + "item");
        redis_client.del(request.user._id.toString() + "transactions");
        logger.debug(request.user._id + " Cache was emptied");
        cache_user_data(request, response, next);
    },

};

// Helper function that caches all the users data
async function cache_user_data(request, response, next) {
    return new Promise(function (resolve, reject) {
        var myPromises = [];
        num = request.user.items.length; //get num items to iterate through
        myPromises.push(dataset_functions.cache_user_institutions(request, response, num, function(){
            return;
        }));
        myPromises.push(dataset_functions.cache_user_accounts(request, response, num, function(){
            return;
        }));
        //myPromises.push(dataset_functions.cache_items(request, response, next, num));
        myPromises.push(dataset_functions.cache_transactions(request, response, num, function(){
            return;
        }));
        myPromises.push(dataset_functions.plaid_to_knotter_json(request, response, num, function(){
            return;
        }));

        BPromise.all(myPromises).then(function() {
            //logger.debug(myPromises);
            next();
            //resolve();
            logger.debug(request.user._id + " Cache was populated");
        });
    });
}
