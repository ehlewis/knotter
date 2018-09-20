var link_functions = require('./link_functions');

module.exports = {
    //Deletes existing keys and replaces them, does NOT fail if they keys don't exist
    refresh_cache : function(request, response, next){
        redis_client.del(request.user._id.toString() + "institutions");
        redis_client.del(request.user._id.toString() + "accounts");
        redis_client.del(request.user._id.toString() + "item");
        redis_client.del(request.user._id.toString() + "transactions");
        cache_user_data(request, response, next);
    },

};

// Helper function that caches all the users data
function cache_user_data(request, response, next) {
    num = request.user.items.length; //get num items to iterate through
    link_functions.cache_user_institutions(request, response, next, num);
    link_functions.cache_user_accounts(request, response, next, num);
    link_functions.cache_items(request, response, next, num);
    link_functions.cache_transactions(request, response, next, num);
}
