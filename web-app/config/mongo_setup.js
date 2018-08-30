var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var User = mongoose.model('User');
var mongo_url = "mongodb://localhost:27017/link";
var configDB = require('./database.js');
var db = null;
var collection = null;

var logger = require('./logger.js');


// ==Configuration*==
module.exports = function() {
    mongoose.connect(configDB.url); // connect to our database

    MongoClient.connect(mongo_url, function(err, client) {
        if (err) throw err;

        db = client.db('link');
        collection = db.collection('users');
        logger.info("Connected to DB!");
    });
}
