var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var User = mongoose.model('User');
var mongo_url = "mongodb://localhost:27017/link"; // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
//var configDB = require('./database.js');
var collection = null;
var logger = require('./logger.js');

mongoose.Promise = require('bluebird');

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
