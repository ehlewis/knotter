var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var User = mongoose.model('User');
//var configDB = require('./database.js');
var logger = require('./logger.js');

mongoose.Promise = require('bluebird');

var mongo_url = process.env.DB_ADDR; // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot


// ==Configuration*==
module.exports = function() {
    mongoose.connect(mongo_url, {useMongoClient: true}); // connect to our database

    MongoClient.connect(mongo_url, { useNewUrlParser: true }, function(err, client) {
        if (err) throw err;

        db = client.db('linkSANDBOX');

        global.collection = db.collection('users');
        logger.info("Connected to DB on URL: " + mongo_url);
    });
}
