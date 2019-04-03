var logger = require('../config/logger');

module.exports = {
    isLoggedIn: function(request, response, next){
        // if user is authenticated in the session, carry on
        if (request.isAuthenticated()){
            return next();
        }
        // if they aren't redirect them to the home page
        response.redirect('/landing');
    }
}
