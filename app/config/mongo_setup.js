var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var User = mongoose.model('User');
//var configDB = require('./database.js');
var collection = null;
var logger = require('./logger.js');

mongoose.Promise = require('bluebird');
if (process.env.SERVICE_CONNECTION === "local-sandbox"){
    var mongo_url = process.env.DB_SANDBOX; // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
}
else if (process.env.SERVICE_CONNECTION === "remote-staging"){
    //var mongo_url = "mongodb://link_server:link_server@linkcluster0-shard-00-00-97dei.gcp.mongodb.net/link";
    var mongo_url = process.env.DB_REMOTE_STAGING; // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot

}
if (process.env.SERVICE_CONNECTION === "production"){
    var mongo_url = "mongodb://localhost:27017/link";
}

// ==Configuration*==
module.exports = function() {
    mongoose.connect(mongo_url, {useMongoClient: true}); // connect to our database

    MongoClient.connect(mongo_url, { useNewUrlParser: true }, function(err, client) {
        if (err) throw err;

        db = client.db('link');
        global.collection = db.collection('users');
        logger.info("Connected to DB!");
    });
}
