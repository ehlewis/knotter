var middleware = require("./middleware")
var logger = require('../config/logger');
var dataset_functions = require('./dataset_functions');

module.exports = function(app){
    app.post('/api/remove_item', function(request, response, next) {
        dataset_functions.remove_item(request, response, next).then(function(isRemoved){
            response.json({
                isRemoved:isRemoved
            });
        }).catch(function(error) {
            logger.error(error);
            response.json({
                isRemoved:false,
                error:true,
                error_msg:error
            });
        });
    }); //Takes the item_id from the POST request and removes the item_id|access_token pair that includes the passed item_id DB under the user's entry


    app.post('/api/get_public_token', function(request, response, next) {
        dataset_functions.createTempPublicToken(request, response, next).then(function(newToken){
            response.json({
                publicToken:newToken
            });
        }).catch(function(error) {
            logger.error(error);
            response.json({
                error:true,
                error_msg:error
            });
        });
    }); //Takes the access_token from the POST request and asks Plaid to generate a 30 minute public_token so that we can put Plaid into update mode for the item associated with the access_token

    app.post('/api/name', function(request, response, next) {
        logger.debug(request.body.name);
        logger.debug(request.user);

        collection.updateOne({
            '_id': request.user._id
        }, {
            '$set': {
                'name': request.body.name
            }
        });

        logger.debug("inserted username: " + request.body.name + " for user " + request.user._id);

        response.redirect('/profile');
    }); //Takes the name from the POST request and inserts it in the DB under the user's entry

    app.post('/api/log_error', function(request, response, next) {
        logger.error(request.error);
        if(request.metadata){
            logger.error(metadata);
        }
    }); //Takes the access_token from the POST request and asks Plaid to generate a 30 minute public_token so that we can put Plaid into update mode for the item associated with the access_token

}
