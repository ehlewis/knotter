var winston = require('winston');
var path = require('path');

//LOCAL setup
if(process.env.SERVICE_CONNECTION==="local-sandbox"){
    var logger = winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(info => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(),winston.format.simple())
            }),
            new winston.transports.File({filename: 'link.log'})
        ]
    });
}

//STAGING setup
else if(process.env.SERVICE_CONNECTION==="remote-sandbox" || process.env.SERVICE_CONNECTION === "remote-dev"){
    /*const {LoggingWinston} = require('@google-cloud/logging-winston');
    const loggingWinston = new LoggingWinston();

    var logger = winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(info => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(),winston.format.simple())
            }),
            new winston.transports.File({filename: 'link.log'}),
            loggingWinston
        ]
    });*/
    var logger = winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(info => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        ),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(),winston.format.simple())
            }),
            new winston.transports.File({filename: 'link.log'})
        ]
    });
}


module.exports = logger;


module.exports.stream = {
    write: function(message, encoding){
        logger.silly(message);
    }
};

/*logger.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};*/
