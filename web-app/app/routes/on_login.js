var plaid_manip = require('./plaid_manip');
var wait = require('wait.for');
var sync = require('synchronize')

module.exports = {
    check_cache: function(request, response, next, redis_client, redis) {
        redis_client.lrange(request.user._id.toString() + "accounts", 0, -1, function(err, reply) {
            // reply is null when the key is missing
            console.log(reply);
        });
    },
    cache_user_data: function(request, response, next, plaid_client, redis_client, redis) {
        //only let this run if the user data doesnt already exist in the cache OR its being called form login not the webpage
        num = 2; //get num accounts
        plaid_manip.cache_user_accounts(request, response, next, plaid_client, redis_client, redis, num);
        plaid_manip.cache_item(request, response, next, plaid_client, redis_client, redis, num);
        plaid_manip.cache_transactions(request, response, next, plaid_client, redis_client, redis, num);
    }
};
