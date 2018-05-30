var plaid_manip = require('./plaid_manip');
var wait = require('wait.for');
var sync = require('synchronize')

function processData (num, callback) {
    console.log(num);
    num += 1;
    callback(num);
  }




/*function asyncOperation ( a, b, c, callback ) {
  // ... lots of hard work ...
  if (  an error occurs  ) {
    return callback(new Error("An error has occured"));
  }
  // ... more work ...
  callback(null, d, e, f);
}

asyncOperation ( params.., function ( err, returnValues.. ) {
   //This code gets run after the async operation gets run
});*/

module.exports = {
  accounts : function (request, response, next, client) {

      num = 2;
      var test = plaid_manip.accounts_return(request, response, next, client, num);//, function(err, returnValue){
          /*console.log("res" + response);
          console.log("test came back as " + returnValue);
      });*/


      /*processData(2, function(err, returnValue){
          console.log(returnValue);
      });*/





      console.log("in");
      num = 2;
      //var account = ;
      //console.log("uiguvjg" + account);
      //wait.launchFiber(accounts_func, request, response, next, client, num);
      /*wait.launchFiber(function () {
            let res_f = wait.for(accounts_func, request, response, next, client, num);
            console.log('alleged result of f(): ' + res_f);
        });*/
    }
};
