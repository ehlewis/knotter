var logger = require('./logger.js');
var redis = require("redis");

// ==Configuration*==
module.exports = function() {
    var redis_client = redis.createClient();
    logger.log("info","Connected to redis!");
    return redis_client;
}
