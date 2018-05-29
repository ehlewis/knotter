var plaid_manip = require('./plaid_manip');
var wait = require('wait.for');

function accounts (request, response, next, client) {
  console.log("HELLO");
  var num = 0;
  //for (var i = 0; i < num; i++) {
      var account = wait.for(plaid_manip.accounts_return, request, response, next, client, num);
      console.log("aaa" + account);
      return account;
  //}
}


module.exports = {
  accounts : function (request, response, next, client) {
      console.log("in");
      //wait.launchFiber(accounts, request, response, next, client);
      wait.launchFiber(accounts, request, response, next, client);
  },
  bar: function () {
    // whatever
    },
    load_accounts : function(){}
};

var zemba = function () {
}


//wont be exposed



/*And in your app file:

// app.js
// ======
var tools = require('./tools');
console.log(typeof tools.foo); // => 'function'
console.log(typeof tools.bar); // => 'function'
console.log(typeof tools.zemba); // => undefined*/
