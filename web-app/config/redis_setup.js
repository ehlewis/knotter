var logger = require('./logger.js');

// ==Configuration*==
module.exports = function() {
    global.redis_client = redis.createClient();
    logger.log("info","Connected to redis!");
}
