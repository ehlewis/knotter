var logger = require('./logger.js');

if (SERVICE_CONNECTION === "local-sandbox"){
    var service_host = "127.0.0.1"; // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    var service_port = "6379";
}
else if (SERVICE_CONNECTION === "remote-staging"){
    var service_host = "10.0.0.3";
    var service_port = "6379";
}
if (SERVICE_CONNECTION === "production"){
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
