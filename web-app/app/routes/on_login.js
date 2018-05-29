var plaid_manip = require('./plaid_manip');
var wait = require('wait.for');
var sync = require('synchronize')

async function accounts_func (request, response, next, client, num) {
    for (var i = 0; i < num; i++) {
        console.log('number' + i);
        var account = await plaid_manip.accounts_return(request, response, next, client, i);
        console.log("ethrttrhrt" + account);
        return account;
    }

}


module.exports = {
  accounts : async function (request, response, next, client) {
      console.log("in");
      num = 2;
      var account = await accounts_func (request, response, next, client, num);
      console.log("uiguvjg" + account);
      //wait.launchFiber(accounts_func, request, response, next, client, num);
      /*wait.launchFiber(function () {
            let res_f = wait.for(accounts_func, request, response, next, client, num);
            console.log('alleged result of f(): ' + res_f);
        });*/
    }
};
