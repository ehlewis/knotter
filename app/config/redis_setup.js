var logger = require('./logger.js');

// ==Configuration*==
module.exports = function() {
    global.redis_client = redis.createClient({
        host: '127.0.0.1',
        port: '6379',
        password: 'thispasswordissuperlongandshouldbereallyreallyhardtofigureoutespeciallysinceitsinplaintext'
    });
    logger.log("info","Connected to redis!");
}
