var plaid_manip = require('./plaid_manip');

module.exports = {
    //Do not use this function, use refresh cache
    check_cache_populate: function(request, response, next, plaid_client, redis_client, redis, replace) {
        redis_client.lrange(request.user._id.toString() + "accounts", 0, -1, function(err, reply) {
            // reply is null when the key is missing
            if(err != null){
                console.log("error" + err);
            }
            if(reply == ''){
                console.log("no data stored");
                cache_user_data(request, response, next, plaid_client, redis_client, redis);
                return;
            }
            else{
                console.log(reply);
                return;
            }
        });
    },
    //Deletes existing keys and replaces them, does NOT fail if they keys don't exist
    refresh_cache : function(request, response, next, plaid_client, redis_client, redis){
        redis_client.del(request.user._id.toString() + "accounts");
        redis_client.del(request.user._id.toString() + "item");
        redis_client.del(request.user._id.toString() + "transactions");
        cache_user_data(request, response, next, plaid_client, redis_client, redis);
    },
    //Try to avoid using this as it will append if data already exists
    populate_cache : function(request, response, next, plaid_client, redis_client, redis){
        cache_user_data(request, response, next, plaid_client, redis_client, redis);
    },

    test : function(request, response, next, redis_client, redis){
        redis_client.lrange(request.user._id.toString() + "accounts", 0, -1, function(err, reply) {
            // reply is null when the key is missing
            if (err != null) {
                console.log("error" + err);
            }
            if (reply == '') {
                console.log("no data stored");
                return;
            } else {
                console.log(JSON.parse(reply));
                response.json(JSON.parse(reply));
                return;
            }
        });
    }
};
// DO NOT USE Checks to see if the cache value accounts exists and returns a bool
function check_cache(request, response, next, plaid_client, redis_client, redis){
    redis_client.lrange(request.user._id.toString() + "accounts", 0, -1, function(err, reply) {
        // reply is null when the key is missing
        if(err != null){
            console.log("error" + err);
        }
        if(reply == ''){
            console.log("no data stored");
            return false;
            // cache_user_data(request, response, next, plaid_client, redis_client, redis);
        }
        else{
            console.log(reply);
            return true;
        }
    });
}

// Helper function that caches all the users data
function cache_user_data(request, response, next, plaid_client, redis_client, redis) {
    num = request.user.accounts.length; //get num accounts
    plaid_manip.cache_user_accounts(request, response, next, plaid_client, redis_client, redis, num);
    plaid_manip.cache_item(request, response, next, plaid_client, redis_client, redis, num);
    plaid_manip.cache_transactions(request, response, next, plaid_client, redis_client, redis, num);
}
