var plaid_manip = require('./plaid_manip');
module.exports = {
  accounts : function (request, response, next, client) {
    console.log("HELLO");
    var num = 2;
    plaid_manip.accounts_test(request, response, next, client, num);
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
