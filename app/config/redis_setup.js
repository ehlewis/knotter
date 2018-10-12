var logger = require('./logger.js');

if (process.env.SERVICE_CONNECTION === "local-sandbox"){
    var service_host = process.env.REDIS_SADBOX_HOST; // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    var service_port = process.env.REDIS_SADBOX_PORT;
}
else if (process.env.SERVICE_CONNECTION === "remote-sandbox" || process.env.SERVICE_CONNECTION === "remote-dev"){
    var service_host = process.env.REDIS_REMOTE_STAGING_HOST;
    var service_port = process.env.REDIS_REMOTE_STAGING_PORT;
}
if (process.env.SERVICE_CONNECTION === "production"){
    var service_host = "";
    var service_port = "";
}

// ==Configuration*==
module.exports = function() {
    global.redis_client = redis.createClient({
        host: service_host,
        port: service_port,
        password: 'thispasswordissuperlongandshouldbereallyreallyhardtofigureoutespeciallysinceitsinplaintext'
    });
    logger.log("info","Connected to redis!");
}
