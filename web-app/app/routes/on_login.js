var plaid_manip = require('./plaid_manip');
var wait = require('wait.for');
var sync = require('synchronize')

module.exports = {
  cache_user_data : function (request, response, next, client, redis_client, redis) {
      //only let this run if the user data doesnt already exist in the cache OR its being called form login not the webpage
      num = 2; //get num accounts
      var test = plaid_manip.cache_user_accounts(request, response, next, client, redis_client, redis, num);

    }
};
