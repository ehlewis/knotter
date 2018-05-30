var plaid_manip = require('./plaid_manip');
var wait = require('wait.for');
var sync = require('synchronize')

module.exports = {
  cache_user_data : function (request, response, next, client, redis_client, redis) {

      num = 2; //get num accounts
      var test = plaid_manip.cache_user_accounts(request, response, next, client, redis_client, redis, num);

    }
};
