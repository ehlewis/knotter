var logger = require('./logger.js');

module.exports = function() {
    global.redis_client = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    });
    redis_client.ping(function (err, result) {
        if (result == "PONG"){
            logger.info("Connected to Redis on IP:" + process.env.REDIS_HOST + " Port: " + process.env.REDIS_PORT);
        }
        else{
            logger.error("Could not connect to Redis on IP:" + process.env.REDIS_HOST + " Port: " + process.env.REDIS_PORT);
        }
 });
}
