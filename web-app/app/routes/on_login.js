var plaid_manip = require('./plaid_manip');
var wait = require('wait.for');

function accounts_func (request, response, next, client, num) {
    var account;
    for (var i = 0; i < num; i++) {
        console.log('number' + i);
        account = wait.for(plaid_manip.accounts_return, request, response, next, client, i);
        console.log("ethrttrhrt" + account);
    }

}


module.exports = {
  accounts : function (request, response, next, client) {
      console.log("in");
      num = 2;
      wait.launchFiber(accounts_func, request, response, next, client, num);
  }
};
